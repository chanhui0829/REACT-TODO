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
    console.log("함수 호출");

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
      <DialogContent style={{ padding: 12 + "px", margin: 24 + "px" }}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-start gap-2 ">
              <p className="!font-semibold text-[15px] text-muted-foreground ">
                제목 :
              </p>
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="w-7/8 text-[16px] outline-none bg-transparent border-1 rounded-sm !p-0.5 !pl-2 "
                style={{ padding: 0 + "px" }}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <DialogDescription style={{ marginTop: 16 + "px" }}>
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더박스 */}
        <div className="flex items-center gap-5 ">
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
        <Separator />
        {/* 마크다운 에디터 */}

        <MDEditor height={320 + "px"} value={content} onChange={setContent} />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-16"
              variant={"outline"}
              style={{ marginRight: 8 + "px" }}
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type={"submit"}
            className="w-16 font-semibold bg-[#58A5E4] text-white hover:bg-[#5FB4F9] hover:text-white"
            onClick={() => handleSubmit(board.id)}
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownDialog };
