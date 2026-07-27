import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Sprout, Building2, Globe2, Store,
  Rocket, Radio, Settings, ChevronRight, TrendingUp,
  Users, FileVideo,
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", desc: "Overview & statistics", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", link: "/dashboard/ekrafhub" },
  { label: "Desa Kreative", desc: "Creative villages network", icon: Sprout, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", link: "/dashboard/ekrafhub/desa-kreative" },
  { label: "Creative Hub", desc: "Creative hub management", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", link: "/dashboard/ekrafhub/creative-hub" },
  { label: "Creative by Indonesia", desc: "Indonesian creative content", icon: Globe2, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", link: "/dashboard/ekrafhub/creative-indonesia" },
  { label: "Marketplace", desc: "Creator marketplace", icon: Store, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", link: "/dashboard/ekrafhub/marketplace" },
  { label: "Boost Ads", desc: "Ad boosting platform", icon: Rocket, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", link: "/dashboard/ekrafhub/boost-ads" },
  { label: "Media Monitoring", desc: "Real-time media tracking", icon: Radio, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", link: "/dashboard/ekrafhub/media-monitoring" },
  { label: "Setting", desc: "Account & preferences", icon: Settings, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", link: "/dashboard/ekrafhub/settings" },
];

const STATS = [
  { label: "Desa Kreative", value: "24", change: "+3 this month", icon: Sprout, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Creative Hub", value: "12", change: "+2 this quarter", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Total Creators", value: "1,247", change: "89 active", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Campaigns", value: "38", change: "12 running", icon: FileVideo, color: "text-orange-400", bg: "bg-orange-500/10" },
];

const RECENT_ACTIVITY = [
  { title: "Desa Kreative Bandung added 5 new creators", time: "2 hours ago", icon: TrendingUp, color: "#22C55E" },
  { title: "Creative Hub Jakarta event completed", time: "5 hours ago", icon: Building2, color: "#8B5CF6" },
  { title: "12 new creators joined from Sulawesi", time: "1 day ago", icon: Users, color: "#3B82F6" },
  { title: "Media Monitoring report generated", time: "1 day ago", icon: Radio, color: "#F97316" },
  { title: "Boost Ads campaign reached 100K impressions", time: "2 days ago", icon: Rocket, color: "#A855F7" },
];

export default function EkrafHubDashboard() {
  const { user } = useAuth();
  const displayName = user?.name || "Ekraf Hub";
  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
            {initials}
          </div>
          <div>
            <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              EkrafHub Dashboard
            </h1>
            <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
              Welcome back, {displayName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border p-4"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)" }}>{s.value}</p>
                  <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                </div>
              </div>
              <p className="text-[11px] mt-2" style={{ color: "#16A34A" }}>{s.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <h2 className="text-[15px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`rounded-xl border p-4 flex items-center gap-3 transition-all hover:scale-[1.02] ${item.bg} ${item.border}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{item.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Recent Activity</h2>
          <div className="rounded-xl border p-4 space-y-3"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            {RECENT_ACTIVITY.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${a.color}15`, color: a.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold leading-tight" style={{ color: "var(--ch-text)" }}>{a.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
