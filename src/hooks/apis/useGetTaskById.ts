"use client";

import { taskAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

function useGetTaskById(taskId: number) {
  const [task, setTask] = useAtom(taskAtom);
  const getTaskById = async () => {
    try {
      const { data, status, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .order("created_at", { ascending: false }); // 🔹 최신순 정렬

      if (data && status === 200) setTask(data[0]);

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

  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);

  return { task, getTaskById };
}

export { useGetTaskById };
