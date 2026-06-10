import { useNavigate } from "react-router-dom";
import { DollarSign, Rocket, FileText, Wallet, Eye, Plus, User, TrendingUp, BarChart3, Check, MessageSquare, Zap, CheckCircle } from "lucide-react";

const STATS = [
  { label: "Pending Reviews", value: "2",        barColor: "#16A34A", icon: FileText },
  { label: "Revenue This Week", value: "Rp 247k", barColor: "#2563EB", icon: DollarSign },
  { label: "Total Views",      value: "27M",     barColor: "#A855F7", icon: Eye },
  { label: "Total Earnings",   value: "Rp 18.4rb", barColor: "#F97316", icon: Wallet },
];

const NEEDS_ATTENTION = [
  {
    title: "3 deliverables awaiting your approval",
    description: "Tasya, Fadil & Sisca submitted content for Ramadan Glow 2026",
    buttonText: "Review Now",
    icon: Check,
    iconBg: "#FEF3C7",
    iconColor: "#1F2937",
    borderColor: "#F59E0B",
    href: "/campaigns"
  },
  {
    title: "2 creators waiting for your reply",
    description: "Messages from Tasya Farasya and Fadli Jodi require response",
    buttonText: "Reply Now",
    icon: MessageSquare,
    iconBg: "#FEE2E2",
    iconColor: "#1F2937",
    borderColor: "#F87171",
    href: "/messages"
  },
  {
    title: "Lebaran Travel Series ends in 4 days",
    description: "16 of 21 deliverables submitted, campaign deadline approaching",
    buttonText: "View Campaign",
    icon: Zap,
    iconBg: "#DBEAFE",
    iconColor: "#1F2937",
    borderColor: "#3B82F6",
    href: "/campaigns"
  },
  {
    title: "Ramadan Give 2024 at 50% of budget",
    description: "Rp 18.7k spent of Rp 37.5k total budget, on pace to overspend",
    buttonText: "Adjust Budget",
    icon: BarChart3,
    iconBg: "#FED7AA",
    iconColor: "#1F2937",
    borderColor: "#EF4444",
    href: "/campaigns"
  },
];

const ACTIVE_CAMPAIGNS = [
  {
    name: "Ramadan Give 2024",
    status: "Active",
    deliverables: "16 of 21",
    deliverablesPct: 76,
    budget: "Rp 18.7k of Rp 37.5k",
    budgetPct: 50,
    views: "6.1k",
    borderColor: "#EF4444"
  },
  {
    name: "Lebaran Travel Series",
    status: "Active",
    deliverables: "16 of 21",
    deliverablesPct: 76,
    budget: "Rp 18.7k of Rp 37.5k",
    budgetPct: 50,
    views: "6.1k",
    borderColor: "#3B82F6"
  },
];

const TOP_CREATORS = [
  {
    rank: 1,
    name: "Tasya Farasya",
    verified: true,
    metrics: "8.4M reach",
    rating: 4.9,
    earnings: "Rp 18.2k",
    avgFee: "avg fee",
    avatarColor: "#3B82F6",
    rankColor: "#F59E0B"
  },
  {
    rank: 2,
    name: "Jasmin Putri",
    verified: true,
    metrics: "5.2M reach",
    rating: 4.8,
    earnings: "Rp 15.3k",
    avgFee: "avg fee",
    avatarColor: "#22C55E",
    rankColor: "#6B7280"
  },
  {
    rank: 3,
    name: "Fadli Jodi",
    verified: true,
    metrics: "3.1M reach",
    rating: 4.7,
    earnings: "Rp 12.1k",
    avgFee: "avg fee",
    avatarColor: "#A855F7",
    rankColor: "#F87171"
  },
];

const RECENT_ACTIVITY = [
  { user: "Tasya Farasya", action: "completed campaign Ramadan Give 2024", time: "2 hours ago", avatarColor: "#3B82F6" },
  { user: "Jasmin Putri", action: "joined Lebaran Travel Series", time: "5 hours ago", avatarColor: "#22C55E" },
  { user: "Fadli Jodi", action: "requested Rp 8.7k for Ramadan Give 2024", time: "1 day ago", avatarColor: "#A855F7" },
  { user: "Ari Budiman", action: "created campaign Summer Drop & Shop", time: "2 days ago", avatarColor: "#F97316" },
];

const QUICK_ACTIONS = [
  { label: "New Campaign", subtitle: "Start a fresh brief", icon: Plus, href: "/campaigns", color: "#3B82F6" },
  { label: "Find Creators", subtitle: "Browse talent pool", icon: User, href: "/marketplace", color: "#22C55E" },
  { label: "Launch Ads", subtitle: "Boost your content", icon: Rocket, href: "/campaigns", color: "#A855F7" },
  { label: "View Reports", subtitle: "Check performance", icon: TrendingUp, href: "/analytics", color: "#A855F7" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* User Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-[32px] font-extrabold leading-tight mb-2" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
                  Needs your attention
                </h2>
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                  4
                </span>
              </div>
              <p className="text-[12px]" style={{ color: "#6B7280" }}>Top items as of today</p>
            </div>
            <div className="space-y-3">
              {NEEDS_ATTENTION.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border-l-4" style={{ background: "#F9FAFB", borderColor: item.borderColor, borderLeftWidth: 4 }}>
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: item.iconBg }}>
                      <item.icon style={{ width: 24, height: 24, color: item.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold mb-1 leading-tight" style={{ color: "var(--ch-text)" }}>{item.title}</p>
                      <p className="text-[12px] leading-snug" style={{ color: "#6B7280" }}>{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(item.href)}
                    className="text-[12px] font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors hover:opacity-90 w-full sm:w-auto"
                    style={{ background: "#3B82F6", color: "white" }}
                  >
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Inter', sans-serif" }}>
                Active campaigns
              </h2>
              <button className="flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-lg border" style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#6B7280" }}>
                Ongoing
                <span style={{ fontSize: 10 }}>▼</span>
              </button>
            </div>
            <div className="space-y-3">
              {ACTIVE_CAMPAIGNS.map((campaign) => (
                <button key={campaign.name} onClick={() => navigate("/campaigns")}
                  className="w-full text-left p-4 rounded-lg border-l-4 transition-all hover:border-blue-300"
                  style={{ background: "#F9FAFB", borderColor: "#E5E7EB", borderLeftColor: campaign.borderColor, borderLeftWidth: 4 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>{campaign.name}</p>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#15803D" }}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-[12px] mb-1" style={{ color: "#6B7280" }}>{campaign.deliverables}</p>
                      <div className="w-full rounded-full h-2" style={{ background: "#E5E7EB" }}>
                        <div className="h-2 rounded-full" style={{ width: `${campaign.deliverablesPct}%`, background: "#3B82F6" }} />
                      </div>
                    </div>

                    <div>
                      <p className="text-[12px] mb-1" style={{ color: "#6B7280" }}>{campaign.budget}</p>
                      <div className="w-full rounded-full h-2" style={{ background: "#E5E7EB" }}>
                        <div className="h-2 rounded-full" style={{ width: `${campaign.budgetPct}%`, background: "#F59E0B" }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[12px]" style={{ color: "#6B7280" }}>{campaign.views}</span>
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
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md"
                  style={{ borderColor: "var(--ch-border)", background: "#F9FAFB" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: action.color + "15" }}>
                    <action.icon style={{ width: 20, height: 20, color: action.color }} />
                  </div>
                  <div className="text-left">
                    <span className="text-[12px] font-semibold leading-tight" style={{ color: "var(--ch-text)" }}>{action.label}</span>
                    <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>{action.subtitle}</p>
                  </div>
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
                  {/* Ranking Number - individual colors */}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: creator.rankColor }}>
                    {creator.rank}
                  </div>
                  {/* Creator Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0" style={{ background: creator.avatarColor }}>
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{creator.name}</p>
                      {creator.verified && (
                        <CheckCircle style={{ width: 14, height: 14, color: "#3B82F6" }} />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>{creator.metrics}</span>
                      <span style={{ color: "#F59E0B" }}>⭐</span>
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>{creator.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{creator.earnings}</p>
                    <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{creator.avgFee}</p>
                  </div>
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
                      <span className="font-semibold">{activity.user}</span> <span className="font-bold" style={{ color: "#3B82F6" }}>{activity.action}</span>
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
