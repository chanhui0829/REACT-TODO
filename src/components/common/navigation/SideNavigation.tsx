"use client";
// Hooks
import { useGetTasks, useCreateTask, useSearch } from "@/hooks/apis";
//UI Component
import { Button, SearchBar } from "@/components/ui";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Task } from "@/types";

function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();
  const { search } = useSearch();
  const [searchTerm, setSearchTerm] = useState<string>("");

  //getTasks는 컴포넌트 최초 렌더링 시 한번만 호출되어야 하므로 useEffect
  useEffect(() => {
    getTasks();
  }, [id]);

  // Task 생성
  const handleCreateTask = useCreateTask();

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      //useSearch 훅이 동작하도록 한다.
      search(searchTerm);
    }
  };

  return (
    <aside className="page__aside">
      <div className="flex flex-col h-full gap-4">
        {/* 검색창 UI */}
        <SearchBar
          placeholder="검색어를 입력하세요."
          onChange={handleSearchTermChange}
          onKeyDown={handleSearch}
        />
        {/* Add New Page 버튼 UI */}
        <Button
          className="text-[#58A5E4] bg-white border border-[#58A5E4] hover:bg-[#F2F7FA] hover:shadow-md"
          onClick={handleCreateTask}
        >
          Add New Page
        </Button>
        {/* Task 목록 UI */}
        <div className="flex flex-col mt-4 gap-2">
          <small className="text-sm font-medium leading-none text-[#a6a6a6]">
            <span className="text-neutral-700">Chan님</span>의 TASKs
          </small>
          <ul className="flex flex-col">
            {tasks.length === 0 ? (
              <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400 "></div>
                등록된 Task가 없습니다.
              </li>
            ) : (
              tasks.map((task: Task) => {
                return (
                  <li
                    key={task.id}
                    onClick={() => router.push(`/task/${task.id}`)}
                    className={`${
                      task.id === Number(id) && "bg-[#f5f5f5]"
                    } min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer `}
                  >
                    <div
                      className={`${
                        task.id === Number(id)
                          ? "bg-[#00f38d]"
                          : "bg-neutral-400"
                      } h-[6px] w-[6px] rounded-full `}
                    ></div>
                    <span
                      className={`${
                        task.id !== Number(id) && `text-neutral-400`
                      }`}
                    >
                      {task.title ? task.title : "등록된 제목이 없습니다."}
                    </span>
                  </li>
                );
              })
            )}
            {/* Supabase에서 생성한 DB에 데이터가 없을 경우 */}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export { SideNavigation };
