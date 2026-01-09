# 환경 변수 설정 가이드 (실제 URL 기준)

## 📋 실제 배포된 서비스 URL

- **프론트엔드**: `https://order-app-frontend-0g6j.onrender.com`
- **백엔드**: `https://order-app-server.onrender.com` (또는 실제 백엔드 URL 확인 필요)

---

## 🔧 환경 변수 설정

### 1. 백엔드 환경 변수 설정

**Render 대시보드 → `order-app-server` 서비스 → Environment 탭**

다음 환경 변수를 설정하세요:

```
NODE_ENV = production
PORT = 10000

DB_HOST = <Render 데이터베이스 Host>
DB_PORT = 5432
DB_NAME = order_app
DB_USER = <Render 데이터베이스 User>
DB_PASSWORD = <Render 데이터베이스 Password>

FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com
```

**중요**: 
- `FRONTEND_URL`은 실제 프론트엔드 URL과 정확히 일치해야 합니다
- 프로토콜(`https://`) 포함 필수
- 슬래시(`/`)는 포함하지 않음

---

### 2. 프론트엔드 환경 변수 설정

**Render 대시보드 → `order-app-frontend-0g6j` 서비스 → Environment 탭**

다음 환경 변수를 설정하세요:

```
VITE_API_URL = https://order-app-server.onrender.com
```

**중요**: 
- `VITE_API_URL`은 실제 백엔드 URL과 정확히 일치해야 합니다
- 프로토콜(`https://`) 포함 필수
- 슬래시(`/`)는 포함하지 않음 (코드에서 `/api` 자동 추가)
- **환경 변수 변경 후 반드시 수동 재배포 필요!**

---

## 🔄 환경 변수 변경 후 재배포

### 백엔드
- 환경 변수 저장 후 자동으로 재배포됨
- 또는 "Manual Deploy" → "Deploy latest commit"

### 프론트엔드 (중요!)
- 환경 변수 변경 후 **반드시 수동 재배포 필요**
- "Manual Deploy" → "Deploy latest commit" 클릭
- ⚠️ Static Site는 환경 변수 변경 후 자동 재배포되지 않음!

---

## ✅ 확인 방법

### 백엔드 확인
1. 헬스 체크: `https://order-app-server.onrender.com/health`
2. API 테스트: `https://order-app-server.onrender.com/api/menus`
3. CORS 확인: 브라우저 콘솔에서 CORS 에러 없어야 함

### 프론트엔드 확인
1. 프론트엔드 접속: `https://order-app-frontend-0g6j.onrender.com`
2. 브라우저 개발자 도구(F12) → Console 탭
3. API 호출 확인: Network 탭에서 `/api/menus` 요청 확인
4. 에러 없이 메뉴가 로드되는지 확인

---

## 🚨 문제 해결

### CORS 에러가 발생하면
- 백엔드의 `FRONTEND_URL`이 `https://order-app-frontend-0g6j.onrender.com`과 정확히 일치하는지 확인

### API 연결 실패하면
- 프론트엔드의 `VITE_API_URL`이 백엔드 URL과 정확히 일치하는지 확인
- 환경 변수 변경 후 수동 재배포했는지 확인

### 메뉴가 로드되지 않으면
- 데이터베이스 스키마가 생성되었는지 확인
- Render Shell에서 `npm run init-db` 실행

