const { Pool } = require('pg');
require('dotenv').config();
const os = require('os');

// 간단한 연결 테스트 - 다양한 비밀번호 조합 시도
const simpleConnect = async () => {
  const username = os.userInfo().username;
  
  console.log('🔍 PostgreSQL 연결 시도 중...\n');
  console.log(`현재 사용자: ${username}\n`);

  // 시도할 비밀번호 목록
  const passwords = [
    '',           // 빈 문자열
    null,         // null
    undefined,    // undefined
    'postgres',   // 기본 비밀번호
    username,     // 사용자 이름
    'password',   // 일반적인 비밀번호
  ];

  const users = [username, 'postgres'];

  for (const user of users) {
    console.log(`\n사용자: ${user}`);
    console.log('─'.repeat(40));
    
    for (const password of passwords) {
      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: user,
      };
      
      // password가 null이나 undefined가 아닌 경우만 추가
      if (password !== null && password !== undefined) {
        config.password = password;
      }
      
      let pool;
      try {
        pool = new Pool(config);
        const result = await pool.query('SELECT current_user, NOW()');
        
        console.log(`✅ 성공!`);
        console.log(`   비밀번호: ${password === '' ? '(빈 문자열)' : password === null ? '(null)' : password === undefined ? '(undefined)' : password}`);
        console.log(`   사용자: ${result.rows[0].current_user}`);
        console.log(`   시간: ${result.rows[0].now}\n`);
        
        // 데이터베이스 생성
        const dbName = process.env.DB_NAME || 'order_app';
        const dbCheck = await pool.query(
          'SELECT 1 FROM pg_database WHERE datname = $1',
          [dbName]
        );
        
        if (dbCheck.rows.length === 0) {
          await pool.query(`CREATE DATABASE ${dbName}`);
          console.log(`✅ 데이터베이스 '${dbName}' 생성 완료!\n`);
        }
        
        await pool.end();
        
        console.log('📝 .env 파일에 다음을 설정하세요:');
        console.log(`   DB_USER=${user}`);
        if (password === null || password === undefined) {
          console.log('   DB_PASSWORD=');
        } else {
          console.log(`   DB_PASSWORD=${password}`);
        }
        console.log('\n✅ 연결 성공! 다음 단계: npm run init-db');
        
        return { success: true, user, password };
      } catch (error) {
        if (pool) {
          await pool.end();
        }
        // 조용히 실패 (마지막에 요약 출력)
      }
    }
  }

  console.log('\n❌ 모든 연결 시도가 실패했습니다.\n');
  console.log('💡 해결 방법:');
  console.log('\n1. PostgreSQL에 직접 접속해보세요:');
  console.log('   /opt/homebrew/bin/psql -U leehyunsong');
  console.log('   또는');
  console.log('   /usr/local/bin/psql -U leehyunsong');
  console.log('\n2. 접속이 되면 비밀번호를 확인하세요.');
  console.log('\n3. 접속이 안 되면 PostgreSQL 인증 설정을 확인하세요.');
  console.log('   파일 위치: /opt/homebrew/var/postgresql@버전/pg_hba.conf');
  console.log('   또는: /usr/local/var/postgresql@버전/pg_hba.conf');
  console.log('\n4. pg_hba.conf 파일에서 다음 줄을 찾아서:');
  console.log('   local   all   all   md5');
  console.log('   또는');
  console.log('   host    all   all   127.0.0.1/32   md5');
  console.log('\n   다음으로 변경:');
  console.log('   local   all   all   trust');
  console.log('   host    all   all   127.0.0.1/32   trust');
  console.log('\n   변경 후 PostgreSQL 재시작:');
  console.log('   brew services restart postgresql@버전');
  
  return { success: false };
};

if (require.main === module) {
  simpleConnect()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = simpleConnect;

