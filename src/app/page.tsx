"use client";

//Hooks
import { useCreateTask } from "@/hooks/apis";
//UI 컴포넌트
import { Button } from "@/components/ui";

function InitPage() {
  //Task 생성
  const handleCreateTask = useCreateTask();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 mb-6">
        <span className=" text-2xl font-semibold tracking-tight">사용법</span>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">
            1. 새로운 TODO 생성
          </small>
          <small className="text-sm font-normal leading-none">
            2. 일정 추가
          </small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          className="text-[#58A5E4] bg-transparent border border-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md w-[180px]"
          onClick={handleCreateTask}
        >
          새로운 Todo 만들기
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
