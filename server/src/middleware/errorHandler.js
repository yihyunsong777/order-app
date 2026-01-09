// 에러 핸들러 미들웨어
const errorHandler = (err, req, res, next) => {
  console.error('❌ 에러 발생:', err);

  // 기본 에러 응답
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 Not Found 핸들러
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.',
    path: req.originalUrl,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

