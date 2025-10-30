"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

interface Props {
  label: string;
  readonly?: boolean;
  value: Date | undefined;
  onChange?: (date: Date | undefined) => void;
}

function LabelDatePicker({ label, readonly, value, onChange }: Props) {
  return (
    <div className="max-w-64 flex items-center gap-3">
      <span className="text-sm font-medium leading-none text-[#6d6d6d]">
        {label}
      </span>
      {/* Shadcn UI - calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon style={{ marginLeft: 8 + "px" }} />
            {value ? format(value, "PPP") : <span> 날짜를 선택하세요.</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
              fromDate={new Date()} // 현재 날짜로부터 과거 날짜를 비활성화합니다.
            ></Calendar>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export { LabelDatePicker };
