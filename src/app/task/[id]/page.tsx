'use client';

// ======================
// 📦 External & React
// ======================
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useSetAtom } from 'jotai';

// ======================
// 🧭 Hooks & Utils
// ======================
import { useGetTaskById, useCreateBoard, useGetTasks } from '@/hooks/apis';
import { supabase } from '@/utils/supabase/client';
import { isDirtyAtom, onSaveAtom } from '@/store/atoms';

// ======================
// 🧱 UI & Components
// ======================
import { Button, LabelDatePicker, Progress } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { BoardCard, DeleteTaskPopup } from '@/components/common';

// ======================
// 🎨 Styles & Types
// ======================
import styles from './page.module.scss';
import type { Board } from '@/types';

// ======================
// 🧩 Component
// ======================
export default function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const taskId = useMemo(() => Number(id), [id]);

  // hooks
  const { task } = useGetTaskById(taskId);
  const createBoard = useCreateBoard();
  const { getTasks } = useGetTasks();

  // jotai 상태
  const setIsDirty = useSetAtom(isDirtyAtom);
  const setOnSave = useSetAtom(onSaveAtom);

  // local state
  const [title, setTitle] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [progressCount, setProgressCount] = useState(0);

  // ======================
  // 💾 저장 함수
  // ======================
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!title || !startDate || !endDate) {
      toast('필수 항목을 입력해주세요.', {
        description: '제목, 시작일, 종료일은 모두 입력해야 합니다.',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          start_date: startDate,
          end_date: endDate,
        })
        .eq('id', taskId);

      if (error) throw error;

      toast('TASK 저장 완료!', {
        description: '수정한 TASK가 정상적으로 반영되었습니다.',
      });

      setIsDirty(false);
      getTasks();
      return true;
    } catch {
      toast('저장 실패', { description: '네트워크 오류' });
      return false;
    }
  }, [taskId, title, startDate, endDate, getTasks, setIsDirty]);

  // ======================
  // ✏️ 로컬 상태 변경 감지
  // ======================
  const markDirty = () => setIsDirty(true);

  const handleAddBoard = async () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: '',
      startDate: undefined,
      endDate: undefined,
      content: '',
    };
    const updated = [...boards, newBoard];
    setBoards(updated);
    markDirty();

    await createBoard(taskId, 'boards', updated);
  };

  // ======================
  // 🔄 데이터 동기화
  // ======================
  useEffect(() => {
    if (!task) return;
  
    const isNewTask = !task.title && !task.start_date && !task.end_date;
  
    if (isNewTask) {
      setTitle('');
      setStartDate(undefined);
      setEndDate(undefined);
      setBoards([]);
      setIsDirty(true);
      return;
    }
  
    // 🛑 boards는 dirty가 아니어야만 덮어쓴다!
    setTitle(task.title || '');
    setStartDate(task.start_date ? new Date(task.start_date) : undefined);
    setEndDate(task.end_date ? new Date(task.end_date) : undefined);
  
    setBoards((prev) => {
      if (prev.length === 0) return task.boards ?? [];
      return prev; // 👈 사용자가 보드 수정 중이면 덮어쓰지 않음
    });
  
    setIsDirty(false);
  }, [task]);

  // 저장 함수 전역 등록
  useEffect(() => {
    setOnSave(() => handleSave);
    // 새 Task가 아니라면 변경사항 초기화
    const isNewTask = !task?.title && !task?.start_date && !task?.end_date;
    if (!isNewTask) setIsDirty(false);
  }, [handleSave, setOnSave, setIsDirty]);

  useEffect(() => {
    if (!task?.boards) return;
    const completed = task.boards.filter((b) => b.isCompleted).length;
    setProgressCount(completed);
  }, [task?.boards]);

  // ======================
  // 🧩 UI 렌더링
  // ======================
  return (
    <>
      {/* 상단 헤더 */}
      <div className={styles.header}>
        {/* 버튼 영역 */}
        <div className={styles['header__btn-box']}>
          <Button
            variant="outline"
            size="icon"
            className="text-gray-400"
            onClick={() => router.push('/')}
          >
            <ChevronLeft />
          </Button>

          <div className="flex items-center gap-2">
            <Button className="w-12 bg-gray-400" onClick={handleSave}>
              저장
            </Button>
            <DeleteTaskPopup>
              <Button className="w-12 bg-red-100 text-rose-600 hover:bg-rose-300">삭제</Button>
            </DeleteTaskPopup>
          </div>
        </div>

        {/* 제목 + 진행률 */}
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

          <div className="flex items-center gap-4">
            <small className="text-sm font-medium text-[#6D6D6D]">
              {progressCount}/{boards.length} Completed
            </small>
            <Progress
              className="h-[10px] w-60"
              value={boards.length ? (progressCount / boards.length) * 100 : 0}
            />
          </div>
        </div>

        {/* 날짜 선택 + 추가 버튼 */}
        <div className={styles.header__bottom}>
          <div className={styles['header__bottom__group']}>
            <div className={styles['header__bottom__dates']}>
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
              className="w-28 bg-[#58A5E4] text-white hover:bg-[#5FB4F9]"
              onClick={handleAddBoard}
            >
              내용 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        {boards.length > 0 ? (
          <div className={styles.body__isData}>
            {boards.map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
          </div>
        ) : (
          <div className={styles.body__noData}>
            <h3 className="text-2xl font-semibold">등록된 내용이 없습니다.</h3>
            <small className="mt-3 text-sm text-[#6D6D6D]">
              버튼을 클릭하여 내용을 추가해보세요!
            </small>
            <button onClick={handleAddBoard}>
              <Image src="/assets/images/button.svg" width={74} height={74} alt="rounded-button" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
