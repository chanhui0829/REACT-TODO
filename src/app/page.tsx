"use client";

// Hooks
import { useCreateTask } from "@/hooks/apis";

// UI 컴포넌트
import { Button } from "@/components/ui";
import { CalendarPlus } from "lucide-react";

function InitPage() {
  // Task 생성
  const handleCreateTask = useCreateTask();

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* 중앙 카드 */}
      <div className="w-full max-w-md  flex flex-col items-center justify-center text-center bg-zinc-50 border border-zinc-200 rounded-xl !p-10 mx-4 gap-2 shadow-sm">
        {/* 상단 아이콘 */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F4FD] mb-4">
          <CalendarPlus className="w-8 h-8 text-[#58A5E4]" />
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-semibold text-neutral-800">
          아직 등록된 일정이 없습니다.
        </h2>

        {/* 설명 */}
        <p className="text-sm text-neutral-500 mt-2">
          새로운 일정을 추가하고 나만의 TO DO LIST를 관리해보세요.
        </p>

        {/* 사용방법 */}
        <ul className="space-y-1 text-sm text-neutral-600 !mb-4">
          <li>① 새로운 일정 생성하기</li>
          <li>② 콘텐츠 추가 및 관리</li>
        </ul>

        {/* 일정 추가 버튼 */}
        <Button
          className="mt-8 text-[#58A5E4] bg-white border border-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md w-[180px]"
          onClick={handleCreateTask}
        >
          <CalendarPlus className="mr-2 w-4 h-4" />
          일정 추가
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
