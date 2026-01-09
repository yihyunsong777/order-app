# 데이터베이스 스키마 생성 가이드 (Shell 없이)

무료 플랜에서는 Render Shell에 접근할 수 없으므로, **로컬에서 Render 데이터베이스에 직접 연결**하여 스키마를 생성합니다.

---

## 🔧 방법: 로컬에서 Render DB에 연결

### 1단계: Render 데이터베이스 정보 확인

1. Render 대시보드 → PostgreSQL 데이터베이스 선택
2. **Connections** 탭 클릭
3. **External Database URL** 복사
   - 예: `postgresql://user:password@host:5432/dbname`
   - 또는 개별 정보 확인:
     - **Host**
     - **Port** (보통 5432)
     - **Database**
     - **User**
     - **Password**

---

### 2단계: 로컬 .env 파일 설정

`server/.env` 파일을 열고 Render 데이터베이스 정보로 수정:

```env
# Render 데이터베이스 정보
DB_HOST=<Render 데이터베이스 Host>
DB_PORT=5432
DB_NAME=order_app
DB_USER=<Render 데이터베이스 User>
DB_PASSWORD=<Render 데이터베이스 Password>

# 기타 설정
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**중요**: 
- `.env` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- Render 데이터베이스 정보만 입력하세요

---

### 3단계: 로컬에서 데이터베이스 초기화 실행

터미널에서 실행:

```bash
cd /Users/leehyunsong/Desktop/order-app/server
npm run init-db
```

또는 Render DB 전용 스크립트 사용:

```bash
npm run init-render-db
```

---

### 4단계: 실행 결과 확인

성공하면 다음과 같은 메시지가 표시됩니다:

```
✅ Menus 테이블 생성 완료
✅ Options 테이블 생성 완료
✅ Orders 테이블 생성 완료
✅ Order_Items 테이블 생성 완료
✅ Order_Item_Options 테이블 생성 완료
✅ 인덱스 생성 완료
✅ 메뉴 데이터 삽입 완료
✅ 옵션 데이터 삽입 완료
✅ 데이터베이스 초기화 완료!
```

---

## 🔍 데이터베이스 연결 테스트

스키마 생성 전에 연결이 되는지 먼저 테스트:

```bash
cd server
npm run test-connection
```

성공하면:
```
✅ 연결 성공!
```

---

## ⚠️ 주의사항

### 1. External Database URL 사용 시

Render에서 **External Database URL**을 제공하는 경우:

1. URL을 복사
2. `.env` 파일에 직접 사용할 수 없으므로, URL을 파싱하여 개별 정보 추출:
   ```
   postgresql://user:password@host:5432/dbname
   ```
   - `user` → DB_USER
   - `password` → DB_PASSWORD
   - `host` → DB_HOST
   - `5432` → DB_PORT
   - `dbname` → DB_NAME

### 2. 방화벽/네트워크 문제

로컬에서 Render 데이터베이스에 연결할 수 없는 경우:
- 회사/학교 네트워크에서 차단될 수 있음
- 다른 네트워크에서 시도해보세요

### 3. 보안

- `.env` 파일은 절대 Git에 커밋하지 마세요
- 데이터베이스 비밀번호를 안전하게 보관하세요

---

## ✅ 체크리스트

- [ ] Render 데이터베이스 정보 확인 완료
- [ ] `server/.env` 파일에 Render DB 정보 입력
- [ ] 연결 테스트 성공: `npm run test-connection`
- [ ] 데이터베이스 초기화 실행: `npm run init-db`
- [ ] 스키마 생성 완료 확인
- [ ] 프론트엔드에서 메뉴가 로드되는지 확인

---

## 🚨 문제 해결

### 연결 실패

**에러**: `ECONNREFUSED` 또는 `timeout`

**해결**:
1. Render 데이터베이스 정보가 정확한지 확인
2. External Database URL이 활성화되어 있는지 확인
3. 네트워크 연결 확인
4. 방화벽 설정 확인

### 인증 실패

**에러**: `password authentication failed`

**해결**:
1. 데이터베이스 비밀번호가 정확한지 확인
2. 사용자 이름이 정확한지 확인
3. Render 대시보드에서 비밀번호 재설정

### 테이블이 이미 존재함

**에러**: `relation "menus" already exists`

**해결**:
- 이미 스키마가 생성된 것입니다
- 프론트엔드에서 메뉴가 로드되는지 확인
- 메뉴가 없다면 데이터만 삽입:
  ```bash
  # 스크립트를 수정하여 데이터만 삽입하거나
  # 직접 SQL 실행
  ```

---

## 📝 다음 단계

데이터베이스 스키마 생성이 완료되면:

1. 프론트엔드에서 메뉴가 로드되는지 확인
2. 백엔드 API가 정상 작동하는지 확인
3. 주문 기능이 작동하는지 확인

---

## 💡 팁

### 데이터베이스 정보 확인

Render 대시보드에서:
- **Internal Database URL**: Render 내부 서비스 간 연결용 (로컬에서 사용 불가)
- **External Database URL**: 외부에서 연결용 (로컬에서 사용 가능)

로컬에서 연결하려면 **External Database URL** 또는 개별 연결 정보가 필요합니다.

