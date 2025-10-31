"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
} from "../index";
import { X } from "lucide-react";

interface ConfirmNavigationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmSave: () => Promise<void>;
  onSkipSave: () => void;
}

export function ConfirmNavigationDialog({
  open,
  onClose,
  onConfirmSave,
  onSkipSave,
}: ConfirmNavigationDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-6 shadow-lg">
        {/* 닫기(X) 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition"
        >
          <X size={18} />
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
            변경사항이 저장되지 않았습니다
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-zinc-500 mt-1 !mb-2">
            이동하기 전에 현재 작업을 저장하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex gap-2">
          <Button
            onClick={onConfirmSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            저장 후 이동
          </Button>
          <Button
            variant="outline"
            onClick={onSkipSave}
            className="flex-1 border border-zinc-300 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          >
            삭제 후 이동
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
