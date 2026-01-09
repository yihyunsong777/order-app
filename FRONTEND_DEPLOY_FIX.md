# 프론트엔드 배포 오류 해결 가이드

## 🔴 발생한 오류

```
==> Publish directory npm start does not exist!
==> Build failed 😞
```

## 🔍 원인

Render가 **Static Site**로 배포하려고 하는데, **Start Command**를 **Publish Directory**로 잘못 인식했습니다.

프론트엔드(Vite)는 정적 파일로 빌드되므로 **Static Site**로 배포하는 것이 올바릅니다.

---

## ✅ 해결 방법

### 방법 1: Static Site로 재생성 (권장)

1. **기존 서비스 삭제** (있다면)
   - Render 대시보드에서 `order-app-ui` 서비스 삭제

2. **새 Static Site 생성**
   - Render 대시보드 → "New +" → **"Static Site"** 선택
   - ⚠️ **Web Service가 아닌 Static Site 선택!**

3. **GitHub 저장소 연결**
   - 저장소: `yihyunsong777/order-app` 선택

4. **서비스 설정 입력**:
   ```
   Name: order-app-ui
   Branch: main
   Root Directory: ui
   Build Command: npm install && npm run build
   Publish Directory: dist          ⚠️ 중요!
   ```

   **중요**: 
   - **Start Command는 없습니다!** (Static Site는 필요 없음)
   - **Publish Directory**: `dist` (Vite 빌드 출력 폴더)

5. **환경 변수 추가** (Environment Variables):
   ```
   VITE_API_URL = https://order-app-server.onrender.com
   ```
   
   **참고**: 
   - 백엔드 서비스 이름이 다르면 해당 URL로 변경
   - 프로토콜(`https://`) 포함 필수!
   - 슬래시(`/`)는 포함하지 않음

6. **"Create Static Site"** 클릭

7. **배포 대기** (약 2-3분)

---

### 방법 2: 기존 서비스를 Static Site로 변경

1. **Render 대시보드 접속**
   - `order-app-ui` 서비스 선택

2. **Settings 탭 클릭**

3. **서비스 타입 확인**
   - 현재 "Web Service"로 되어 있다면, Static Site로 변경 불가
   - **새로 생성해야 합니다** (방법 1 참고)

---

## 📋 올바른 Render 설정 비교

### ❌ Web Service (잘못된 방법)
```
Type: Web Service
Root Directory: ui
Build Command: npm install && npm run build
Start Command: npm start          ← Static Site에는 불필요!
```

### ✅ Static Site (올바른 방법)
```
Type: Static Site
Root Directory: ui
Build Command: npm install && npm run build
Publish Directory: dist           ← 이것만 필요!
```

---

## 🔄 배포 후 확인

1. **배포 상태 확인**:
   - Render 대시보드 → "Live" 상태 확인
   - 로그에서 빌드 성공 확인

2. **프론트엔드 접속**:
   - `https://order-app-ui.onrender.com` 접속
   - 메뉴 목록이 정상적으로 표시되는지 확인

3. **API 연결 확인**:
   - 브라우저 개발자 도구(F12) → Network 탭
   - API 호출이 백엔드 서버로 가는지 확인

---

## 💡 Static Site vs Web Service

### Static Site (권장)
- ✅ 더 빠르고 간단함
- ✅ 무료 플랜에서도 빠름
- ✅ CDN으로 자동 서빙
- ✅ 빌드된 정적 파일만 서빙
- ❌ 런타임 환경 변수 변경 불가 (빌드 시점에만 주입)

### Web Service
- ✅ 런타임 환경 변수 변경 가능
- ❌ 더 느림 (무료 플랜)
- ❌ 서버가 항상 실행되어야 함
- ❌ 추가 설정 필요

**Vite 앱은 Static Site로 배포하는 것이 표준입니다!**

---

## ⚠️ 주의사항

1. **환경 변수 변경 후 재배포 필요**:
   - `VITE_API_URL` 변경 시 수동 재배포 필요
   - "Manual Deploy" → "Deploy latest commit"

2. **백엔드 URL 확인**:
   - 백엔드 서비스가 먼저 배포되어 있어야 함
   - 백엔드 URL이 정확한지 확인

3. **CORS 설정**:
   - 백엔드의 `FRONTEND_URL` 환경 변수가 프론트엔드 URL과 일치해야 함

---

## 🔧 문제 해결

### 문제 1: 빌드는 성공했는데 배포 실패

**해결**: Static Site로 생성했는지 확인, Publish Directory가 `dist`인지 확인

### 문제 2: API 연결 실패

**해결**: 
1. `VITE_API_URL` 환경 변수 확인
2. 백엔드 서버가 정상 작동하는지 확인
3. 백엔드 CORS 설정 확인

### 문제 3: 이미지가 표시되지 않음

**해결**: 
- `public/images/` 폴더의 이미지가 Git에 포함되어 있는지 확인
- 이미지 경로가 `/images/...` 형식인지 확인

---

## ✅ 체크리스트

배포 전:
- [ ] 기존 Web Service 삭제 (있다면)
- [ ] Static Site로 새로 생성
- [ ] Root Directory: `ui` 설정
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist` 설정
- [ ] Start Command 제거 (Static Site에는 없음)
- [ ] 환경 변수 `VITE_API_URL` 설정

배포 후:
- [ ] 서비스가 "Live" 상태
- [ ] 프론트엔드 접속 가능
- [ ] 메뉴 목록 표시 확인
- [ ] API 호출 정상 작동 확인

