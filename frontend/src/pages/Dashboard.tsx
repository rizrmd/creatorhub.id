import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Megaphone, Radio, Database, FolderOpen,
  MessageSquare, Sparkles, Coins, TrendingUp,
  Eye, CreditCard, Store, ChevronRight,
  FileVideo, BarChart3, Zap, Globe2, Shield,
} from "lucide-react";

const SERVICES = [
  { label: "Marketplace", desc: "Content creator discovery & hiring", icon: Store, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", link: "/dashboard/marketplace" },
  { label: "Campaigns", desc: "Influencer campaign management", icon: Megaphone, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", link: "/dashboard/campaigns" },
  { label: "Boost Ads", desc: "Ad boosting across platforms", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", link: "/dashboard/boost-ads" },
  { label: "Database", desc: "Creator database management", icon: Database, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", link: "/dashboard/database" },
  { label: "Creator Hub", desc: "Content creation & management", icon: FolderOpen, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", link: "/dashboard/creator-hub" },
  { label: "Media Monitoring", desc: "Real-time media tracking", icon: Radio, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", link: "/dashboard/media-monitoring" },
  { label: "AI Support", desc: "AI-powered campaign insights", icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", link: "/dashboard/ai-support" },
  { label: "Messages", desc: "Direct messaging with creators", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", link: "/dashboard/messages" },
];

const OVERVIEW_STATS = [
  { label: "Total Spent", value: "Rp 0", change: "Admin — all features free", icon: Coins, color: "text-orange-400" },
  { label: "Active Campaigns", value: "3", change: "1 pending review", icon: Megaphone, color: "text-blue-400" },
  { label: "Content Created", value: "156", change: "23 posts this week", icon: FileVideo, color: "text-teal-400" },
  { label: "Media Placements", value: "24", change: "8 this month", icon: Eye, color: "text-purple-400" },
];

const BREAKDOWN = [
  { label: "Content Creation", desc: "Creator collaborations & deliverables", value: "156 pieces", spent: "Rp 0", icon: FileVideo, color: "text-blue-400", bg: "bg-blue-500/10", link: "/dashboard/campaigns" },
  { label: "Media Placement", desc: "Publisher & media network reach", value: "24 placements", spent: "Rp 0", icon: Globe2, color: "text-orange-400", bg: "bg-orange-500/10", link: "/dashboard/homeless-media" },
  { label: "Boost & Ads", desc: "Paid promotion across platforms", value: "50K impressions", spent: "Rp 0", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", link: "/dashboard/boost-ads" },
  { label: "Media Monitoring", desc: "Brand mentions & sentiment tracking", value: "120 mentions", spent: "Rp 0", icon: BarChart3, color: "text-red-400", bg: "bg-red-500/10", link: "/dashboard/media-monitoring" },
];

const RECENT_ACTIVITY = [
  { title: "GlowUp Skincare campaign is now live", time: "2 hours ago", icon: Megaphone, color: "#22C55E" },
  { title: "Boost Ads: 50K impressions milestone reached", time: "5 hours ago", icon: TrendingUp, color: "#3B82F6" },
  { title: "3 new content deliverables submitted", time: "1 day ago", icon: FileVideo, color: "#F97316" },
  { title: "Media placement confirmed on Detik.com", time: "1 day ago", icon: Globe2, color: "#A855F7" },
  { title: "Payment of Rp 15M processed", time: "2 days ago", icon: CreditCard, color: "#8B5CF6" },
  { title: "New message from Tasya Farasya", time: "2 days ago", icon: MessageSquare, color: "#10B981" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.name || "Muhamad Al Azhari";
  const displayEmail = user?.email || "admin@creatorhub.id";
  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="pb-8">
      {/* Profile Card */}
      <div className="px-4 md:px-8 pt-6 pb-5">
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="h-20 w-full" style={{ background: "linear-gradient(135deg, #F97316, #3B82F6)" }} />
          <div className="px-5 pb-5 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white border-4 shrink-0" style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", borderColor: "var(--ch-surface)" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold truncate" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {displayName}
                  </h1>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 shrink-0">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{displayEmail}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">CreatorHub.ID</span>
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">All Features Unlocked</span>
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Rp 0 — Full Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="px-4 md:px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {OVERVIEW_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--ch-text-muted)" }}>{s.label}</span>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: "var(--ch-text)" }}>{s.value}</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-soft)" }}>{s.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribed Services */}
      <div className="px-4 md:px-8 mb-6">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Subscribed Services</h2>
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
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ch-text-muted)" }} />
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="px-4 md:px-8 mb-6">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Activity Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BREAKDOWN.map((b) => (
            <Link
              key={b.label}
              to={b.link}
              className="group rounded-xl border p-4 flex items-start gap-3 transition-all hover:scale-[1.01] no-underline"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${b.bg}`}>
                <b.icon className={`w-5 h-5 ${b.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{b.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{b.desc}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--ch-text)" }}>{b.value}</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--ch-text-soft)" }}>{b.spent}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ch-text-muted)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 md:px-8">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Recent Activity</h2>
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--ch-border)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${a.color}15` }}>
                <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium" style={{ color: "var(--ch-text)" }}>{a.title}</p>
              </div>
              <span className="text-[11px] shrink-0" style={{ color: "var(--ch-text-muted)" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
