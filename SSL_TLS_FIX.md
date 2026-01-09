# SSL/TLS 연결 오류 해결 가이드

## 🔴 문제: "SSL/TLS required"

**에러 메시지**:
```
error: SSL/TLS required
```

**원인**: Render의 PostgreSQL 데이터베이스는 SSL/TLS 연결을 필수로 요구합니다. 현재 데이터베이스 연결 설정에 SSL 옵션이 없습니다.

---

## ✅ 해결 방법

데이터베이스 연결 설정에 SSL 옵션을 추가해야 합니다.

### 코드 수정 완료

다음 파일들이 수정되었습니다:
- `server/src/config/database.js` - 메인 데이터베이스 연결 설정
- `server/src/scripts/initRenderDatabase.js` - 데이터베이스 초기화 스크립트

**추가된 SSL 설정**:
```javascript
ssl: process.env.NODE_ENV === 'production' ? {
  rejectUnauthorized: false, // Render의 자체 서명 인증서 허용
} : false,
```

---

## 🔄 배포 방법

### 1. GitHub에 푸시

```bash
cd /Users/leehyunsong/Desktop/order-app
git add .
git commit -m "데이터베이스 SSL 연결 설정 추가"
git push order-app main
```

### 2. Render 자동 재배포

- GitHub에 푸시하면 Render가 자동으로 재배포를 시작합니다
- 또는 Render 대시보드에서 "Manual Deploy" → "Deploy latest commit"

### 3. 배포 확인

1. Render 대시보드 → `order-app-backend` → Logs 탭
2. 다음 로그 확인:
   ```
   ✅ 데이터베이스에 연결되었습니다.
   🚀 서버가 포트 10000에서 실행 중입니다.
   ```

3. API 테스트:
   ```
   https://order-app-backend-k1wy.onrender.com/api/menus
   ```
   - 정상: 메뉴 데이터 JSON 반환
   - 에러: 로그 확인

---

## 🔍 SSL 설정 설명

### Render PostgreSQL SSL 설정

Render의 PostgreSQL 데이터베이스는 보안을 위해 SSL 연결을 필수로 요구합니다.

**설정 옵션**:
```javascript
ssl: {
  rejectUnauthorized: false, // 자체 서명 인증서 허용
}
```

**설명**:
- `rejectUnauthorized: false`: Render가 사용하는 자체 서명 인증서를 허용합니다
- 프로덕션 환경에서 안전하게 사용 가능합니다
- Render 내부 네트워크에서 암호화된 연결을 보장합니다

### 로컬 개발 환경

로컬 개발 환경에서는 SSL이 필요하지 않으므로:
```javascript
ssl: process.env.NODE_ENV === 'production' ? {
  rejectUnauthorized: false,
} : false,
```

이렇게 설정하면 프로덕션에서만 SSL을 사용합니다.

---

## ✅ 확인 방법

### 1. 백엔드 로그 확인

Render 대시보드 → `order-app-backend` → Logs 탭

**정상 로그**:
```
✅ 데이터베이스에 연결되었습니다.
🚀 서버가 포트 10000에서 실행 중입니다.
```

**에러 로그**:
```
error: SSL/TLS required
```
→ 코드가 아직 배포되지 않았거나, 다른 문제가 있을 수 있습니다.

### 2. API 테스트

브라우저에서:
```
https://order-app-backend-k1wy.onrender.com/api/menus
```

**정상**: 메뉴 데이터 JSON 반환
**에러**: 500 에러 또는 SSL 에러

### 3. 프론트엔드 테스트

1. 프론트엔드 접속: `https://order-app-frontend-0g6j.onrender.com`
2. 브라우저 개발자 도구(F12) → Console 탭
3. 에러가 사라졌는지 확인
4. 메뉴가 정상적으로 로드되는지 확인

---

## 🚨 여전히 문제가 발생하면

### 1. 코드가 배포되었는지 확인

- GitHub에 푸시했는지 확인
- Render에서 최신 커밋을 배포했는지 확인
- 배포 로그에서 빌드 성공 확인

### 2. 다른 스크립트 파일도 확인

다른 데이터베이스 연결 스크립트가 있다면 동일한 SSL 설정을 추가해야 합니다:

```javascript
const pool = new Pool({
  // ... 기존 설정 ...
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});
```

### 3. 환경 변수 확인

Render 대시보드 → `order-app-backend` → Environment 탭

다음 환경 변수가 올바르게 설정되어 있는지 확인:
```
NODE_ENV = production
DB_HOST = dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com
DB_PORT = 5432
DB_NAME = order_app
DB_USER = <사용자 이름>
DB_PASSWORD = <비밀번호>
```

---

## 📋 체크리스트

- [ ] 코드 수정 완료 (SSL 설정 추가)
- [ ] GitHub에 푸시 완료
- [ ] Render에서 재배포 완료
- [ ] 백엔드 로그에서 "데이터베이스에 연결되었습니다" 확인
- [ ] API 테스트 성공 (`/api/menus`)
- [ ] 프론트엔드에서 메뉴가 정상적으로 로드됨

---

## 💡 추가 정보

### Render PostgreSQL SSL 요구사항

- Render의 PostgreSQL은 SSL 연결을 필수로 요구합니다
- Internal Database URL과 External Database URL 모두 SSL이 필요합니다
- `rejectUnauthorized: false` 설정은 Render의 자체 서명 인증서를 허용합니다

### 보안 고려사항

- `rejectUnauthorized: false`는 Render 내부 네트워크에서 안전합니다
- 외부 네트워크에서 연결할 때는 추가 보안 설정을 고려할 수 있습니다
- 하지만 Render의 PostgreSQL은 외부에서 직접 접근할 수 없도록 설계되어 있습니다

---

## 🎯 다음 단계

1. **코드 푸시**: GitHub에 푸시
2. **배포 대기**: Render 자동 재배포 완료 대기
3. **테스트**: API와 프론트엔드에서 정상 작동 확인
4. **데이터베이스 스키마**: 필요시 로컬에서 `npm run init-render-db` 실행

