"use client";

// ======================
// 📦 External Libraries
// ======================
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
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
 * 📌 useSearch
 * Supabase에서 title 기준으로 Task를 검색하고 전역 상태(tasksAtom)에 반영하는 커스텀 훅
 */
export function useSearch() {
  const [, setTasks] = useAtom(tasksAtom);
  const router = useRouter();
  const { id } = useParams();

  /**
   * 검색어를 기반으로 Task를 조회합니다.
   * @param searchTerm - 검색할 문자열
   */
  const search = async (searchTerm: string): Promise<void> => {
    try {
      // 🔹 검색어가 비어있으면 원래 Task 페이지로 이동
      if (!searchTerm.trim()) {
        router.push(`/task/${id}/`);
        return;
      }

      const { data, error, status } = await supabase
        .from("tasks")
        .select("*")
        .like("title", `%${searchTerm}%`);

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 200 && data) {
        setTasks(data); // 🔄 Jotai 상태 업데이트
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return { search };
}
