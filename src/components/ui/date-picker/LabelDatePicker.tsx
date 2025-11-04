"use client";

import { useState } from "react";
import { format, isBefore } from "date-fns";
import { ko as koDateFns } from "date-fns/locale";
import { Calendar1 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

// react-day-picker 커스텀 ("월년" → "년월" 순서 변경)
function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const year = format(displayMonth, "yyyy", { locale: koDateFns });
  const month = format(displayMonth, "M", { locale: koDateFns });
  return (
    <div className="flex justify-center items-center py-2 font-medium text-[15px]">
      {year}년 {month}월
    </div>
  );
}

interface Props {
  label: string;
  readonly?: boolean;
  value: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  //시작일 값 (종료일 유효성 비교용)
  startDate?: Date | undefined;
}

function LabelDatePicker({
  label,
  readonly,
  value,
  onChange,
  startDate,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    // 시작일 미설정 상태에서 종료일 선택 차단
    if (label === "종료일" && !startDate) {
      toast("시작일을 먼저 선택해주세요 ⚠️", {
        description: "종료일은 시작일 이후에만 선택할 수 있습니다.",
      });
      setOpen(false);
      return;
    }

    // 종료일이 시작일보다 빠를 경우 방지
    if (label === "종료일" && startDate && isBefore(date, startDate)) {
      toast("날짜 선택 오류", {
        description: "종료일은 시작일 이후여야 합니다 ⚠️",
      });
      return;
    }

    onChange?.(date);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    // 종료일인데 시작일이 없는 경우, 열기 자체 막기
    if (label === "종료일" && !startDate && isOpen) {
      toast("시작일을 먼저 선택해주세요 ⚠️", {
        description: "시작일을 설정해야 종료일을 선택할 수 있습니다.",
      });
      return;
    }
    setOpen(isOpen);
  };

  return (
    <div className="max-w-64 flex items-center gap-2">
      <span className="text-sm font-medium leading-none text-[#6d6d6d]  whitespace-nowrap">
        {label}
      </span>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={label === "종료일" && !startDate} // 종료일 >시작일 미선택시 비활성화
          >
            <Calendar1 style={{ marginLeft: 8 + "px" }} />
            {value ? (
              <span>
                {format(value, "yyyy.MM.dd (EEE)", { locale: koDateFns })}
              </span>
            ) : (
              <span>날짜를 선택하세요.</span>
            )}
          </Button>
        </PopoverTrigger>

        {!readonly && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              initialFocus
              fromDate={new Date()}
              locale={koDateFns}
              disabled={
                label === "종료일" && startDate
                  ? { before: startDate } // 시작일 이전은 회색 처리
                  : undefined
              }
              components={{
                Caption: CustomCaption,
              }}
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export { LabelDatePicker };
