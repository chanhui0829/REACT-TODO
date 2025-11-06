"use client";

// ======================
// 📦 External
// ======================
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

// ======================
// 🧭 Hooks & Store
// ======================
import { useGetTaskById, useUpdateBoard } from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

// ======================
// 🧱 UI Components
// ======================
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  LabelDatePicker,
  Separator,
} from "@/components/ui";

// ======================
// 📘 Types
// ======================
import type { Board } from "@/types";

// ======================
// 🧩 Component
// ======================
interface Props {
  children: React.ReactNode;
  board: Board;
}

function MarkdownDialog({ board, children }: Props) {
  const { id } = useParams();
  const updateBoard = useUpdateBoard();
  const { getTaskById } = useGetTaskById(Number(id));
  const task = useAtomValue(taskAtom);

  // ----------------------
  // 🔹 Local State
  // ----------------------
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [content, setContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ----------------------
  // ♻️ 상태 초기화
  // ----------------------
  const initState = () => {
    setIsCompleted(board.isCompleted ?? false);
    setTitle(board.title ?? "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content ?? "");
  };

  useEffect(() => {
    if (isDialogOpen) initState();
  }, [isDialogOpen]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  };

  // ----------------------
  // 💾 Supabase 저장
  // ----------------------
  const handleSubmit = async (boardId: string) => {
    if (!title || !content) {
      toast("필수 입력 항목 누락", {
        description: "제목과 콘텐츠를 모두 입력해주세요.",
      });
      return;
    }

    try {
      const updatedBoards = task?.boards.map((b: Board) =>
        b.id === boardId
          ? { ...b, isCompleted, title, startDate, endDate, content }
          : b
      );

      await updateBoard(Number(id), "boards", updatedBoards);
      getTaskById();
      handleCloseDialog();

      toast("저장 완료", {
        description: "콘텐츠가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error(error);
      toast("저장 실패", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  // ----------------------
  // 🧩 Render
  // ----------------------
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[88vh] w-[800px] max-w-[90vw] sm:max-w-[80vw] md:w-[600px] overflow-y-auto rounded-lg !p-4">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-11/12 items-center gap-2 whitespace-nowrap">
              <p className="text-[14px] font-semibold text-muted-foreground sm:text-[15px]">
                제목 :
              </p>
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="flex-1 rounded-sm border bg-transparent !pl-1 !py-0.5 text-[14px] font-normal outline-none sm:text-[15px]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </DialogTitle>

          <DialogDescription className="mt-4 text-[13px] text-gray-500 sm:text-[14px]">
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>

        {/* DATE PICKERS */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <LabelDatePicker
            label="시작일"
            value={startDate}
            onChange={setStartDate}
          />
          <LabelDatePicker
            label="종료일"
            value={endDate}
            onChange={setEndDate}
            startDate={startDate}
          />
        </div>

        <Separator className="my-4" />

        {/* MARKDOWN EDITOR */}
        <div className="w-full">
          <MDEditor
            height={
              typeof window !== "undefined" && window.innerWidth < 640
                ? 220
                : 320
            }
            value={content}
            onChange={(val) => setContent(val || "")}
          />
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex flex-row justify-end">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-8 w-16 text-[13px] sm:h-9 sm:text-[14px]"
              >
                취소
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="h-8 w-16 bg-[#58A5E4] font-semibold text-white hover:bg-[#5FB4F9] sm:h-9"
              onClick={() => handleSubmit(board.id)}
            >
              등록
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownDialog };
