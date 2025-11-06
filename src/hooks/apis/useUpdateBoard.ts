"use client";

// ======================
// 📦 External Libraries
// ======================
import { toast } from "sonner";

// ======================
// 🧭 Supabase & Types
// ======================
import { supabase } from "@/utils/supabase/client";
import type { Board } from "@/types";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useUpdateBoard
 * 특정 Task 내 컬럼(column)에 연결된 Board 배열을 업데이트하는 커스텀 훅
 */
export function useUpdateBoard() {
  /**
   * Supabase를 통해 tasks 테이블의 특정 컬럼을 업데이트합니다.
   * @param taskId - 업데이트할 Task의 ID
   * @param column - 수정할 컬럼명 (예: 'boards')
   * @param newValue - 새로운 Board 배열 값
   */
  const updateBoard = async (
    taskId: number,
    column: string,
    newValue: Board[] | undefined
  ): Promise<void> => {
    try {
      const { data, error, status } = await supabase
        .from("tasks")
        .update({ [column]: newValue })
        .eq("id", taskId)
        .select();

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 200 && data?.length) {
        toast("콘텐츠가 변경되었습니다 ✅", {
          description: "콘텐츠 업데이트가 완료되었습니다!",
        });
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return updateBoard;
}
