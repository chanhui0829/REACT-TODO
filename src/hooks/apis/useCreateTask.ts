"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { isDirtyAtom } from "@/store/atoms";

function useCreateTask() {
  const router = useRouter();
  const setIsDirty = useSetAtom(isDirtyAtom);

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

      if (error) throw error;

      if (data && status === 201) {
        toast("새로운 일정을 추가하였습니다.", {
          description: "나만의 TODO LIST를 완성해보세요!",
        });

        // ✅ 새로 생성된 Todo는 '저장되지 않은 변경 상태'로 표시
        setIsDirty(true);

        router.push(`/task/${data[0].id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return createTask;
}

export { useCreateTask };
