# 커피 주문 앱 백엔드 서버

Express.js와 PostgreSQL을 사용한 커피 주문 앱의 백엔드 API 서버입니다.

## 📋 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: 없음 (Raw SQL 사용)

## 📁 프로젝트 구조

```
server/
├── src/
│   ├── index.js              # 서버 진입점
│   ├── config/
│   │   └── database.js       # 데이터베이스 연결 설정
│   ├── routes/
│   │   ├── menus.js          # 메뉴 라우트
│   │   └── orders.js         # 주문 라우트
│   ├── controllers/
│   │   ├── menuController.js # 메뉴 컨트롤러
│   │   └── orderController.js# 주문 컨트롤러
│   ├── middleware/
│   │   └── errorHandler.js   # 에러 핸들러
│   └── scripts/
│       └── initDatabase.js   # DB 초기화 스크립트
├── package.json
├── .env                       # 환경 변수
├── .env.example               # 환경 변수 예시
└── .gitignore

```

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 값을 수정하세요:

```bash
cp .env.example .env
```

```.env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
```

### 2. 데이터베이스 설정

PostgreSQL이 설치되어 있어야 합니다.

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE order_app;

# 접속 종료
\q
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 데이터베이스 초기화

테이블 생성 및 샘플 데이터 삽입:

```bash
npm run init-db
```

### 5. 서버 실행

**개발 모드 (nodemon):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

서버가 http://localhost:3000 에서 실행됩니다.

## 📡 API 엔드포인트

### 헬스 체크
- `GET /health` - 서버 상태 확인

### 메뉴 관련
- `GET /api/menus` - 전체 메뉴 조회
- `GET /api/menus/:id` - 특정 메뉴 조회
- `PATCH /api/menus/:id/inventory` - 재고 수정

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 전체 주문 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `PATCH /api/orders/:id/status` - 주문 상태 변경
- `GET /api/orders/stats` - 주문 통계 조회

자세한 API 문서는 `/docs/PRD.md` 파일을 참고하세요.

## 🗄️ 데이터베이스 스키마

### 테이블 목록
- `menus` - 메뉴 정보
- `options` - 메뉴 옵션
- `orders` - 주문 정보
- `order_items` - 주문 항목
- `order_item_options` - 주문 항목 옵션

## 🧪 테스트

cURL 또는 Postman을 사용하여 API를 테스트할 수 있습니다.

**예시: 메뉴 조회**
```bash
curl http://localhost:3000/api/menus
```

**예시: 주문 생성**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "menu_id": 1,
        "quantity": 2,
        "options": [1]
      }
    ]
  }'
```

## 🔧 개발 팁

### 데이터베이스 재초기화

```bash
npm run init-db
```

### 로그 확인

개발 모드에서는 모든 SQL 쿼리와 요청이 콘솔에 출력됩니다.

## ⚠️ 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- 프로덕션 환경에서는 적절한 비밀번호를 사용하세요
- 데이터베이스 백업을 정기적으로 수행하세요

## 📝 다음 단계

1. ✅ 기본 CRUD API 구현 완료
2. ⬜ 프론트엔드와 연동
3. ⬜ 에러 처리 고도화
4. ⬜ API 문서 자동화 (Swagger)
5. ⬜ 유닛 테스트 작성
6. ⬜ 로깅 시스템 개선

