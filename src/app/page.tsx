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
        <span className=" text-2xl font-semibold tracking-tight">
          How to Start
        </span>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">
            1. Create a page
          </small>
          <small className="text-sm font-normal leading-none">
            2. Add boards to page
          </small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          className="text-[#58A5E4] bg-transparent border border-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md w-[180px]"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
