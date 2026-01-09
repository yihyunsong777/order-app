# 데이터베이스 연결 오류 해결 가이드

## 🔴 문제: `getaddrinfo ENOTFOUND @dpg-...`

**에러 메시지**:
```
Error: getaddrinfo ENOTFOUND @dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com
```

**원인**: 데이터베이스 호스트 이름 앞에 `@` 기호가 포함되어 있습니다. 이는 환경 변수 설정 오류입니다.

---

## 🔍 원인 진단

### 가능한 원인:

1. **DB_HOST 환경 변수에 `@` 기호가 포함됨**
   - 잘못된 값: `@dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com`
   - 올바른 값: `dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com`

2. **Internal Database URL을 잘못 파싱함**
   - Internal URL은 `@` 기호를 포함할 수 있음
   - External URL 또는 개별 환경 변수 사용 필요

3. **환경 변수에 공백이나 특수문자가 포함됨**

---

## ✅ 해결 방법

### 방법 1: Render 대시보드에서 환경 변수 수정 (권장)

1. **Render 대시보드 → `order-app-backend` 서비스**
2. **Environment** 탭 클릭
3. **DB_HOST** 환경 변수 확인/수정:

   **잘못된 설정**:
   ```
   DB_HOST = @dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com
   ```

   **올바른 설정**:
   ```
   DB_HOST = dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com
   ```
   - ⚠️ **`@` 기호 제거!**
   - ⚠️ **앞뒤 공백 없음!**

4. **다른 데이터베이스 환경 변수도 확인**:
   ```
   DB_PORT = 5432
   DB_NAME = order_app
   DB_USER = <사용자 이름>
   DB_PASSWORD = <비밀번호>
   ```

5. **"Save Changes" 클릭**
6. **자동 재배포 대기** (또는 수동 재배포)

---

### 방법 2: 데이터베이스 정보 다시 확인

1. **Render 대시보드 → PostgreSQL 데이터베이스 선택**
2. **Connections** 탭 클릭
3. **개별 연결 정보 확인**:
   - **Host**: `dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com` (앞의 `@` 없음)
   - **Port**: `5432`
   - **Database**: `order_app` (또는 실제 데이터베이스 이름)
   - **User**: 사용자 이름
   - **Password**: 비밀번호

4. **각 값을 정확히 복사하여 환경 변수에 설정**

---

## 🔧 올바른 환경 변수 설정 예시

### 백엔드 환경 변수 (Render 대시보드)

```
NODE_ENV = production
PORT = 10000

DB_HOST = dpg-d5gfkiali9vc7385gi0g-a.oregon-postgres.render.com
DB_PORT = 5432
DB_NAME = order_app
DB_USER = order_app_user
DB_PASSWORD = <실제 비밀번호>

FRONTEND_URL = https://order-app-frontend-0g6j.onrender.com
```

**중요 체크리스트**:
- ✅ `DB_HOST`에 `@` 기호 없음
- ✅ `DB_HOST` 앞뒤 공백 없음
- ✅ 모든 값이 정확히 일치
- ✅ 따옴표 없이 값만 입력

---

## 🚨 Internal vs External Database URL

### Internal Database URL (사용하지 않음)
```
postgresql://user:password@dpg-xxx-a.oregon-postgres.render.com/dbname
```
- Render 내부 서비스 간 연결용
- 로컬이나 외부에서 사용 불가
- `@` 기호 포함

### External Database URL (로컬에서 사용)
```
postgresql://user:password@dpg-xxx-a.oregon-postgres.render.com:5432/dbname
```
- 외부에서 연결 가능
- 로컬 개발용

### 개별 환경 변수 (Render 배포용 - 권장)
```
DB_HOST = dpg-xxx-a.oregon-postgres.render.com
DB_PORT = 5432
DB_NAME = dbname
DB_USER = user
DB_PASSWORD = password
```
- Render 배포 시 가장 안정적
- `@` 기호 없음

---

## ✅ 확인 방법

### 1. 환경 변수 확인

Render 대시보드에서:
1. `order-app-backend` 서비스 → Environment 탭
2. 각 환경 변수 값 확인
3. `DB_HOST`에 `@` 기호가 없는지 확인

### 2. 백엔드 로그 확인

Render 대시보드 → `order-app-backend` → Logs 탭

**정상적인 로그**:
```
🚀 서버가 포트 10000에서 실행 중입니다.
```

**에러 로그**:
```
Error: getaddrinfo ENOTFOUND @dpg-...
```
→ 환경 변수 수정 필요

### 3. API 테스트

브라우저에서:
```
https://order-app-backend-k1wy.onrender.com/api/menus
```

**정상**: 메뉴 데이터 JSON 반환
**에러**: 500 에러 또는 데이터베이스 연결 에러

---

## 🔄 수정 후 재배포

1. 환경 변수 수정 후 **"Save Changes"** 클릭
2. 자동 재배포 대기 (또는 수동 재배포)
3. 로그에서 에러가 사라졌는지 확인
4. API 테스트로 정상 작동 확인

---

## 💡 추가 팁

### 환경 변수 값에 공백이 있는지 확인

Render 대시보드에서 환경 변수를 수정할 때:
- 값 앞뒤에 공백이 없어야 함
- 따옴표를 사용하지 않음
- 특수문자(`@`, `#`, `$` 등)가 값에 포함되지 않아야 함

### 데이터베이스 연결 정보 확인

Render 대시보드 → PostgreSQL 데이터베이스:
- **Connections** 탭에서 정확한 정보 확인
- 각 값을 하나씩 복사하여 환경 변수에 설정
- 직접 타이핑하지 말고 복사-붙여넣기 사용

---

## 📋 체크리스트

- [ ] `DB_HOST` 환경 변수에 `@` 기호 없음
- [ ] `DB_HOST` 앞뒤 공백 없음
- [ ] 모든 데이터베이스 환경 변수가 정확히 설정됨
- [ ] 환경 변수 저장 후 재배포 완료
- [ ] 백엔드 로그에서 데이터베이스 연결 에러 없음
- [ ] API 테스트 성공 (`/api/menus`)

---

## 🚨 여전히 문제가 발생하면

1. **Render 대시보드에서 환경 변수 스크린샷** 촬영
2. **백엔드 로그 전체** 복사
3. **데이터베이스 Connections 탭 스크린샷** 촬영

이 정보를 바탕으로 추가 진단이 가능합니다.

