import { Menu, Bell, Search, CircleUserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TopbarProps {
  onMenuClick: () => void;
}

function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();

  const pageTitle =
    {
      "/dashboard": "Dashboard",
      "/explore": "Explore",
      "/profile": "Profile",
      "/requests": "Requests",
      "/sessions": "Sessions",
      "/chat": "Chat",
      "/settings": "Settings",
    }[location.pathname] ?? "Dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/90 md:pl-72">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-950 sm:text-lg">
            {pageTitle}
          </h1>
        </div>

        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search"
              aria-label="Search dashboard"
              className="h-10 bg-slate-50 pl-10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-950"
            aria-label="User account"
          >
            <CircleUserRound className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
