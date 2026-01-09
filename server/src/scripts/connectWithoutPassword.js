const { Pool } = require('pg');
require('dotenv').config();
const os = require('os');

// 비밀번호 없이 연결 시도
const tryConnect = async () => {
  const username = os.userInfo().username;
  
  console.log('🔍 비밀번호 없이 PostgreSQL 연결 시도 중...\n');
  console.log(`현재 사용자: ${username}\n`);

  // 시도할 연결 설정들
  const configs = [
    {
      name: `현재 사용자 (${username}) - 비밀번호 없음`,
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: username,
        // password 필드 자체를 제거
      },
    },
    {
      name: 'postgres 사용자 - 비밀번호 없음',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: 'postgres',
        // password 필드 자체를 제거
      },
    },
  ];

  for (const { name, config } of configs) {
    console.log(`시도 중: ${name}...`);
    
    // password가 undefined인 경우 필드를 아예 제거
    if (!config.password) {
      delete config.password;
    }
    
    const pool = new Pool(config);
    
    try {
      const result = await pool.query('SELECT NOW(), current_user, version()');
      console.log(`✅ 성공!`);
      console.log(`   사용자: ${result.rows[0].current_user}`);
      console.log(`   시간: ${result.rows[0].now}`);
      console.log(`   버전: ${result.rows[0].version.split(',')[0]}\n`);
      
      // 성공한 설정 정보 출력
      console.log('📝 성공한 연결 설정:');
      console.log(`   DB_USER=${config.user}`);
      console.log(`   DB_PASSWORD=(비어있음)\n`);
      
      // 데이터베이스 생성 시도
      console.log('📦 데이터베이스 생성 중...');
      const dbName = process.env.DB_NAME || 'order_app';
      
      const dbCheck = await pool.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );
      
      if (dbCheck.rows.length === 0) {
        await pool.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ 데이터베이스 '${dbName}' 생성 완료!\n`);
      } else {
        console.log(`ℹ️  데이터베이스 '${dbName}'가 이미 존재합니다.\n`);
      }
      
      // 생성된 데이터베이스에 연결 테스트
      const testPool = new Pool({
        ...config,
        database: dbName,
      });
      
      const testResult = await testPool.query('SELECT NOW()');
      console.log(`✅ '${dbName}' 데이터베이스 연결 성공!`);
      console.log(`   시간: ${testResult.rows[0].now}\n`);
      
      await testPool.end();
      await pool.end();
      
      console.log('🎉 모든 설정이 완료되었습니다!');
      console.log('\n다음 단계:');
      console.log('1. server/.env 파일을 열어서 다음을 수정하세요:');
      console.log(`   DB_USER=${config.user}`);
      console.log('   DB_PASSWORD=  (비워두거나 제거)');
      console.log('\n2. 그 다음 실행:');
      console.log('   npm run init-db');
      
      return { success: true, config };
    } catch (error) {
      await pool.end();
      if (error.code === '28P01') {
        console.log(`   ❌ 인증 실패\n`);
      } else if (error.code === '3D000') {
        console.log(`   ❌ 데이터베이스 없음\n`);
      } else {
        console.log(`   ❌ 실패: ${error.message}\n`);
      }
    }
  }

  console.log('❌ 모든 연결 시도가 실패했습니다.\n');
  console.log('다른 방법을 시도해보세요:');
  console.log('1. PostgreSQL에 직접 접속하여 사용자 확인:');
  console.log('   /opt/homebrew/bin/psql -U $(whoami)');
  console.log('   또는');
  console.log('   /usr/local/bin/psql -U $(whoami)');
  console.log('\n2. 접속 후 다음 명령어 실행:');
  console.log('   SELECT current_user;');
  console.log('\n3. 성공한 사용자 이름을 .env 파일의 DB_USER에 입력하세요.');
  
  return { success: false };
};

if (require.main === module) {
  tryConnect()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = tryConnect;

