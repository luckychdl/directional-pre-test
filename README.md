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
NEXT_PUBLIC_API_BASE_URL='https://fe-hiring-rest-api.vercel.app'
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

📊 데이터 시각화 (Chart)

본 프로젝트는 ECharts 기반 데이터 시각화 과제를 포함하고 있으며,  
다양한 차트 유형과 인터랙션 요구사항을 충실히 구현하였습니다.

🧱 사용 라이브러리  
 • echarts  
 • echarts-for-react  
 • React + TypeScript 기반 구성  
 • React Query로 데이터 패칭 관리

⸻

1️⃣ 바 차트 / 도넛 차트

사용 API  
 • /mock/weekly-mood-trend  
 • /mock/popular-snack-brands

구현 차트  
 • 바 차트 (Bar Chart)  
 • 도넛 차트 (Donut Chart)

구현 내용  
 • 데이터별 차트 2종씩 구현 (총 4개 차트)  
 • 범례(Legend) 표시  
 • 범례 클릭 시 데이터 보이기 / 숨기기  
 • 컬러 피커를 통한 시리즈 색상 변경  
 • 도넛 차트의 경우 주간 데이터 합산 후 시각화

⸻

2️⃣ 스택형 바 차트 / 스택형 면적 차트

사용 API  
 • /mock/weekly-mood-trend  
 • /mock/weekly-workout-trend

구현 차트  
 • 스택형 바 차트 (Stacked Bar)  
 • 스택형 면적 차트 (Stacked Area)

구현 내용  
 • X축: week  
 • Y축: 백분율(%)  
 • 항목별 누적(Stacked) 표현  
 • Mood: happy, tired, stressed  
 • Workout: running, cycling, stretching  
 • 데이터별 차트 2종씩 구현 (총 4개 차트)  
 • 범례 표시 및 시리즈 토글 지원

⸻

3️⃣ 멀티라인 차트 (Dual Y-Axis)

사용 API  
 • /mock/coffee-consumption  
 • /mock/snack-impact

구현 차트  
 • 멀티라인 차트 (Multi-line Chart)  
 • 듀얼 Y축 (Left / Right)

구현 내용  
 • X축  
 • 커피 섭취량(잔/일)  
 • 스낵 수  
 • 왼쪽 Y축  
 • 버그 수(bugs)  
 • 회의 불참(meetingsMissed)  
 • 오른쪽 Y축  
 • 생산성(productivity)  
 • 사기(morale)  
 • 팀/부서별 2개의 라인  
 • 실선 + 원형 마커: 버그 수 / 회의 불참  
 • 점선 + 사각 마커: 생산성 / 사기  
 • 동일 팀(부서)은 동일 색상 유지  
 • 컬러 피커를 통한 팀별 색상 변경  
 • 데이터 포인트 호버 시  
 • 해당 팀의 데이터만 Tooltip에 표시

⸻

4️⃣ 공통 차트 인터랙션  
 • Legend(범례) 필수 표시  
 • 범례 클릭으로 데이터 표시/숨김  
 • 색상 변경 기능 제공  
 • Hover 기반 Tooltip 커스터마이징  
 • Chart 타입별 컴포넌트 분리  
 • BarChart  
 • DonutChart  
 • StackBarChart  
 • AreaChart  
 • MultiLineChart

⸻

📌 차트 설계 포인트  
 • React Query를 활용한 데이터 패칭 및 캐싱  
 • ECharts 옵션을 useMemo로 최적화  
 • 시리즈 색상 state 분리로 차트 간 데이터 충돌 방지  
 • Tooltip을 커스터마이징하여 호버된 팀 데이터만 표시  
 • 실무에서 바로 활용 가능한 데이터 시각화 UX 구성  
📄 기타

본 프로젝트는 과제 테스트 목적으로 제작되었습니다.  
보안 목적이 아닌 평가 편의를 위해 환경 변수를 레포지토리에 포함하였습니다.
