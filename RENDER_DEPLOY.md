# Render.com 배포 가이드

## 🚀 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 로그인 또는 회원가입

2. **새 데이터베이스 생성**
   - **"New +"** 버튼 클릭
   - **"PostgreSQL"** 선택

3. **설정 입력**:
   ```
   Name: order-app-db
   Database: order_app
   User: order_app_user (또는 자동 생성)
   Region: 가장 가까운 지역 (예: Singapore)
   PostgreSQL Version: 18
   Plan: Free
   ```

4. **"Create Database"** 클릭

5. **데이터베이스 정보 복사**
   - 생성 완료 후 **"Connections"** 탭에서 정보 확인
   - **Internal Database URL** 복사 (나중에 사용)

---

### 2단계: 백엔드 서버 배포

#### 2.1 GitHub 저장소 준비

```bash
# 프로젝트 루트에서
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2.2 Render에서 Web Service 생성

1. **"New +"** → **"Web Service"** 선택
2. **GitHub 저장소 연결**
   - GitHub 계정 연결 (처음인 경우)
   - 저장소: `order-app` 선택

3. **서비스 설정**:
   ```
   Name: order-app-server
   Region: 데이터베이스와 같은 지역
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **환경 변수 추가** (Environment Variables):
   ```
   NODE_ENV = production
   PORT = 10000
   
   DB_HOST = <데이터베이스 Host>
   DB_PORT = 5432
   DB_NAME = order_app
   DB_USER = <데이터베이스 User>
   DB_PASSWORD = <데이터베이스 Password>
   
   FRONTEND_URL = https://order-app-ui.onrender.com
   ```
   
   **참고**: `FRONTEND_URL`은 3단계에서 프론트엔드 배포 후 업데이트

5. **"Create Web Service"** 클릭

6. **배포 대기** (약 2-3분)

#### 2.3 데이터베이스 초기화

배포 완료 후 데이터베이스를 초기화해야 합니다:

**방법 1: Render Shell 사용 (권장)**

1. Render 대시보드에서 `order-app-server` 서비스 선택
2. **"Shell"** 탭 클릭
3. 다음 명령어 실행:
   ```bash
   cd server
   npm run init-db
   ```

**방법 2: 로컬에서 Render DB에 연결**

1. Render 데이터베이스의 **"Connections"** 탭에서 **External Database URL** 복사
2. 로컬 `.env` 파일에 설정:
   ```env
   DB_HOST=<External Host>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<User>
   DB_PASSWORD=<Password>
   ```
3. 로컬에서 실행:
   ```bash
   cd server
   npm run init-db
   ```

#### 2.4 배포 확인

- 서비스 URL: `https://order-app-server.onrender.com`
- 헬스 체크: `https://order-app-server.onrender.com/health`
- API 테스트: `https://order-app-server.onrender.com/api/menus`

---

### 3단계: 프론트엔드 배포

#### 3.1 Static Site 생성

1. **"New +"** → **"Static Site"** 선택
2. **GitHub 저장소 연결**
   - 같은 저장소: `order-app`

3. **설정 입력**:
   ```
   Name: order-app-ui
   Branch: main
   Root Directory: ui
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **환경 변수 추가**:
   ```
   VITE_API_URL = https://order-app-server.onrender.com
   ```
   
   **중요**: 백엔드 서버 URL을 정확히 입력하세요!

5. **"Create Static Site"** 클릭

6. **배포 대기** (약 2-3분)

#### 3.2 백엔드 CORS 설정 업데이트

프론트엔드 배포 후, 백엔드의 `FRONTEND_URL` 환경 변수를 업데이트:

1. `order-app-server` 서비스 선택
2. **"Environment"** 탭 클릭
3. `FRONTEND_URL` 수정:
   ```
   FRONTEND_URL = https://order-app-ui.onrender.com
   ```
4. **"Save Changes"** 클릭
5. 서비스가 자동으로 재배포됨

#### 3.3 배포 확인

- 프론트엔드 URL: `https://order-app-ui.onrender.com`
- 브라우저에서 접속하여 테스트

---

## 📋 환경 변수 체크리스트

### 백엔드 (order-app-server)

```
✅ NODE_ENV = production
✅ PORT = 10000
✅ DB_HOST = <Render DB Host>
✅ DB_PORT = 5432
✅ DB_NAME = order_app
✅ DB_USER = <Render DB User>
✅ DB_PASSWORD = <Render DB Password>
✅ FRONTEND_URL = https://order-app-ui.onrender.com
```

### 프론트엔드 (order-app-ui)

```
✅ VITE_API_URL = https://order-app-server.onrender.com
```

---

## 🔧 문제 해결

### 백엔드 연결 오류

**문제**: 데이터베이스 연결 실패

**해결**:
1. Internal Database URL 사용 확인
2. 환경 변수 값 확인 (특히 비밀번호)
3. Render Shell에서 연결 테스트:
   ```bash
   cd server
   npm run test-connection
   ```

### CORS 오류

**문제**: 프론트엔드에서 API 호출 실패

**해결**:
1. 백엔드의 `FRONTEND_URL` 환경 변수 확인
2. 프론트엔드 URL이 정확한지 확인 (https 포함)
3. 브라우저 콘솔에서 오류 메시지 확인

### 이미지가 표시되지 않음

**문제**: 메뉴 이미지가 보이지 않음

**해결**:
1. `ui/public/images/` 폴더에 이미지가 있는지 확인
2. 이미지 경로가 `/images/...` 형식인지 확인
3. 빌드 시 이미지가 포함되었는지 확인

### 데이터베이스 초기화 실패

**문제**: 테이블이 생성되지 않음

**해결**:
1. Render Shell에서 직접 실행
2. 환경 변수 확인
3. 데이터베이스 권한 확인

---

## 🎯 빠른 배포 체크리스트

- [ ] GitHub에 코드 푸시 완료
- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] 백엔드 Web Service 생성 완료
- [ ] 백엔드 환경 변수 설정 완료
- [ ] 데이터베이스 초기화 완료 (`npm run init-db`)
- [ ] 백엔드 헬스 체크 성공
- [ ] 프론트엔드 Static Site 생성 완료
- [ ] 프론트엔드 환경 변수 설정 완료
- [ ] 백엔드 CORS 설정 업데이트 완료
- [ ] 전체 기능 테스트 완료

---

## 📝 추가 팁

### 자동 배포

Render는 GitHub에 푸시할 때마다 자동으로 재배포합니다.

### 무료 플랜 제한사항

- **Web Service**: 15분간 비활성 시 자동 스핀다운 (첫 요청 시 느림)
- **PostgreSQL**: 90일간 비활성 시 삭제 가능
- **Static Site**: 제한 없음

### 성능 최적화

- 무료 플랜에서는 첫 요청이 느릴 수 있음
- 프로덕션 환경에서는 유료 플랜 사용 권장

---

## 🎉 배포 완료!

모든 단계를 완료하면:
- 프론트엔드: `https://order-app-ui.onrender.com`
- 백엔드 API: `https://order-app-server.onrender.com`
- 데이터베이스: Render에서 관리

이제 어디서든 접속 가능한 커피 주문 앱이 완성되었습니다! ☕

