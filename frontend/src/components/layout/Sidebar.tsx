import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Megaphone,
  BarChart3,
  Radio,
  MessageSquare,
  CreditCard,
  Settings,
  Zap,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/marketplace", icon: Store, label: "Marketplace" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/media-monitoring", icon: Radio, label: "Media Monitoring" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-[70px] flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 font-display leading-none">CreatorHub</p>
            <p className="text-[10px] text-slate-400">.id</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom cards */}
      <div className="p-3 space-y-2">
        <div className="bg-blue-600 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold mb-1">Jadi Kreator?</p>
          <p className="text-[11px] opacity-80">Daftarkan profil kamu dan dapatkan tawaran brand.</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-700">Butuh Bantuan?</p>
            <p className="text-[11px] text-slate-500">Hubungi support kami</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
