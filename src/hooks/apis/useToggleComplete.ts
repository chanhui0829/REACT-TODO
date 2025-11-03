"use client";

import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";
import { toast } from "sonner";

function useToggleComplete() {
  const toggleComplete = async (
    taskId: number,
    column: string,
    newValue: Board[] | undefined
  ) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ [column]: newValue })
        .eq("id", taskId);

      if (error) throw error;

      toast("상태가 변경되었습니다 ✅", {
        description: "콘텐츠 완료 상태가 업데이트되었습니다.",
      });
    } catch (error) {
      console.error(error);
      toast("업데이트 실패 ❌", {
        description: "네트워크 오류 또는 서버 문제입니다.",
      });
    }
  };

  return toggleComplete;
}

export { useToggleComplete };
