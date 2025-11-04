#  📑 REACT-TODO LIST

## ✅ 프로젝트 개요
- **프로젝트명**: REACT-TODO LIST
- **설명**: `React + Next.js + Supabase + Jotai + shadcn UI`를 이용해 만든 개인용 TODO 관리 애플리케이션입니다.  
  - 하나의 TASK 안에 여러 BOARD(하위 작업)를 생성하고 진행 상태를 관리할 수 있습니다.  
  - 시작일/종료일을 설정하고, 진행률(Progress bar)도 볼 수 있습니다.  
  - TASK 생성 시 자동 저장 확인, 이동 시 경고 모달 등 사용성 고려한 UX가 포함되어 있습니다.
  - 반응형 UI를 통해 모바일 환경에서도 이용 가능합니다.

## 🏗 기술 스택
- 프레임워크: [Next.js](https://nextjs.org/)  
- 데이터베이스/백엔드: [Supabase](https://supabase.com/)  
- 상태관리: [Jotai](https://jotai.org/)  
- UI 컴포넌트: [shadcn UI](https://ui.shadcn.com/) + Lucide Icons  
- 날짜 처리: [date-fns](https://date-fns.org/)  
- 기타 유틸: nanoid 등

## 📂 폴더 구조
- /app – Next.js 앱 루트 (혹은 pages)
- /components – UI 컴포넌트 모음
- /hooks/apis – API 통신 훅들 (Supabase + 커스텀 로직)
- /store – Jotai atom 정의
- /types – 타입 정의 파일 (Task, Board 등)
- /utils – 유틸 함수, Supabase 클라이언트 설정 등
- /styles – 전역 및 모듈 CSS/SCSS


## 🔧 주요 기능
- TASK 생성, 제목/시작일/종료일 설정  
- BOARD(하위 작업) 추가 및 완료 처리  
- 진행률 표시 (Progress bar)  
- TASK 삭제 기능  
- TASK 목록 사이드바: 검색 및 이동  
- TASK 생성/이동 시 저장 여부 경고 모달  
- 날짜 선택 UI: `LabelDatePicker` + `Calendar` 컴포넌트  
- Supabase 사용으로 실시간 DB 저장
- 화면 크기에 따라 레이아웃 및 인터랙션이 유연하게 변경됨 (반응형 UI)

## 📌 설치 & 실행
```bash
git clone https://github.com/chanhui0829/REACT-TODO.git
cd REACT-TODO
npm install   # 또는 yarn
npm run dev   # 개발 모드로 실행 (http://localhost:3000)
```
## 🛠 개선사항 및 로드맵
```
✅ 최신생성순 정렬: TASK 목록을 최신 생성순으로 보여주기

✅ 입력 변경 시 ‘저장 여부’ 상태 관리 개선

✅ 날짜 선택 UI 자동 닫힘 구현

📌 향후 추가할 기능:

태그/카테고리 기능 추가

드래그 앤 드롭으로 BOARD 순서 변경

알림 기능 (마감일 알림)


테스트 코드 (Jest, React Testing Library) 추가
```
## 🧾 개발자 윤찬희

