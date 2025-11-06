"use client";

// ======================
// 📦 External Libraries
// ======================
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { toast } from "sonner";

// ======================
// 🧭 Supabase & Store
// ======================
import { supabase } from "@/utils/supabase/client";
import { isDirtyAtom, onSaveAtom } from "@/store/atoms";

// ======================
// 🧩 Hook Definition
// ======================
/**
 * 📌 useCreateTask
 * 새로운 Task(일정)를 생성하고 생성된 페이지로 이동하는 커스텀 훅
 */
export function useCreateTask() {
  const router = useRouter();
  const setIsDirty = useSetAtom(isDirtyAtom);
  const setOnSave = useSetAtom(onSaveAtom);

  /**
   * 새로운 Task를 Supabase에 생성합니다.
   * @returns {Promise<void>}
   */
  const createTask = async (): Promise<void> => {
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

      if (error) {
        toast("에러가 발생했습니다 ⚠️", {
          description: `Supabase 오류: ${error.message}`,
        });
        return;
      }

      if (status === 201 && data?.length) {
        toast("새로운 일정을 추가하였습니다 ✅", {
          description: "나만의 TODO LIST를 완성해보세요!",
        });

        // 🔸 새로 생성된 Todo는 '저장되지 않은 변경 상태'로 표시
        // ✅ 새 Task 생성 후 상태 초기화
        setIsDirty(true);
        setOnSave(null);

        // 🔸 생성된 Task 페이지로 이동
        router.push(`/task/${data[0].id}`);
      }
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return createTask;
}
