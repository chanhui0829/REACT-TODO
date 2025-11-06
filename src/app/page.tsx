"use client";

// ======================
// 📦 Hooks
// ======================
import { useCreateTask } from "@/hooks/apis";

// ======================
// 🧱 UI Components
// ======================
import { Button } from "@/components/ui";
import { CalendarPlus } from "lucide-react";

// ======================
// 🧩 Component
// ======================
function InitPage() {
  const handleCreateTask = useCreateTask();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="!mx-4 flex w-full max-w-md flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 !p-10 text-center shadow-sm gap-2 ">
        {/* 상단 아이콘 */}
        <div className="!mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F4FD]">
          <CalendarPlus className="h-8 w-8 text-[#58A5E4]" />
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-semibold text-neutral-800">
          아직 등록된 일정이 없습니다.
        </h2>

        {/* 설명 */}
        <p className="!mt-2 text-sm text-neutral-500">
          새로운 일정을 추가하고 나만의 TO DO LIST를 관리해보세요.
        </p>

        {/* 사용 방법 */}
        <ul className="!mb-4 space-y-1 text-sm text-neutral-600">
          <li>① 새로운 일정 생성하기</li>
          <li>② 콘텐츠 추가 및 관리</li>
        </ul>

        {/* 일정 추가 버튼 */}
        <Button
          onClick={handleCreateTask}
          className="w-[180px] border border-[#58A5E4] bg-white text-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          일정 추가
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
