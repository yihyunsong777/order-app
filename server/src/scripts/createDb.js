const { Pool } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
  // postgres 데이터베이스에 연결하여 order_app 생성
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('🔄 데이터베이스 생성 중...');
    
    const dbName = process.env.DB_NAME || 'order_app';
    
    // 데이터베이스 존재 확인
    const checkResult = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ 데이터베이스 '${dbName}' 생성 완료!`);
    } else {
      console.log(`ℹ️  데이터베이스 '${dbName}'가 이미 존재합니다.`);
    }

    // 생성된 데이터베이스에 연결 테스트
    const testPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    const testResult = await testPool.query('SELECT NOW()');
    console.log(`✅ '${dbName}' 데이터베이스 연결 성공!`);
    console.log(`   시간: ${testResult.rows[0].now}\n`);

    await testPool.end();
    await adminPool.end();

    return true;
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    await adminPool.end();
    throw error;
  }
};

if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('🎉 데이터베이스 생성 완료!');
      console.log('   다음 단계: npm run init-db');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 데이터베이스 생성 실패');
      process.exit(1);
    });
}

module.exports = createDatabase;

