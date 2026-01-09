# 메뉴 불러오기 실패 해결 가이드

## 🔴 문제 증상

배포는 성공했지만 프론트엔드에서 "메뉴 불러오기에 실패했습니다" 오류 발생

---

## 🔍 가능한 원인 및 해결 방법

### 1. CORS 설정 문제 (가장 흔한 원인)

**증상**: 브라우저 콘솔에 CORS 에러

**원인**: 백엔드의 `FRONTEND_URL` 환경 변수가 프론트엔드 URL과 일치하지 않음

**해결 방법**:

1. **프론트엔드 URL 확인**
   - Render 대시보드 → `order-app-ui` 서비스
   - URL 확인: 예) `https://order-app-ui.onrender.com`

2. **백엔드 환경 변수 수정**
   - Render 대시보드 → `order-app-server` 서비스
   - **Environment** 탭 클릭
   - `FRONTEND_URL` 환경 변수 확인/수정:
     ```
     FRONTEND_URL = https://order-app-ui.onrender.com
     ```
   - ⚠️ **프로토콜(`https://`) 포함 필수!**
   - ⚠️ **슬래시(`/`)는 포함하지 않음!**

3. **서비스 재배포**
   - "Save Changes" 클릭
   - 자동으로 재배포됨 (또는 수동 재배포)

---

### 2. API URL 설정 문제

**증상**: 네트워크 탭에서 404 또는 연결 실패

**원인**: 프론트엔드의 `VITE_API_URL` 환경 변수가 올바르지 않음

**해결 방법**:

1. **백엔드 URL 확인**
   - Render 대시보드 → `order-app-server` 서비스
   - URL 확인: 예) `https://order-app-server.onrender.com`

2. **프론트엔드 환경 변수 수정**
   - Render 대시보드 → `order-app-ui` 서비스
   - **Environment** 탭 클릭
   - `VITE_API_URL` 환경 변수 확인/수정:
     ```
     VITE_API_URL = https://order-app-server.onrender.com
     ```
   - ⚠️ **프로토콜(`https://`) 포함 필수!**
   - ⚠️ **슬래시(`/`)는 포함하지 않음!** (코드에서 자동 추가)

3. **수동 재배포** (중요!)
   - 환경 변수 변경 후 **반드시 수동 재배포 필요**
   - "Manual Deploy" → "Deploy latest commit" 클릭
   - ⚠️ Static Site는 환경 변수 변경 후 자동 재배포되지 않음!

---

### 3. 데이터베이스 스키마 미생성

**증상**: 백엔드 로그에 데이터베이스 에러

**원인**: 데이터베이스에 테이블이 생성되지 않음

**해결 방법**:

1. **Render Shell 사용**
   - Render 대시보드 → `order-app-server` 서비스
   - **Shell** 탭 클릭
   - 다음 명령어 실행:
     ```bash
     cd server
     npm run init-db
     ```

2. **로컬에서 실행** (대안)
   - Render 데이터베이스의 **Connections** 탭에서 **External Database URL** 복사
   - 로컬 `.env` 파일에 설정:
     ```env
     DB_HOST=<External Host>
     DB_PORT=5432
     DB_NAME=order_app
     DB_USER=<User>
     DB_PASSWORD=<Password>
     ```
   - 로컬에서 실행:
     ```bash
     cd server
     npm run init-db
     ```

---

### 4. 백엔드 서버가 실행되지 않음

**증상**: 프론트엔드에서 API 호출 시 연결 실패

**해결 방법**:

1. **백엔드 로그 확인**
   - Render 대시보드 → `order-app-server` 서비스
   - **Logs** 탭에서 에러 확인

2. **헬스 체크**
   - 브라우저에서 `https://order-app-server.onrender.com/health` 접속
   - 정상 응답 확인:
     ```json
     {
       "success": true,
       "message": "서버가 정상적으로 실행 중입니다."
     }
     ```

3. **API 테스트**
   - 브라우저에서 `https://order-app-server.onrender.com/api/menus` 접속
   - 메뉴 데이터가 반환되는지 확인

---

## 🔧 단계별 진단 방법

### 1단계: 브라우저 개발자 도구 확인

1. 프론트엔드 페이지 열기
2. **F12** 키로 개발자 도구 열기
3. **Console** 탭에서 에러 메시지 확인
4. **Network** 탭에서 API 호출 확인:
   - `/api/menus` 요청이 있는지 확인
   - 요청 상태 코드 확인 (200, 404, 500, CORS 에러 등)
   - 요청 URL이 올바른지 확인

### 2단계: 백엔드 로그 확인

1. Render 대시보드 → `order-app-server` 서비스
2. **Logs** 탭에서 에러 메시지 확인
3. 데이터베이스 연결 에러가 있는지 확인

### 3단계: 환경 변수 확인

**백엔드 환경 변수**:
```
FRONTEND_URL = https://order-app-ui.onrender.com
```

**프론트엔드 환경 변수**:
```
VITE_API_URL = https://order-app-server.onrender.com
```

---

## ✅ 체크리스트

### 백엔드 확인
- [ ] 서비스가 "Live" 상태
- [ ] 헬스 체크 성공: `https://order-app-server.onrender.com/health`
- [ ] API 테스트 성공: `https://order-app-server.onrender.com/api/menus`
- [ ] `FRONTEND_URL` 환경 변수가 프론트엔드 URL과 일치
- [ ] 데이터베이스 연결 정상
- [ ] 데이터베이스 스키마 생성 완료

### 프론트엔드 확인
- [ ] 서비스가 "Live" 상태
- [ ] `VITE_API_URL` 환경 변수가 백엔드 URL과 일치
- [ ] 환경 변수 변경 후 수동 재배포 완료
- [ ] 브라우저 콘솔에 CORS 에러 없음
- [ ] Network 탭에서 API 호출 성공 (200 상태 코드)

---

## 🚨 빠른 해결 방법

가장 빠른 해결 순서:

1. **백엔드 CORS 설정 확인**
   ```
   FRONTEND_URL = https://order-app-ui.onrender.com
   ```

2. **프론트엔드 API URL 확인**
   ```
   VITE_API_URL = https://order-app-server.onrender.com
   ```
   → 환경 변수 변경 후 **수동 재배포 필수!**

3. **데이터베이스 스키마 생성**
   ```bash
   # Render Shell에서
   cd server
   npm run init-db
   ```

4. **브라우저에서 테스트**
   - 프론트엔드 페이지 새로고침
   - 개발자 도구에서 에러 확인

---

## 💡 추가 팁

### API URL 확인 방법

브라우저 콘솔에서:
```javascript
// 프론트엔드에서 API URL 확인
console.log(import.meta.env.VITE_API_URL);
```

### CORS 에러 확인

브라우저 콘솔에서 다음과 같은 에러가 보이면 CORS 문제:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

### 네트워크 요청 확인

Network 탭에서:
- 요청 URL이 올바른지 확인
- 상태 코드 확인 (200 = 성공, 404 = 경로 없음, 500 = 서버 에러)
- 응답 본문 확인

---

## 📞 문제가 계속되면

1. **브라우저 콘솔 에러 메시지** 복사
2. **Network 탭 스크린샷** 촬영
3. **백엔드 로그** 확인
4. 위 정보를 바탕으로 추가 진단

