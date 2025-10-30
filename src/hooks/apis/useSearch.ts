"use client";

import { tasksAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function useSearch() {
  const [, setTasks] = useAtom(tasksAtom);
  const router = useRouter();
  const { id } = useParams();

  const search = async (searchTerm: string) => {
    try {
      if (searchTerm === "") router.push(`/task/${id}/`);

      const { data, status, error } = await supabase
        .from("tasks")
        .select("*")
        .like("title", `%${searchTerm}%`);

      if (data && status === 200) setTasks(data); //Jotai에 tasksAtom 상태를 업데이트

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
  return { search };
}

export { useSearch };
