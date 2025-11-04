"use client";
// Hooks
import { useGetTasks, useCreateTask, useSearch } from "@/hooks/apis";
//UI Component
import { Button, SearchBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Task } from "@/types";
import { useAtom } from "jotai";
import { isDirtyAtom, onSaveAtom } from "@/store/atoms";
import { ConfirmNavigationDialog } from "@/components/ui/dialog/confirmnavigationdialog";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { CalendarPlus } from "lucide-react";

function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();
  const { search } = useSearch();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isDirty] = useAtom(isDirtyAtom);
  const [onSave] = useAtom(onSaveAtom);

  const [openDialog, setOpenDialog] = useState(false);
  const [nextTaskId, setNextTaskId] = useState<number | null>(null);

  // ✅ 동일한 task 클릭 시에는 아무 동작 안 함
  const handleTaskClick = (taskId: number) => {
    if (taskId === Number(id)) return;

    if (isDirty) {
      setNextTaskId(taskId);
      setOpenDialog(true);
    } else {
      router.push(`/task/${taskId}`);
    }
  };

  // ✅ 저장 후 이동 로직 (필수값 미입력 시 이동 금지)
  const handleConfirmSave = async () => {
    if (onSave) {
      const success = await onSave();
      if (!success) {
        // ❌ 필수값 누락 등으로 실패 시 이동하지 않음
        return;
      }
    }
    setOpenDialog(false);
    if (nextTaskId) router.push(`/task/${nextTaskId}`);
  };

  // ✅ 저장 안 하고 이동 (현재 Task 삭제)
  const handleSkipSave = async () => {
    try {
      if (id) {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) {
          toast("삭제 중 오류가 발생했습니다.", {
            description: `Supabase 오류: ${error.message}`,
          });
          return;
        }
        toast("현재 TASK가 삭제되었습니다.", {
          description: "저장하지 않은 작업은 복구할 수 없습니다.",
        });
      }

      setOpenDialog(false);
      if (nextTaskId) router.push(`/task/${nextTaskId}`);
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "삭제 요청을 처리하지 못했습니다.",
      });
    }
  };

  // ✅ Task 생성
  const handleCreateTask = useCreateTask();

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search(searchTerm);
    }
  };

  // ✅ getTasks는 컴포넌트 최초 렌더링 시 한번만 호출되어야 하므로 useEffect
  useEffect(() => {
    getTasks();
  }, [id]);

  // ✅ 최신순으로 정렬된 배열 생성 (created_at 기준)
  const sortedTasks = [...tasks].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <aside className="page__aside">
        <div className="flex flex-col h-full gap-4">
          {/* 검색창 UI */}
          <SearchBar
            placeholder="입력 후 Enter를 눌러주세요."
            onChange={handleSearchTermChange}
            onKeyDown={handleSearch}
          />

          {/* Add New Page 버튼 UI */}
          <Button
            className="text-[#58A5E4] bg-white border border-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md"
            onClick={handleCreateTask}
          >
            <CalendarPlus /> 일정 추가
          </Button>

          {/* Task 목록 UI */}
          <div className="flex-1 mt-4 overflow-y-auto pr-1 pb-4 box-border">
            <small className="text-sm font-medium leading-none text-[#a6a6a6] ">
              <span className="text-neutral-700">Chan님</span>의 TASKs
            </small>

            <ul className="flex flex-col gap-0.5 !mt-2">
              {sortedTasks.length === 0 ? (
                <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                  <div className="h-[6px] w-[6px] rounded-full bg-neutral-400 "></div>
                  등록된 Task가 없습니다.
                </li>
              ) : (
                sortedTasks.map((task: Task) => {
                  return (
                    <li
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className={`${
                        task.id === Number(id) && "!bg-[#f5f5f5]"
                      } min-h-9 flex items-center !gap-2 !py-2 !px-[10px] rounded-sm text-sm cursor-pointer `}
                    >
                      <div
                        className={`${
                          task.id === Number(id)
                            ? "bg-[#00f38d]"
                            : "bg-neutral-400"
                        } h-[6px] w-[6px] rounded-full `}
                      ></div>
                      <span
                        className={`${
                          task.id !== Number(id)
                            ? `text-neutral-400`
                            : `text-neutral-800`
                        }`}
                      >
                        {task.title ? task.title : "등록된 제목이 없습니다."}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </aside>

      <ConfirmNavigationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirmSave={handleConfirmSave}
        onSkipSave={handleSkipSave}
      />
    </>
  );
}

export { SideNavigation };
