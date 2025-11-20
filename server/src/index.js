import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');

// CORS 配置 - 支持 Zeabur 和其他云平台
const corsOptions = {
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（如移动应用、Postman）
    if (!origin) return callback(null, true);

    // 允许的域名列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      /\.zeabur\.app$/,  // 所有 Zeabur 域名
      /\.vercel\.app$/,  // Vercel 域名
      /\.netlify\.app$/  // Netlify 域名
    ];

    // 检查是否匹配
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      } else {
        return pattern.test(origin);
      }
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // 开发阶段允许所有域名，生产环境可以改为 false
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// 确保数据文件存在
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// 读取所有文章
async function readPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入文章
async function writePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}

// API Routes

// 健康检查端点
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '博客 API 服务运行中',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 获取所有文章
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read posts' });
  }
});

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read post' });
  }
});

// 创建新文章
app.post('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      title: req.body.title || '无标题',
      content: req.body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    await writePosts(posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// 更新文章
app.put('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        title: req.body.title || posts[index].title,
        content: req.body.content || posts[index].content,
        updatedAt: new Date().toISOString()
      };
      await writePosts(posts);
      res.json(posts[index]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 删除文章
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    if (filteredPosts.length < posts.length) {
      await writePosts(filteredPosts);
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// 启动服务器
ensureDataFile().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
