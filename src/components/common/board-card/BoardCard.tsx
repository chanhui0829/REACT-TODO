"use client";

import { MarkdownDialog } from "@/components/common";

//UI
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Button,
  Card,
  Checkbox,
  Input,
  LabelDatePicker,
  Separator,
} from "@/components/ui";
//Type
import { Board } from "@/types";
import { useDeleteBoard } from "@/hooks/apis";
import { useParams } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();

  const [isShowContent, setIsShowContent] = useState<boolean>(false);

  /** TASK의 개별 TODO-BOARD 삭제(TODO-BOARD 1건 삭제) */
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);

  return (
    <Card
      className="w-full flex flex-col items-center p-2 gap-4"
      style={{ padding: 16 + "px" }}
    >
      {/* 게시물 카드 제목 영역*/}
      <div className="w-full flex items-center justify-between gap-2">
        <Checkbox className="h-5 w-5" checked={board.isCompleted} />
        <Input
          type="text"
          placeholder="등록된 제목이 없습니다."
          value={board.title}
          className="text-xl outline-none bg-transparent"
          disabled={true}
          style={{ paddingLeft: 8 + "px" }}
        />
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
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-3xl flex items-center justify-between ">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label={"From"}
            readonly={true}
            value={board.startDate}
          />
          <LabelDatePicker label={"To"} readonly={true} value={board.endDate} />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            className="text-sm text-rose-600 hover:text-rose-400 hover:bg-red-50 w-16"
            onClick={handleDeleteBoard}
          >
            Delete
          </Button>
        </div>
      </div>
      {isShowContent && (
        <MDEditor
          height={320 + "px"}
          value={board.content ? board.content : " "}
          style={{ width: 100 + "%", marginTop: 16 + "px" }}
        />
      )}
      <Separator />
      <MarkdownDialog board={board}>
        <Button
          variant={"ghost"}
          className="text-lg text-slate-500 hover:text-slate-400 hover:bg-slate-100"
          style={{ padding: 16 + "px" }}
        >
          {board.title ? "Update Content" : "Add Content"}
        </Button>
      </MarkdownDialog>
    </Card>
  );
}

export { BoardCard };
