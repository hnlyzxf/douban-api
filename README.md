# douban-api

豆瓣API服务 - 基于豆瓣移动端API获取影视热门榜单数据

## 项目简介

本项目是一个基于豆瓣移动端API的影视榜单服务，完全使用 `https://m.douban.com/rexxar/api/v2/subject/recent_hot/` 这个移动端内部API来获取数据。项目采用Docker容器化部署，提供RESTful API接口，支持获取豆瓣所有支持的影视内容榜单。

## 功能特性

- 🎬 **电影榜单**: 支持热门、最新、豆瓣高分、冷门佳片、华语、欧美、韩国、日本等8种榜单
- 📺 **电视剧榜单**: 支持综合、国产剧、综艺、欧美剧、日剧、韩剧、动画、纪录片等8种榜单
- 🐳 **Docker部署**: 完全基于Docker容器运行，开箱即用
- 🚀 **高性能**: 基于Express.js框架，轻量级高性能
- 📋 **标准化API**: 统一的响应格式，完善的错误处理
- 🔧 **易于扩展**: 模块化设计，易于维护和扩展

## 支持的榜单类型

### 电影榜单 (4大类 × 5小类 = 20个分类)

#### 热门电影
- 全部: `/api/douban/movie/hot/全部`
- 华语: `/api/douban/movie/hot/华语`
- 欧美: `/api/douban/movie/hot/欧美`
- 韩国: `/api/douban/movie/hot/韩国`
- 日本: `/api/douban/movie/hot/日本`

#### 最新电影
- 全部: `/api/douban/movie/latest/全部`
- 华语: `/api/douban/movie/latest/华语`
- 欧美: `/api/douban/movie/latest/欧美`
- 韩国: `/api/douban/movie/latest/韩国`
- 日本: `/api/douban/movie/latest/日本`

#### 豆瓣高分
- 全部: `/api/douban/movie/top/全部`
- 华语: `/api/douban/movie/top/华语`
- 欧美: `/api/douban/movie/top/欧美`
- 韩国: `/api/douban/movie/top/韩国`
- 日本: `/api/douban/movie/top/日本`

#### 冷门佳片
- 全部: `/api/douban/movie/underrated/全部`
- 华语: `/api/douban/movie/underrated/华语`
- 欧美: `/api/douban/movie/underrated/欧美`
- 韩国: `/api/douban/movie/underrated/韩国`
- 日本: `/api/douban/movie/underrated/日本`

### 剧集榜单 (2大类，共10个分类)

#### 最近热门剧集 (7个分类)
- 综合: `/api/douban/tv/drama/综合`
- 国产剧: `/api/douban/tv/drama/国产剧`
- 欧美剧: `/api/douban/tv/drama/欧美剧`
- 日剧: `/api/douban/tv/drama/日剧`
- 韩剧: `/api/douban/tv/drama/韩剧`
- 动画: `/api/douban/tv/drama/动画`
- 纪录片: `/api/douban/tv/drama/纪录片`

#### 最近热门综艺 (3个分类)
- 综合: `/api/douban/tv/variety/综合`
- 国内: `/api/douban/tv/variety/国内`
- 国外: `/api/douban/tv/variety/国外`

## 快速开始

### 使用Docker Compose (推荐)

```yaml
version: "3.8"
services:
  douban-api:
    image: x1ao4/douban-api:latest
    container_name: douban-api
    ports:
      - 3000:3000
    restart: unless-stopped
```

### 使用Docker

直接运行预构建的镜像：
```bash
docker run -d -p 3000:3000 --name douban-api x1ao4/douban-api:latest
```

## API文档

### 基础信息
- 基础URL: `http://localhost:3000`
- 响应格式: JSON
- 字符编码: UTF-8

### 通用响应格式
```json
{
  "success": true,
  "code": 0,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 电影榜单接口

#### 热门电影榜单
```
GET /api/douban/movie/hot/:type?
```

#### 最新电影榜单
```
GET /api/douban/movie/latest/:type?
```

#### 豆瓣高分电影榜单
```
GET /api/douban/movie/top/:type?
```

#### 冷门佳片榜单
```
GET /api/douban/movie/underrated/:type?
```

**路径参数:**
- `type` (string, 可选): 地区类型，可选值: `全部`、`华语`、`欧美`、`韩国`、`日本`，默认`全部`

**查询参数:**
- `start` (number, 可选): 起始位置，默认0
- `limit` (number, 可选): 返回数量，默认20，最大100

**示例请求:**
```bash
# 获取热门电影 - 全部
curl "http://localhost:3000/api/douban/movie/hot/全部"

# 获取豆瓣高分 - 华语
curl "http://localhost:3000/api/douban/movie/top/华语"

# 获取最新电影 - 欧美
curl "http://localhost:3000/api/douban/movie/latest/欧美?limit=10"
```

### 剧集榜单接口

#### 最近热门剧集
```
GET /api/douban/tv/drama/:type?
```

**路径参数:**
- `type` (string, 可选): 剧集类型，可选值: `综合`、`国产剧`、`欧美剧`、`日剧`、`韩剧`、`动画`、`纪录片`，默认`综合`

#### 最近热门综艺
```
GET /api/douban/tv/variety/:type?
```

**路径参数:**
- `type` (string, 可选): 综艺类型，可选值: `综合`、`国内`、`国外`，默认`综合`

**查询参数:**
- `start` (number, 可选): 起始位置，默认0
- `limit` (number, 可选): 返回数量，默认20，最大100

**示例请求:**
```bash
# 获取最近热门剧集 - 韩剧
curl "http://localhost:3000/api/douban/tv/drama/韩剧"

# 获取最近热门综艺 - 国内
curl "http://localhost:3000/api/douban/tv/variety/国内?limit=10"

# 获取动画
curl "http://localhost:3000/api/douban/tv/drama/动画"
```

### 兼容性接口

#### 通用电影接口 (兼容旧版本)
```
GET /api/douban/movie/recent_hot
```

#### 通用剧集接口 (兼容旧版本)
```
GET /api/douban/tv/recent_hot
```

### 其他接口

#### 获取电影类别列表
```
GET /api/douban/movie/categories
```

#### 获取剧集类别列表
```
GET /api/douban/tv/categories
```

#### 获取所有类别列表
```
GET /api/douban/categories
```

#### 健康检查
```
GET /health
```

#### API文档
```
GET /
```

## 环境变量

项目支持通过 `.env` 文件配置环境变量（可选）:

```bash
# 服务端口（默认: 3000）
PORT=3000
```

如果不创建 `.env` 文件，服务将使用默认端口 3000。

## 注意事项

1. **使用限制**: 本服务仅用于学习和研究目的，请遵守豆瓣的使用条款
2. **请求频率**: 建议合理控制请求频率，避免对豆瓣服务造成压力
3. **数据来源**: 所有数据来源于豆瓣移动端API，数据准确性和可用性依赖于豆瓣服务
4. **网络环境**: 确保服务器能够正常访问豆瓣移动端API
