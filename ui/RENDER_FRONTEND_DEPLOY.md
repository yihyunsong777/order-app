# 프론트엔드 Render 배포 가이드

## 📋 배포 전 확인사항

### 1. 코드 수정 완료 확인

다음 파일들이 올바르게 설정되어 있는지 확인하세요:

- ✅ `package.json`에 `start` 스크립트 추가됨
- ✅ `vite.config.js`에 빌드 설정 추가됨
- ✅ `src/utils/api.js`에서 `VITE_API_URL` 환경 변수 사용 중

### 2. 환경 변수 확인

프론트엔드는 빌드 시점에 환경 변수가 주입되므로, Render에서 빌드 시 환경 변수를 설정해야 합니다.

---

## 🚀 Render 배포 단계

### 1단계: GitHub에 코드 푸시

```bash
cd /Users/leehyunsong/Desktop/order-app
git add .
git commit -m "프론트엔드 배포 준비"
git push origin main
```

### 2단계: Render에서 Web Service 생성

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 로그인

2. **"New +" 버튼 클릭** → **"Web Service"** 선택

3. **GitHub 저장소 연결**
   - GitHub 계정 연결 (처음인 경우)
   - 저장소: `yihyunsong777/order-app` 선택

4. **서비스 설정 입력**:
   ```
   Name: order-app-ui
   Region: 백엔드와 같은 지역 (예: Singapore)
   Branch: main
   Root Directory: ui
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

   **중요**: 
   - `Root Directory`를 `ui`로 설정해야 합니다
   - `Build Command`는 빌드만 수행
   - `Start Command`는 빌드된 파일을 서빙

5. **환경 변수 추가** (Environment Variables):
   
   **빌드 시점 환경 변수** (중요!):
   ```
   VITE_API_URL = https://order-app-server.onrender.com
   ```
   
   **참고**: 
   - `VITE_API_URL`은 백엔드 서버의 URL입니다
   - 백엔드 서비스 이름이 다르면 해당 URL로 변경하세요
   - 예: `https://<백엔드-서비스-이름>.onrender.com`
   - **프로토콜(`https://`) 포함 필수!**

   **런타임 환경 변수** (선택):
   ```
   PORT = 3000
   NODE_ENV = production
   ```

6. **"Create Web Service"** 클릭

7. **배포 대기** (약 3-5분)
   - 빌드 과정에서 환경 변수가 주입됩니다
   - 빌드 완료 후 자동으로 서비스가 시작됩니다

---

## 🔍 배포 확인

### 1. 배포 상태 확인

Render 대시보드에서:
- ✅ "Live" 상태 확인
- ✅ 로그에서 빌드 성공 확인
- ✅ 서비스 URL 확인 (예: `https://order-app-ui.onrender.com`)

### 2. 기능 테스트

배포된 프론트엔드에서:
1. 메뉴 목록이 정상적으로 표시되는지 확인
2. 주문 기능이 작동하는지 확인
3. 관리자 페이지가 정상 작동하는지 확인
4. 브라우저 개발자 도구(F12) → Network 탭에서 API 호출 확인

### 3. API 연결 확인

브라우저 콘솔에서:
```javascript
// API URL 확인
console.log(import.meta.env.VITE_API_URL);
```

---

## ⚠️ 문제 해결

### 문제 1: 빌드 실패

**증상**: Render 로그에 빌드 에러

**해결**:
- 로그에서 에러 메시지 확인
- 로컬에서 `npm run build` 실행하여 에러 재현
- `package.json`의 의존성 확인

### 문제 2: API 연결 실패 (CORS 에러)

**증상**: 브라우저 콘솔에 CORS 에러

**해결**:
1. 백엔드 서버의 CORS 설정 확인
2. `FRONTEND_URL` 환경 변수가 올바른지 확인:
   ```
   FRONTEND_URL = https://order-app-ui.onrender.com
   ```
3. 백엔드 서버 재배포

### 문제 3: 환경 변수가 적용되지 않음

**증상**: API 호출이 여전히 localhost로 가는 경우

**해결**:
1. Render 대시보드에서 환경 변수 확인:
   - `VITE_API_URL`이 올바르게 설정되어 있는지
   - 프로토콜(`https://`) 포함 확인
2. **중요**: 환경 변수 변경 후 **수동 재배포** 필요
   - Render 대시보드 → "Manual Deploy" → "Deploy latest commit"

### 문제 4: 이미지가 표시되지 않음

**증상**: 메뉴 이미지가 깨짐

**해결**:
- `public/images/` 폴더의 이미지가 Git에 포함되어 있는지 확인
- 이미지 경로가 `/images/...` 형식인지 확인

---

## 📝 환경 변수 설정 요약

### 프론트엔드 (Render)

```
VITE_API_URL = https://order-app-server.onrender.com
PORT = 3000 (선택)
NODE_ENV = production (선택)
```

### 백엔드 (Render) - 참고용

```
NODE_ENV = production
PORT = 10000
DB_HOST = <데이터베이스 호스트>
DB_PORT = 5432
DB_NAME = order_app
DB_USER = <데이터베이스 사용자>
DB_PASSWORD = <데이터베이스 비밀번호>
FRONTEND_URL = https://order-app-ui.onrender.com
```

---

## 🔄 업데이트 배포

코드를 수정한 후:

1. **로컬에서 테스트**
   ```bash
   cd ui
   npm run build
   npm run preview
   ```

2. **Git에 푸시**
   ```bash
   git add .
   git commit -m "프론트엔드 업데이트"
   git push origin main
   ```

3. **Render 자동 배포**
   - Render가 자동으로 감지하여 재배포 시작
   - 또는 수동으로 "Manual Deploy" 클릭

---

## 📚 추가 리소스

- [Render 공식 문서](https://render.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [환경 변수 설정](https://render.com/docs/environment-variables)

---

## ✅ 체크리스트

배포 전:
- [ ] GitHub에 코드 푸시 완료
- [ ] 백엔드 서버가 배포되어 있고 정상 작동 중
- [ ] 백엔드 서버 URL 확인

Render 설정:
- [ ] Root Directory: `ui` 설정
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] 환경 변수 `VITE_API_URL` 설정 (백엔드 URL)

배포 후:
- [ ] 서비스가 "Live" 상태
- [ ] 프론트엔드 접속 가능
- [ ] 메뉴 목록 표시 확인
- [ ] 주문 기능 작동 확인
- [ ] 관리자 페이지 작동 확인
- [ ] API 호출 정상 작동 확인

