const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 연결 테스트 스크립트
const testConnection = async () => {
  console.log('🔌 PostgreSQL 연결 테스트 중...\n');
  console.log('연결 정보:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 5432}`);
  console.log(`  Database: postgres (기본 DB)`);
  console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : '(설정되지 않음)'}\n`);

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    const result = await pool.query('SELECT NOW(), version()');
    console.log('✅ 연결 성공!');
    console.log(`   현재 시간: ${result.rows[0].now}`);
    console.log(`   PostgreSQL 버전: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}\n`);
    
    // 데이터베이스 목록 확인
    const dbList = await pool.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false"
    );
    console.log('📦 사용 가능한 데이터베이스:');
    dbList.rows.forEach(db => {
      console.log(`   - ${db.datname}`);
    });
    
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ 연결 실패!\n');
    
    if (error.code === '28P01') {
      console.error('   인증 실패: 비밀번호가 잘못되었습니다.');
      console.error('\n   해결 방법:');
      console.error('   1. .env 파일을 열어서 DB_PASSWORD를 확인하세요.');
      console.error('   2. PostgreSQL 설치 시 설정한 비밀번호를 입력하세요.');
      console.error('   3. 비밀번호를 모르는 경우:');
      console.error('      - macOS (Homebrew): 비밀번호 없이 설정되어 있을 수 있습니다.');
      console.error('      - 다른 방법으로 설치한 경우: PostgreSQL 설정을 확인하세요.\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   연결 거부: PostgreSQL 서버가 실행 중이지 않습니다.');
      console.error('\n   해결 방법:');
      console.error('   macOS (Homebrew):');
      console.error('     brew services start postgresql@14');
      console.error('     (또는 설치된 버전에 맞게)');
      console.error('   다른 방법:');
      console.error('     PostgreSQL 서버를 시작하세요.\n');
    } else {
      console.error(`   오류 코드: ${error.code}`);
      console.error(`   메시지: ${error.message}\n`);
    }
    
    await pool.end();
    return false;
  }
};

if (require.main === module) {
  testConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = testConnection;

