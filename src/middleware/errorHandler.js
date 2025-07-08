/**
 * API响应格式化类
 */
class ApiResponse {
  constructor(success, code, data, message) {
    this.success = success;
    this.code = code;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = "操作成功") {
    return new ApiResponse(true, 0, data, message);
  }

  static error(message, code = 10000) {
    return new ApiResponse(false, code, null, message);
  }
}

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('API错误:', err);

  // 默认错误信息
  let statusCode = 500;
  let message = '服务器内部错误';
  let code = 10000;

  // 根据错误类型设置不同的响应
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '请求参数错误';
    code = 10001;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '未授权访问';
    code = 10002;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = '资源不存在';
    code = 10003;
  } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = '豆瓣服务暂时不可用';
    code = 10004;
  } else if (err.code === 'ECONNABORTED') {
    statusCode = 408;
    message = '请求超时';
    code = 10005;
  } else if (err.response && err.response.status) {
    // Axios错误
    statusCode = err.response.status;
    message = err.response.data?.message || err.message || '外部服务错误';
    code = 10006;
  } else if (err.message) {
    message = err.message;
  }

  // 返回错误响应
  res.status(statusCode).json(ApiResponse.error(message, code));
};

/**
 * 异步错误处理包装器
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ApiResponse,
  errorHandler,
  asyncHandler
};
