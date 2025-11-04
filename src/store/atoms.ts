"use client";
import { Task } from "@/types";
import { atom } from "jotai";

//전체 Task 목록 조회
export const tasksAtom = atom<Task[]>([]); //기본값 설정

//단일(개별) Task 조회
export const taskAtom = atom<Task | null>(null);

//저장 > task 이동시
export const isDirtyAtom = atom(false);
export const onSaveAtom = atom<(() => Promise<boolean>) | null>(null);
