"use client";

// ======================
// 📦 External
// ======================
import { useParams } from "next/navigation";

// ======================
// 🧭 Hooks
// ======================
import { useDeleteTask } from "@/hooks/apis";

// ======================
// 🧱 UI Components
// ======================
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";

// ======================
// 🧩 Component
// ======================
interface Props {
  children: React.ReactNode;
}

function DeleteTaskPopup({ children }: Props) {
  const { id } = useParams();
  const { deleteTask } = useDeleteTask();

  // ----------------------
  // 🗑️ 삭제 핸들러
  // ----------------------
  const handleDelete = () => {
    if (!id) return;
    deleteTask(Number(id));
  };

  // ----------------------
  // 🧩 Render
  // ----------------------
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>해당 TASK를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제 후에는 복구가 불가능합니다. 신중히 진행해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="w-16">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="w-16 bg-red-500 hover:bg-red-400"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteTaskPopup };
