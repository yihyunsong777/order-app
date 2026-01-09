# 커피 주문 앱
## 1. 프로젝트 개요
### 1.1 프로젝트명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면 (메뉴 선택 및 장바구니 기능)
- 관리자 화면 (재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프론트엔드 : HTML, CSS, 리액트, 자바스크립트
- 백엔드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프론트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 프론트엔드 UI 상세 명세

### 4.1 주문하기 화면

#### 4.1.1 화면 개요
사용자가 커피 메뉴를 선택하고 옵션을 추가하여 장바구니에 담은 후 주문할 수 있는 화면

#### 4.1.2 레이아웃 구조

**헤더 영역**
- 브랜드 로고: "COZY" 텍스트 (좌측 상단)
- 네비게이션 탭:
  - "주문하기" 버튼 (현재 화면 - 활성화 상태)
  - "관리자" 버튼 (관리자 화면으로 이동)

**메인 컨텐츠 영역**
- 메뉴 카드 그리드:
  - 3개의 메뉴 카드가 가로로 나열
  - 각 카드는 동일한 크기와 스타일로 구성
  - 반응형 디자인으로 화면 크기에 따라 카드 배치 조정

**장바구니 영역**
- 화면 하단에 고정
- 담은 메뉴 목록과 총 금액 표시
- 주문하기 버튼 포함

#### 4.1.3 메뉴 카드 컴포넌트

**구성 요소:**
1. **메뉴 이미지**
   - 플레이스홀더 이미지 (X 표시)
   - 비율: 가로형 직사각형

2. **메뉴명**
   - 예시: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
   - 굵은 글씨체로 강조

3. **가격**
   - 메뉴명 바로 아래 표시
   - 형식: "N,000원"
   - 예시: "4,000원", "5,000원"

4. **메뉴 설명**
   - 간단한 설명 텍스트
   - 예시: "간단한 설명..."
   - 회색 계열의 보조 텍스트

5. **옵션 선택**
   - 체크박스 형태
   - 옵션 종류:
     - 샷 추가 (+500원)
     - 시럽 추가 (+0원)
   - 여러 옵션 동시 선택 가능

6. **담기 버튼**
   - 카드 하단에 위치
   - 테두리가 있는 버튼 스타일
   - 클릭 시 선택된 옵션과 함께 장바구니에 추가

#### 4.1.4 장바구니 컴포넌트

**구성 요소:**
1. **제목**
   - "장바구니" 텍스트

2. **주문 목록**
   - 각 주문 항목 표시
   - 형식: "메뉴명(옵션) x 수량 금액"
   - 예시:
     - "아메리카노(ICE) (샷 추가) x 1  4,500원"
     - "아메리카노(HOT) x 2  8,000원"

3. **총 금액**
   - 우측 정렬
   - 굵은 글씨로 강조
   - 형식: "총 금액 NN,NNN원"
   - 예시: "총 금액 12,500원"

4. **주문하기 버튼**
   - 총 금액 아래에 위치
   - 테두리가 있는 버튼 스타일
   - 클릭 시 주문 완료 처리

#### 4.1.5 주요 기능 및 상호작용

**메뉴 선택 플로우:**
1. 사용자가 원하는 메뉴 카드의 옵션 체크박스 선택
2. "담기" 버튼 클릭
3. 선택한 메뉴가 장바구니에 추가됨
4. 장바구니 금액이 실시간으로 업데이트됨

**장바구니 기능:**
- 동일한 메뉴를 여러 번 추가하면 수량이 증가
- 옵션이 다른 경우 별도의 항목으로 추가
- 총 금액 자동 계산 및 표시

**주문 완료:**
- "주문하기" 버튼 클릭 시 주문 제출
- 주문 완료 후 장바구니 초기화

#### 4.1.6 데이터 요구사항

**메뉴 데이터:**
- 메뉴 ID
- 메뉴명
- 가격
- 설명
- 이미지 URL
- 사용 가능한 옵션 목록

**옵션 데이터:**
- 옵션명
- 추가 가격

**장바구니 데이터:**
- 메뉴 정보
- 선택된 옵션
- 수량
- 총 가격

#### 4.1.7 UI/UX 가이드라인

**디자인 원칙:**
- 깔끔하고 심플한 디자인
- 직관적인 사용자 경험
- 명확한 버튼과 액션 포인트

**색상:**
- 기본: 흰색 배경
- 강조: 검은색 텍스트
- 버튼: 테두리 스타일 (배경 투명)

**레이아웃:**
- 카드 그리드 형태로 메뉴 표시
- 적절한 여백과 패딩 사용
- 반응형 디자인 적용

**상태 표시:**
- 현재 활성화된 탭 강조 표시
- 버튼 호버 시 시각적 피드백
- 옵션 선택 시 체크박스 상태 변경

#### 4.1.8 예외 처리

- 장바구니가 비어있을 때 "주문하기" 버튼 비활성화 또는 안내 메시지 표시
- 메뉴 재고가 없을 경우 "품절" 표시 및 담기 버튼 비활성화
- 주문 실패 시 사용자에게 오류 메시지 표시

### 4.2 관리자 화면

#### 4.2.1 화면 개요
관리자가 주문을 관리하고 메뉴의 재고를 조정할 수 있는 화면

#### 4.2.2 레이아웃 구조

**헤더 영역**
- 브랜드 로고: "COZY" 텍스트 (좌측 상단)
- 네비게이션 탭:
  - "주문하기" 버튼 (주문하기 화면으로 이동)
  - "관리자" 버튼 (현재 화면 - 활성화 상태)

**메인 컨텐츠 영역**
- 3개의 주요 섹션으로 구성:
  1. 관리자 대시보드 (상단)
  2. 재고 현황 (중단)
  3. 주문 현황 (하단)

#### 4.2.3 관리자 대시보드 컴포넌트

**구성 요소:**
1. **섹션 제목**
   - "관리자 대시보드"

2. **통계 정보**
   - 한 줄로 나열된 주문 상태별 통계
   - 슬래시(/)로 구분
   - 표시 항목:
     - 총 주문: 전체 주문 건수
     - 주문 접수: 접수된 주문 건수
     - 제조 중: 현재 제조 중인 주문 건수
     - 제조 완료: 완료된 주문 건수
   - 형식: "총 주문 N / 주문 접수 N / 제조 중 N / 제조 완료 N"
   - 예시: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

**기능:**
- 실시간 주문 상태 집계 및 표시
- 주문 상태가 변경될 때마다 자동 업데이트

#### 4.2.4 재고 현황 컴포넌트

**구성 요소:**
1. **섹션 제목**
   - "재고 현황"

2. **메뉴 재고 카드**
   - 가로로 나열된 카드 형태
   - 각 메뉴별로 별도의 카드
   - 카드 내용:
     - 메뉴명 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
     - 재고 수량 (예: "10개")
     - 수량 조절 버튼:
       - [+] 버튼: 재고 1개 증가
       - [-] 버튼: 재고 1개 감소

**기능:**
- [+] 버튼 클릭 시:
  - 해당 메뉴의 재고가 1개 증가
  - 화면에 즉시 반영
  - 데이터베이스 업데이트
  
- [-] 버튼 클릭 시:
  - 해당 메뉴의 재고가 1개 감소
  - 화면에 즉시 반영
  - 재고가 0일 경우 비활성화
  - 데이터베이스 업데이트

**예외 처리:**
- 재고가 0일 때 [-] 버튼 비활성화
- 재고가 음수가 되지 않도록 제한
- 재고 업데이트 실패 시 오류 메시지 표시

#### 4.2.5 주문 현황 컴포넌트

**구성 요소:**
1. **섹션 제목**
   - "주문 현황"

2. **주문 카드**
   - 각 주문을 카드 형태로 표시
   - 카드 내용:
     - 주문 시간 (예: "7월 31일 13:00")
     - 주문 내역 (예: "아메리카노(ICE) x 1")
     - 주문 금액 (예: "4,000원")
     - 주문 상태 버튼 (예: "주문 접수")

3. **주문 상태 버튼**
   - 현재 주문 상태를 표시하는 동시에 다음 상태로 변경하는 버튼
   - 상태 전환 흐름:
     - "주문 접수" → 클릭 시 "제조 중"으로 변경
     - "제조 중" → 클릭 시 "제조 완료"로 변경
     - "제조 완료" → 완료 상태 (버튼 비활성화)

**기능:**
- 새로운 주문이 들어오면 자동으로 목록에 추가
- 최신 주문이 상단에 표시 (시간 역순 정렬)
- 주문 상태 버튼 클릭 시:
  - 주문 상태 업데이트
  - 대시보드 통계 자동 업데이트
  - 상태에 따른 버튼 텍스트 변경

**주문 상세 정보:**
- 여러 메뉴가 포함된 경우 모두 표시
- 옵션이 포함된 경우 함께 표시
- 형식: "메뉴명(옵션) x 수량"

#### 4.2.6 데이터 요구사항

**대시보드 데이터:**
- 총 주문 건수
- 주문 접수 상태 건수
- 제조 중 상태 건수
- 제조 완료 상태 건수

**재고 데이터:**
- 메뉴 ID
- 메뉴명
- 현재 재고 수량

**주문 데이터:**
- 주문 ID
- 주문 시간
- 주문 내역 (메뉴, 옵션, 수량)
- 총 금액
- 주문 상태 (주문 접수 / 제조 중 / 제조 완료)

#### 4.2.7 UI/UX 가이드라인

**디자인 원칙:**
- 정보의 계층 구조를 명확하게 표시
- 관리자가 빠르게 파악하고 조작할 수 있는 직관적인 인터페이스
- 중요한 정보를 우선적으로 배치

**색상:**
- 기본: 흰색 배경
- 텍스트: 검은색
- 섹션 구분: 테두리 또는 배경색으로 구분
- 버튼: 테두리 스타일

**레이아웃:**
- 박스/카드 형태로 섹션 구분
- 적절한 여백과 패딩 사용
- 가독성을 고려한 정보 배치

**상태 표시:**
- 현재 활성화된 탭 강조 표시
- 주문 상태별로 시각적으로 구분 (색상 또는 아이콘 활용 가능)
- 버튼 호버 시 시각적 피드백

#### 4.2.8 주요 기능 및 상호작용

**재고 관리 플로우:**
1. 관리자가 재고 현황 섹션에서 특정 메뉴 확인
2. [+] 또는 [-] 버튼 클릭하여 재고 조정
3. 변경사항이 즉시 화면에 반영
4. 데이터베이스에 재고 수량 업데이트

**주문 관리 플로우:**
1. 새 주문이 들어오면 주문 현황에 자동 표시
2. 관리자가 주문 확인 후 "주문 접수" 버튼 클릭
3. 상태가 "제조 중"으로 변경
4. 제조 완료 후 "제조 중" 버튼 클릭
5. 상태가 "제조 완료"로 변경
6. 대시보드 통계가 실시간으로 업데이트

**실시간 업데이트:**
- 주문하기 화면에서 새 주문이 들어올 때 자동 반영
- 여러 관리자가 동시에 접속한 경우 동기화

#### 4.2.9 예외 처리

- 재고가 0 이하로 내려가지 않도록 제한
- 재고 업데이트 실패 시 이전 값으로 복구 및 오류 메시지 표시
- 주문 상태 업데이트 실패 시 오류 메시지 표시
- 네트워크 오류 시 재시도 또는 안내 메시지
- 존재하지 않는 주문에 대한 처리

#### 4.2.10 권한 및 보안

- 관리자 화면 접근 제한 (선택 사항 - 현재 프로젝트에서는 제외)
- 재고 및 주문 데이터의 무결성 보장
- 동시 수정 시 충돌 방지 메커니즘

## 5. 백엔드 API 상세 명세

### 5.1 개요
- RESTful API 설계 원칙 준수
- JSON 형식으로 데이터 송수신
- HTTP 상태 코드를 통한 응답 처리
- 에러 핸들링 및 검증

### 5.2 데이터베이스 스키마

#### 5.2.1 Menus 테이블

커피 메뉴 정보를 저장하는 테이블

**필드:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR(100), NOT NULL, UNIQUE): 커피 이름
- `description` (TEXT): 메뉴 설명
- `price` (INT, NOT NULL): 가격 (원 단위)
- `image_url` (VARCHAR(500)): 이미지 URL
- `inventory` (INT, NOT NULL, DEFAULT 0): 재고 수량
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 수정 일시

**제약조건:**
- `price`는 0 이상
- `inventory`는 0 이상
- `name`은 중복 불가

**예시 데이터:**
```sql
{
  "id": 1,
  "name": "아메리카노(ICE)",
  "description": "시원하고 깔끔한 아이스 아메리카노",
  "price": 4000,
  "image_url": "https://example.com/images/americano-ice.jpg",
  "inventory": 10,
  "created_at": "2025-01-09T10:00:00Z",
  "updated_at": "2025-01-09T10:00:00Z"
}
```

#### 5.2.2 Options 테이블

메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블

**필드:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 옵션 고유 ID
- `name` (VARCHAR(50), NOT NULL): 옵션 이름
- `price` (INT, NOT NULL, DEFAULT 0): 추가 가격 (원 단위)
- `menu_id` (INT, FOREIGN KEY REFERENCES Menus(id)): 연결된 메뉴 ID
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**제약조건:**
- `price`는 0 이상
- `menu_id`는 Menus 테이블의 id를 참조 (ON DELETE CASCADE)

**예시 데이터:**
```sql
{
  "id": 1,
  "name": "샷 추가",
  "price": 500,
  "menu_id": 1,
  "created_at": "2025-01-09T10:00:00Z"
}
```

#### 5.2.3 Orders 테이블

주문 정보를 저장하는 테이블

**필드:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 주문 고유 ID
- `order_datetime` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): 주문 일시
- `total_price` (INT, NOT NULL): 총 주문 금액
- `status` (ENUM('pending', 'preparing', 'completed'), DEFAULT 'pending'): 주문 상태
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 수정 일시

**제약조건:**
- `total_price`는 0 이상
- `status`는 'pending', 'preparing', 'completed' 중 하나

**예시 데이터:**
```sql
{
  "id": 1,
  "order_datetime": "2025-01-09T13:30:00Z",
  "total_price": 9000,
  "status": "pending",
  "created_at": "2025-01-09T13:30:00Z",
  "updated_at": "2025-01-09T13:30:00Z"
}
```

#### 5.2.4 Order_Items 테이블

주문에 포함된 메뉴 항목들을 저장하는 테이블 (Orders와 Menus의 중간 테이블)

**필드:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 주문 항목 고유 ID
- `order_id` (INT, FOREIGN KEY REFERENCES Orders(id)): 주문 ID
- `menu_id` (INT, FOREIGN KEY REFERENCES Menus(id)): 메뉴 ID
- `quantity` (INT, NOT NULL, DEFAULT 1): 수량
- `unit_price` (INT, NOT NULL): 단가 (옵션 포함)
- `subtotal` (INT, NOT NULL): 소계 (단가 × 수량)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**제약조건:**
- `order_id`는 Orders 테이블의 id를 참조 (ON DELETE CASCADE)
- `menu_id`는 Menus 테이블의 id를 참조
- `quantity`는 1 이상
- `unit_price`, `subtotal`은 0 이상

**예시 데이터:**
```sql
{
  "id": 1,
  "order_id": 1,
  "menu_id": 1,
  "quantity": 2,
  "unit_price": 4500,
  "subtotal": 9000,
  "created_at": "2025-01-09T13:30:00Z"
}
```

#### 5.2.5 Order_Item_Options 테이블

주문 항목에 추가된 옵션들을 저장하는 테이블

**필드:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 고유 ID
- `order_item_id` (INT, FOREIGN KEY REFERENCES Order_Items(id)): 주문 항목 ID
- `option_id` (INT, FOREIGN KEY REFERENCES Options(id)): 옵션 ID
- `option_name` (VARCHAR(50), NOT NULL): 옵션 이름 (스냅샷)
- `option_price` (INT, NOT NULL): 옵션 가격 (스냅샷)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**제약조건:**
- `order_item_id`는 Order_Items 테이블의 id를 참조 (ON DELETE CASCADE)
- `option_id`는 Options 테이블의 id를 참조

**예시 데이터:**
```sql
{
  "id": 1,
  "order_item_id": 1,
  "option_id": 1,
  "option_name": "샷 추가",
  "option_price": 500,
  "created_at": "2025-01-09T13:30:00Z"
}
```

### 5.3 ER 다이어그램 관계

```
Menus (1) ─────< (N) Options
  │
  │
  └─< (N) Order_Items (N) >─── Orders (1)
            │
            │
            └─< (N) Order_Item_Options (N) >─── Options (1)
```

### 5.4 API 엔드포인트 명세

#### 5.4.1 메뉴 관련 API

**1. 전체 메뉴 조회**
```
GET /api/menus
```
**설명:** 모든 커피 메뉴와 연결된 옵션 목록을 조회

**요청 파라미터:** 없음

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노",
      "price": 4000,
      "image_url": "https://example.com/images/americano-ice.jpg",
      "inventory": 10,
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        },
        {
          "id": 2,
          "name": "시럽 추가",
          "price": 0
        }
      ]
    }
  ]
}
```

**2. 특정 메뉴 조회**
```
GET /api/menus/:id
```
**설명:** 특정 메뉴의 상세 정보 조회

**경로 파라미터:**
- `id` (INT, 필수): 메뉴 ID

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "시원하고 깔끔한 아이스 아메리카노",
    "price": 4000,
    "image_url": "https://example.com/images/americano-ice.jpg",
    "inventory": 10,
    "options": [...]
  }
}
```

**에러 응답 (404 Not Found):**
```json
{
  "success": false,
  "error": "메뉴를 찾을 수 없습니다."
}
```

**3. 메뉴 재고 수정**
```
PATCH /api/menus/:id/inventory
```
**설명:** 특정 메뉴의 재고 수량 수정 (관리자 기능)

**경로 파라미터:**
- `id` (INT, 필수): 메뉴 ID

**요청 본문:**
```json
{
  "inventory": 15
}
```

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "message": "재고가 업데이트되었습니다.",
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "inventory": 15
  }
}
```

**에러 응답 (400 Bad Request):**
```json
{
  "success": false,
  "error": "재고 수량은 0 이상이어야 합니다."
}
```

#### 5.4.2 주문 관련 API

**1. 주문 생성**
```
POST /api/orders
```
**설명:** 새로운 주문을 생성하고 재고 차감

**요청 본문:**
```json
{
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "options": [1, 2]
    },
    {
      "menu_id": 2,
      "quantity": 1,
      "options": []
    }
  ]
}
```

**처리 과정:**
1. 재고 확인 (재고 부족 시 주문 거부)
2. 주문 금액 계산
3. Orders 테이블에 주문 생성
4. Order_Items 테이블에 주문 항목 저장
5. Order_Item_Options 테이블에 옵션 저장
6. 메뉴 재고 차감

**응답 예시 (201 Created):**
```json
{
  "success": true,
  "message": "주문이 완료되었습니다.",
  "data": {
    "order_id": 1,
    "order_datetime": "2025-01-09T13:30:00Z",
    "total_price": 9000,
    "status": "pending",
    "items": [
      {
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "unit_price": 4500,
        "subtotal": 9000,
        "options": ["샷 추가"]
      }
    ]
  }
}
```

**에러 응답 (400 Bad Request - 재고 부족):**
```json
{
  "success": false,
  "error": "아메리카노(ICE)의 재고가 부족합니다. (남은 재고: 1개)"
}
```

**에러 응답 (400 Bad Request - 유효성 검증 실패):**
```json
{
  "success": false,
  "error": "주문 항목이 비어있습니다."
}
```

**2. 전체 주문 조회**
```
GET /api/orders
```
**설명:** 모든 주문 목록을 최신순으로 조회 (관리자 기능)

**쿼리 파라미터 (선택):**
- `status` (STRING): 주문 상태로 필터링 (pending, preparing, completed)
- `limit` (INT): 조회할 주문 개수 (기본값: 50)
- `offset` (INT): 페이지네이션 오프셋 (기본값: 0)

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_datetime": "2025-01-09T13:30:00Z",
      "total_price": 9000,
      "status": "pending",
      "items": [
        {
          "menu_name": "아메리카노(ICE)",
          "quantity": 2,
          "unit_price": 4500,
          "options": ["샷 추가"]
        }
      ]
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

**3. 특정 주문 조회**
```
GET /api/orders/:id
```
**설명:** 주문 ID로 특정 주문의 상세 정보 조회

**경로 파라미터:**
- `id` (INT, 필수): 주문 ID

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_datetime": "2025-01-09T13:30:00Z",
    "total_price": 9000,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "menu_id": 1,
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "unit_price": 4500,
        "subtotal": 9000,
        "options": [
          {
            "id": 1,
            "name": "샷 추가",
            "price": 500
          }
        ]
      }
    ]
  }
}
```

**에러 응답 (404 Not Found):**
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

**4. 주문 상태 변경**
```
PATCH /api/orders/:id/status
```
**설명:** 주문 상태를 변경 (관리자 기능)

**경로 파라미터:**
- `id` (INT, 필수): 주문 ID

**요청 본문:**
```json
{
  "status": "preparing"
}
```

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "message": "주문 상태가 변경되었습니다.",
  "data": {
    "id": 1,
    "status": "preparing",
    "updated_at": "2025-01-09T13:35:00Z"
  }
}
```

**에러 응답 (400 Bad Request):**
```json
{
  "success": false,
  "error": "유효하지 않은 상태입니다. (pending, preparing, completed 중 하나여야 합니다)"
}
```

#### 5.4.3 통계 관련 API

**주문 통계 조회**
```
GET /api/orders/stats
```
**설명:** 주문 상태별 통계 정보 조회 (관리자 대시보드용)

**응답 예시 (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 3,
    "preparing": 2,
    "completed": 5
  }
}
```

### 5.5 사용자 흐름에 따른 API 호출 시퀀스

#### 5.5.1 주문하기 화면 진입
```
1. 클라이언트 → 서버: GET /api/menus
2. 서버 → 클라이언트: 메뉴 목록 (재고 포함)
3. 클라이언트: 메뉴 카드 렌더링 + 재고 표시
```

#### 5.5.2 주문 프로세스
```
1. 사용자: 메뉴 선택 + 옵션 선택 → 장바구니 담기 (클라이언트 상태)
2. 사용자: "주문하기" 버튼 클릭
3. 클라이언트 → 서버: POST /api/orders (주문 데이터)
4. 서버: 
   - 재고 확인
   - 재고 부족 시 → 에러 반환
   - 재고 충분 시 → Orders 테이블에 저장
                   → Order_Items, Order_Item_Options 저장
                   → Menus 테이블의 inventory 차감
5. 서버 → 클라이언트: 주문 완료 (주문 ID 포함)
6. 클라이언트: 성공 메시지 표시 + 장바구니 초기화
```

#### 5.5.3 관리자 화면 진입
```
1. 클라이언트 → 서버: GET /api/orders (전체 주문 조회)
2. 서버 → 클라이언트: 주문 목록
3. 클라이언트 → 서버: GET /api/orders/stats
4. 서버 → 클라이언트: 통계 데이터
5. 클라이언트 → 서버: GET /api/menus
6. 서버 → 클라이언트: 메뉴 목록 (재고 포함)
7. 클라이언트: 대시보드, 재고 현황, 주문 현황 렌더링
```

#### 5.5.4 주문 상태 변경
```
1. 관리자: "제조 시작" 버튼 클릭
2. 클라이언트 → 서버: PATCH /api/orders/:id/status (status: "preparing")
3. 서버: Orders 테이블의 status 업데이트
4. 서버 → 클라이언트: 변경된 주문 정보
5. 클라이언트: UI 업데이트 (버튼 텍스트 변경, 대시보드 통계 재조회)
```

#### 5.5.5 재고 수정
```
1. 관리자: 재고 [+] 또는 [-] 버튼 클릭
2. 클라이언트 → 서버: PATCH /api/menus/:id/inventory
3. 서버: Menus 테이블의 inventory 업데이트
4. 서버 → 클라이언트: 변경된 메뉴 정보
5. 클라이언트: 재고 표시 업데이트
```

### 5.6 에러 처리

#### 5.6.1 HTTP 상태 코드
- `200 OK`: 성공적인 조회/수정
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청 (유효성 검증 실패)
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류

#### 5.6.2 공통 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지",
  "details": "상세한 에러 정보 (선택적)"
}
```

#### 5.6.3 주요 에러 케이스
1. **재고 부족**: 주문 시 재고가 부족한 경우
2. **존재하지 않는 리소스**: 잘못된 ID로 조회 시
3. **유효성 검증 실패**: 필수 필드 누락, 타입 불일치 등
4. **데이터베이스 오류**: 쿼리 실행 실패
5. **동시성 문제**: 같은 재고를 동시에 수정

### 5.7 데이터 검증 규칙

#### 5.7.1 주문 생성 시
- `items` 배열이 비어있지 않아야 함
- 각 `menu_id`는 유효한 메뉴 ID여야 함
- `quantity`는 1 이상이어야 함
- 선택한 `options`는 해당 메뉴의 유효한 옵션이어야 함

#### 5.7.2 재고 수정 시
- `inventory`는 0 이상의 정수여야 함

#### 5.7.3 주문 상태 변경 시
- `status`는 'pending', 'preparing', 'completed' 중 하나여야 함

### 5.8 성능 및 최적화

#### 5.8.1 인덱싱
- `Menus.name`: 메뉴 검색 최적화
- `Orders.order_datetime`: 시간순 정렬 최적화
- `Orders.status`: 상태별 필터링 최적화
- `Order_Items.order_id`: 주문 항목 조회 최적화

#### 5.8.2 트랜잭션
- 주문 생성 시 트랜잭션 사용 (원자성 보장):
  - Orders 생성
  - Order_Items 생성
  - Order_Item_Options 생성
  - Menus 재고 차감
  - 하나라도 실패 시 전체 롤백

#### 5.8.3 동시성 제어
- 재고 수정 시 낙관적 잠금(Optimistic Locking) 또는 비관적 잠금(Pessimistic Locking) 사용
- 주문 생성 시 재고 확인과 차감을 트랜잭션 내에서 처리

### 5.9 보안 고려사항

- SQL Injection 방지: Prepared Statement 사용
- XSS 방지: 입력 데이터 이스케이프 처리
- CORS 설정: 프론트엔드 도메인만 허용
- Rate Limiting: API 호출 빈도 제한
- Input Validation: 모든 입력 데이터 검증

### 5.10 개발 우선순위

**Phase 1 (핵심 기능):**
1. 메뉴 조회 API
2. 주문 생성 API (재고 차감 포함)
3. 주문 조회 API
4. 주문 상태 변경 API

**Phase 2 (관리 기능):**
5. 재고 수정 API
6. 통계 API
7. 페이지네이션

**Phase 3 (최적화):**
8. 에러 처리 고도화
9. 트랜잭션 및 동시성 제어
10. 성능 최적화


