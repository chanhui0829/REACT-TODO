"use client";

// ======================
// 📦 External
// ======================
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

// ======================
// 🧭 Hooks & Utils
// ======================
import { useGetTasks, useCreateTask, useSearch } from "@/hooks/apis";
import { supabase } from "@/utils/supabase/client";

// ======================
// 🧱 UI Components
// ======================
import { Button, SearchBar } from "@/components/ui";
import { ConfirmNavigationDialog } from "@/components/ui/dialog/confirmnavigationdialog";

// ======================
// 📘 Types & Store
// ======================
import type { Task } from "@/types";
import { isDirtyAtom, onSaveAtom } from "@/store/atoms";

// ======================
// 🧩 Component
// ======================
function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();

  // hooks
  const { tasks, getTasks } = useGetTasks();
  const { search } = useSearch();
  const handleCreateTask = useCreateTask();

  // jotai
  const [isDirty] = useAtom(isDirtyAtom);
  const [onSave] = useAtom(onSaveAtom);

  // local state
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [nextTaskId, setNextTaskId] = useState<number | null>(null);

  // ======================
  // 🔍 검색 기능
  // ======================
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search(searchTerm);
  };

  // ======================
  // 🧭 페이지 이동 제어
  // ======================
  const handleTaskClick = (taskId: number) => {
    if (taskId === Number(id)) return; // 같은 Task 클릭 시 무시

    if (isDirty) {
      setNextTaskId(taskId);
      setOpenDialog(true);
    } else {
      router.push(`/task/${taskId}`);
    }
  };

  // ✅ 저장 후 이동
  const handleConfirmSave = async () => {
    if (onSave) {
      const success = await onSave();
      if (!success) return;
    }

    setOpenDialog(false);
    if (nextTaskId) router.push(`/task/${nextTaskId}`);
  };

  // ❌ 저장 없이 이동 (현재 Task 삭제)
  const handleSkipSave = async () => {
    try {
      if (id) {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error)
          return toast("삭제 실패", {
            description: `Supabase 오류: ${error.message}`,
          });

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

  // ======================
  // 🔁 Task Fetch
  // ======================
  useEffect(() => {
    getTasks();
  }, [id]);

  // 최신순 정렬
  const sortedTasks = [...tasks].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // ======================
  // 🧩 Render
  // ======================
  return (
    <>
      <aside className="page__aside">
        <div className="flex h-full flex-col gap-4">
          {/* 검색창 */}
          <SearchBar
            placeholder="입력 후 Enter를 눌러주세요."
            onChange={handleSearchTermChange}
            onKeyDown={handleSearch}
          />

          {/* 새 일정 추가 버튼 */}
          <Button
            onClick={handleCreateTask}
            className="border border-[#58A5E4] bg-white text-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md"
          >
            <CalendarPlus />
            일정 추가
          </Button>

          {/* Task 목록 */}
          <div className="!mt-2 flex-1 overflow-y-auto pr-1 pb-4 box-border">
            <small className="text-sm font-medium leading-none text-[#a6a6a6]">
              <span className="text-neutral-700">Chan님</span>의 TASKs
            </small>

            <ul className="!mt-2 flex flex-col gap-0.5">
              {sortedTasks.length === 0 ? (
                <li className="flex min-h-9 items-center gap-2 rounded-sm bg-[#f5f5f5] px-[10px] py-2 text-sm text-neutral-400">
                  <div className="h-[6px] w-[6px] rounded-full bg-neutral-400" />
                  등록된 Task가 없습니다.
                </li>
              ) : (
                sortedTasks.map((task: Task) => {
                  const isActive = task.id === Number(id);
                  return (
                    <li
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-sm px-[10px] py-2 text-sm transition-all ${
                        isActive ? "bg-[#f5f5f5]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`h-[6px] w-[6px] rounded-full ${
                          isActive ? "bg-[#00f38d]" : "bg-neutral-400"
                        }`}
                      />
                      <span
                        className={
                          isActive ? "text-neutral-800" : "text-neutral-400"
                        }
                      >
                        {task.title || "등록된 제목이 없습니다."}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </aside>

      {/* 이동 시 확인 다이얼로그 */}
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
