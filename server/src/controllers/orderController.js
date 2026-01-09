const { query, pool } = require('../config/database');

// 주문 생성
const createOrder = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { items } = req.body;

    // 유효성 검증
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 비어있습니다.',
      });
    }

    await client.query('BEGIN');

    // 1. 재고 확인
    for (const item of items) {
      const menuResult = await client.query(
        'SELECT id, name, price, inventory FROM menus WHERE id = $1',
        [item.menu_id]
      );

      if (menuResult.rows.length === 0) {
        throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
      }

      const menu = menuResult.rows[0];
      if (menu.inventory < item.quantity) {
        throw new Error(
          `${menu.name}의 재고가 부족합니다. (남은 재고: ${menu.inventory}개)`
        );
      }
    }

    // 2. 총 금액 계산
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuResult = await client.query(
        'SELECT price, name FROM menus WHERE id = $1',
        [item.menu_id]
      );
      const menu = menuResult.rows[0];
      
      let unitPrice = menu.price;

      // 옵션 가격 추가
      const selectedOptions = [];
      if (item.options && item.options.length > 0) {
        const optionsResult = await client.query(
          'SELECT id, name, price FROM options WHERE id = ANY($1)',
          [item.options]
        );
        
        for (const option of optionsResult.rows) {
          unitPrice += option.price;
          selectedOptions.push(option);
        }
      }

      const subtotal = unitPrice * item.quantity;
      totalPrice += subtotal;

      orderItemsData.push({
        menu_id: item.menu_id,
        menu_name: menu.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal,
        options: selectedOptions,
      });
    }

    // 3. Orders 테이블에 주문 생성
    const orderResult = await client.query(
      'INSERT INTO orders (total_price, status) VALUES ($1, $2) RETURNING id, order_datetime, total_price, status',
      [totalPrice, 'pending']
    );
    const order = orderResult.rows[0];

    // 4. Order_Items 저장 및 재고 차감
    for (const itemData of orderItemsData) {
      // Order_Items 저장
      const orderItemResult = await client.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [order.id, itemData.menu_id, itemData.quantity, itemData.unit_price, itemData.subtotal]
      );
      const orderItemId = orderItemResult.rows[0].id;

      // Order_Item_Options 저장
      for (const option of itemData.options) {
        await client.query(
          'INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price) VALUES ($1, $2, $3, $4)',
          [orderItemId, option.id, option.name, option.price]
        );
      }

      // 재고 차감
      await client.query(
        'UPDATE menus SET inventory = inventory - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [itemData.quantity, itemData.menu_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: '주문이 완료되었습니다.',
      data: {
        order_id: order.id,
        order_datetime: order.order_datetime,
        total_price: order.total_price,
        status: order.status,
        items: orderItemsData,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// 전체 주문 조회
const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM orders';
    const queryParams = [];

    if (status) {
      queryText += ' WHERE status = $1';
      queryParams.push(status);
    }

    queryText += ' ORDER BY order_datetime DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const ordersResult = await query(queryText, queryParams);
    const orders = ordersResult.rows;

    // 각 주문의 항목 조회
    for (const order of orders) {
      const itemsResult = await query(
        `SELECT oi.*, m.name as menu_name
         FROM order_items oi
         JOIN menus m ON oi.menu_id = m.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      for (const item of itemsResult.rows) {
        const optionsResult = await query(
          'SELECT option_name, option_price FROM order_item_options WHERE order_item_id = $1',
          [item.id]
        );
        item.options = optionsResult.rows.map(o => o.option_name);
      }

      order.items = itemsResult.rows;
    }

    // 전체 개수 조회
    let countQuery = 'SELECT COUNT(*) FROM orders';
    if (status) {
      countQuery += ' WHERE status = $1';
    }
    const countResult = await query(countQuery, status ? [status] : []);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

// 특정 주문 조회
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.',
      });
    }

    const order = orderResult.rows[0];

    // 주문 항목 조회
    const itemsResult = await query(
      `SELECT oi.*, m.name as menu_name
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1`,
      [id]
    );

    for (const item of itemsResult.rows) {
      const optionsResult = await query(
        'SELECT option_id, option_name, option_price FROM order_item_options WHERE order_item_id = $1',
        [item.id]
      );
      item.options = optionsResult.rows;
    }

    order.items = itemsResult.rows;

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// 주문 상태 변경
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 유효성 검증
    if (!['pending', 'preparing', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 상태입니다. (pending, preparing, completed 중 하나여야 합니다)',
      });
    }

    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status, updated_at',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      message: '주문 상태가 변경되었습니다.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// 주문 통계 조회
const getOrderStats = async (req, res, next) => {
  try {
    const statsResult = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'preparing') as preparing,
        COUNT(*) FILTER (WHERE status = 'completed') as completed
      FROM orders
    `);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        total: parseInt(stats.total),
        pending: parseInt(stats.pending),
        preparing: parseInt(stats.preparing),
        completed: parseInt(stats.completed),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
};

