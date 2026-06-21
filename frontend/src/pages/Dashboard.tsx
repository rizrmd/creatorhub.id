import { Link } from "react-router-dom";
import {
  Rocket, Megaphone, Radio, Database, FolderOpen,
  MessageSquare, Sparkles, BarChart3, Coins, TrendingUp,
  Eye, CreditCard, Store, ChevronRight,
} from "lucide-react";

/* ---------- Data ---------- */
const SERVICES = [
  { label: "Marketplace", desc: "Discover and hire creators", icon: Store, spent: "Rp 85M", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", link: "/dashboard/marketplace" },
  { label: "Campaigns", desc: "3 active campaigns", icon: Megaphone, spent: "Rp 120M", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", link: "/dashboard/campaigns" },
  { label: "Boost Ads", desc: "2 ad campaigns running", icon: Rocket, spent: "Rp 45M", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", link: "/dashboard/boost-ads" },
  { label: "Database", desc: "8 creators in database", icon: Database, spent: "Rp 0", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", link: "/dashboard/database" },
  { label: "Content Hub", desc: "Manage your content", icon: FolderOpen, spent: "Rp 0", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", link: "/dashboard/content-hub" },
  { label: "Media Monitoring", desc: "Track media mentions", icon: Radio, spent: "Rp 15M", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", link: "/dashboard/media-monitoring" },
  { label: "AI Support", desc: "AI-powered insights", icon: Sparkles, spent: "Rp 0", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", link: "/dashboard/ai-support" },
  { label: "Messages", desc: "12 unread messages", icon: MessageSquare, spent: "", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", link: "/dashboard/messages" },
];

const STATS = [
  { label: "Total Spent", value: "Rp 265M", sub: "+12% from last month", icon: Coins, color: "text-orange-400" },
  { label: "Active Campaigns", value: "3", sub: "1 pending review", icon: Megaphone, color: "text-blue-400" },
  { label: "Media Placements", value: "24", sub: "8 this month", icon: Eye, color: "text-purple-400" },
  { label: "Content Created", value: "156", sub: "23 posts this week", icon: BarChart3, color: "text-teal-400" },
];

const RECENT_ACTIVITY = [
  { title: "GlowUp Skincare campaign is live", time: "2 hours ago", icon: Megaphone, color: "text-green-400" },
  { title: "Boost Ads: 50K impressions reached", time: "5 hours ago", icon: TrendingUp, color: "text-blue-400" },
  { title: "New message from Tasya Farasya", time: "1 day ago", icon: MessageSquare, color: "text-orange-400" },
  { title: "Payment of Rp 15M processed", time: "2 days ago", icon: CreditCard, color: "text-purple-400" },
];

export default function Dashboard() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Overview of your services, campaigns, and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="px-4 md:px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs font-semibold" style={{ color: "var(--ch-text-muted)" }}>{s.label}</span>
              </div>
              <p className="text-xl font-extrabold" style={{ color: "var(--ch-text)" }}>{s.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 md:px-8 mb-6">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Your Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SERVICES.map((s) => (
            <Link
              key={s.label}
              to={s.link}
              className="group rounded-xl border p-4 transition-all hover:scale-[1.02] no-underline"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg} ${s.border} border`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ch-text-muted)" }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{s.desc}</p>
              {s.spent && (
                <p className="text-xs font-semibold mt-2" style={{ color: "var(--ch-text-soft)" }}>
                  Spent: {s.spent}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 md:px-8 pb-8">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Recent Activity</h2>
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--ch-border)" }}>
              <a.icon className={`w-4 h-4 shrink-0 ${a.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>{a.title}</p>
              </div>
              <span className="text-xs shrink-0" style={{ color: "var(--ch-text-muted)" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
