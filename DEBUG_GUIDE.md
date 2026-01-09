# 메뉴 불러오기 실패 디버깅 가이드

## 🔍 단계별 진단 방법

### 1단계: 브라우저 콘솔 확인

1. 프론트엔드 페이지 열기: `https://order-app-frontend-0g6j.onrender.com`
2. **F12** 키로 개발자 도구 열기
3. **Console** 탭 확인:
   - `🔗 API Base URL:` 로그 확인
   - `📡 API 호출:` 로그 확인
   - `❌ API 호출 오류:` 에러 메시지 확인

**확인 사항**:
- API Base URL이 올바른지 확인
- 에러 메시지가 무엇인지 확인

---

### 2단계: Network 탭 확인

1. 개발자 도구 → **Network** 탭
2. 페이지 새로고침 (F5)
3. `/api/menus` 요청 찾기
4. 요청 클릭하여 상세 정보 확인:

**확인 사항**:
- **Request URL**: 올바른 백엔드 URL인지 확인
- **Status Code**: 
  - `200` = 성공
  - `404` = 경로 없음
  - `500` = 서버 에러
  - `CORS error` = CORS 문제
- **Response**: 응답 내용 확인

---

### 3단계: 백엔드 직접 테스트

브라우저에서 직접 접속:

1. **헬스 체크**:
   ```
   https://order-app-server.onrender.com/health
   ```
   - 정상: `{"success":true,"message":"서버가 정상적으로 실행 중입니다."}`

2. **메뉴 API 테스트**:
   ```
   https://order-app-server.onrender.com/api/menus
   ```
   - 정상: 메뉴 데이터 JSON 반환
   - 에러: 에러 메시지 확인

---

### 4단계: 환경 변수 확인

#### 백엔드 환경 변수 (Render 대시보드)

```
FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com
```

**확인 방법**:
1. Render 대시보드 → `order-app-server` 서비스
2. **Environment** 탭
3. `FRONTEND_URL` 값 확인

#### 프론트엔드 환경 변수 (Render 대시보드)

```
VITE_API_URL = https://order-app-server.onrender.com
```

**확인 방법**:
1. Render 대시보드 → `order-app-frontend-0g6j` 서비스
2. **Environment** 탭
3. `VITE_API_URL` 값 확인
4. **중요**: 환경 변수 변경 후 수동 재배포 필요!

---

## 🚨 일반적인 오류와 해결 방법

### 오류 1: "CORS policy" 에러

**증상**:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**해결**:
- 백엔드의 `FRONTEND_URL`이 `https://order-app-frontend-0g6j.onrender.com`과 정확히 일치하는지 확인
- 백엔드 재배포

---

### 오류 2: "Failed to fetch" 또는 "Network error"

**증상**:
```
Failed to fetch
또는
Network request failed
```

**해결**:
1. 백엔드 서버가 실행 중인지 확인
2. 백엔드 URL이 올바른지 확인
3. 프론트엔드의 `VITE_API_URL` 확인
4. 환경 변수 변경 후 재배포

---

### 오류 3: "404 Not Found"

**증상**:
```
404 Not Found
```

**해결**:
1. API 경로 확인: `/api/menus`
2. 백엔드 라우트 설정 확인
3. 백엔드 로그 확인

---

### 오류 4: "500 Internal Server Error"

**증상**:
```
500 Internal Server Error
```

**해결**:
1. 백엔드 로그 확인 (Render 대시보드 → Logs)
2. 데이터베이스 연결 확인
3. 데이터베이스 스키마 생성 확인

---

### 오류 5: "메뉴를 불러오는데 실패했습니다" (alert)

**증상**:
- 브라우저에 alert 팝업 표시

**해결**:
1. 브라우저 콘솔에서 실제 에러 확인
2. Network 탭에서 요청 상태 확인
3. 위의 오류 1-4 중 하나일 가능성

---

## 🔧 빠른 해결 체크리스트

### 백엔드
- [ ] 서비스가 "Live" 상태
- [ ] `FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com` 설정
- [ ] 헬스 체크 성공: `https://order-app-server.onrender.com/health`
- [ ] API 테스트 성공: `https://order-app-server.onrender.com/api/menus`
- [ ] 데이터베이스 연결 정상
- [ ] 데이터베이스 스키마 생성 완료

### 프론트엔드
- [ ] 서비스가 "Live" 상태
- [ ] `VITE_API_URL = https://order-app-server.onrender.com` 설정
- [ ] 환경 변수 변경 후 수동 재배포 완료
- [ ] 브라우저 콘솔에 API URL 로그 확인
- [ ] Network 탭에서 API 호출 확인

---

## 💡 디버깅 팁

### 브라우저 콘솔에서 API URL 확인

개발자 도구 콘솔에 다음과 같은 로그가 표시됩니다:
```
🔗 API Base URL: https://order-app-server.onrender.com/api
🔗 VITE_API_URL: https://order-app-server.onrender.com
📡 API 호출: https://order-app-server.onrender.com/api/menus GET
```

이 로그를 통해 실제로 어떤 URL로 요청이 가는지 확인할 수 있습니다.

### 백엔드 로그 확인

Render 대시보드 → `order-app-server` → **Logs** 탭에서:
- 데이터베이스 연결 에러 확인
- API 요청 로그 확인
- 에러 스택 트레이스 확인

---

## 📞 여전히 문제가 발생하면

다음 정보를 확인하세요:

1. **브라우저 콘솔 에러 메시지** (전체)
2. **Network 탭 스크린샷** (요청/응답)
3. **백엔드 로그** (최근 에러)
4. **환경 변수 설정** (스크린샷)

이 정보를 바탕으로 추가 진단이 가능합니다.

