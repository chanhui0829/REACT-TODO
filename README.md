# 🧠 React-TODO (Next.js + Jotai)

---

## 🚀 프로젝트 개요

간결한 구조와 전역 상태 관리를 결합한 Todo 애플리케이션입니다.  
Next.js의 **App Router**를 기반으로 라우팅을 구성하고,  
**Jotai**를 이용해 작업(Task) 데이터를 전역적으로 관리합니다.

---

## ⚙️ 주요 기능

- ✨ **Todo 추가 / 삭제 / 완료 토글**
- 🔍 **전체 / 완료 / 미완료 필터링**
- 🧠 **Jotai 기반 전역 상태관리**
- 💾 **LocalStorage를 통한 데이터 지속화**
- 🌐 **Next.js App Router 라우팅 구조**
- 🎨 **TailwindCSS 기반 반응형 UI**

---

## 🧩 기술 스택

| 항목 | 사용 기술 |
|------|-------------|
| 프레임워크 | **Next.js (App Router)** |
| 프론트엔드 | **React + TypeScript** |
| 상태관리 | **Jotai** |
| 스타일링 | **TailwindCSS** |
| 빌드/배포 | **Vercel / GitHub Pages** |

---

## 💬 실행 방법

```bash
# 1️⃣ 패키지 설치
npm install

# 2️⃣ 개발 서버 실행
npm run dev

# 3️⃣ 프로덕션 빌드
npm run build
```
---

## 🧠 상태관리 구조 (Jotai)
```
// store/tasksAtom.ts
import { atom } from "jotai";
import { Task } from "@/types";

export const tasksAtom = atom<Task[]>([]);
export const taskAtom = atom<Task | null>(null);

tasksAtom : 전체 Task 리스트 전역 관리
taskAtom : 선택된 단일 Task 관리

---

## 🧱 Next.js App Router 구조
Next.js의 App Router(src/app/)는 파일 시스템 기반 라우팅을 제공합니다.

예시 구조 👇

bash
코드 복사
/app/page.tsx              → "/"
/app/about/page.tsx        → "/about"
/app/todo/[id]/page.tsx    → "/todo/:id"
특징

layout.tsx : 페이지 공통 레이아웃
page.tsx : 해당 경로의 기본 페이지
useRouter 훅을 통한 클라이언트 내비게이션

서버 컴포넌트(Server Component)와 클라이언트 컴포넌트(Client Component) 분리

---

## 🔮 개선 계획
atomWithStorage로 로컬스토리지 완전 통합

Supabase 연동 및 사용자 인증 추가

다크모드 / 반응형 UI

테스트 코드 및 CI/CD 자동화

---

📄 라이선스
MIT © 윤찬희
```
