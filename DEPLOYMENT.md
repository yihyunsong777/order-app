# Render.com 배포 가이드

## 📋 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 서버 배포**
3. **프론트엔드 배포**

---

## 1단계: PostgreSQL 데이터베이스 생성

### 1.1 Render.com에서 데이터베이스 생성

1. Render.com 대시보드 접속: https://dashboard.render.com
2. **"New +"** 버튼 클릭
3. **"PostgreSQL"** 선택
4. 설정 입력:
   - **Name**: `order-app-db` (원하는 이름)
   - **Database**: `order_app` (또는 원하는 이름)
   - **User**: 자동 생성 (또는 원하는 이름)
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 18 (또는 설치한 버전)
   - **Plan**: Free (또는 원하는 플랜)

5. **"Create Database"** 클릭

### 1.2 데이터베이스 정보 확인

생성 완료 후 다음 정보를 복사해두세요:
- **Internal Database URL**: `postgresql://user:password@host:port/database`
- **External Database URL**: 외부 접속용 (선택사항)
- **Host**: 데이터베이스 호스트
- **Port**: 5432
- **Database**: 데이터베이스 이름
- **User**: 사용자 이름
- **Password**: 비밀번호

### 1.3 데이터베이스 초기화

로컬에서 데이터베이스를 초기화하는 방법:

**방법 1: Render 데이터베이스에 직접 연결**

```bash
# .env 파일에 Render 데이터베이스 정보 입력
cd server
# .env 파일 수정
DB_HOST=<Render에서 제공한 Host>
DB_PORT=5432
DB_NAME=<Database 이름>
DB_USER=<User 이름>
DB_PASSWORD=<Password>

# 데이터베이스 초기화
npm run init-db
```

**방법 2: psql로 직접 연결**

```bash
# Render에서 제공한 External Database URL 사용
psql <External Database URL>

# 또는
psql -h <Host> -U <User> -d <Database>
# 비밀번호 입력

# SQL 스크립트 실행
\i init.sql
```

---

## 2단계: 백엔드 서버 배포

### 2.1 GitHub 저장소 준비

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **.gitignore 확인**
   - `.env` 파일이 커밋되지 않았는지 확인
   - `node_modules`가 제외되었는지 확인

### 2.2 Render.com에서 Web Service 생성

1. Render.com 대시보드에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. **GitHub 저장소 연결**
   - GitHub 계정 연결 (처음인 경우)
   - 저장소 선택: `order-app`

4. **서비스 설정**:
   - **Name**: `order-app-server` (또는 원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **환경 변수 설정** (Environment Variables):
   ```
   NODE_ENV=production
   PORT=10000
   
   DB_HOST=<1단계에서 복사한 Host>
   DB_PORT=5432
   DB_NAME=<Database 이름>
   DB_USER=<User 이름>
   DB_PASSWORD=<Password>
   
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

6. **"Create Web Service"** 클릭

### 2.3 배포 확인

- 배포 로그 확인
- 서비스 URL 확인: `https://order-app-server.onrender.com`
- 헬스 체크: `https://order-app-server.onrender.com/health`

### 2.4 데이터베이스 초기화 (배포 후)

배포된 서버에서 데이터베이스를 초기화하려면:

**방법 1: Render Shell 사용**
1. Render 대시보드에서 서비스 선택
2. **"Shell"** 탭 클릭
3. 다음 명령어 실행:
   ```bash
   cd server
   npm run init-db
   ```

**방법 2: 로컬에서 Render 데이터베이스에 연결**
```bash
# .env 파일에 Render DB 정보 입력 후
cd server
npm run init-db
```

---

## 3단계: 프론트엔드 배포

### 3.1 Static Site로 배포 (권장)

1. Render.com 대시보드에서 **"New +"** 클릭
2. **"Static Site"** 선택
3. **GitHub 저장소 연결**
   - 같은 저장소 선택: `order-app`

4. **설정 입력**:
   - **Name**: `order-app-ui` (또는 원하는 이름)
   - **Branch**: `main`
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **환경 변수 설정** (선택사항):
   ```
   VITE_API_URL=https://order-app-server.onrender.com
   ```

6. **"Create Static Site"** 클릭

### 3.2 프론트엔드 API URL 설정

프론트엔드가 배포된 백엔드 URL을 사용하도록 설정:

**방법 1: 환경 변수 사용 (권장)**

`ui/src/utils/api.js` 파일 수정:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**방법 2: 빌드 시점에 설정**

`ui/vite.config.js`에 설정 추가 (필요한 경우)

### 3.3 배포 확인

- 프론트엔드 URL 확인: `https://order-app-ui.onrender.com`
- 브라우저에서 접속하여 테스트

---

## 🔧 추가 설정

### CORS 설정 확인

백엔드 서버의 CORS 설정이 프론트엔드 URL을 허용하는지 확인:

`server/src/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

배포 시 `FRONTEND_URL` 환경 변수를 프론트엔드 URL로 설정하세요.

### 환경 변수 요약

**백엔드 (Web Service)**:
```
NODE_ENV=production
PORT=10000
DB_HOST=<Render DB Host>
DB_PORT=5432
DB_NAME=<Database>
DB_USER=<User>
DB_PASSWORD=<Password>
FRONTEND_URL=https://order-app-ui.onrender.com
```

**프론트엔드 (Static Site)**:
```
VITE_API_URL=https://order-app-server.onrender.com
```

---

## 📝 배포 체크리스트

### 배포 전 확인사항

- [ ] GitHub에 코드 푸시 완료
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있음
- [ ] `package.json`에 `start` 스크립트가 있음
- [ ] 데이터베이스 연결 정보 준비
- [ ] CORS 설정 확인

### 배포 후 확인사항

- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] 데이터베이스 초기화 완료 (테이블 생성)
- [ ] 백엔드 서버 배포 완료
- [ ] 백엔드 헬스 체크 성공 (`/health`)
- [ ] 프론트엔드 배포 완료
- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 주문하기 기능 테스트
- [ ] 관리자 화면 기능 테스트

---

## 🐛 문제 해결

### 백엔드 연결 오류

1. **데이터베이스 연결 실패**
   - 환경 변수 확인
   - Internal Database URL 사용 (Render 내부 네트워크)
   - 방화벽 설정 확인

2. **포트 오류**
   - Render는 자동으로 PORT 환경 변수를 설정
   - `process.env.PORT` 사용 확인

### 프론트엔드 API 호출 실패

1. **CORS 오류**
   - 백엔드의 `FRONTEND_URL` 환경 변수 확인
   - 프론트엔드 URL이 정확한지 확인

2. **API URL 오류**
   - 프론트엔드의 `VITE_API_URL` 환경 변수 확인
   - 브라우저 콘솔에서 네트워크 오류 확인

### 데이터베이스 초기화 실패

1. **권한 오류**
   - 데이터베이스 사용자 권한 확인
   - Render Shell에서 직접 실행

2. **연결 타임아웃**
   - Internal Database URL 사용
   - 네트워크 설정 확인

---

## 📚 참고 자료

- Render.com 문서: https://render.com/docs
- PostgreSQL on Render: https://render.com/docs/databases
- Static Sites on Render: https://render.com/docs/static-sites
- Web Services on Render: https://render.com/docs/web-services

---

## 🎯 빠른 배포 요약

1. **PostgreSQL 생성** → 정보 복사
2. **백엔드 배포** (Web Service)
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`
   - 환경 변수 설정
3. **데이터베이스 초기화** (Render Shell 또는 로컬)
4. **프론트엔드 배포** (Static Site)
   - Root: `ui`
   - Build: `npm install && npm run build`
   - Publish: `dist`
5. **CORS 및 API URL 설정 확인**

