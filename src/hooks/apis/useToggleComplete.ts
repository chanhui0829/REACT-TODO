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
 * 📌 useToggleComplete
 * 특정 Task 내 Board의 완료 상태를 업데이트하는 커스텀 훅
 */
export function useToggleComplete() {
  /**
   * Supabase를 통해 tasks 테이블 내 특정 컬럼(column)의 값을 업데이트합니다.
   * @param taskId - 업데이트할 Task의 ID
   * @param column - 업데이트할 컬럼명 (예: 'boards')
   * @param newValue - 수정된 Board 배열 값
   */
  const toggleComplete = async (
    taskId: number,
    column: string,
    newValue: Board[] | undefined
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ [column]: newValue })
        .eq("id", taskId);

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      toast("상태가 변경되었습니다 ✅", {
        description: "콘텐츠 완료 상태가 성공적으로 업데이트되었습니다.",
      });
    } catch (err) {
      console.error(err);
      toast("업데이트 실패 ❌", {
        description: "네트워크 오류 또는 서버 문제입니다. 다시 시도해주세요.",
      });
    }
  };

  return toggleComplete;
}
