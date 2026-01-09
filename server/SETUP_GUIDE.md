# PostgreSQL 연결 설정 가이드

## 현재 상황
PostgreSQL 연결에 문제가 있습니다. 다음 단계를 따라 설정을 완료하세요.

## 1. PostgreSQL 설치 확인

### Homebrew로 설치한 경우:
```bash
# 설치된 PostgreSQL 버전 확인
brew list | grep postgresql

# 서비스 상태 확인
brew services list
```

### PostgreSQL 서버 시작:
```bash
# PostgreSQL 서버 시작 (버전에 맞게)
brew services start postgresql@14
# 또는
brew services start postgresql@15
# 또는
brew services start postgresql@16
```

## 2. PostgreSQL 접속 테스트

### 방법 1: psql 명령어 사용
```bash
# PATH에 PostgreSQL 추가 (Homebrew 설치 시)
export PATH="/opt/homebrew/bin:$PATH"
# 또는
export PATH="/usr/local/bin:$PATH"

# PostgreSQL 접속 시도
psql -U postgres
# 또는 현재 사용자로
psql -U $(whoami)
```

### 방법 2: 전체 경로 사용
```bash
# Homebrew 설치 경로에서 직접 실행
/opt/homebrew/bin/psql -U postgres
# 또는
/usr/local/bin/psql -U postgres
```

## 3. 비밀번호 확인 및 설정

### 비밀번호 없이 접속되는 경우:
`.env` 파일에서 `DB_PASSWORD`를 빈 문자열로 설정하거나 제거:
```env
DB_PASSWORD=
```

### 비밀번호가 필요한 경우:
PostgreSQL에 접속한 후:
```sql
-- 비밀번호 설정
ALTER USER postgres PASSWORD 'your_password';
```

그리고 `.env` 파일에 설정:
```env
DB_PASSWORD=your_password
```

## 4. 데이터베이스 생성

PostgreSQL에 접속한 후:
```sql
-- 데이터베이스 생성
CREATE DATABASE order_app;

-- 확인
\l

-- 종료
\q
```

## 5. Node.js로 연결 테스트

```bash
cd server
npm run test-connection
```

## 6. 데이터베이스 초기화

연결이 성공하면:
```bash
npm run setup-db    # 데이터베이스 생성 (이미 생성했다면 생략)
npm run init-db     # 테이블 생성 및 샘플 데이터 삽입
```

## 문제 해결

### "command not found: psql"
- PostgreSQL이 PATH에 없습니다.
- 전체 경로를 사용하거나 PATH에 추가하세요.

### "password authentication failed"
- `.env` 파일의 비밀번호가 잘못되었습니다.
- PostgreSQL에 접속하여 비밀번호를 확인하거나 재설정하세요.

### "connection refused"
- PostgreSQL 서버가 실행되지 않았습니다.
- `brew services start postgresql@버전`으로 서버를 시작하세요.

### "database does not exist"
- `order_app` 데이터베이스를 생성하세요.
- 또는 `.env` 파일의 `DB_NAME`을 확인하세요.

## 도움이 필요한 경우

1. PostgreSQL 설치 방법 확인
2. 설치된 버전 확인
3. 서버 실행 상태 확인
4. 사용자 및 비밀번호 설정 확인

위 정보를 알려주시면 더 정확한 도움을 드릴 수 있습니다.

