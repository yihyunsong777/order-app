const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders/stats - 주문 통계 조회
router.get('/stats', orderController.getOrderStats);

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders - 전체 주문 조회
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', orderController.getOrderById);

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;

