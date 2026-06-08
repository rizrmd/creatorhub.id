import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, MessageSquare, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const NOTIFICATIONS = [
  { id: 1, text: "Nadia Aurellia menerima brief kampanye", time: "2 menit lalu", unread: true },
  { id: 2, text: "Pembayaran INV-9281 telah diproses", time: "1 jam lalu", unread: true },
  { id: 3, text: "Laporan analytics mingguan tersedia", time: "5 jam lalu", unread: false },
];

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 relative z-30">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Cari kreator, kampanye... (Enter)"
          className="pl-9 bg-slate-50 border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/messages")}>
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none">
            7
          </span>
        </Button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotif((v) => !v)}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-blue-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none">
              3
            </span>
          </Button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notifikasi</p>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => setShowNotif(false)}>
                  Tandai semua dibaca
                </button>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${n.unread ? "bg-blue-50/40" : ""}`}
                  onClick={() => setShowNotif(false)}
                >
                  <p className="text-sm text-slate-700">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-blue-600 hover:underline">Lihat semua notifikasi</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 cursor-pointer"
            onClick={() => setShowProfile((v) => !v)}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">A</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800 leading-none">Arif Budiman</p>
              <p className="text-xs text-slate-500 mt-0.5">Brand Manager</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
              >
                <User className="w-4 h-4 text-slate-400" /> My Profile
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
              >
                <Settings className="w-4 h-4 text-slate-400" /> Settings
              </button>
              <div className="border-t border-slate-100" />
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => { setShowProfile(false); toast.success("Berhasil logout"); }}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
