# 메뉴 Fetch 오류 빠른 해결 가이드

## 🔴 문제: "menus fetch 오류"

프론트엔드에서 메뉴를 불러올 때 fetch 오류 발생

---

## ✅ 즉시 확인할 3가지

### 1. 백엔드 서버가 실행 중인지 확인

**먼저 백엔드 URL 확인:**
1. Render 대시보드 → `order-app-backend` 서비스
2. 상단에 표시된 URL 확인
3. 예: `https://order-app-backend-xxxx.onrender.com`

브라우저에서 직접 접속:
```
https://order-app-backend.onrender.com/health
```
(실제 백엔드 URL로 변경)

**정상 응답**:
```json
{
  "success": true,
  "message": "서버가 정상적으로 실행 중입니다."
}
```

**에러가 나면**: 백엔드 서버가 실행되지 않은 것입니다.

---

### 2. API 엔드포인트 직접 테스트

브라우저에서 직접 접속:
```
https://order-app-backend.onrender.com/api/menus
```
(실제 백엔드 URL로 변경)

**정상 응답**: 메뉴 데이터 JSON
**에러가 나면**: 
- 404 = 경로 없음 (라우트 문제)
- 500 = 서버 에러 (데이터베이스 문제 가능)

---

### 3. CORS 설정 확인

**Render 대시보드 → `order-app-server` → Environment**

다음 환경 변수 확인:
```
FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com
```

**중요**:
- 정확히 일치해야 함
- 프로토콜(`https://`) 포함
- 슬래시(`/`) 없음

---

## 🔧 해결 방법

### 방법 1: CORS 설정 수정 (가장 흔한 원인)

1. Render 대시보드 → `order-app-backend` 서비스
2. **Environment** 탭
3. `FRONTEND_URL` 확인/수정:
   ```
   FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com
   ```
4. **Save Changes** 클릭
5. 자동 재배포 대기

---

### 방법 2: 프론트엔드 API URL 확인

1. Render 대시보드 → `order-app-frontend` 서비스
2. **Environment** 탭
3. `VITE_API_URL` 확인:
   ```
   VITE_API_URL = https://order-app-backend.onrender.com
   ```
   ⚠️ **실제 백엔드 URL로 변경하세요!**
   - Render 대시보드 → `order-app-backend` 서비스
   - 상단에 표시된 URL 확인
   - 예: `https://order-app-backend-xxxx.onrender.com`
4. **중요**: 환경 변수 변경 후 **수동 재배포 필수!**
   - "Manual Deploy" → "Deploy latest commit"

---

### 방법 3: 데이터베이스 스키마 생성

메뉴 데이터가 없으면 빈 배열이 반환되거나 에러가 발생할 수 있습니다.

1. Render 대시보드 → `order-app-backend` 서비스
2. **Shell** 탭 클릭
3. 다음 명령어 실행:

   **Root Directory가 `server`인 경우:**
   ```bash
   cd server
   npm run init-db
   ```

   **Root Directory가 루트인 경우:**
   ```bash
   npm run init-db
   ```

   **Root Directory 확인 방법:**
   - Render 대시보드 → `order-app-backend` → Settings 탭
   - "Root Directory" 필드 확인

---

## 🔍 브라우저에서 디버깅

### 1. 개발자 도구 열기
- 프론트엔드 페이지에서 **F12** 키
- **Console** 탭 확인

### 2. 확인할 로그
다음과 같은 로그가 표시됩니다:
```
🔗 API Base URL: https://order-app-server.onrender.com/api
🔗 VITE_API_URL: https://order-app-server.onrender.com
📡 API 호출: https://order-app-server.onrender.com/api/menus GET
```

### 3. 에러 확인
- `❌ API 호출 오류:` 로그 확인
- 에러 메시지 읽기

### 4. Network 탭 확인
- **Network** 탭 클릭
- 페이지 새로고침 (F5)
- `/api/menus` 요청 찾기
- 상태 코드 확인:
  - **200** = 성공
  - **404** = 경로 없음
  - **500** = 서버 에러
  - **CORS error** = CORS 문제

---

## 🚨 일반적인 오류와 해결

### "Failed to fetch" 또는 "Network error"
- 백엔드 서버가 실행 중인지 확인
- API URL이 올바른지 확인
- 환경 변수 변경 후 재배포 확인

### "CORS policy" 에러
- 백엔드의 `FRONTEND_URL`이 프론트엔드 URL과 정확히 일치하는지 확인
- 백엔드 재배포

### "404 Not Found"
- API 경로 확인: `/api/menus`
- 백엔드 라우트 설정 확인

### "500 Internal Server Error"
- 백엔드 로그 확인 (Render 대시보드 → Logs)
- 데이터베이스 연결 확인
- 데이터베이스 스키마 생성 확인

---

## ✅ 체크리스트

### 백엔드
- [ ] 서비스가 "Live" 상태
- [ ] 헬스 체크 성공: `https://order-app-server.onrender.com/health`
- [ ] API 테스트 성공: `https://order-app-server.onrender.com/api/menus`
- [ ] `FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com` 설정
- [ ] 데이터베이스 연결 정상
- [ ] 데이터베이스 스키마 생성 완료

### 프론트엔드
- [ ] 서비스가 "Live" 상태
- [ ] `VITE_API_URL = https://order-app-server.onrender.com` 설정
- [ ] 환경 변수 변경 후 수동 재배포 완료
- [ ] 브라우저 콘솔에서 API URL 로그 확인

---

## 💡 빠른 테스트

터미널에서 curl로 테스트 (또는 브라우저에서 직접 접속):

```bash
# 헬스 체크
curl https://order-app-server.onrender.com/health

# 메뉴 API
curl https://order-app-server.onrender.com/api/menus
```

정상이면 JSON 데이터가 반환됩니다.

---

## 📞 여전히 문제가 발생하면

다음 정보를 확인하세요:

1. **브라우저 콘솔의 전체 에러 메시지**
2. **Network 탭의 요청/응답** (스크린샷)
3. **백엔드 로그** (Render 대시보드 → Logs)
4. **환경 변수 설정** (스크린샷)

이 정보를 바탕으로 추가 진단이 가능합니다.

