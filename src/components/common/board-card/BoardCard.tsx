"use client";

// ======================
// 📦 External
// ======================
import { useState } from "react";
import { useParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Trash2, Plus, SquarePen } from "lucide-react";

// ======================
// 🧭 Hooks & Store
// ======================
import {
  useDeleteBoard,
  useToggleComplete,
  useGetTaskById,
} from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

// ======================
// 🧱 UI Components
// ======================
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
  Card,
  Checkbox,
  Input,
  LabelDatePicker,
} from "@/components/ui";
import { MarkdownDialog } from "@/components/common";

// ======================
// 📘 Types
// ======================
import type { Board } from "@/types";

// ======================
// 🧩 Component
// ======================
interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  // ----------------------
  // 🔹 States & Hooks
  // ----------------------
  const { id } = useParams();
  const [isShowContent, setIsShowContent] = useState(false);
  const [isCompleted, setIsCompleted] = useState(board.isCompleted);

  const hasContent = !!board.content?.trim();

  const toggleComplete = useToggleComplete();
  const { getTaskById } = useGetTaskById(Number(id));
  const task = useAtomValue(taskAtom);
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);

  // ----------------------
  // 💾 완료 상태 토글
  // ----------------------
  const handleToggleComplete = async (checked: boolean) => {
    if (!hasContent) {
      toast("콘텐츠가 없습니다.", {
        description: "먼저 콘텐츠를 작성한 후 완료 처리할 수 있습니다.",
      });
      return;
    }

    try {
      const updatedBoards = task?.boards.map((b) =>
        b.id === board.id ? { ...b, isCompleted: checked } : b
      );

      setIsCompleted(checked);
      await toggleComplete(Number(id), "boards", updatedBoards);
      getTaskById();
    } catch (error) {
      console.error(error);
      toast("업데이트 실패", {
        description: "네트워크 또는 서버 오류가 발생했습니다.",
      });
    }
  };

  // ----------------------
  // 🧩 Render
  // ----------------------
  return (
    <Card className="flex w-full flex-col items-center gap-4 !p-6">
      {/* 제목 영역 */}
      <div className="flex w-full items-center justify-between gap-2">
        <Checkbox
          className="h-5 w-5"
          checked={isCompleted}
          disabled={!hasContent}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") handleToggleComplete(checked);
          }}
        />

        <Input
          type="text"
          placeholder="등록된 제목이 없습니다."
          value={board.title}
          disabled
          className={`bg-transparent text-xl outline-none ${
            isCompleted ? "line-through text-slate-400" : ""
          } pl-2`}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-[42px] text-sm text-rose-600 hover:bg-red-200 hover:text-rose-400"
              aria-label="보드 삭제"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>이 내용을 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                삭제 후에는 복구할 수 없습니다. 정말 삭제하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="!p-2">취소</AlertDialogCancel>
              <AlertDialogAction
                className="bg-rose-600 !p-2 hover:bg-rose-700"
                onClick={handleDeleteBoard}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 날짜 + 접기버튼 */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <LabelDatePicker label="시작일" readonly value={board.startDate} />
          <LabelDatePicker
            label="종료일"
            readonly
            value={board.endDate}
            startDate={board.startDate}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsShowContent((prev) => !prev)}
        >
          {isShowContent ? (
            <ChevronUp className="text-[#6d6d6d]" />
          ) : (
            <ChevronDown className="text-[#6d6d6d]" />
          )}
        </Button>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 !p-6 transition-all hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer">
        <MarkdownDialog board={board}>
          <div className="flex w-full flex-col items-center gap-3">
            {isShowContent && (
              <MDEditor
                height="320px"
                value={board.content || ""}
                className="mb-2 w-full"
              />
            )}

            {/* 콘텐츠 유무에 따른 표시 */}
            {!hasContent ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Plus />
                </div>
                <p className="text-lg font-medium text-slate-600 transition-colors hover:text-indigo-600">
                  새 콘텐츠 추가하기
                </p>
                <p className="text-sm text-slate-400">
                  Markdown으로 글을 작성할 수 있습니다 ✍️
                </p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <SquarePen />
                </div>
                <p className="text-lg font-medium text-slate-600 transition-colors hover:text-indigo-600">
                  콘텐츠 수정하기
                </p>
                <p className="text-center text-sm text-slate-400">
                  펼쳐보기로 내용을 확인할 수 있으며, <br />
                  클릭 시 Markdown으로 수정 가능합니다 ✍️
                </p>
              </>
            )}
          </div>
        </MarkdownDialog>
      </div>
    </Card>
  );
}

export { BoardCard };
