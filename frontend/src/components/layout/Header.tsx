import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Cari kreator, kampanye..."
          className="pl-9 bg-slate-50 border-slate-200"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-none">Admin</p>
            <p className="text-xs text-slate-500">Brand Manager</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
