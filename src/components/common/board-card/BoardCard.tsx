"use client";

import { MarkdownDialog } from "@/components/common";

//UI
import { ChevronDown, ChevronUp, Trash2, Plus, SquarePen } from "lucide-react";
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
//Type
import { Board } from "@/types";
import { useDeleteBoard, useToggleComplete } from "@/hooks/apis";
import { useParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { useGetTaskById } from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";
import { toast } from "sonner";

interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();
  const [isShowContent, setIsShowContent] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(board.isCompleted);
  const hasContent = !!board.content && board.content.trim() !== "";

  /** hooks */
  const toggleComplete = useToggleComplete();
  const { getTaskById } = useGetTaskById(Number(id));
  const task = useAtomValue(taskAtom);
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);

  /** ✅ 완료 상태 토글 (카드에서 직접 체크) */
  const handleToggleComplete = async (checked: boolean) => {
    if (!hasContent) {
      toast("콘텐츠가 없습니다.", {
        description: "먼저 콘텐츠를 작성한 후 완료처리할 수 있습니다.",
      });
      return;
    }

    try {
      // boards 배열 내 해당 보드만 수정
      const newBoards = task?.boards.map((b: Board) => {
        if (b.id === board.id) {
          return { ...b, isCompleted: checked };
        }
        return b;
      });
      setIsCompleted(checked);
      await toggleComplete(Number(id), "boards", newBoards);
      getTaskById();
    } catch (error) {
      console.error(error);
      toast("업데이트 실패", {
        description: "네트워크 문제나 서버 오류가 발생했습니다.",
      });
    }
  };

  return (
    <Card
      className="w-full flex flex-col items-center !p-6 gap-4"
      style={{ padding: "16px" }}
    >
      {/* 제목 영역 */}
      <div className="w-full flex items-center justify-between gap-2">
        <Checkbox
          className="h-5 w-5"
          checked={isCompleted}
          disabled={!hasContent} // ✅ 콘텐츠 없으면 체크 불가
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              handleToggleComplete(checked);
            }
          }}
        />
        <Input
          type="text"
          placeholder="등록된 제목이 없습니다."
          value={board.title}
          className={`text-xl outline-none bg-transparent ${
            isCompleted ? "line-through text-slate-400" : ""
          }`}
          disabled={true}
          style={{ paddingLeft: "8px" }}
        />
        <div className="flex items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"outline"}
                className="text-sm text-rose-600 hover:text-rose-400 hover:bg-red-200"
                style={{ width: 42 + "px" }}
                aria-label="보드 삭제"
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>이 해당 내용을 삭제할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  삭제 후에는 복구할 수 없습니다. 정말로 삭제하시겠어요?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="!p-2">취소</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-rose-600 hover:bg-rose-700 !p-2"
                  onClick={handleDeleteBoard}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 날짜 + 삭제버튼 */}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 flex-1">
          <LabelDatePicker
            label={"시작일"}
            readonly={true}
            value={board.startDate}
          />
          <LabelDatePicker
            label={"종료일"}
            readonly={true}
            value={board.endDate}
            startDate={board.startDate}
          />
        </div>
        <div className="sm:flex sm:items-end sm:justify-end">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsShowContent(!isShowContent)}
          >
            {isShowContent ? (
              <ChevronUp className="text-[#6d6d6d]" />
            ) : (
              <ChevronDown className="text-[#6d6d6d]" />
            )}
          </Button>
        </div>
      </div>

      {/* 콘텐츠 추가 / 수정 박스 */}
      <div className="w-full border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl !p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-indigo-50/40">
        <MarkdownDialog board={board}>
          <div className="w-full flex flex-col items-center gap-3">
            {/* 마크다운 콘텐츠 */}
            {isShowContent && (
              <MDEditor
                height="320px"
                value={board.content || ""}
                className="!w-full !mb-2"
              />
            )}

            {/* 콘텐츠 유무에 따른 UI */}
            {!hasContent ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                  <Plus />
                </div>
                <p className="text-lg font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  새 콘텐츠 추가하기
                </p>
                <p className="text-sm text-slate-400">
                  Markdown으로 글을 작성할 수 있습니다 ✍️
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                  <SquarePen />
                </div>
                <p className="text-lg font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  콘텐츠 수정하기
                </p>
                <p className="text-sm text-slate-400 text-center">
                  펼쳐보기를 통해 콘텐츠 내용 확인이 가능하며, <br />
                  클릭 시 Markdown으로 글을 수정할 수 있습니다 ✍️
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
