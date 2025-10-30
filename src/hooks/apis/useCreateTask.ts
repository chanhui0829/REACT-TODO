"use client";
import { useRouter } from "next/navigation";

import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

function useCreateTask() {
  const router = useRouter();
  const createTask = async () => {
    try {
      const { data, error, status } = await supabase
        .from("tasks")
        .insert([
          {
            title: "",
            start_date: null,
            end_date: null,
            boards: [],
          },
        ])
        .select();

      if (data && status === 201) {
        // 올바르게 tasks 테이블에 ROw 데이터 한 줄이 올바르게 생성이되면 실행
        toast("새로운 TASK가 생성이 되었습니다.", {
          description: "나만의 TODO BOARD를 생성해보세요!",
        });
        router.push(`/task/${data[0].id}`);
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
  return createTask;
}

export { useCreateTask };
