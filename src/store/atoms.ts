import { Task } from "@/types";
import { atom } from "jotai";

//전체 Task 목록 조회
export const tasksAtom = atom<Task[]>([]); //기본값 설정

//단일(개별) Task 조회
export const taskAtom = atom<Task | null>(null);
