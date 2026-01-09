# PostgreSQL 18 연결 설정 가이드

## 현재 상황
- PostgreSQL 18이 `/Library/PostgreSQL/18/`에 설치되어 있습니다.
- psql 경로: `/Library/PostgreSQL/18/bin/psql`
- 비밀번호 인증이 필요합니다.

## 해결 방법

### 방법 1: pg_hba.conf 파일 수정 (비밀번호 없이 접속)

#### 1단계: pg_hba.conf 파일 찾기

터미널에서 다음 명령어를 실행하세요:

```bash
find /Library/PostgreSQL/18 -name pg_hba.conf
```

또는 일반적인 위치:

```bash
/Library/PostgreSQL/18/data/pg_hba.conf
```

#### 2단계: 파일 수정

파일을 찾으면 관리자 권한으로 열어서 수정하세요:

```bash
sudo nano /Library/PostgreSQL/18/data/pg_hba.conf
```

다음 줄들을 찾으세요:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
# 또는
host    all             all             127.0.0.1/32            md5

# "local" is for Unix domain socket connections only
local   all             all                                     scram-sha-256
# 또는
local   all             all                                     md5
```

이것을 다음으로 변경하세요:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust

# "local" is for Unix domain socket connections only
local   all             all                                     trust
```

**주의:** `trust`는 로컬에서만 사용하세요. 프로덕션 환경에서는 보안상 위험합니다.

#### 3단계: PostgreSQL 재시작

PostgreSQL 서비스를 재시작하세요. 공식 설치 프로그램의 경우:

```bash
# 서비스 상태 확인
sudo launchctl list | grep postgres

# 또는 PostgreSQL 앱에서 재시작
# Applications > PostgreSQL 18 > Stop Server
# Applications > PostgreSQL 18 > Start Server
```

또는 터미널에서:

```bash
sudo /Library/PostgreSQL/18/bin/pg_ctl -D /Library/PostgreSQL/18/data restart
```

#### 4단계: 연결 테스트

```bash
cd server
npm run connect
```

### 방법 2: 설치 시 설정한 비밀번호 사용

PostgreSQL 설치 시 비밀번호를 설정했다면, 그 비밀번호를 `.env` 파일에 입력하세요:

```env
DB_USER=postgres
DB_PASSWORD=설치시_설정한_비밀번호
```

그리고 연결 테스트:

```bash
cd server
npm run test-connection
```

### 방법 3: 비밀번호 재설정

비밀번호를 모르는 경우, PostgreSQL에 접속하여 재설정할 수 있습니다:

```bash
# PostgreSQL에 접속 (비밀번호 입력 필요)
/Library/PostgreSQL/18/bin/psql -U postgres
```

접속 후:

```sql
-- 비밀번호 설정
ALTER USER postgres PASSWORD 'postgres';
-- 또는 원하는 비밀번호로
ALTER USER postgres PASSWORD 'your_password';

-- 종료
\q
```

그리고 `.env` 파일에 설정:

```env
DB_USER=postgres
DB_PASSWORD=postgres
```

## 빠른 해결 (권장)

가장 빠른 방법은 pg_hba.conf를 수정하는 것입니다:

1. **파일 찾기:**
   ```bash
   sudo find /Library/PostgreSQL/18 -name pg_hba.conf
   ```

2. **파일 열기:**
   ```bash
   sudo nano /Library/PostgreSQL/18/data/pg_hba.conf
   ```

3. **수정:** `scram-sha-256` 또는 `md5`를 `trust`로 변경

4. **재시작:**
   ```bash
   sudo /Library/PostgreSQL/18/bin/pg_ctl -D /Library/PostgreSQL/18/data restart
   ```

5. **테스트:**
   ```bash
   cd server
   npm run connect
   ```

## 다음 단계

연결이 성공하면:

```bash
cd server
npm run init-db
```

이 명령어로 테이블을 생성하고 샘플 데이터를 삽입할 수 있습니다.

