import { Search, Bell, ChevronDown, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none">
            7
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-blue-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">A</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-none">Arif Budiman</p>
            <p className="text-xs text-slate-500 mt-0.5">Brand Manager</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
