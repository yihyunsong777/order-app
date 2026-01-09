const { Pool } = require('pg');
require('dotenv').config();
const os = require('os');

// 다양한 연결 방법 시도
const tryConnections = async () => {
  const username = os.userInfo().username;
  const configs = [
    {
      name: '환경 변수 설정 (postgres 사용자)',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      },
    },
    {
      name: '비밀번호 없음 (postgres 사용자)',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: 'postgres',
        // password 필드 제거 (비밀번호 없이 접속)
      },
    },
    {
      name: `현재 사용자 (${username})`,
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: username,
        // password 필드 제거 (비밀번호 없이 접속)
      },
    },
    {
      name: `현재 사용자 (${username}, 비밀번호 postgres)`,
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: username,
        password: 'postgres',
      },
    },
  ];

  console.log('🔍 PostgreSQL 연결 방법 시도 중...\n');

  for (const { name, config } of configs) {
    const pool = new Pool(config);
    try {
      const result = await pool.query('SELECT NOW(), current_user');
      console.log(`✅ 성공: ${name}`);
      console.log(`   사용자: ${result.rows[0].current_user}`);
      console.log(`   시간: ${result.rows[0].now}\n`);
      
      // 성공한 설정을 .env 파일에 저장할 수 있도록 출력
      console.log('📝 성공한 설정:');
      console.log(`   DB_USER=${config.user}`);
      console.log(`   DB_PASSWORD=${config.password ? '***' : '(비어있음)'}\n`);
      
      await pool.end();
      return { success: true, config };
    } catch (error) {
      await pool.end();
      if (error.code !== '28P01') {
        // 인증 오류가 아닌 경우 (예: 연결 거부)
        console.log(`❌ 실패: ${name} - ${error.message}\n`);
      }
    }
  }

  return { success: false };
};

// 데이터베이스 생성 시도
const createDatabase = async (config) => {
  const pool = new Pool({
    ...config,
    database: 'postgres', // 기본 DB에 연결
  });

  try {
    const client = await pool.connect();
    
    const dbName = process.env.DB_NAME || 'order_app';
    
    // 데이터베이스 존재 확인
    const checkResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rows.length === 0) {
      console.log(`📦 데이터베이스 '${dbName}' 생성 중...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('✅ 데이터베이스 생성 완료!\n');
    } else {
      console.log(`ℹ️  데이터베이스 '${dbName}'가 이미 존재합니다.\n`);
    }

    // 연결 테스트
    const testPool = new Pool({
      ...config,
      database: dbName,
    });
    
    const testResult = await testPool.query('SELECT NOW()');
    console.log(`✅ '${dbName}' 데이터베이스 연결 성공!`);
    console.log(`   시간: ${testResult.rows[0].now}\n`);
    
    testPool.end();
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    await pool.end();
    console.error('❌ 데이터베이스 생성 실패:', error.message);
    return false;
  }
};

if (require.main === module) {
  tryConnections()
    .then(async (result) => {
      if (result.success) {
        console.log('🎉 연결 성공! 데이터베이스를 생성합니다...\n');
        const dbCreated = await createDatabase(result.config);
        if (dbCreated) {
          console.log('✅ 모든 설정이 완료되었습니다!');
          console.log('   다음 단계: npm run init-db');
        }
        process.exit(0);
      } else {
        console.error('❌ 모든 연결 방법이 실패했습니다.');
        console.error('\n해결 방법:');
        console.error('1. PostgreSQL 서버가 실행 중인지 확인:');
        console.error('   brew services list');
        console.error('2. PostgreSQL 서버 시작:');
        console.error('   brew services start postgresql@14');
        console.error('   (또는 설치된 버전)');
        console.error('3. .env 파일의 DB_USER와 DB_PASSWORD를 확인하세요.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = { tryConnections, createDatabase };

