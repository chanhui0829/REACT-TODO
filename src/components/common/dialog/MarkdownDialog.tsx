"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetTaskById, useUpdateBoard } from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

import MDEditor from "@uiw/react-md-editor";
//Component
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

import { toast } from "sonner";
import { Board } from "@/types";

interface Props {
  children: React.ReactNode;
  board: Board;
}

function MarkdownDialog({ board, children }: Props) {
  const { id } = useParams();
  const updateBoard = useUpdateBoard();
  const task = useAtomValue(taskAtom);
  const { getTaskById } = useGetTaskById(Number(id));

  //해당 컴포넌트에서 사용되는 상태 값
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  //상태 값 초기화
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content || "");
  };

  useEffect(() => {
    if (isDialogOpen) {
      initState();
    }
  }, [isDialogOpen]);

  //다이얼로그 닫기
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  };
  //===============================================supabase저장============================================
  // 등록 버튼 클릭 시
  const handleSubmit = async (boardId: string) => {
    if (!title || !content) {
      toast("기입되지 않은 데이터(값)가 있습니다.", {
        description: "제목, 콘텐츠 값을 확인해주세요.",
      });
      return;
    }
    //해당 Board에 대한 데이터만 수정

    try {
      // boards 배열에서 선택한 boards를 찾고, 수정된 값으로 업데이트
      const newBoards = task?.boards.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoard(Number(id), "boards", newBoards);
      handleCloseDialog();
      getTaskById();
    } catch (error) {
      //네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용
      throw error;
      toast("네트워크 오류", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="!w-[800px] !max-w-[90vw] !sm:max-w-[80vw] !md:w-[600px] !max-h-[88vh] rounded-lg overflow-y-auto"
        style={{ padding: 12 }}
      >
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>
            <div className="flex !w-11/12 items-center justify-start gap-2 whitespace-nowrap">
              <p className="font-semibold text-[14px] sm:text-[15px] text-muted-foreground">
                제목 :
              </p>
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="flex-1 text-[14px] sm:text-[15px] font-normal outline-none bg-transparent border rounded-sm !pl-1 !py-0.5 "
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <DialogDescription className="mt-4 text-[13px] sm:text-[14px] text-gray-500">
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>

        {/* DATE PICKERS */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mt-2">
          <div className="">
            <LabelDatePicker
              label="시작일"
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div className="">
            <LabelDatePicker
              label="종료일"
              value={endDate}
              onChange={setEndDate}
              startDate={startDate}
            />
          </div>
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
            onChange={setContent}
          />
        </div>

        {/* FOOTER 버튼 한 줄 우측정렬 */}
        <DialogFooter className="!flex !flex-row !justify-end">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                className="w-16 h-8 sm:h-9 text-[13px] sm:text-[14px]"
                variant="outline"
              >
                취소
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-16 h-8 sm:h-9 font-semibold bg-[#58A5E4] text-white hover:bg-[#5FB4F9]"
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
