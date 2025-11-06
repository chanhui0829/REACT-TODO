"use client";

// ======================
// 📦 External Libraries
// ======================
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ======================
// 🧭 Supabase
// ======================
import { supabase } from "@/utils/supabase/client";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useDeleteTask
 * 특정 Task를 삭제하고 메인 페이지로 이동하는 커스텀 훅
 */
export function useDeleteTask() {
  const router = useRouter();

  /**
   * 지정한 Task를 Supabase에서 삭제합니다.
   * @param taskId - 삭제할 Task의 ID
   */
  const deleteTask = async (taskId: number): Promise<void> => {
    try {
      const { status, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 204) {
        toast("선택한 TASK가 삭제되었습니다 ✅", {
          description: "새로운 TASK가 생기면 언제든 추가해주세요.",
        });

        // 🔄 메인 페이지로 이동
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return { deleteTask };
}
