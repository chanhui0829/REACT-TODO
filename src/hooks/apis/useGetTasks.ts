"use client";

// ======================
// 📦 External Libraries
// ======================
import { useAtom } from "jotai";
import { toast } from "sonner";

// ======================
// 🧭 Supabase & Store
// ======================
import { supabase } from "@/utils/supabase/client";
import { tasksAtom } from "@/store/atoms";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useGetTasks
 * Supabase에서 모든 Task 목록을 조회하고 전역 상태(tasksAtom)에 저장하는 커스텀 훅
 */
export function useGetTasks() {
  const [tasks, setTasks] = useAtom(tasksAtom);

  /**
   * Supabase로부터 모든 Task 데이터를 가져옵니다.
   */
  const getTasks = async (): Promise<void> => {
    try {
      const { data, error, status } = await supabase.from("tasks").select("*");

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 200 && data) {
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  return { getTasks, tasks };
}
