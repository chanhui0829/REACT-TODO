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

function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const year = format(displayMonth, "yyyy", { locale: koDateFns });
  const month = format(displayMonth, "M", { locale: koDateFns });
  return (
    <div className="flex justify-center items-center py-2 font-medium text-[14px] sm:text-[15px]">
      {year}년 {month}월
    </div>
  );
}

interface Props {
  label: string;
  readonly?: boolean;
  value: Date | undefined;
  onChange?: (date: Date | undefined) => void;
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

    if (label === "종료일" && !startDate) {
      toast("시작일을 먼저 선택해주세요 ⚠️", {
        description: "종료일은 시작일 이후에만 선택할 수 있습니다.",
      });
      setOpen(false);
      return;
    }

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
    if (label === "종료일" && !startDate && isOpen) {
      toast("시작일을 먼저 선택해주세요 ⚠️", {
        description: "시작일을 설정해야 종료일을 선택할 수 있습니다.",
      });
      return;
    }
    setOpen(isOpen);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-64">
      <span className="text-xs sm:text-sm font-medium text-[#6d6d6d] whitespace-nowrap">
        {label}
      </span>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 min-w-[160px] max-w-[120px] sm:min-w-[180px] sm:max-w-[240px] justify-start text-left font-normal !px-2 !py-1 sm:py-2 text-xs sm:text-sm",
              !value && "text-muted-foreground"
            )}
            disabled={label === "종료일" && !startDate}
          >
            <Calendar1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
            {value ? (
              <span>
                {format(value, "yyyy.MM.dd (EEE)", { locale: koDateFns })}
              </span>
            ) : (
              <span>날짜를 선택 해주세요.</span>
            )}
          </Button>
        </PopoverTrigger>

        {!readonly && (
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={4}
            className="flex justify-center items-center w-[200px] sm:w-[240px] p-0 overflow-hidden"
          >
            <div className="origin-top justify-center scale-[0.9] sm:scale-100">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleSelect}
                initialFocus
                fromDate={new Date()}
                locale={koDateFns}
                disabled={
                  label === "종료일" && startDate
                    ? { before: startDate }
                    : undefined
                }
                components={{ Caption: CustomCaption }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-0 ",
                  month: "space-y-2",
                  caption_label: "text-sm sm:text-base font-medium",
                  table: "w-full border-collapse space-y-1",
                  head_row:
                    "flex justify-center text-[10px] sm:text-xs text-zinc-400",
                  row: "flex justify-between",
                  cell: "text-[11px] sm:text-sm h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-md",
                }}
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export { LabelDatePicker };
