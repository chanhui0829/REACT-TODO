"use client";

// ======================
// 📦 External Libraries
// ======================
import { useAtom } from "jotai";
import { toast } from "sonner";

// ======================
// 🧭 Supabase & Store & Hooks
// ======================
import { supabase } from "@/utils/supabase/client";
import { taskAtom } from "@/store/atoms";
import { useGetTaskById } from "./useGetTaskById";

// ======================
// 📘 Types
// ======================
import type { Board } from "@/types";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useDeleteBoard
 * 특정 Task 내에서 지정한 Board를 삭제하는 커스텀 훅
 * @param taskId - 삭제할 Board가 속한 Task의 ID
 * @param boardId - 삭제할 Board의 고유 ID
 */
export function useDeleteBoard(taskId: number, boardId: string) {
  const { getTaskById } = useGetTaskById(taskId);
  const [task] = useAtom(taskAtom);

  /**
   * Supabase의 tasks 테이블에서 특정 Board를 삭제합니다.
   */
  const deleteBoard = async (): Promise<void> => {
    try {
      const filteredBoards = task?.boards.filter(
        (board: Board) => board.id !== boardId
      );

      const { status, error } = await supabase
        .from("tasks")
        .update({ boards: filteredBoards })
        .eq("id", taskId);

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 204) {
        toast("선택한 TODO-BOARD가 삭제되었습니다 ✅", {
          description: "새로운 할 일이 생기면 TODO-BOARD를 생성해주세요.",
        });

        // 🔄 Task 데이터 갱신
        await getTaskById();
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return deleteBoard;
}
