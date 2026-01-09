# PostgreSQL 연결 문제 빠른 해결 가이드

## 현재 문제
PostgreSQL 연결 시 비밀번호 인증이 실패하고 있습니다.

## 해결 방법

### 방법 1: PostgreSQL 인증 설정 변경 (권장)

PostgreSQL의 인증 설정을 변경하여 비밀번호 없이 접속할 수 있도록 합니다.

#### 1단계: pg_hba.conf 파일 찾기

터미널에서 다음 명령어를 실행하세요:

```bash
# 방법 1: Homebrew 설치 위치 확인
find /opt/homebrew/var -name pg_hba.conf 2>/dev/null

# 방법 2: 일반 설치 위치 확인
find /usr/local/var -name pg_hba.conf 2>/dev/null

# 방법 3: 사용자 디렉토리 확인
find ~/Library/Application\ Support/Postgres -name pg_hba.conf 2>/dev/null
```

#### 2단계: pg_hba.conf 파일 수정

파일을 찾으면 텍스트 에디터로 열어서 다음 줄들을 찾으세요:

```
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

이것을 다음으로 변경하세요:

```
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
```

**주의:** `trust`는 로컬에서만 사용하세요. 프로덕션 환경에서는 보안상 위험합니다.

#### 3단계: PostgreSQL 재시작

```bash
# Homebrew로 설치한 경우
brew services restart postgresql@14
# 또는 설치된 버전에 맞게
brew services restart postgresql@15
brew services restart postgresql@16
```

#### 4단계: 연결 테스트

```bash
cd server
npm run connect
```

### 방법 2: 비밀번호 설정

PostgreSQL에 접속하여 비밀번호를 설정할 수 있다면:

```bash
# PostgreSQL 접속 (방법은 설치 방법에 따라 다름)
psql -U postgres
# 또는
psql -U leehyunsong
```

접속 후:

```sql
-- 비밀번호 설정
ALTER USER postgres PASSWORD 'postgres';
-- 또는
ALTER USER leehyunsong PASSWORD 'postgres';
```

그리고 `.env` 파일에 설정:

```env
DB_USER=postgres
DB_PASSWORD=postgres
```

### 방법 3: PostgreSQL 재설치 (최후의 수단)

```bash
# 기존 PostgreSQL 제거
brew services stop postgresql@버전
brew uninstall postgresql@버전

# 새로 설치
brew install postgresql@14

# 서비스 시작
brew services start postgresql@14

# 초기 설정 (비밀번호 없이)
/opt/homebrew/bin/psql postgres
```

## PostgreSQL 설치 방법 확인

PostgreSQL을 어떻게 설치하셨나요?

1. **Homebrew**: `brew install postgresql@버전`
2. **Postgres.app**: macOS 앱으로 설치
3. **공식 설치 프로그램**: postgresql.org에서 다운로드
4. **다른 방법**: ?

설치 방법을 알려주시면 더 정확한 도움을 드릴 수 있습니다.

## 다음 단계

연결이 성공하면:

```bash
cd server
npm run init-db
```

이 명령어로 테이블을 생성하고 샘플 데이터를 삽입할 수 있습니다.

