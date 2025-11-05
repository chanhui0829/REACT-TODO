"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useSetAtom } from "jotai";

// hooks & utils
import { useGetTaskById, useCreateBoard, useGetTasks } from "@/hooks/apis";
import { supabase } from "@/utils/supabase/client";
import { isDirtyAtom, onSaveAtom } from "@/store/atoms";

// ui
import { Button, LabelDatePicker, Progress } from "@/components/ui";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { BoardCard, DeleteTaskPopup } from "@/components/common";
import styles from "./page.module.scss";

import type { Board } from "@/types";

export default function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const { task } = useGetTaskById(Number(id));
  const createBoard = useCreateBoard();
  const { getTasks } = useGetTasks();

  const setIsDirty = useSetAtom(isDirtyAtom);
  const setOnSave = useSetAtom(onSaveAtom);

  const [title, setTitle] = useState("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [progressCount, setProgressCount] = useState(0);

  /** 🔹 저장 함수 (true/false 반환으로 성공여부 명확히 구분) */
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!title || !startDate || !endDate) {
      toast("필수 항목을 입력해주세요.", {
        description: "제목, 시작일, 종료일은 모두 입력해야 합니다.",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", id);

      if (error) {
        toast("에러가 발생했습니다.", { description: error.message });
        return false;
      }

      toast("TASK 저장 완료!", {
        description: "수정한 TASK가 정상적으로 반영되었습니다.",
      });

      setIsDirty(false);
      getTasks();
      return true;
    } catch (err) {
      console.error(err);
      toast("네트워크 오류", { description: "저장 요청 실패" });
      return false;
    }
  }, [id, title, startDate, endDate]);

  /** 🔹 Dirty 감지 */
  const markDirty = () => setIsDirty(true);

  /** 🔹 Board 추가 */
  const handleAddBoard = async () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };
    const updated = [...boards, newBoard];
    setBoards(updated);
    markDirty();
    await createBoard(Number(id), "boards", updated);
  };

  /** 🔹 Task 데이터 fetch 후 local state 반영 */
  useEffect(() => {
    if (task) {
      setTitle((prev) => prev || task.title || "");
      setStartDate(
        (prev) =>
          prev ?? (task.start_date ? new Date(task.start_date) : undefined)
      );
      setEndDate(
        (prev) => prev ?? (task.end_date ? new Date(task.end_date) : undefined)
      );
      setBoards(task.boards ?? []);
    }
  }, [task]);

  useEffect(() => {
    // ✅ 새로 생성된 빈 Task인지 판별
    const isNewTask = !task?.title && !task?.start_date && !task?.end_date;

    // 기존 Task는 dirty 초기화, 새 Task는 그대로 유지
    if (!isNewTask) {
      setIsDirty(false);
    }

    setOnSave(() => handleSave);
  }, [task, handleSave, setIsDirty, setOnSave]);

  useEffect(() => {
    if (task?.boards) {
      const completed = task.boards.filter((b) => b.isCompleted).length;
      setProgressCount(completed);
    }
  }, [task?.boards]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles["header__btn-box"]}>
          <Button
            variant="outline"
            size="icon"
            className="text-gray-400"
            onClick={() => router.push("/")}
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center gap-2">
            <Button className="w-12 bg-gray-400" onClick={handleSave}>
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="w-12 text-rose-600 bg-red-100 hover:bg-rose-300 ">
                삭제
              </Button>
            </DeleteTaskPopup>
          </div>
        </div>

        <div className={styles.header__top}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            placeholder="제목을 입력해주세요."
            className={styles.header__top__input}
          />

          <div className="flex items-center justify-start gap-4">
            <small className="text-sm font-medium text-[#6D6D6D]">
              {progressCount}/{boards.length} Completed
            </small>
            <Progress
              className="w-60 h-[10px]"
              value={boards.length ? (progressCount / boards.length) * 100 : 0}
            />
          </div>
        </div>

        <div className={styles.header__bottom}>
          <div className={styles["header__bottom__group"]}>
            <div className={styles["header__bottom__dates"]}>
              <LabelDatePicker
                label="시작일"
                value={startDate}
                onChange={(d) => {
                  setStartDate(d);
                  markDirty();
                }}
              />
              <LabelDatePicker
                label="종료일"
                value={endDate}
                onChange={(d) => {
                  setEndDate(d);
                  markDirty();
                }}
                startDate={startDate}
              />
            </div>

            <Button
              className="w-28 text-white bg-[#58A5E4] hover:bg-[#5FB4F9]"
              onClick={handleAddBoard}
            >
              내용 추가
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {boards.length ? (
          <div className={styles.body__isData}>
            {boards.map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
          </div>
        ) : (
          <div className={styles.body__noData}>
            <h3 className="text-2xl font-semibold">등록된 내용이 없습니다.</h3>
            <small className="text-sm text-[#6D6D6D] mt-3">
              버튼을 클릭하여 내용을 추가해보세요!
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
