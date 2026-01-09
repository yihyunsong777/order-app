const { Pool } = require('pg');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const updateImages = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'order_app',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('🔄 이미지 다운로드 및 데이터베이스 업데이트 시작...\n');

    // 메뉴 데이터 조회
    const menusResult = await pool.query('SELECT id, name, image_url FROM menus ORDER BY id');
    const menus = menusResult.rows;

    // 이미지 저장 경로
    const imagesDir = path.join(__dirname, '../../../ui/public/images');
    
    // 디렉토리 생성
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // 각 메뉴의 이미지 다운로드 및 업데이트
    for (const menu of menus) {
      const imageUrl = menu.image_url;
      if (!imageUrl || !imageUrl.startsWith('http')) {
        console.log(`⏭️  ${menu.name}: 이미지 URL이 없거나 유효하지 않습니다.`);
        continue;
      }

      // 파일명 생성 (메뉴 ID와 이름 기반)
      const fileName = `menu-${menu.id}-${menu.name.replace(/[^a-zA-Z0-9가-힣]/g, '-')}.jpg`;
      const filePath = path.join(imagesDir, fileName);

      try {
        console.log(`📥 ${menu.name} 이미지 다운로드 중...`);
        await downloadImage(imageUrl, filePath);
        console.log(`✅ ${menu.name} 이미지 다운로드 완료: ${fileName}`);

        // 데이터베이스 업데이트
        const newImageUrl = `/images/${fileName}`;
        await pool.query(
          'UPDATE menus SET image_url = $1 WHERE id = $2',
          [newImageUrl, menu.id]
        );
        console.log(`✅ ${menu.name} 데이터베이스 업데이트 완료: ${newImageUrl}\n`);
      } catch (error) {
        console.error(`❌ ${menu.name} 이미지 다운로드 실패:`, error.message);
      }
    }

    console.log('🎉 모든 이미지 다운로드 및 업데이트 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  updateImages()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

module.exports = updateImages;

