import { useState } from "react";
import { Star, TrendingUp, MessageSquare, DollarSign, Award, Zap } from "lucide-react";
import { toast } from "sonner";

const KPIs = [
  { label: "New Invitations",    value: "3",       sub: "Awaiting response",    hue: 220, icon: MessageSquare },
  { label: "Active Jobs",        value: "2",       sub: "In progress",          hue: 142, icon: Zap },
  { label: "Earnings This Month", value: "Rp 12.4jt", sub: "+18% vs last month", hue: 28, icon: DollarSign },
  { label: "Average Rating",     value: "4.9",     sub: "From 24 reviews",       hue: 42,  icon: Star },
];

const invitations = [
  { id: "1", brand: "Wardah",   campaign: "Ramadan Glow Campaign", budget: "Rp 5.000.000", deadline: "2 days left", category: "Beauty", accepted: false },
  { id: "2", brand: "Tokopedia", campaign: "Flash Sale July 2026",  budget: "Rp 3.500.000", deadline: "5 days left", category: "E-Commerce", accepted: false },
  { id: "3", brand: "Grab",      campaign: "GrabFood Summer Promo", budget: "Rp 4.200.000", deadline: "7 days left", category: "Food & Beverage", accepted: false },
];

const topPosts = [
  { platform: "Instagram", content: "Skincare routine pagi hari ☀️", reach: "84K", engagement: "6.2%", emoji: "📸" },
  { platform: "TikTok",    content: "GRWM ke kondangan bestie!",    reach: "210K", engagement: "8.4%", emoji: "🎬" },
  { platform: "YouTube",   content: "Review Skincare Budget Rp50rb", reach: "42K",  engagement: "4.8%", emoji: "▶️" },
];

const achievements = [
  { icon: "⭐", label: "Top Rated",    desc: "Rating 4.9+" },
  { icon: "⚡", label: "Fast Response", desc: "Reply <2 hours" },
  { icon: "✅", label: "Verified",     desc: "ID verified" },
  { icon: "🔥", label: "Trending",      desc: "Top 5% this month" },
];

export default function CreatorHome() {
  const [invs, setInvs] = useState(invitations);

  const respond = (id: string, accepted: boolean) => {
    setInvs((list) => list.filter((i) => i.id !== id));
    toast.success(accepted ? "Invitation accepted! 🎉" : "Invitation declined");
  };

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #16A34A 60%, #4ade80 100%)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-12 translate-x-12" />
        <div className="relative">
          <p className="text-green-200 text-[13px] mb-1">Creator Portal</p>
          <h1 className="text-[24px] font-extrabold text-white tracking-[-0.5px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome, Tasya! 👋
          </h1>
          <p className="text-green-200 text-[13px] mt-1">
            You have <strong className="text-white">{invs.length} new invitations</strong> waiting
          </p>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIs.map((k) => (
          <div key={k.label} className="rounded-xl border p-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${k.hue}, 80%, 95%)`, color: `hsl(${k.hue}, 60%, 40%)` }}>
                <k.icon style={{ width: 15, height: 15 }} />
              </div>
            </div>
            <p className="text-[20px] font-extrabold"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {k.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{k.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: `hsl(${k.hue}, 60%, 40%)` }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="rounded-xl border p-5"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>
          <Award style={{ display: "inline", width: 14, height: 14, marginRight: 6, color: "#F59E0B" }} />
          Your Achievements
        </p>
        <div className="flex gap-3">
          {achievements.map((a) => (
            <div key={a.label} className="flex-1 rounded-xl p-3 text-center"
              style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
              <div className="text-xl mb-1">{a.icon}</div>
              <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{a.label}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations */}
      {invs.length > 0 && (
        <div>
          <p className="text-[14px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>
            Latest Invitations
          </p>
          <div className="space-y-3">
            {invs.map((inv) => (
              <div key={inv.id} className="rounded-xl border p-4 flex items-center gap-4"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                  style={{ background: "var(--ch-primary)" }}>
                  {inv.brand[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{inv.campaign}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                    {inv.brand} · {inv.category} · <span style={{ color: "#F97316" }}>{inv.deadline}</span>
                  </p>
                </div>
                <p className="text-[13px] font-bold shrink-0" style={{ color: "#16A34A" }}>{inv.budget}</p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => respond(inv.id, false)}
                    className="px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors"
                    style={{ borderColor: "#FCA5A5", color: "#DC2626" }}>
                    Decline
                  </button>
                  <button onClick={() => respond(inv.id, true)}
                    className="px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold"
                    style={{ background: "#16A34A" }}>
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top posts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
            <TrendingUp style={{ display: "inline", width: 14, height: 14, marginRight: 6, color: "var(--ch-primary)" }} />
            Best Content This Month
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPosts.map((p) => (
            <div key={p.content} className="rounded-xl border p-4"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{p.emoji}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                  {p.platform}
                </span>
              </div>
              <p className="text-[13px] font-semibold line-clamp-1 mb-2" style={{ color: "var(--ch-text)" }}>
                {p.content}
              </p>
              <div className="flex gap-4 text-[12px]">
                <div>
                  <p className="font-bold" style={{ color: "var(--ch-text)" }}>{p.reach}</p>
                  <p style={{ color: "var(--ch-text-muted)" }}>Reach</p>
                </div>
                <div>
                  <p className="font-bold" style={{ color: "#16A34A" }}>{p.engagement}</p>
                  <p style={{ color: "var(--ch-text-muted)" }}>Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
