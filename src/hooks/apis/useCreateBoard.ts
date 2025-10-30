"use client";

import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";
import { toast } from "sonner";

function useCreateBoard() {
  const createBoard = async (
    taskId: number,
    column: string,
    newValue: Board[] | undefined
  ) => {
    try {
      const { data, status, error } = await supabase
        .from("tasks")
        .update({
          [column]: newValue,
        })
        .eq("id", taskId)
        .select();

      if (data && status === 200) {
        // 올바르게 tasks 테이블에 ROw 데이터 한 줄이 올바르게 생성이되면 실행
        toast("새로운 TODO-BOARD를 생성하였습니다", {
          description: "나만의 TODO-BOARD를 완성해보세요!!",
        });
      }

      if (error) {
        toast("에러가 발생했습니다.", {
          description: `Supabase 오류: ${error.message} || 알 수 없는 오류`,
        });
      }
    } catch (error) {
      console.log(error);
      toast("네트워크 오류.", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };
  return createBoard;
}

export { useCreateBoard };
