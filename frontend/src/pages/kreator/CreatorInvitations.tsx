import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Inbox, CheckCircle, XCircle, Clock, Sparkles, Search, ChevronRight } from "lucide-react";
import { useKreatorData } from "@/context/KreatorDataContext";
import {
  formatRp,
  formatReceivedAgo,
  isNewInvitation,
  sortInvitations,
  type InvitationStatus,
  type KreatorInvitation,
} from "@/data/kreatorData";
import { cn } from "@/lib/utils";

const TAB_FILTERS: { key: "all" | InvitationStatus; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Inbox },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "accepted", label: "Accepted", icon: CheckCircle },
  { key: "declined", label: "Declined", icon: XCircle },
];

const statusChip = (status: InvitationStatus) => {
  const map: Record<InvitationStatus, { label: string; bg: string; fg: string }> = {
    pending: { label: "Awaiting response", bg: "#FEF3C7", fg: "#B45309" },
    accepted: { label: "Accepted", bg: "#DCFCE7", fg: "#15803D" },
    declined: { label: "Declined", bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}>{s.label}</span>
  );
};

function InvitationCard({ inv, onOpen }: { inv: KreatorInvitation; onOpen: () => void }) {
  const isNew = isNewInvitation(inv);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-xl border overflow-hidden transition-all text-left cursor-pointer",
        "hover:shadow-md hover:border-green-200 active:scale-[0.995]",
        isNew && "ring-2 ring-green-200 shadow-md",
      )}
      style={{
        background: isNew ? "#F0FDF4" : "var(--ch-surface)",
        borderColor: isNew ? "#86EFAC" : "var(--ch-border)",
        boxShadow: isNew ? undefined : "var(--ch-shadow-sm)",
      }}
    >
      <div className="p-4 flex items-center gap-4 relative">
        {isNew && (
          <span
            className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
            style={{ background: "#16A34A" }}
          />
        )}

        <div className="relative shrink-0 ml-1">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[15px]"
            style={{ background: isNew ? "#16A34A" : "var(--ch-primary)" }}
          >
            {inv.brand[0]}
          </div>
          {isNew && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ background: "#F97316" }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{inv.campaign}</p>
            {isNew && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                style={{ background: "#16A34A", color: "white" }}
              >
                Pending
              </span>
            )}
            {statusChip(inv.status)}
          </div>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
            {inv.brand} · {inv.category}
          </p>
          <p className="text-[11px] mt-0.5 flex flex-wrap items-center gap-2" style={{ color: "var(--ch-text-soft)" }}>
            <span className="flex items-center gap-1">
              <Clock style={{ width: 10, height: 10 }} />
              Diterima {formatReceivedAgo(inv.receivedAt)}
            </span>
            <span>·</span>
            <span>Deadline {new Date(inv.deadline).toLocaleDateString("id-ID")}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <p className="text-[14px] font-bold" style={{ color: "#16A34A" }}>
            {formatRp(inv.budget)}
          </p>
          <ChevronRight className="w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
        </div>
      </div>
    </button>
  );
}

function SectionHeader({ title, count, highlight }: { title: string; count: number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <p
        className="text-[13px] font-bold"
        style={{ color: highlight ? "#15803D" : "var(--ch-text-muted)" }}
      >
        {title}
      </p>
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={
          highlight
            ? { background: "#DCFCE7", color: "#15803D" }
            : { background: "var(--ch-bg)", color: "var(--ch-text-muted)" }
        }
      >
        {count}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--ch-border)" }} />
    </div>
  );
}

function matchesInvitationSearch(inv: KreatorInvitation, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [inv.brand, inv.campaign, inv.category, inv.brief]
    .some((field) => field.toLowerCase().includes(q));
}

export default function CreatorInvitations() {
  const navigate = useNavigate();
  const { invitations } = useKreatorData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<"all" | InvitationStatus>("all");
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const openDetail = (id: string) => navigate(`/dashboard/kreator/invitations/${id}`);

  const sorted = useMemo(() => sortInvitations(invitations), [invitations]);
  const searched = useMemo(
    () => sorted.filter((inv) => matchesInvitationSearch(inv, search)),
    [sorted, search],
  );
  const newInvitations = searched.filter(isNewInvitation);
  const historyInvitations = searched.filter((i) => !isNewInvitation(i));

  const filtered = filter === "all"
    ? searched
    : filter === "pending"
      ? newInvitations
      : searched.filter((i) => i.status === filter);

  const counts = {
    all: searched.length,
    pending: newInvitations.length,
    accepted: searched.filter((i) => i.status === "accepted").length,
    declined: searched.filter((i) => i.status === "declined").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Brand Invitations
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            <strong style={{ color: "var(--ch-text)" }}>
              {search.trim() ? `${counts.all} results` : `${invitations.length} total invitations`}
            </strong>
            {" · "}
            <strong style={{ color: "#16A34A" }}>{counts.pending} pending</strong> your response
          </p>
        </div>
        <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
          <input
            className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-[13px] outline-none"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            placeholder="Search brand, campaign, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: "var(--ch-border)" }}>
        {TAB_FILTERS.map((t) => {
          const Icon = t.icon;
          const count = counts[t.key];
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors shrink-0 cursor-pointer"
              style={active
                ? { borderColor: "#16A34A", color: "#16A34A" }
                : { borderColor: "transparent", color: "var(--ch-text-muted)" }}>
              <Icon style={{ width: 13, height: 13 }} />
              {t.label}
              <span className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={active ? { background: "#DCFCE7", color: "#15803D" } : { background: "var(--ch-bg)", color: "var(--ch-text-muted)" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {counts.pending > 0 && filter === "all" && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <Sparkles style={{ width: 18, height: 18, color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#064E3B" }}>
              {counts.pending} invitations awaiting response
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: "#065F46" }}>
              Cards with green label &quot;Pending&quot; are invitations that need your action.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filter === "all" ? (
          <>
            {newInvitations.length > 0 && (
              <div className="space-y-3">
                <SectionHeader title="Pending Invitations" count={newInvitations.length} highlight />
                {newInvitations.map((inv) => (
                  <InvitationCard key={inv.id} inv={inv} onOpen={() => openDetail(inv.id)} />
                ))}
              </div>
            )}
            {historyInvitations.length > 0 && (
              <div className="space-y-3">
                <SectionHeader title="History" count={historyInvitations.length} />
                {historyInvitations.map((inv) => (
                  <InvitationCard key={inv.id} inv={inv} onOpen={() => openDetail(inv.id)} />
                ))}
              </div>
            )}
          </>
        ) : (
          filtered.map((inv) => (
            <InvitationCard key={inv.id} inv={inv} onOpen={() => openDetail(inv.id)} />
          ))
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--ch-text-soft)" }}>
            <Inbox style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
            <p className="text-[14px] font-medium">
              {search.trim() ? `No invitations found for "${search.trim()}"` : "No invitations in this category"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}