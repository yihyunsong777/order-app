# 최종 환경 변수 설정 (실제 URL 기준)

## ✅ 확인된 실제 서비스 URL

- **백엔드**: `https://order-app-backend-k1wy.onrender.com` ✅ 정상 작동
- **프론트엔드**: `https://order-app-frontend-0g6j.onrender.com`

---

## 🔧 환경 변수 설정

### 1. 백엔드 환경 변수 설정

**Render 대시보드 → `order-app-backend` 서비스 → Environment 탭**

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
- `FRONTEND_URL`은 프론트엔드 URL과 정확히 일치해야 합니다
- 프로토콜(`https://`) 포함 필수
- 슬래시(`/`)는 포함하지 않음

---

### 2. 프론트엔드 환경 변수 설정 (중요!)

**Render 대시보드 → `order-app-frontend` 서비스 → Environment 탭**

다음 환경 변수를 설정하세요:

```
VITE_API_URL = https://order-app-backend-k1wy.onrender.com
```

**중요**: 
- `VITE_API_URL`은 백엔드 URL과 정확히 일치해야 합니다
- 프로토콜(`https://`) 포함 필수
- 슬래시(`/`)는 포함하지 않음 (코드에서 `/api` 자동 추가)
- **환경 변수 변경 후 반드시 수동 재배포 필요!**

---

## 🔄 환경 변수 변경 후 재배포

### 백엔드
- 환경 변수 저장 후 자동으로 재배포됨
- 또는 "Manual Deploy" → "Deploy latest commit"

### 프론트엔드 (중요!)
1. 환경 변수 저장
2. **반드시 수동 재배포 필요!**
   - "Manual Deploy" → "Deploy latest commit" 클릭
   - ⚠️ Static Site는 환경 변수 변경 후 자동 재배포되지 않음!

---

## ✅ 확인 방법

### 백엔드 확인
1. ✅ 루트 경로: `https://order-app-backend-k1wy.onrender.com/` - 정상 작동 확인됨
2. 헬스 체크: `https://order-app-backend-k1wy.onrender.com/health`
3. API 테스트: `https://order-app-backend-k1wy.onrender.com/api/menus`

### 프론트엔드 확인
1. 프론트엔드 접속: `https://order-app-frontend-0g6j.onrender.com`
2. 브라우저 개발자 도구(F12) → Console 탭
3. 다음 로그 확인:
   ```
   🔗 API Base URL: https://order-app-backend-k1wy.onrender.com/api
   🔗 VITE_API_URL: https://order-app-backend-k1wy.onrender.com
   ```
4. 메뉴가 정상적으로 로드되는지 확인

---

## 🚨 문제 해결

### CORS 에러가 발생하면
- 백엔드의 `FRONTEND_URL`이 `https://order-app-frontend-0g6j.onrender.com`과 정확히 일치하는지 확인
- 백엔드 재배포

### API 연결 실패하면
- 프론트엔드의 `VITE_API_URL`이 `https://order-app-backend-k1wy.onrender.com`과 정확히 일치하는지 확인
- 환경 변수 변경 후 수동 재배포했는지 확인

### 메뉴가 로드되지 않으면
- 데이터베이스 스키마가 생성되었는지 확인
- 로컬에서 `npm run init-render-db` 실행

---

## 📝 데이터베이스 스키마 생성 (로컬에서)

Shell 접근이 불가능하므로 로컬에서 실행:

1. Render 데이터베이스 정보 확인
   - Render 대시보드 → PostgreSQL 데이터베이스
   - Connections 탭 → External Database URL 또는 개별 정보

2. `server/.env` 파일에 Render DB 정보 입력:
   ```env
   DB_HOST=<Render 데이터베이스 Host>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<Render 데이터베이스 User>
   DB_PASSWORD=<Render 데이터베이스 Password>
   ```

3. 로컬에서 실행:
   ```bash
   cd /Users/leehyunsong/Desktop/order-app/server
   npm run test-connection  # 연결 테스트
   npm run init-render-db  # 스키마 생성
   ```

---

## ✅ 최종 체크리스트

### 백엔드 (`order-app-backend`)
- [x] 서비스가 "Live" 상태 ✅
- [x] 루트 경로 정상 작동 ✅
- [ ] `FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com` 설정
- [ ] 데이터베이스 연결 정상
- [ ] 데이터베이스 스키마 생성 완료

### 프론트엔드 (`order-app-frontend`)
- [ ] 서비스가 "Live" 상태
- [ ] `VITE_API_URL = https://order-app-backend-k1wy.onrender.com` 설정
- [ ] 환경 변수 변경 후 수동 재배포 완료
- [ ] 브라우저 콘솔에서 API URL 로그 확인
- [ ] 메뉴가 정상적으로 로드됨

---

## 🎯 다음 단계

1. **프론트엔드 환경 변수 설정**
   - `VITE_API_URL = https://order-app-backend-k1wy.onrender.com`
   - 수동 재배포

2. **백엔드 CORS 설정 확인**
   - `FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com`

3. **데이터베이스 스키마 생성**
   - 로컬에서 `npm run init-render-db` 실행

4. **테스트**
   - 프론트엔드에서 메뉴가 로드되는지 확인

