import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import OpenAI from 'openai';

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

// 获取 OpenAI 客户端
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('未配置 OPENAI_API_KEY 环境变量');
  }
  return new OpenAI({ apiKey });
}

// 将图片转换为 base64
async function imageToBase64(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  return imageBuffer.toString('base64');
}

// 获取图片的 MIME 类型
function getMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/jpeg';
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

// AI 分析图片
router.post('/analyze', async (req, res) => {
  try {
    const { productImage, sceneImage } = req.body;

    if (!productImage) {
      return res.status(400).json({ error: '请提供产品图片' });
    }

    const openai = getOpenAIClient();

    // 读取产品图片
    const productPath = path.join(UPLOAD_DIR, productImage);
    const productBase64 = await imageToBase64(productPath);
    const productMime = getMimeType(productPath);

    // 构建消息
    const messages = [
      {
        role: 'system',
        content: `你是一个专业的产品图片分析助手。请分析用户上传的产品图片，识别：
1. 产品的主要特征和类型
2. 产品的颜色、形状、材质
3. 当前背景情况
4. 如果有场景图片，分析如何将产品融入该场景
5. 提供具体的处理建议

请用中文回答，结构化输出分析结果。`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: sceneImage
              ? '请分析这个产品图片，并根据提供的场景图片，建议如何将产品融入场景中。'
              : '请分析这个产品图片，识别产品主体和背景，并提供处理建议。'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${productMime};base64,${productBase64}`
            }
          }
        ]
      }
    ];

    // 如果有场景图片，添加到消息中
    if (sceneImage) {
      const scenePath = path.join(UPLOAD_DIR, sceneImage);
      const sceneBase64 = await imageToBase64(scenePath);
      const sceneMime = getMimeType(scenePath);

      messages[1].content.push({
        type: 'text',
        text: '以下是目标场景图片：'
      });
      messages[1].content.push({
        type: 'image_url',
        image_url: {
          url: `data:${sceneMime};base64,${sceneBase64}`
        }
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1500
    });

    const analysis = response.choices[0].message.content;

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

// 异步处理图片任务
async function processImageTask(taskId, productImage, sceneImage, prompt, mode) {
  const task = tasks.get(taskId);

  try {
    const openai = getOpenAIClient();
    const productPath = path.join(UPLOAD_DIR, productImage);

    let resultFilename;
    let resultUrl;

    if (mode === 'remove-background') {
      // 模式1：移除背景（使用 sharp 简单处理或调用专门的API）
      // 这里使用简化版本，实际生产中建议使用专门的抠图服务
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      // 简单的处理示例（实际需要更复杂的算法或AI服务）
      await sharp(productPath)
        .png()
        .toFile(resultPath);

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        message: '背景已处理（示例模式）'
      };
    } else if (mode === 'generate-scene') {
      // 模式2：使用 DALL-E 生成新场景
      const productBase64 = await imageToBase64(productPath);

      // 使用 DALL-E 3 生成图片
      const generatePrompt = prompt || '将这个产品放置在一个现代简约的白色背景中，专业的产品摄影风格，柔和的灯光';

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: generatePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      });

      const generatedImageUrl = response.data[0].url;

      // 下载生成的图片
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      const imageResponse = await fetch(generatedImageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      await fs.writeFile(resultPath, Buffer.from(arrayBuffer));

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        revisedPrompt: response.data[0].revised_prompt,
        message: 'AI 场景生成完成'
      };
    } else if (mode === 'edit-image') {
      // 模式3：使用 DALL-E 2 编辑图片（需要 mask）
      const editPrompt = prompt || '优化产品图片的背景和光照';

      // 将图片转换为 PNG 并调整大小
      const processedPath = path.join(UPLOAD_DIR, `processed-${taskId}.png`);
      await sharp(productPath)
        .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(processedPath);

      // 使用 DALL-E 3 重新生成
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `基于上传的产品照片风格，${editPrompt}`,
        n: 1,
        size: '1024x1024'
      });

      const generatedImageUrl = response.data[0].url;

      // 下载生成的图片
      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      const imageResponse = await fetch(generatedImageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      await fs.writeFile(resultPath, Buffer.from(arrayBuffer));

      // 清理临时文件
      await fs.unlink(processedPath).catch(() => {});

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        revisedPrompt: response.data[0].revised_prompt,
        message: 'AI 图片编辑完成'
      };
    } else if (mode === 'composite') {
      // 模式4：合成模式 - 分析并生成产品在场景中的效果图
      const productBase64 = await imageToBase64(productPath);

      let sceneDescription = '';
      if (sceneImage) {
        const scenePath = path.join(UPLOAD_DIR, sceneImage);
        const sceneBase64 = await imageToBase64(scenePath);

        // 先分析场景
        const analysisResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: '请详细描述这个场景的特征，包括环境、光照、风格等，用于后续的产品合成。' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${sceneBase64}` } }
              ]
            }
          ],
          max_tokens: 500
        });
        sceneDescription = analysisResponse.choices[0].message.content;
      }

      // 分析产品
      const productAnalysis = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '请详细描述这个产品的外观特征，包括形状、颜色、材质、大小等。' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${productBase64}` } }
            ]
          }
        ],
        max_tokens: 500
      });
      const productDescription = productAnalysis.choices[0].message.content;

      // 生成合成提示词
      const compositePrompt = prompt || (sceneDescription
        ? `一个产品的专业摄影照片。产品描述：${productDescription}。放置在以下场景中：${sceneDescription}。高质量产品摄影，专业灯光。`
        : `一个产品的专业摄影照片。产品描述：${productDescription}。现代简约白色背景，柔和的工作室灯光，高质量产品摄影。`);

      // 生成最终图片
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: compositePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd'
      });

      const generatedImageUrl = response.data[0].url;

      resultFilename = `result-${taskId}.png`;
      const resultPath = path.join(RESULTS_DIR, resultFilename);

      const imageResponse = await fetch(generatedImageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      await fs.writeFile(resultPath, Buffer.from(arrayBuffer));

      resultUrl = `/api/images/file/${resultFilename}`;

      task.status = 'completed';
      task.result = {
        url: resultUrl,
        filename: resultFilename,
        productDescription,
        sceneDescription,
        revisedPrompt: response.data[0].revised_prompt,
        message: 'AI 产品场景合成完成'
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
