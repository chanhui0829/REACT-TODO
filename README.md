# React-TODO Board

## ✅ 프로젝트 개요
- **프로젝트명**: React-TODO Board  
- **설명**: `React + Next.js + Supabase + Jotai + shadcn UI`를 이용해 만든 개인용 TODO 관리 애플리케이션입니다.  
  - 하나의 TASK 안에 여러 BOARD(하위 작업)를 생성하고 진행 상태를 관리할 수 있습니다.  
  - 시작일/종료일을 설정하고, 진행률(Progress bar)도 볼 수 있습니다.  
  - TASK 생성 시 자동 저장 확인, 이동 시 경고 모달 등 사용성 고려한 UX가 포함되어 있습니다.

## 🏗 기술 스택
- 프레임워크: [Next.js](https://nextjs.org/)  
- 데이터베이스/백엔드: [Supabase](https://supabase.com/)  
- 상태관리: [Jotai](https://jotai.org/)  
- UI 컴포넌트: [shadcn UI](https://ui.shadcn.com/) + Lucide Icons  
- 날짜 처리: [date-fns](https://date-fns.org/)  
- 기타 유틸: nanoid 등

## 📂 폴더 구조
/app – Next.js 앱 루트 (혹은 pages)
/components – UI 컴포넌트 모음
/hooks/apis – API 통신 훅들 (Supabase + 커스텀 로직)
/store – Jotai atom 정의
/types – 타입 정의 파일 (Task, Board 등)
/utils – 유틸 함수, Supabase 클라이언트 설정 등
/styles – 전역 및 모듈 CSS/SCSS

markdown
코드 복사

## 🔧 주요 기능
- TASK 생성, 제목/시작일/종료일 설정  
- BOARD(하위 작업) 추가 및 완료 처리  
- 진행률 표시 (Progress bar)  
- TASK 삭제 기능  
- TASK 목록 사이드바: 검색 및 이동  
- TASK 생성/이동 시 저장 여부 경고 모달  
- 날짜 선택 UI: `LabelDatePicker` + `Calendar` 컴포넌트  
- Supabase 사용으로 실시간 DB 저장

## 📌 설치 & 실행
```bash
git clone https://github.com/chanhui0829/REACT-TODO.git
cd REACT-TODO
npm install   # 또는 yarn
npm run dev   # 개발 모드로 실행 (http://localhost:3000)
🚀 배포
Next.js 앱을 Vercel, Netlify 등에 배포 가능

.env 파일에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 등 환경변수 설정 필요

Supabase 테이블 구조 (tasks, boards 등) 미리 만들어야 합니다.

🛠 개선사항 및 로드맵
✅ 최신생성순 정렬: TASK 목록을 최신 생성순으로 보여주기

✅ 입력 변경 시 ‘저장 여부’ 상태 관리 개선

✅ 날짜 선택 UI 자동 닫힘 구현

📌 향후 추가할 기능:

태그/카테고리 기능 추가

드래그 앤 드롭으로 BOARD 순서 변경

알림 기능 (마감일 알림)

반응형/모바일 UI 개선

테스트 코드 (Jest, React Testing Library) 추가

🧾 라이선스
MIT © 2025 Chan Hui

markdown
코드 복사

---

## 🔍 코드/구조 최적화 제안사항
프로젝트를 보진 못했지만, 그동안 주신 코드 조각 기반으로 보았을 때 **개선할 수 있는 부분들**은 다음과 같아요.

1. **타입 정의 강화**  
   - `Task` 타입에 `created_at: string` 등 DB 자동 생성 필드 포함  
   - `Board` 타입에도 시작/종료일 필드 등 명확히 정의  
   - Supabase 반환 타입을 제네릭으로 명시해 타입 안전성 높이기 (예: `.single<Task>()`)

2. **API 훅 통합 및 에러 처리를 통일화**  
   - `useGetTaskById`, `useGetTasks`, `useCreateTask` 등 훅마다 에러/로딩 처리 구조 통일  
   - 예: `useQuery` 패턴이나 `react-query` 도입도 고려

3. **상태관리 개선**  
   - `onSaveAtom`, `isDirtyAtom` 등 Jotai atom 사용 좋은데, “현재 TASK 상태(taskAtom)”도 전역으로 묶으면서 변경 흐름 깔끔히  
   - `boards`, `title`, `startDate`, `endDate` 등을 로컬 상태에만 두기보다는 atom으로 관리하면 페이지 전환 시에도 상태 유지 가능

4. **UI/UX 리팩토링**  
   - 사이드바 `tasks` 목록 정렬, 검색, 페이지 전환 흐름 매끄럽게  
   - 날짜 선택 팝오버 닫힘, 모바일 대응, 접근성(ARIA) 고려  
   - 로딩 상태 표시 (예: 데이터 fetch 중 spinner)

5. **데이터베이스 쿼리 최적화**  
   - `.select("*")` 대신 필요한 필드만 조회하여 응답 크기 줄이기  
   - 필요한 인덱스가 있는지 Supabase 테이블 검사 (`created_at`, `id` 등)

6. **보안 및 환경설정**  
   - Supabase 키는 반드시 `.env.local` 등 숨기고 GitHub에는 노출하지 않기  
   - 배포 환경에서 CORS, 인증 등의 설정 고려

7. **테스트 및 배포 설정**  
   - 중요 컴포넌트에 유닛 테스트 추가  
   - 배포 자동화 (예: GitHub Actions) 설정하면 안정성 증가

---
