# 🚀 Render.com 배포 체크리스트

## 배포 전 준비사항

### ✅ 코드 준비
- [ ] 모든 코드가 GitHub에 푸시됨
- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] `ui/public/images/` 폴더에 이미지 파일 존재
- [ ] 이미지 파일들이 Git에 커밋됨

### ✅ 백엔드 확인
- [ ] `server/package.json`에 `start` 스크립트 있음
- [ ] `server/src/index.js`가 `process.env.PORT` 사용
- [ ] CORS 설정이 환경 변수 사용 (`FRONTEND_URL`)

### ✅ 프론트엔드 확인
- [ ] `ui/src/utils/api.js`가 환경 변수 사용 (`VITE_API_URL`)
- [ ] `ui/vite.config.js` 설정 확인
- [ ] `ui/package.json`에 `build` 스크립트 있음

---

## 1단계: PostgreSQL 데이터베이스 생성

### Render.com에서 생성
- [ ] Render.com 대시보드 접속
- [ ] "New +" → "PostgreSQL" 선택
- [ ] 설정 입력:
  - Name: `order-app-db`
  - Database: `order_app`
  - Region: 선택
  - Plan: Free
- [ ] "Create Database" 클릭
- [ ] 데이터베이스 정보 복사:
  - [ ] Host
  - [ ] Port (5432)
  - [ ] Database
  - [ ] User
  - [ ] Password
  - [ ] Internal Database URL

---

## 2단계: 백엔드 서버 배포

### Web Service 생성
- [ ] "New +" → "Web Service" 선택
- [ ] GitHub 저장소 연결
- [ ] 설정 입력:
  - Name: `order-app-server`
  - Region: 데이터베이스와 동일
  - Branch: `main`
  - Root Directory: `server`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`

### 환경 변수 설정
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DB_HOST` = `<데이터베이스 Host>`
- [ ] `DB_PORT` = `5432`
- [ ] `DB_NAME` = `order_app`
- [ ] `DB_USER` = `<데이터베이스 User>`
- [ ] `DB_PASSWORD` = `<데이터베이스 Password>`
- [ ] `FRONTEND_URL` = `https://order-app-ui.onrender.com` (3단계 후 업데이트)

### 배포 확인
- [ ] 배포 완료 대기 (2-3분)
- [ ] 서비스 URL 확인: `https://order-app-server.onrender.com`
- [ ] 헬스 체크: `https://order-app-server.onrender.com/health`
- [ ] API 테스트: `https://order-app-server.onrender.com/api/menus`

### 데이터베이스 초기화
- [ ] Render Shell 접속
- [ ] `cd server` 실행
- [ ] `npm run init-db` 실행
- [ ] 테이블 생성 확인

---

## 3단계: 프론트엔드 배포

### Static Site 생성
- [ ] "New +" → "Static Site" 선택
- [ ] GitHub 저장소 연결
- [ ] 설정 입력:
  - Name: `order-app-ui`
  - Branch: `main`
  - Root Directory: `ui`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

### 환경 변수 설정
- [ ] `VITE_API_URL` = `https://order-app-server.onrender.com`

### 배포 확인
- [ ] 배포 완료 대기 (2-3분)
- [ ] 프론트엔드 URL 확인: `https://order-app-ui.onrender.com`
- [ ] 브라우저에서 접속 테스트

### 백엔드 CORS 업데이트
- [ ] `order-app-server` 서비스 선택
- [ ] Environment 탭에서 `FRONTEND_URL` 업데이트
- [ ] `https://order-app-ui.onrender.com` 입력
- [ ] "Save Changes" 클릭
- [ ] 자동 재배포 대기

---

## 4단계: 최종 테스트

### 기능 테스트
- [ ] 프론트엔드 접속 성공
- [ ] 메뉴 목록 표시 확인
- [ ] 메뉴 이미지 표시 확인
- [ ] 장바구니에 메뉴 추가
- [ ] 주문하기 기능 테스트
- [ ] 관리자 화면 접속
- [ ] 주문 현황 확인
- [ ] 재고 관리 기능 테스트
- [ ] 주문 상태 변경 테스트

### API 테스트
- [ ] `GET /api/menus` - 메뉴 목록
- [ ] `POST /api/orders` - 주문 생성
- [ ] `GET /api/orders` - 주문 목록
- [ ] `PATCH /api/orders/:id/status` - 주문 상태 변경
- [ ] `PATCH /api/menus/:id/inventory` - 재고 수정

---

## 🐛 문제 해결 가이드

### 백엔드가 시작되지 않음
- [ ] 환경 변수 확인
- [ ] Build Command 확인
- [ ] Start Command 확인
- [ ] 로그 확인

### 데이터베이스 연결 실패
- [ ] Internal Database URL 사용 확인
- [ ] 환경 변수 값 정확성 확인
- [ ] 데이터베이스가 실행 중인지 확인

### 프론트엔드 빌드 실패
- [ ] Node 버전 확인
- [ ] 의존성 설치 확인
- [ ] 빌드 로그 확인

### CORS 오류
- [ ] `FRONTEND_URL` 환경 변수 확인
- [ ] 프론트엔드 URL이 정확한지 확인
- [ ] https 프로토콜 사용 확인

### 이미지가 표시되지 않음
- [ ] `ui/public/images/` 폴더 확인
- [ ] 이미지 파일이 Git에 커밋되었는지 확인
- [ ] 이미지 경로가 `/images/...` 형식인지 확인

---

## 📝 배포 후 유지보수

### 정기 확인사항
- [ ] 서비스가 정상 실행 중인지 확인
- [ ] 데이터베이스 연결 상태 확인
- [ ] 로그 확인 (에러 없음)

### 업데이트 방법
1. 로컬에서 코드 수정
2. GitHub에 푸시
3. Render가 자동으로 재배포

---

## 🎉 배포 완료!

모든 체크리스트를 완료하면 배포가 완료됩니다!

**프론트엔드**: https://order-app-ui.onrender.com
**백엔드**: https://order-app-server.onrender.com

