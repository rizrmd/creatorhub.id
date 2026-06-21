import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, MessageSquare, Coins, Award, Zap, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { useKreatorData } from "@/context/KreatorDataContext";
import {
  KREATOR_TOP_POSTS,
  formatRp,
  formatRpShort,
  formatDeadlineLeft,
  formatReceivedAgo,
  CREATOR_RATING,
} from "@/data/kreatorData";
import { cn } from "@/lib/utils";

const cardHover =
  "transition-all hover:shadow-md hover:border-green-200 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer text-left w-full";

export default function CreatorHome() {
  const navigate = useNavigate();
  const { firstName } = useDisplayUser();
  const { invitations, stats, respondToInvitation } = useKreatorData();

  const pendingInvitations = stats.pendingInvitations;

  const kpis = useMemo(() => [
    {
      label: "Pending Invitations",
      value: String(stats.pendingInvitationCount),
      sub: "Awaiting response",
      hue: 220,
      icon: MessageSquare,
      href: "/dashboard/kreator/invitations",
    },
    {
      label: "Active Jobs",
      value: String(stats.activeJobCount),
      sub: stats.inProgressJobCount === 1 ? "1 in progress" : `${stats.inProgressJobCount} in progress`,
      hue: 142,
      icon: Zap,
      href: "/dashboard/kreator/work",
    },
    {
      label: "Earnings This Month",
      value: formatRpShort(stats.currentMonthEarnings),
      sub: `${stats.earningsGrowthPct >= 0 ? "+" : ""}${stats.earningsGrowthPct}% vs last month`,
      hue: 28,
      icon: Coins,
      href: "/dashboard/kreator/earnings",
    },
    {
      label: "Average Rating",
      value: String(stats.rating),
      sub: `From ${stats.reviewCount} reviews`,
      hue: 42,
      icon: Star,
      href: "/dashboard/kreator/profile",
    },
  ], [stats]);

  const achievements = useMemo(() => [
    { icon: "⭐", label: "Top Rated", desc: `Rating ${CREATOR_RATING}+`, href: "/dashboard/kreator/profile" },
    { icon: "⚡", label: "Fast Response", desc: "Reply <2 hours", href: "/dashboard/kreator/profile" },
    { icon: "✅", label: "Verified", desc: "ID verified", href: "/dashboard/kreator/profile" },
    { icon: "🔥", label: "Trending", desc: "Top 5% this month", href: "/dashboard/kreator/insights" },
  ], []);

  const respond = (id: string, accepted: boolean) => {
    respondToInvitation(id, accepted);
    toast.success(accepted ? "Invitation accepted! 🎉" : "Invitation declined");
  };

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Hero */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/kreator/invitations")}
        className={cn("rounded-2xl p-6 relative overflow-hidden block", cardHover)}
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #16A34A 60%, #4ade80 100%)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-12 translate-x-12" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="text-left">
            <p className="text-green-200 text-[13px] mb-1">Creator Portal</p>
            <h1
              className="text-[24px] font-extrabold text-white tracking-[-0.5px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Welcome, {firstName}! 👋
            </h1>
            <p className="text-green-200 text-[13px] mt-1">
              Anda punya{" "}
              <strong className="text-white">
                {stats.pendingInvitationCount} pending invitations
              </strong>{" "}
              respons
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/70 shrink-0 mt-1" />
        </div>
      </button>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => navigate(k.href)}
            className={cn("rounded-xl border p-4", cardHover)}
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${k.hue}, 80%, 95%)`, color: `hsl(${k.hue}, 60%, 40%)` }}
              >
                <k.icon style={{ width: 15, height: 15 }} />
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
            </div>
            <p
              className="text-[20px] font-extrabold"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {k.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{k.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: `hsl(${k.hue}, 60%, 40%)` }}>{k.sub}</p>
          </button>
        ))}
      </div>

      {/* Achievements */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard/kreator/profile")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>
            <Award style={{ display: "inline", width: 14, height: 14, marginRight: 6, color: "#F59E0B" }} />
            Your Achievements
          </p>
          <span className="text-[12px] font-semibold flex items-center gap-0.5 group-hover:underline" style={{ color: "#16A34A" }}>
            Lihat profil <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => navigate(a.href)}
              className={cn("rounded-xl p-3 text-center", cardHover)}
              style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}
            >
              <div className="text-xl mb-1">{a.icon}</div>
              <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{a.label}</p>
              <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Invitations */}
      {pendingInvitations.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/kreator/invitations")}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
              Latest Invitations
            </p>
            <span className="text-[12px] font-semibold flex items-center gap-0.5 group-hover:underline" style={{ color: "#16A34A" }}>
              Lihat semua ({invitations.length}) <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <div className="space-y-3">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-green-200 ring-1 ring-green-100"
                style={{ background: "#F0FDF4", borderColor: "#86EFAC", boxShadow: "var(--ch-shadow-sm)" }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/kreator/invitations/${inv.id}`)}
                  className="flex flex-1 items-center gap-3 sm:gap-4 min-w-0 text-left cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                    style={{ background: "var(--ch-primary)" }}
                  >
                    {inv.brand[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[13px] font-bold group-hover:underline" style={{ color: "var(--ch-text)" }}>
                        {inv.campaign}
                      </p>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase"
                        style={{ background: "#16A34A", color: "white" }}>Pending</span>
                    </div>
                    <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                      {inv.brand} · {inv.category} ·{" "}
                      <span style={{ color: "#F97316" }}>{formatDeadlineLeft(inv.deadline)}</span>
                      {" · "}Diterima {formatReceivedAgo(inv.receivedAt)}
                    </p>
                    <p className="text-[12px] font-bold mt-0.5 sm:hidden" style={{ color: "#16A34A" }}>
                      {formatRp(inv.budget)}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold shrink-0 hidden sm:block" style={{ color: "#16A34A" }}>
                    {formatRp(inv.budget)}
                  </p>
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
                </button>
                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => respond(inv.id, false)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border text-[12px] font-semibold cursor-pointer transition-colors hover:bg-red-50"
                    style={{ borderColor: "#FCA5A5", color: "#DC2626" }}
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => respond(inv.id, true)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
                    style={{ background: "#16A34A" }}
                  >
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
        <button
          type="button"
          onClick={() => navigate("/dashboard/kreator/insights")}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
            <TrendingUp style={{ display: "inline", width: 14, height: 14, marginRight: 6, color: "var(--ch-primary)" }} />
            Best Content This Month
          </p>
          <span className="text-[12px] font-semibold flex items-center gap-0.5 group-hover:underline" style={{ color: "#16A34A" }}>
            Lihat insights <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KREATOR_TOP_POSTS.map((p) => (
            <button
              key={p.content}
              type="button"
              onClick={() => navigate("/dashboard/kreator/insights")}
              className={cn("rounded-xl border p-4", cardHover)}
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{p.emoji}</span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}
                  >
                    {p.platform}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
              </div>
              <p className="text-[13px] font-semibold line-clamp-1 mb-2 text-left" style={{ color: "var(--ch-text)" }}>
                {p.content}
              </p>
              <div className="flex gap-4 text-[12px]">
                <div className="text-left">
                  <p className="font-bold" style={{ color: "var(--ch-text)" }}>{p.reach}</p>
                  <p style={{ color: "var(--ch-text-muted)" }}>Reach</p>
                </div>
                <div className="text-left">
                  <p className="font-bold" style={{ color: "#16A34A" }}>{p.engagement}</p>
                  <p style={{ color: "var(--ch-text-muted)" }}>Engagement</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}