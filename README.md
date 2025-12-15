# 📋 게시판 프로젝트

Cursor 기반 페이지네이션과 TanStack Table을 활용한 게시판 서비스입니다.  
게시글 CRUD, 무한 스크롤, 검색/필터/정렬, 컬럼 커스터마이징 등 **실무형 기능 구현**에 초점을 맞췄습니다.

---

## 🚀 프로젝트 실행 방법

### 1. 패키지 설치

```bash
npm install
# 또는
yarn install
```

2. 환경 변수 설정

⚠️ 본 프로젝트는 과제 테스트 목적으로 작성되어
.env 파일을 .gitignore에 포함하지 않고 레포지토리에 함께 업로드하였습니다.

루트 경로에 .env.local 파일이 포함되어 있으며,
별도의 환경 변수 설정 없이 바로 실행할 수 있습니다.

예시:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=directional-pre-test
```

3. 개발 서버 실행

```
npm run dev
# 또는
yarn dev
```

👉 브라우저에서 http://localhost:3000 접속 (필수)

🛠 사용한 기술 스택

Frontend
• Next.js 15 (App Router)
• React 18
• TypeScript
• SCSS (CSS Modules)

상태 / 데이터 관리
• @tanstack/react-query
• useQuery
• useInfiniteQuery (Cursor 기반 무한 스크롤)
• @tanstack/react-table
• 컬럼 리사이즈
• 컬럼 숨김/보임 토글

인증
• NextAuth (Credentials Provider)
• JWT 기반 인증
• Server Component에서 세션 체크 및 리다이렉트

HTTP
• Axios
• 공통 axios instance 구성
• query params 정제 로직 적용

UI / UX
• react-icons
• IntersectionObserver 기반 Infinite Scroll

✨ 주요 구현 기능 요약

🔐 인증
• 로그인 / 로그아웃
• 로그인 상태에 따른 페이지 접근 제어
• 로그인 시 /post/list 자동 이동

📝 게시판 기능
• 게시글 작성 / 조회 / 수정 / 삭제 (CRUD)
• 게시글 목록 테이블 표시

📊 게시글 목록 (Table)
• TanStack Table 기반 테이블
• 컬럼 기능
• 컬럼 너비 리사이즈
• 컬럼 숨김 / 보임 토글
• 클릭 시 게시글 상세/수정 페이지 이동

🔍 검색 / 필터 / 정렬
• 제목 + 본문 검색
• 검색 버튼 클릭 또는 Enter 시 적용
• 카테고리 필터 (NOTICE / QNA / FREE)
• 정렬
• createdAt, title
• sort 선택 시에만 order(asc/desc) 반영
• 필터/검색 변경 시 cursor 초기화 후 재조회

♾ 무한 스크롤 (Cursor 기반)
• nextCursor를 활용한 Infinite Scroll
• IntersectionObserver 사용
• 조건 변경 시 첫 페이지부터 다시 로딩

🏷 태그 입력
• 최대 5개
• 중복 자동 제거
• 태그당 최대 24자
• Enter / 콤마로 추가
• Chip UI + 삭제 기능

🚫 금칙어 필터

아래 단어가 제목 또는 본문에 포함되면 게시글 등록 불가
• 캄보디아
• 프놈펜
• 불법체류
• 텔레그램

📌 설계 포인트
• Cursor 기반 페이지네이션으로 대용량 데이터 대응
• query param 정제 로직으로 불필요한 요청 방지
• sort / order 의존 관계를 프론트에서 제어
• Server Component + Client Component 역할 분리
• 실무에서 바로 활용 가능한 테이블 UX 구성

📄 기타

본 프로젝트는 과제 테스트 목적으로 제작되었습니다.
보안 목적이 아닌 평가 편의를 위해 환경 변수를 레포지토리에 포함하였습니다.
