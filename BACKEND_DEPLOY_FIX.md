# 백엔드 배포 오류 해결 가이드

## 🔴 발생한 오류

```
Error: Cannot find module '/opt/render/project/src/server/index.js'
```

## 🔍 원인

Render의 **Start Command**가 잘못 설정되었습니다.

현재 설정: `node index.js` (잘못됨)
올바른 설정: `npm start` 또는 `node src/index.js`

## ✅ 해결 방법

### 방법 1: Render 대시보드에서 수정 (권장)

1. **Render 대시보드 접속**
   - https://dashboard.render.com
   - `order-app-server` 서비스 선택

2. **Settings 탭 클릭**

3. **Start Command 수정**:
   ```
   npm start
   ```
   또는
   ```
   node src/index.js
   ```

4. **Root Directory 확인**:
   ```
   server
   ```
   (반드시 `server`로 설정되어 있어야 합니다)

5. **Build Command 확인**:
   ```
   npm install
   ```

6. **"Save Changes" 클릭**

7. **수동 재배포**:
   - "Manual Deploy" → "Deploy latest commit" 클릭

### 방법 2: render.yaml 파일 사용 (Infrastructure as Code)

프로젝트에 `render.yaml` 파일이 있다면, Render에서 이 파일을 사용하여 자동으로 설정할 수 있습니다.

---

## 📋 올바른 Render 설정 요약

### 백엔드 서비스 설정

```
Name: order-app-server
Region: <데이터베이스와 같은 지역>
Branch: main
Root Directory: server          ⚠️ 중요!
Runtime: Node
Build Command: npm install
Start Command: npm start         ⚠️ 수정 필요!
```

### 환경 변수

```
NODE_ENV = production
PORT = 10000

DB_HOST = <Render 데이터베이스 호스트>
DB_PORT = 5432
DB_NAME = order_app
DB_USER = <Render 데이터베이스 사용자>
DB_PASSWORD = <Render 데이터베이스 비밀번호>

FRONTEND_URL = https://order-app-ui.onrender.com
```

---

## 🔄 배포 후 확인

1. **로그 확인**:
   - Render 대시보드 → "Logs" 탭
   - "Server is running on port 10000" 메시지 확인

2. **헬스 체크**:
   - 브라우저에서 `https://order-app-server.onrender.com/health` 접속
   - `{"success":true,"message":"서버가 정상 작동 중입니다."}` 응답 확인

3. **API 테스트**:
   - `https://order-app-server.onrender.com/` 접속
   - API 엔드포인트 목록 확인

---

## 💡 추가 팁

### package.json 확인

`server/package.json`의 `start` 스크립트:
```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

따라서 Render에서 `npm start`를 사용하면 자동으로 `node src/index.js`가 실행됩니다.

### 파일 구조 확인

올바른 파일 구조:
```
server/
  ├── package.json
  ├── src/
  │   └── index.js    ← 서버 진입점
  └── ...
```

---

## ❓ 여전히 문제가 발생하면

1. **Root Directory 확인**: 반드시 `server`로 설정
2. **Start Command 확인**: `npm start` 또는 `node src/index.js`
3. **로그 확인**: 에러 메시지 자세히 읽기
4. **GitHub 저장소 확인**: 최신 코드가 푸시되었는지 확인

