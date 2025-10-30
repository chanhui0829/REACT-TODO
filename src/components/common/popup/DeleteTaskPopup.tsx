"use client";
import { useParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { useDeleteTask } from "@/hooks/apis";

interface Props {
  children: React.ReactNode;
}

function DeleteTaskPopup({ children }: Props) {
  const { id } = useParams();
  const { deleteTask } = useDeleteTask();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            해당 TASK를 정말로 삭제하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription>
            이 작업이 실행되면 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-16">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteTask(Number(id));
            }}
            className="bg-red-500 hover:bg-red-400 w-16"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteTaskPopup };
