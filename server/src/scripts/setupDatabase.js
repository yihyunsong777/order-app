const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 연결 설정 (기본 postgres 데이터베이스에 연결)
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // 기본 데이터베이스
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const setupDatabase = async () => {
  const client = await adminPool.connect();
  
  try {
    console.log('🔄 데이터베이스 설정 시작...');
    
    // 데이터베이스 존재 여부 확인
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'order_app']
    );

    if (dbCheckResult.rows.length === 0) {
      // 데이터베이스 생성
      console.log(`📦 데이터베이스 '${process.env.DB_NAME || 'order_app'}' 생성 중...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'order_app'}`);
      console.log('✅ 데이터베이스 생성 완료!');
    } else {
      console.log('ℹ️  데이터베이스가 이미 존재합니다.');
    }

    // 연결 테스트
    console.log('🔌 데이터베이스 연결 테스트 중...');
    const testPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'order_app',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    const testClient = await testPool.connect();
    const testResult = await testClient.query('SELECT NOW()');
    console.log('✅ 데이터베이스 연결 성공!');
    console.log(`   현재 시간: ${testResult.rows[0].now}`);
    
    testClient.release();
    await testPool.end();

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    if (error.code === '28P01') {
      console.error('   인증 실패: 사용자 이름 또는 비밀번호가 잘못되었습니다.');
      console.error('   .env 파일의 DB_USER와 DB_PASSWORD를 확인하세요.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   연결 거부: PostgreSQL 서버가 실행 중인지 확인하세요.');
      console.error('   macOS: brew services start postgresql@14 (또는 설치된 버전)');
    } else {
      console.error('   오류 코드:', error.code);
    }
    
    throw error;
  } finally {
    client.release();
    await adminPool.end();
  }
};

// 스크립트 실행
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 데이터베이스 설정 완료!');
      console.log('   다음 단계: npm run init-db');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 데이터베이스 설정 실패');
      process.exit(1);
    });
}

module.exports = setupDatabase;

