import { useNavigate } from "react-router-dom";
import { DollarSign, Rocket, AlertCircle, FileCheck, Wallet, Eye, Clock, Plus, Search, BarChart3, ChevronRight, Info } from "lucide-react";

const STATS = [
  { label: "Pending Reviews", value: "2",        barColor: "#16A34A", icon: FileCheck },
  { label: "Revenue This Week", value: "Rp 247k", barColor: "#2563EB", icon: Wallet },
  { label: "Total Views",      value: "27M",     barColor: "#A855F7", icon: Eye },
  { label: "Total Earnings",   value: "Rp 18.4rb", barColor: "#F97316", icon: DollarSign },
];

const NEEDS_ATTENTION = [
  { title: "3 collaborations awaiting your approval", desc: "Review now", time: "2 hours ago", type: "warning", href: "/campaigns" },
  { title: "2 creators waiting for your reply", desc: "Open Messages", time: "1 day ago", type: "warning", href: "/messages" },
  { title: "Lebaran Travel Series ends in 4 days", desc: "Open Campaign", time: "2 days ago", type: "urgent", href: "/campaigns" },
  { title: "Ramadan Give at 50% of budget", desc: "Adjust Budget", time: "3 days ago", type: "urgent", href: "/campaigns" },
];

const ACTIVE_CAMPAIGNS = [
  { name: "Ramadan Give 2024", status: "Active", progress: "16 / 50", pct: 32, revenue: "Rp 12.3k", views: "4.2k" },
  { name: "Lebaran Travel Series", status: "Active", progress: "21 / 50", pct: 42, revenue: "Rp 18.7k", views: "6.1k" },
];

const TOP_CREATORS = [
  { name: "Tasya Farasya", earnings: "Rp 18.2k", avatarColor: "#3B82F6" },
  { name: "Jasmin Putri", earnings: "Rp 15.3k", avatarColor: "#22C55E" },
  { name: "Fadli Jodi", earnings: "Rp 12.1k", avatarColor: "#A855F7" },
];

const RECENT_ACTIVITY = [
  { user: "Tasya Farasya", action: "completed campaign Ramadan Give 2024", time: "2 hours ago", avatarColor: "#3B82F6" },
  { user: "Jasmin Putri", action: "joined Lebaran Travel Series", time: "5 hours ago", avatarColor: "#22C55E" },
  { user: "Fadli Jodi", action: "requested Rp 8.7k for Ramadan Give 2024", time: "1 day ago", avatarColor: "#A855F7" },
  { user: "Ari Budiman", action: "created campaign Summer Drop & Shop", time: "2 days ago", avatarColor: "#F97316" },
];

const QUICK_ACTIONS = [
  { label: "New Campaign", icon: Plus, href: "/campaigns", color: "#3B82F6" },
  { label: "Find Creators", icon: Search, href: "/marketplace", color: "#22C55E" },
  { label: "Launch Ads", icon: Rocket, href: "/campaigns", color: "#A855F7" },
  { label: "View Reports", icon: BarChart3, href: "/analytics", color: "#A855F7" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* User Greeting */}
      <div className="mb-6">
        <h1 className="text-[32px] font-extrabold leading-tight mb-2" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Ari!!
        </h1>
        <p className="text-[14px]" style={{ color: "var(--ch-text-muted)" }}>
          You have <strong style={{ color: "var(--ch-text)" }}>3 marketplaces</strong> to review, <strong style={{ color: "var(--ch-text)" }}>2 creators</strong> awaiting response, and <strong style={{ color: "var(--ch-text)" }}>1 campaign</strong> ending this week.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5 border relative overflow-hidden"
            style={{
              background: "var(--ch-surface)",
              borderColor: "var(--ch-border)",
              boxShadow: "var(--ch-shadow-sm)",
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: s.barColor }} />
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium mb-1" style={{ color: "#6B7280" }}>{s.label}</p>
                <p className="text-[24px] font-extrabold leading-tight" style={{ color: "#1F2937", fontFamily: "'Inter', sans-serif" }}>
                  {s.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: s.barColor + "15" }}>
                <s.icon style={{ width: 20, height: 20, color: s.barColor }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Your Attention */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
                Needs your attention
              </h2>
              <Info style={{ width: 16, height: 16, color: "#9CA3AF" }} />
            </div>
            <div className="space-y-3">
              {NEEDS_ATTENTION.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
                  <AlertCircle style={{ width: 18, height: 18, color: item.type === "urgent" ? "#F97316" : "#F59E0B", flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--ch-text)" }}>{item.title}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(item.href)} className="text-[12px] font-medium hover:underline" style={{ color: "#3B82F6" }}>
                        {item.desc}
                      </button>
                      <ChevronRight style={{ width: 14, height: 14, color: "#9CA3AF" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: "#9CA3AF" }}>
                    <Clock style={{ width: 12, height: 12 }} />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
                Active campaigns
              </h2>
              <Info style={{ width: 16, height: 16, color: "#9CA3AF" }} />
            </div>
            <div className="space-y-3">
              {ACTIVE_CAMPAIGNS.map((campaign) => (
                <button key={campaign.name} onClick={() => navigate("/campaigns")}
                  className="w-full text-left p-4 rounded-lg border transition-all hover:border-blue-300"
                  style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>{campaign.name}</p>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#15803D" }}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px]" style={{ color: "#6B7280" }}>{campaign.progress}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium" style={{ color: "var(--ch-text)" }}>{campaign.revenue}</span>
                      <span className="text-[12px]" style={{ color: "#6B7280" }}>{campaign.views}</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "#E5E7EB" }}>
                    <div className="h-2 rounded-full" style={{ width: `${campaign.pct}%`, background: "#3B82F6" }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
              Performance - last 30 days
            </h2>
            <div className="h-48 flex items-center justify-center rounded-lg" style={{ background: "#F9FAFB" }}>
              <div className="text-center">
                <BarChart3 style={{ width: 48, height: 48, color: "#9CA3AF", marginBottom: 8 }} />
                <p className="text-[13px]" style={{ color: "#6B7280" }}>Performance chart</p>
                <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>71.2k total • 4.67k avg • 352.5k views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
              Quick actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button key={action.label} onClick={() => navigate(action.href)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md"
                  style={{ borderColor: "var(--ch-border)", background: "#F9FAFB" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: action.color + "15" }}>
                    <action.icon style={{ width: 20, height: 20, color: action.color }} />
                  </div>
                  <span className="text-[12px] font-semibold text-center leading-tight" style={{ color: "var(--ch-text)" }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
              Top creators - this quarter
            </h2>
            <div className="space-y-3">
              {TOP_CREATORS.map((creator, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#F9FAFB" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0" style={{ background: creator.avatarColor }}>
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{creator.name}</p>
                  </div>
                  <span className="text-[12px] font-medium" style={{ color: "#6B7280" }}>{creator.earnings}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
              Recent activity
            </h2>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: activity.avatarColor }}>
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px]" style={{ color: "var(--ch-text)" }}>
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
