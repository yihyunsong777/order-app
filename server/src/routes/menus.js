const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menus - 전체 메뉴 조회
router.get('/', menuController.getAllMenus);

// GET /api/menus/:id - 특정 메뉴 조회
router.get('/:id', menuController.getMenuById);

// PATCH /api/menus/:id/inventory - 재고 수정
router.patch('/:id/inventory', menuController.updateInventory);

module.exports = router;

