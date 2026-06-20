import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Settings, LogOut, User, Megaphone, Users, Coins, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/context/RoleContext";
import { useSidebar } from "@/contexts/SidebarContext";

const NOTIFICATIONS = [
  { id: 1, who: "Tasya Farasya", action: "menerima brief", target: "Ramadan Glow 2026", time: "2 mnt lalu", unread: true, iconBg: "#DBEAFE", iconFg: "#2563EB", icon: "check" },
  { id: 2, who: "Sistem",        action: "memproses pembayaran", target: "INV-9281",        time: "1 jam lalu", unread: true, iconBg: "#DCFCE7", iconFg: "#16A34A", icon: "coins" },
  { id: 3, who: "Analytics",     action: "laporan mingguan tersedia", target: "",           time: "5 jam lalu", unread: false, iconBg: "#FEF3C7", iconFg: "#B45309", icon: "chart" },
];

const MESSAGE_THREADS = [
  { id: 1, name: "Tasya Farasya", online: true,  last: "Siap, kapan brief-nya dikirim?",  time: "2m", unread: 2 },
  { id: 2, name: "Jerome Polin",  online: true,  last: "Noted kak, akan saya review",      time: "1h", unread: 0 },
  { id: 3, name: "Rachel Vennya", online: false, last: "Oke noted ya, makasih!",            time: "3h", unread: 1 },
  { id: 4, name: "Fadil Jaidi",   online: false, last: "Deal! Let's collab again 🔥",      time: "1d", unread: 0 },
  { id: 5, name: "Nessie Judge",  online: true,  last: "Udah upload kak, cek ya",           time: "2d", unread: 4 },
];

const USER_BY_ROLE = {
  brand:   { name: "Arif Budiman",  subtitle: "Brand Manager",     initial: "A", stats: { campaigns: 8, creators: 24, spent: "Rp 1.4B" } },
  kreator: { name: "Rina Pratiwi",  subtitle: "Lifestyle Creator", initial: "R", stats: { campaigns: 3, creators: 0,  spent: "Rp 48jt" } },
};

function NotifIcon({ icon, bg, fg }: { icon: string; bg: string; fg: string }) {
  return (
    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ background: bg, color: fg }}>
      {icon === "check"  && "✓"}
      {icon === "coins" && <Coins style={{ width: 16, height: 16 }} />}
      {icon === "chart"  && "📊"}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { effectiveRole } = useRole();
  const { toggleMobile } = useSidebar();
  const [showNotif, setShowNotif]       = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile]   = useState(false);
  const [msgSearch, setMsgSearch]       = useState("");
  const [now, setNow] = useState(new Date());

  const notifRef   = useRef<HTMLDivElement>(null);
  const msgRef     = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const displayUser = effectiveRole === "kreator" ? {
    ...USER_BY_ROLE.kreator,
    name:     user?.name ?? USER_BY_ROLE.kreator.name,
    subtitle: "Content Creator",
    initial:  user?.name ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : USER_BY_ROLE.kreator.initial,
    stats: USER_BY_ROLE.kreator.stats,
  } : {
    ...USER_BY_ROLE.brand,
    name:     user?.name ?? "Arif Budiman",
    subtitle: user?.role === "admin" ? "Super Admin" : "Brand Manager",
    initial:  user?.name ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "A",
    stats: USER_BY_ROLE.brand.stats,
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setShowNotif(false);
      if (msgRef.current     && !msgRef.current.contains(e.target as Node))     setShowMessages(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const open = (which: "notif" | "msg" | "profile") => {
    setShowNotif(which === "notif");
    setShowMessages(which === "msg");
    setShowProfile(which === "profile");
  };

  const messagesPath = effectiveRole === "kreator" ? "/dashboard/kreator/messages" : "/dashboard/messages";
  const settingsPath = effectiveRole === "kreator" ? "/dashboard/kreator/settings" : "/dashboard/settings";
  const profilePath = effectiveRole === "kreator" ? "/dashboard/kreator/profile" : "/dashboard/settings";

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    toast.success("Berhasil logout");
    navigate("/login", { replace: true });
  };

  const filteredThreads = MESSAGE_THREADS.filter(
    (t) => !msgSearch || t.name.toLowerCase().includes(msgSearch.toLowerCase())
  );

  const unreadNotif = NOTIFICATIONS.filter((n) => n.unread).length;
  const unreadMsg   = MESSAGE_THREADS.reduce((s, t) => s + t.unread, 0);

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return (
    <header
      className="h-16 bg-slate-950 border-b border-white/20 flex items-center gap-2 md:gap-4 shrink-0 relative z-30 px-4 md:px-6"
    >
      <button
        type="button"
        onClick={toggleMobile}
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10 text-white"
        aria-label="Buka menu"
      >
        <Menu style={{ width: 20, height: 20 }} />
      </button>

      {/* Logo + Brand — same size as landing page */}
      <div className="flex items-center gap-2.5 shrink-0">
        <img src="/favicon.png?v=4" alt="CreatorHub" className="h-12 w-12" />
        <span className="text-2xl font-extrabold text-white tracking-tight hidden sm:block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CreatorHub.ID</span>
      </div>

      {/* Center — Date & Time */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm font-semibold text-white/70 hidden md:block">{dateStr} | {timeStr}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">

        {/* Messages */}
        <div ref={msgRef} className="relative">
          <button
            onClick={() => open("msg")}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadMsg > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none bg-red-500">
                {unreadMsg}
              </span>
            )}
          </button>

          {showMessages && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[380px] bg-white rounded-xl border overflow-hidden animate-slide-in"
              style={{ borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-lg)" }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pesan</p>
                <button className="text-xs font-semibold hover:underline" style={{ color: "var(--ch-primary)" }}
                  onClick={() => { navigate(messagesPath); setShowMessages(false); }}>
                  Lihat semua
                </button>
              </div>
              <div className="px-3 py-2 border-b" style={{ borderColor: "var(--ch-border)" }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F1F5F9" }}>
                  <Search className="w-3.5 h-3.5" style={{ color: "var(--ch-text-soft)" }} />
                  <input
                    className="flex-1 bg-transparent border-0 outline-none text-[12px]"
                    style={{ color: "var(--ch-text)", fontFamily: "inherit" }}
                    placeholder="Cari percakapan…"
                    value={msgSearch}
                    onChange={(e) => setMsgSearch(e.target.value)}
                  />
                </div>
              </div>
              {filteredThreads.map((t) => (
                <button key={t.id}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b text-left transition-colors hover:bg-slate-50"
                  style={{ borderColor: "var(--ch-border)" }}
                  onClick={() => { navigate(messagesPath); setShowMessages(false); }}
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: "var(--ch-primary)" }}>
                      {t.name[0]}
                    </div>
                    {t.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#16A34A" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{t.name}</p>
                      <span className="text-[11px] ml-2 shrink-0" style={{ color: "var(--ch-text-soft)" }}>{t.time}</span>
                    </div>
                    <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{t.last}</p>
                  </div>
                  {t.unread > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 shrink-0"
                      style={{ background: "var(--ch-primary)" }}>
                      {t.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => open("notif")}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-white"
          >
            <Bell style={{ width: 18, height: 18 }} />
            {unreadNotif > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-0.5 leading-none bg-red-500">
                {unreadNotif}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[400px] bg-white rounded-xl border overflow-hidden animate-slide-in"
              style={{ borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-lg)" }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</p>
                <button className="text-xs font-semibold hover:underline" style={{ color: "var(--ch-primary)" }} onClick={() => setShowNotif(false)}>
                  Tandai semua dibaca
                </button>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id}
                  className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-colors hover:bg-slate-50"
                  style={{ borderColor: "var(--ch-border)", background: n.unread ? "#EFF6FF" : "white" }}
                  onClick={() => setShowNotif(false)}
                >
                  <NotifIcon icon={n.icon} bg={n.iconBg} fg={n.iconFg} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] leading-snug" style={{ color: "var(--ch-text)" }}>
                      <span className="font-semibold">{n.who}</span>{" "}{n.action}
                      {n.target && <> <span className="font-semibold">{n.target}</span></>}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{n.time}</p>
                  </div>
                  {n.unread && <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "var(--ch-primary)" }} />}
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs font-semibold hover:underline" style={{ color: "var(--ch-primary)" }}>
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            className="flex items-center gap-2 pl-2 sm:pl-3 ml-0.5 sm:ml-1 cursor-pointer"
            onClick={() => open("profile")}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 bg-orange-500"
            >
              {displayUser.initial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold leading-none text-white">{displayUser.subtitle}</p>
            </div>
            <ChevronDown className="hidden sm:block text-white/60" style={{ width: 14, height: 14 }} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border overflow-hidden animate-slide-in"
              style={{ borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-lg)" }}>
              <div className="px-4 py-3" style={{ background: "linear-gradient(135deg, var(--ch-primary-100), #EDE9FE)" }}>
                <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{displayUser.name}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{displayUser.subtitle}</p>
              </div>
              <div className="grid grid-cols-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
                <div className="flex flex-col items-center py-2.5 border-r" style={{ borderColor: "var(--ch-border)" }}>
                  <Megaphone style={{ width: 14, height: 14, marginBottom: 2, color: "var(--ch-text-muted)" }} />
                  <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{displayUser.stats.campaigns}</span>
                  <span className="text-[9px]" style={{ color: "var(--ch-text-soft)" }}>Kampanye</span>
                </div>
                <div className="flex flex-col items-center py-2.5 border-r" style={{ borderColor: "var(--ch-border)" }}>
                  <Users style={{ width: 14, height: 14, marginBottom: 2, color: "var(--ch-text-muted)" }} />
                  <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{displayUser.stats.creators}</span>
                  <span className="text-[9px]" style={{ color: "var(--ch-text-soft)" }}>Kreator</span>
                </div>
                <div className="flex flex-col items-center py-2.5">
                  <Coins style={{ width: 14, height: 14, marginBottom: 2, color: "var(--ch-text-muted)" }} />
                  <span className="text-[10px] font-bold leading-tight text-center" style={{ color: "var(--ch-text)" }}>{displayUser.stats.spent}</span>
                  <span className="text-[9px]" style={{ color: "var(--ch-text-soft)" }}>Spent</span>
                </div>
              </div>
              <button className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-slate-50"
                style={{ color: "var(--ch-text)" }}
                onClick={() => { navigate(profilePath); setShowProfile(false); }}>
                <User style={{ width: 16, height: 16, color: "var(--ch-text-muted)" }} /> My Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-slate-50"
                style={{ color: "var(--ch-text)" }}
                onClick={() => { navigate(settingsPath); setShowProfile(false); }}>
                <Settings style={{ width: 16, height: 16, color: "var(--ch-text-muted)" }} /> Settings
              </button>
              <div className="border-t" style={{ borderColor: "var(--ch-border)" }} />
              <button className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-red-50 text-red-600"
                onClick={handleLogout}>
                <LogOut style={{ width: 16, height: 16 }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
