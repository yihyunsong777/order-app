const { Pool } = require('pg');
require('dotenv').config();

// Render 데이터베이스 초기화 스크립트
const initRenderDatabase = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'order_app',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔄 Render 데이터베이스 초기화 시작...');
    console.log(`연결 정보: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}\n`);
    
    // 트랜잭션 시작
    await client.query('BEGIN');

    // 기존 테이블 삭제 (역순으로)
    console.log('🗑️  기존 테이블 삭제 중...');
    await client.query('DROP TABLE IF EXISTS order_item_options CASCADE');
    await client.query('DROP TABLE IF EXISTS order_items CASCADE');
    await client.query('DROP TABLE IF EXISTS orders CASCADE');
    await client.query('DROP TABLE IF EXISTS options CASCADE');
    await client.query('DROP TABLE IF EXISTS menus CASCADE');

    // Menus 테이블 생성
    await client.query(`
      CREATE TABLE menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL CHECK (price >= 0),
        image_url VARCHAR(500),
        inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Menus 테이블 생성 완료');

    // Options 테이블 생성
    await client.query(`
      CREATE TABLE options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
        menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Options 테이블 생성 완료');

    // Orders 테이블 생성
    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        order_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        total_price INTEGER NOT NULL CHECK (total_price >= 0),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Orders 테이블 생성 완료');

    // Order_Items 테이블 생성
    await client.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menus(id),
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
        unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
        subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Order_Items 테이블 생성 완료');

    // Order_Item_Options 테이블 생성
    await client.query(`
      CREATE TABLE order_item_options (
        id SERIAL PRIMARY KEY,
        order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
        option_id INTEGER REFERENCES options(id),
        option_name VARCHAR(50) NOT NULL,
        option_price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Order_Item_Options 테이블 생성 완료');

    // 인덱스 생성
    await client.query('CREATE INDEX IF NOT EXISTS idx_menus_name ON menus(name)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_datetime ON orders(order_datetime)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)');
    console.log('✅ 인덱스 생성 완료');

    // 샘플 데이터 삽입
    console.log('\n🔄 샘플 데이터 삽입 중...');

    // 메뉴 데이터
    const menuResult = await client.query(`
      INSERT INTO menus (name, description, price, image_url, inventory) VALUES
      ('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/menu-1-아메리카노-ICE-.jpg', 10),
      ('아메리카노(HOT)', '따뜻하고 진한 아메리카노', 4000, '/images/menu-2-아메리카노-HOT-.jpg', 10),
      ('카페라떼', '부드러운 우유가 가득한 라떼', 5000, '/images/menu-3-카페라떼.jpg', 10),
      ('카푸치노', '풍부한 거품이 일품인 카푸치노', 5000, '/images/menu-4-카푸치노.jpg', 10),
      ('바닐라라떼', '달콤한 바닐라 향이 가득한 라떼', 5500, '/images/menu-5-바닐라라떼.jpg', 10),
      ('카라멜 마키아또', '달콤한 카라멜 시럽과 에스프레소의 조화', 6000, '/images/menu-6-카라멜-마키아또.jpg', 10)
      RETURNING id
    `);
    console.log('✅ 메뉴 데이터 삽입 완료');

    // 옵션 데이터 (모든 메뉴에 동일한 옵션 추가)
    for (let i = 1; i <= 6; i++) {
      await client.query(`
        INSERT INTO options (name, price, menu_id) VALUES
        ('샷 추가', 500, $1),
        ('시럽 추가', 0, $1)
      `, [i]);
    }
    
    // 바닐라라떼와 카라멜 마키아또에는 휘핑 추가 옵션 추가
    await client.query(`
      INSERT INTO options (name, price, menu_id) VALUES
      ('휘핑 추가', 500, 5),
      ('휘핑 추가', 500, 6)
    `);
    console.log('✅ 옵션 데이터 삽입 완료');

    // 커밋
    await client.query('COMMIT');
    
    console.log('\n✅ Render 데이터베이스 초기화 완료!');
    console.log('📊 생성된 테이블:');
    console.log('  - menus (6개 메뉴)');
    console.log('  - options (14개 옵션)');
    console.log('  - orders');
    console.log('  - order_items');
    console.log('  - order_item_options');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// 스크립트 실행
if (require.main === module) {
  initRenderDatabase()
    .then(() => {
      console.log('\n🎉 모든 작업이 완료되었습니다!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 오류 발생:', error);
      process.exit(1);
    });
}

module.exports = initRenderDatabase;

