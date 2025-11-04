"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui";
import { SideNavigation } from "@/components/common";

function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between !p-4 border-b-zinc-100 border-zinc-800 bg-gray-100">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-zinc-800" />
        </button>
        <h1 className="font-semibold text-lg text-zinc-600">TO DO List</h1>
        <div className="w-6 h-6" />
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[260px] bg-zinc-900">
          {/* ❗ 여기 조건 없이 항상 렌더 */}
          <SideNavigation />
        </SheetContent>
      </Sheet>
    </>
  );
}

export { MobileDrawer };
