"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Image from "next/image";
//Hooks
import { useGetTaskById, useCreateBoard, useGetTasks } from "@/hooks/apis";
//UI 컴포넌트
import { Button, LabelDatePicker, Progress } from "@/components/ui";
import { ChevronLeft } from "lucide-react";
//CSS
import styles from "./page.module.scss";
//Types
import { Board } from "@/types";
import { BoardCard, DeleteTaskPopup } from "@/components/common";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const { task } = useGetTaskById(Number(id));
  const createBoard = useCreateBoard();
  const { getTasks } = useGetTasks();

  const [title, setTitle] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [progressCount, setProgressCount] = useState<number>(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setStartDate(task.start_date ? new Date(task.start_date) : undefined);
      setEndDate(task.end_date ? new Date(task.end_date) : undefined);
      setBoards(task.boards);
    }
  }, [task]);

  // TASK 내의 BOARD 생성
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };
    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    //실제 Supabase와 통신하는 로직 hook
    createBoard(Number(id), "boards", newBoards);
  };

  //저장
  const handleSave = async () => {
    if (!title || !startDate || !endDate) {
      toast("기입되지 않은 데이터 값이 있습니다.", {
        description: "제목, 시작일, 종료일은 필수 값입니다.",
      });
      return;
    }
    try {
      const { data, status, error } = await supabase
        .from("tasks")
        .update({
          title: title,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", id)
        .select();

      if (data && status === 200) {
        // 올바르게 tasks 테이블에 ROw 데이터 한 줄이 올바르게 생성이되면 실행
        toast("TASK 저장을 완료하였습니다.", {
          description: "수정한 TASK의 마감일을 꼭 지켜주세요!",
        });

        //서버에서 데이터 갱신 후 상태값 업데이트
        // SideNavigation 컴포넌트 리스트 정보를 실시간으로 업데이트 하기 위해 getTask 훅을 호출
        getTasks();
      }

      if (error) {
        toast("에러가 발생했습니다.", {
          description: `Supabase 오류: ${error.message} || 알 수 없는 오류`,
        });
      }
    } catch (error) {
      console.log(error);
      toast("네트워크 오류.", {
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
    }
  };

  useEffect(() => {
    if (task?.boards) {
      const completedCount = task.boards.filter(
        (board) => board.isCompleted
      ).length;
      setProgressCount(completedCount);
    }
  }, [task?.boards]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles[`header__btn-box`]}>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => router.push("/")}
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              className="w-12 bg-gray-100"
              variant={"secondary"}
              onClick={handleSave}
            >
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="w-12 text-rose-600 bg-red-50 hover:bg-rose-50 ">
                삭제
              </Button>
            </DeleteTaskPopup>
          </div>
        </div>
        <div className={styles.header__top}>
          {/* 제목 입력 Input 섹션 */}
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력해주세요."
            className={styles.header__top__input}
          />
          {/* 진행상황 척도 그래프 섹션 */}
          <div className="flex items-center justify-start gap-4">
            <small className="text-sm font-medium leading-none text-[#6D6D6D]">
              {progressCount}/{task?.boards.length} Completed
            </small>
            <Progress
              className="w-60 h-[10px]"
              value={
                task && task.boards.length > 0
                  ? (progressCount / task.boards.length) * 100
                  : 0
              }
            />
          </div>
        </div>
        {/* 캘린더 + Add New Board 버튼 섹션 */}
        <div className={styles.header__bottom}>
          <div className="flex items-center gap-5">
            <LabelDatePicker
              label={"From"}
              value={startDate}
              onChange={setStartDate}
            />
            <LabelDatePicker
              label={"To"}
              value={endDate}
              onChange={setEndDate}
            />
          </div>
          <Button
            className="w-32 text-white bg-[#58A5E4] hover:bg-[#5FB4F9] hover:ring-1 hover:ring-[#5FB4F9] hover:ring-offset-1 active:bg-[#5FB4F9] hover:shadow-md"
            onClick={handleAddBoard}
          >
            Add New Board
          </Button>
        </div>
      </div>
      <div className={styles.body}>
        {boards.length !== 0 ? (
          <div className={styles.body__isData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
            {boards.map((board: Board) => {
              return <BoardCard key={board.id} board={board} />;
            })}
          </div>
        ) : (
          <div className={styles.body__noData}>
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              There is no board yet.
            </h3>
            <small className="text-sm font-medium leading-none text-[#6D6D6D] mt-3 mb-7">
              Click the button and start flashing!
            </small>
            <button onClick={handleAddBoard}>
              <Image
                src="/assets/images/button.svg"
                width={74}
                height={74}
                alt="rounded-button"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskPage;
