"use client";

// ======================
// 📦 External Libraries
// ======================
import { useEffect } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";

// ======================
// 🧭 Supabase & Store
// ======================
import { supabase } from "@/utils/supabase/client";
import { taskAtom } from "@/store/atoms";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useGetTaskById
 * 특정 Task ID로 Supabase에서 데이터를 조회하고
 * 전역 상태(taskAtom)에 저장하는 커스텀 훅
 *
 * @param taskId - 조회할 Task의 고유 ID
 */
export function useGetTaskById(taskId: number) {
  const [task, setTask] = useAtom(taskAtom);

  /**
   * Supabase에서 Task 데이터를 가져옵니다.
   */
  const getTaskById = async (): Promise<void> => {
    try {
      const { data, error, status } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .order("created_at", { ascending: false }); // 🔹 최신순 정렬

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 200 && data?.length) {
        setTask(data[0]);
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  // 🔄 taskId 변경 시 자동으로 데이터 fetch
  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);

  return { task, getTaskById };
}
