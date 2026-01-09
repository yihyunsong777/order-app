const { query } = require('../config/database');

// 전체 메뉴 조회 (옵션 포함)
const getAllMenus = async (req, res, next) => {
  try {
    // 메뉴 조회
    const menusResult = await query('SELECT * FROM menus ORDER BY id');
    const menus = menusResult.rows;

    // 각 메뉴의 옵션 조회
    for (const menu of menus) {
      const optionsResult = await query(
        'SELECT id, name, price FROM options WHERE menu_id = $1',
        [menu.id]
      );
      menu.options = optionsResult.rows;
    }

    res.json({
      success: true,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

// 특정 메뉴 조회
const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuResult = await query('SELECT * FROM menus WHERE id = $1', [id]);

    if (menuResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.',
      });
    }

    const menu = menuResult.rows[0];

    // 옵션 조회
    const optionsResult = await query(
      'SELECT id, name, price FROM options WHERE menu_id = $1',
      [id]
    );
    menu.options = optionsResult.rows;

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// 재고 수정
const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inventory } = req.body;

    // 유효성 검증
    if (inventory === undefined || inventory < 0) {
      return res.status(400).json({
        success: false,
        error: '재고 수량은 0 이상이어야 합니다.',
      });
    }

    const result = await query(
      'UPDATE menus SET inventory = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, inventory',
      [inventory, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      message: '재고가 업데이트되었습니다.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  updateInventory,
};

