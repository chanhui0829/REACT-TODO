"use client";

// ======================
// 📦 External
// ======================
import { useState } from "react";
import { Menu } from "lucide-react";

// ======================
// 🧱 UI Components
// ======================
import { Sheet, SheetContent } from "@/components/ui";
import { SideNavigation } from "@/components/common";

// ======================
// 🧩 Component
// ======================
function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 상단 모바일 헤더 */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-gray-100 !p-4 lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6 text-zinc-800" />
        </button>
        <h1 className="text-lg font-semibold text-zinc-700">TO DO List</h1>
        {/* 빈 공간 맞추기 */}
        <div className="h-6 w-6" />
      </header>

      {/* 모바일 내비게이션 Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[260px] bg-zinc-900 p-0">
          <SideNavigation />
        </SheetContent>
      </Sheet>
    </>
  );
}

export { MobileDrawer };
