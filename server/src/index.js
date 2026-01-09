const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const menusRouter = require('./routes/menus');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
console.log('🌐 CORS 설정:', frontendUrl);

app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 루트 경로 - API 안내
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '커피 주문 앱 API 서버',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      menus: {
        getAll: 'GET /api/menus',
        getById: 'GET /api/menus/:id',
        updateInventory: 'PATCH /api/menus/:id/inventory',
      },
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        getById: 'GET /api/orders/:id',
        updateStatus: 'PATCH /api/orders/:id/status',
        getStats: 'GET /api/orders/stats',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString(),
  });
});

// API 라우트
app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log('🚀 ====================================');
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`🚀 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 헬스 체크: http://localhost:${PORT}/health`);
  console.log('🚀 ====================================');
});

// 우아한 종료
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM 신호 수신. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT 신호 수신. 서버를 종료합니다...');
  process.exit(0);
});

module.exports = app;

