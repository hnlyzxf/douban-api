const express = require('express');
const router = express.Router();
const DoubanService = require('../services/doubanService');
const { ApiResponse, asyncHandler } = require('../middleware/errorHandler');

const doubanService = new DoubanService();

/**
 * 获取电影榜单 - 通用接口
 * GET /api/douban/movie/recent_hot
 */
router.get('/movie/recent_hot', asyncHandler(async (req, res) => {
  const {
    category = '热门',
    type = '全部',
    start = 0,
    limit = 20
  } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  // 验证参数
  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  if (startNum < 0) {
    return res.status(400).json(ApiResponse.error('start参数不能小于0'));
  }

  const result = await doubanService.getMovieRanking(category, type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取电影榜单成功: ${category} - ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取电影榜单失败'));
  }
}));

/**
 * 获取热门电影榜单
 * GET /api/douban/movie/hot/:type?
 */
router.get('/movie/hot/:type?', asyncHandler(async (req, res) => {
  const { type = '全部' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  const result = await doubanService.getMovieRanking('热门', type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取热门电影榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取热门电影榜单失败'));
  }
}));

/**
 * 获取最新电影榜单
 * GET /api/douban/movie/latest/:type?
 */
router.get('/movie/latest/:type?', asyncHandler(async (req, res) => {
  const { type = '全部' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  const result = await doubanService.getMovieRanking('最新', type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取最新电影榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取最新电影榜单失败'));
  }
}));

/**
 * 获取豆瓣高分电影榜单
 * GET /api/douban/movie/top/:type?
 */
router.get('/movie/top/:type?', asyncHandler(async (req, res) => {
  const { type = '全部' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  const result = await doubanService.getMovieRanking('豆瓣高分', type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取豆瓣高分电影榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取豆瓣高分电影榜单失败'));
  }
}));

/**
 * 获取冷门佳片榜单
 * GET /api/douban/movie/underrated/:type?
 */
router.get('/movie/underrated/:type?', asyncHandler(async (req, res) => {
  const { type = '全部' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  const result = await doubanService.getMovieRanking('冷门佳片', type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取冷门佳片榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取冷门佳片榜单失败'));
  }
}));

/**
 * 获取电视剧榜单 - 通用接口
 * GET /api/douban/tv/recent_hot
 */
router.get('/tv/recent_hot', asyncHandler(async (req, res) => {
  const {
    category = 'tv',
    type = 'tv',
    start = 0,
    limit = 20
  } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  // 验证参数
  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  if (startNum < 0) {
    return res.status(400).json(ApiResponse.error('start参数不能小于0'));
  }

  const result = await doubanService.getTvRanking(category, type, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取电视剧榜单成功: ${category} - ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取电视剧榜单失败'));
  }
}));

/**
 * 获取最近热门剧集 - 综合
 * GET /api/douban/tv/drama/:type?
 */
router.get('/tv/drama/:type?', asyncHandler(async (req, res) => {
  const { type = '综合' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  // 根据type映射到正确的category和type
  let category, apiType;
  switch(type) {
    case '综合':
      category = 'tv'; apiType = 'tv'; break;
    case '国产剧':
      category = 'tv'; apiType = 'tv_domestic'; break;
    case '欧美剧':
      category = 'tv'; apiType = 'tv_american'; break;
    case '日剧':
      category = 'tv'; apiType = 'tv_japanese'; break;
    case '韩剧':
      category = 'tv'; apiType = 'tv_korean'; break;
    case '动画':
      category = 'tv'; apiType = 'tv_animation'; break;
    case '纪录片':
      category = 'tv'; apiType = 'tv_documentary'; break;
    default:
      category = 'tv'; apiType = 'tv';
  }

  const result = await doubanService.getTvRanking(category, apiType, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取最近热门剧集榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取最近热门剧集榜单失败'));
  }
}));

/**
 * 获取最近热门综艺
 * GET /api/douban/tv/variety/:type?
 */
router.get('/tv/variety/:type?', asyncHandler(async (req, res) => {
  const { type = '综合' } = req.params;
  const { start = 0, limit = 20 } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  // 根据type映射到正确的category和type
  let category, apiType;
  switch(type) {
    case '综合':
      category = 'show'; apiType = 'show'; break;
    case '国内':
      category = 'show'; apiType = 'show_domestic'; break;
    case '国外':
      category = 'show'; apiType = 'show_foreign'; break;
    default:
      category = 'show'; apiType = 'show';
  }

  const result = await doubanService.getTvRanking(category, apiType, startNum, limitNum);

  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取最近热门综艺榜单成功: ${type}`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取最近热门综艺榜单失败'));
  }
}));

/**
 * 获取电影类别列表
 * GET /api/douban/movie/categories
 */
router.get('/movie/categories', asyncHandler(async (req, res) => {
  const categories = doubanService.getMovieCategories();
  res.json(ApiResponse.success(categories, '获取电影类别列表成功'));
}));

/**
 * 获取电视剧类别列表
 * GET /api/douban/tv/categories
 */
router.get('/tv/categories', asyncHandler(async (req, res) => {
  const categories = doubanService.getTvCategories();
  res.json(ApiResponse.success(categories, '获取电视剧类别列表成功'));
}));

/**
 * 获取所有类别列表
 * GET /api/douban/categories
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = doubanService.getAllCategories();
  res.json(ApiResponse.success(categories, '获取所有类别列表成功'));
}));

/**
 * 通用榜单接口 - 兼容旧版本
 * GET /api/douban/recent_hot
 */
router.get('/recent_hot', asyncHandler(async (req, res) => {
  const {
    type = 'movie',
    category = '热门',
    subtype = '全部',
    start = 0,
    limit = 20
  } = req.query;

  const startNum = parseInt(start) || 0;
  const limitNum = parseInt(limit) || 20;

  // 验证参数
  if (limitNum > 100) {
    return res.status(400).json(ApiResponse.error('limit参数不能超过100'));
  }

  if (startNum < 0) {
    return res.status(400).json(ApiResponse.error('start参数不能小于0'));
  }

  let result;
  if (type === 'movie') {
    result = await doubanService.getMovieRanking(category, subtype, startNum, limitNum);
  } else if (type === 'tv') {
    result = await doubanService.getTvRanking(category, subtype, startNum, limitNum);
  } else {
    return res.status(400).json(ApiResponse.error('type参数只支持movie或tv'));
  }
  
  if (result.success) {
    res.json(ApiResponse.success(result.data, `获取${type === 'movie' ? '电影' : '电视剧'}榜单成功`));
  } else {
    res.status(500).json(ApiResponse.error(result.message || '获取榜单失败'));
  }
}));

module.exports = router;
