import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 上传目录配置
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const RESULTS_DIR = path.join(__dirname, '..', 'results');

// 确保目录存在
async function ensureDirectories() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(RESULTS_DIR, { recursive: true });
}
ensureDirectories();

// Multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 JPEG、PNG、WebP 格式的图片'));
    }
  }
});

// 获取 Gemini 客户端
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('未配置 GEMINI_API_KEY 环境变量');
  }
  return new GoogleGenerativeAI(apiKey);
}

// 将图片转换为 Gemini 格式
async function imageToGeminiFormat(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };
  return {
    inlineData: {
      data: base64,
      mimeType: mimeTypes[ext] || 'image/jpeg'
    }
  };
}

// 任务存储（生产环境应使用数据库）
const tasks = new Map();

// 上传图片
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' });
    }

    const imageUrl = `/api/images/file/${req.file.filename}`;

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: imageUrl
    });
  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 获取上传的图片
router.get('/file/:filename', async (req, res) => {
  try {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    // 尝试从结果目录获取
    try {
      const resultPath = path.join(RESULTS_DIR, req.params.filename);
      await fs.access(resultPath);
      res.sendFile(resultPath);
    } catch {
      res.status(404).json({ error: '图片不存在' });
    }
  }
});

// AI 分析图片（使用 Gemini）
router.post('/analyze', async (req, res) => {
  try {
    const { productImage, sceneImage } = req.body;

    if (!productImage) {
      return res.status(400).json({ error: '请提供产品图片' });
    }

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 读取产品图片
    const productPath = path.join(UPLOAD_DIR, productImage);
    const productImageData = await imageToGeminiFormat(productPath);

    // 构建提示词
    const systemPrompt = `你是一个专业的产品图片分析助手。请分析用户上传的产品图片，识别：
1. 产品的主要特征和类型
2. 产品的颜色、形状、材质
3. 当前背景情况
4. 如果有场景图片，分析如何将产品融入该场景
5. 提供具体的处理建议

请用中文回答，结构化输出分析结果。`;

    const userPrompt = sceneImage
      ? '请分析这个产品图片，并根据提供的场景图片，建议如何将产品融入场景中。'
      : '请分析这个产品图片，识别产品主体和背景，并提供处理建议。';

    // 构建内容
    const contents = [systemPrompt + '\n\n' + userPrompt, productImageData];

    // 如果有场景图片，添加到内容中
    if (sceneImage) {
      const scenePath = path.join(UPLOAD_DIR, sceneImage);
      const sceneImageData = await imageToGeminiFormat(scenePath);
      contents.push('以下是目标场景图片：');
      contents.push(sceneImageData);
    }

    const result = await model.generateContent(contents);
    const response = await result.response;
    const analysis = response.text();

    res.json({
      success: true,
      analysis,
      productImage,
      sceneImage
    });
  } catch (error) {
    console.error('分析错误:', error);
    res.status(500).json({
      error: '分析失败',
      details: error.message
    });
  }
});

// 创建图片处理任务
router.post('/process', async (req, res) => {
  try {
    const { productImage, sceneImage, prompt, mode } = req.body;

    if (!productImage) {
      return res.status(400).json({ error: '请提供产品图片' });
    }

    const taskId = Date.now().toString();

    // 创建任务
    tasks.set(taskId, {
      id: taskId,
      status: 'processing',
      productImage,
      sceneImage,
      prompt,
      mode,
      createdAt: new Date().toISOString(),
      result: null,
      error: null
    });

    // 异步处理任务
    processImageTask(taskId, productImage, sceneImage, prompt, mode);

    res.json({
      success: true,
      taskId,
      message: '任务已创建，正在处理中...'
    });
  } catch (error) {
    console.error('创建任务错误:', error);
    res.status(500).json({ error: '创建任务失败' });
  }
});

// 获取任务状态
router.get('/task/:taskId', async (req, res) => {
  try {
    const task = tasks.get(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }

    res.json(task);
  } catch (error) {
    console.error('获取任务错误:', error);
    res.status(500).json({ error: '获取任务状态失败' });
  }
});

// 异步处理图片任务（使用 Gemini 分析 + Sharp 处理）
async function processImageTask(taskId, productImage, sceneImage, prompt, mode) {
  const task = tasks.get(taskId);

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const productPath = path.join(UPLOAD_DIR, productImage);

    let resultFilename;
    let resultUrl;

    if (mode === 'remove-background') {
      // 模式1：移除背景 - 使用 Sharp 处理
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      // 获取图片信息
      const metadata = await sharp(productPath).metadata();

      // 创建透明背景版本（简化处理）
      await sharp(productPath)
        .ensureAlpha()
        .png()
        .toFile(resultPath);

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        message: '图片已处理（基础模式）'
      };

    } else if (mode === 'generate-scene' || mode === 'edit-image') {
      // 模式2/3：场景生成/图片编辑 - 使用 Gemini 分析 + Sharp 处理
      const productImageData = await imageToGeminiFormat(productPath);

      // 使用 Gemini 分析产品
      const analysisPrompt = prompt || '请分析这个产品，并描述如何为它创建一个专业的产品摄影效果。';
      const analysisResult = await model.generateContent([analysisPrompt, productImageData]);
      const analysisText = (await analysisResult.response).text();

      // 使用 Sharp 进行图片优化处理
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      // 应用专业的图片处理效果
      await sharp(productPath)
        .resize(1024, 1024, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .modulate({
          brightness: 1.05,  // 轻微提亮
          saturation: 1.1    // 增加饱和度
        })
        .sharpen()           // 锐化
        .png({ quality: 95 })
        .toFile(resultPath);

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        analysisText,
        message: 'AI 分析完成，图片已优化处理'
      };

    } else if (mode === 'composite') {
      // 模式4：合成模式 - AI 分析 + 智能合成
      const productImageData = await imageToGeminiFormat(productPath);

      let sceneDescription = '';
      let sceneImageData = null;

      if (sceneImage) {
        const scenePath = path.join(UPLOAD_DIR, sceneImage);
        sceneImageData = await imageToGeminiFormat(scenePath);

        // 使用 Gemini 分析场景
        const sceneAnalysis = await model.generateContent([
          '请详细描述这个场景的特征，包括环境、光照、风格、色调等，用于后续的产品合成建议。',
          sceneImageData
        ]);
        sceneDescription = (await sceneAnalysis.response).text();
      }

      // 使用 Gemini 分析产品
      const productAnalysis = await model.generateContent([
        '请详细描述这个产品的外观特征，包括形状、颜色、材质、大小等。',
        productImageData
      ]);
      const productDescription = (await productAnalysis.response).text();

      // 生成合成建议
      const compositePrompt = sceneDescription
        ? `产品描述：${productDescription}\n\n场景描述：${sceneDescription}\n\n请提供将此产品融入该场景的详细建议，包括位置、角度、光照调整等。`
        : `产品描述：${productDescription}\n\n请提供为此产品创建专业摄影效果的建议。`;

      const suggestionResult = await model.generateContent(compositePrompt);
      const compositeSuggestion = (await suggestionResult.response).text();

      // 使用 Sharp 进行合成处理
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      if (sceneImage) {
        // 有场景图片时，进行叠加合成
        const scenePath = path.join(UPLOAD_DIR, sceneImage);

        // 获取场景图片尺寸
        const sceneMetadata = await sharp(scenePath).metadata();
        const targetWidth = sceneMetadata.width || 1024;
        const targetHeight = sceneMetadata.height || 1024;

        // 调整产品图片大小（保持比例，占场景的 40%）
        const productResized = await sharp(productPath)
          .resize(Math.floor(targetWidth * 0.4), Math.floor(targetHeight * 0.4), {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .ensureAlpha()
          .toBuffer();

        // 合成到场景中心偏下位置
        const left = Math.floor((targetWidth - Math.floor(targetWidth * 0.4)) / 2);
        const top = Math.floor(targetHeight * 0.5);

        await sharp(scenePath)
          .resize(targetWidth, targetHeight)
          .composite([{
            input: productResized,
            left: left,
            top: top,
            blend: 'over'
          }])
          .png({ quality: 95 })
          .toFile(resultPath);
      } else {
        // 无场景图片时，创建专业白色背景
        await sharp(productPath)
          .resize(1024, 1024, {
            fit: 'contain',
            background: { r: 250, g: 250, b: 250, alpha: 1 }
          })
          .modulate({
            brightness: 1.05,
            saturation: 1.1
          })
          .sharpen()
          .png({ quality: 95 })
          .toFile(resultPath);
      }

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        productDescription,
        sceneDescription,
        compositeSuggestion,
        message: 'AI 产品场景分析与合成完成'
      };

    } else {
      throw new Error('未知的处理模式');
    }

  } catch (error) {
    console.error('处理任务错误:', error);
    task.status = 'failed';
    task.error = error.message;
  }

  tasks.set(taskId, task);
}

// 清理旧文件（可选的定时任务）
router.delete('/cleanup', async (req, res) => {
  try {
    const maxAge = 24 * 60 * 60 * 1000; // 24小时
    const now = Date.now();

    const uploadFiles = await fs.readdir(UPLOAD_DIR);
    const resultFiles = await fs.readdir(RESULTS_DIR);

    let deletedCount = 0;

    for (const file of [...uploadFiles, ...resultFiles]) {
      const dir = uploadFiles.includes(file) ? UPLOAD_DIR : RESULTS_DIR;
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    res.json({ success: true, deletedCount });
  } catch (error) {
    console.error('清理错误:', error);
    res.status(500).json({ error: '清理失败' });
  }
});

export default router;
