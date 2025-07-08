const express = require('express');
const cors = require('cors');
require('dotenv').config();

const doubanRoutes = require('./routes/douban');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/douban', doubanRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '豆瓣API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 根路径 - API文档
app.get('/', (req, res) => {
  res.json({
    name: 'douban-api',
    version: '1.0.0',
    description: '豆瓣API服务 - 基于豆瓣移动端API获取影视热门榜单数据',
    endpoints: {
      movie: {
        '热门电影': {
          '全部': '/api/douban/movie/hot/全部',
          '华语': '/api/douban/movie/hot/华语',
          '欧美': '/api/douban/movie/hot/欧美',
          '韩国': '/api/douban/movie/hot/韩国',
          '日本': '/api/douban/movie/hot/日本'
        },
        '最新电影': {
          '全部': '/api/douban/movie/latest/全部',
          '华语': '/api/douban/movie/latest/华语',
          '欧美': '/api/douban/movie/latest/欧美',
          '韩国': '/api/douban/movie/latest/韩国',
          '日本': '/api/douban/movie/latest/日本'
        },
        '豆瓣高分': {
          '全部': '/api/douban/movie/top/全部',
          '华语': '/api/douban/movie/top/华语',
          '欧美': '/api/douban/movie/top/欧美',
          '韩国': '/api/douban/movie/top/韩国',
          '日本': '/api/douban/movie/top/日本'
        },
        '冷门佳片': {
          '全部': '/api/douban/movie/underrated/全部',
          '华语': '/api/douban/movie/underrated/华语',
          '欧美': '/api/douban/movie/underrated/欧美',
          '韩国': '/api/douban/movie/underrated/韩国',
          '日本': '/api/douban/movie/underrated/日本'
        }
      },
      tv: {
        '最近热门剧集': {
          '综合': '/api/douban/tv/drama/综合',
          '国产剧': '/api/douban/tv/drama/国产剧',
          '欧美剧': '/api/douban/tv/drama/欧美剧',
          '日剧': '/api/douban/tv/drama/日剧',
          '韩剧': '/api/douban/tv/drama/韩剧',
          '动画': '/api/douban/tv/drama/动画',
          '纪录片': '/api/douban/tv/drama/纪录片'
        },
        '最近热门综艺': {
          '综合': '/api/douban/tv/variety/综合',
          '国内': '/api/douban/tv/variety/国内',
          '国外': '/api/douban/tv/variety/国外'
        }
      }
    },
    legacy_endpoints: {
      '通用电影接口': '/api/douban/movie/recent_hot?category=热门&type=全部',
      '通用剧集接口': '/api/douban/tv/recent_hot?category=tv&type=tv'
    },
    documentation: 'https://github.com/x1ao4/douban-api'
  });
});

// 错误处理中间件
app.use(errorHandler);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    code: 404,
    message: '接口不存在',
    data: null
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`豆瓣API服务已启动，端口: ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 查看API文档`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;
