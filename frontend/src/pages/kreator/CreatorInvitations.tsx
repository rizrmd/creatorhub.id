import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox, CheckCircle, XCircle, Clock, Filter, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
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
  { key: "all", label: "Semua", icon: Inbox },
  { key: "pending", label: "Menunggu", icon: Clock },
  { key: "accepted", label: "Diterima", icon: CheckCircle },
  { key: "declined", label: "Ditolak", icon: XCircle },
];

const statusChip = (status: InvitationStatus) => {
  const map: Record<InvitationStatus, { label: string; bg: string; fg: string }> = {
    pending: { label: "Menunggu respons", bg: "#FEF3C7", fg: "#B45309" },
    accepted: { label: "Diterima", bg: "#DCFCE7", fg: "#15803D" },
    declined: { label: "Ditolak", bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}>{s.label}</span>
  );
};

function InvitationCard({
  inv,
  expanded,
  onToggle,
  onRespond,
}: {
  inv: KreatorInvitation;
  expanded: boolean;
  onToggle: () => void;
  onRespond: (accepted: boolean) => void;
}) {
  const isNew = isNewInvitation(inv);

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-shadow",
        isNew && "ring-2 ring-green-200 shadow-md",
      )}
      style={{
        background: isNew ? "#F0FDF4" : "var(--ch-surface)",
        borderColor: isNew ? "#86EFAC" : "var(--ch-border)",
        boxShadow: isNew ? undefined : "var(--ch-shadow-sm)",
      }}
    >
      <div
        className="p-4 flex items-center gap-4 relative"
        style={{ cursor: "pointer" }}
        onClick={onToggle}
      >
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
                Menunggu
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

        <p className="text-[14px] font-bold shrink-0" style={{ color: "#16A34A" }}>
          {formatRp(inv.budget)}
        </p>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: isNew ? "#BBF7D0" : "var(--ch-border)" }}>
          <p className="text-[12px] mt-3" style={{ color: "var(--ch-text-muted)" }}>Brief:</p>
          <p className="text-[13px] mt-1 mb-4" style={{ color: "var(--ch-text)" }}>{inv.brief}</p>
          {inv.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onRespond(false); }}
                className="flex-1 py-2 rounded-lg border text-[13px] font-semibold"
                style={{ borderColor: "#FCA5A5", color: "#DC2626" }}
              >
                Tolak
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRespond(true); }}
                className="flex-1 py-2 rounded-lg text-white text-[13px] font-semibold"
                style={{ background: "#16A34A" }}
              >
                Terima Undangan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
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
  const { invitations, respondToInvitation } = useKreatorData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<"all" | InvitationStatus>("all");
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const respond = (id: string, accepted: boolean) => {
    respondToInvitation(id, accepted);
    setExpanded(null);
    toast.success(accepted ? "Undangan diterima! 🎉" : "Undangan ditolak");
  };

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
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Undangan Brand
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          <strong style={{ color: "var(--ch-text)" }}>
            {search.trim() ? `${counts.all} hasil` : `${invitations.length} undangan total`}
          </strong>
          {" · "}
          <strong style={{ color: "#16A34A" }}>{counts.pending} menunggu</strong> respons Anda
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
        <input
          className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-[13px] outline-none"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          placeholder="Cari brand, kampanye, kategori…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        <div className="rounded-xl border px-3 py-2 text-[12px] font-semibold"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          Total <span className="font-bold" style={{ color: "var(--ch-text)" }}>{counts.all}</span>
        </div>
        <div className="rounded-xl border px-3 py-2 text-[12px] font-semibold"
          style={{ background: "#F0FDF4", borderColor: "#86EFAC", color: "#15803D" }}>
          Menunggu <span className="font-bold">{counts.pending}</span>
        </div>
        <div className="rounded-xl border px-3 py-2 text-[12px] font-semibold"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          Diterima <span className="font-bold" style={{ color: "#15803D" }}>{counts.accepted}</span>
        </div>
        <div className="rounded-xl border px-3 py-2 text-[12px] font-semibold"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          Ditolak <span className="font-bold" style={{ color: "#DC2626" }}>{counts.declined}</span>
        </div>
      </div>

      <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: "var(--ch-border)" }}>
        {TAB_FILTERS.map((t) => {
          const Icon = t.icon;
          const count = counts[t.key];
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors shrink-0"
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
        <div className="ml-auto flex items-center px-2 shrink-0">
          <Filter style={{ width: 14, height: 14, color: "var(--ch-text-soft)" }} />
        </div>
      </div>

      {counts.pending > 0 && filter === "all" && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <Sparkles style={{ width: 18, height: 18, color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#064E3B" }}>
              {counts.pending} undangan menunggu respons
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: "#065F46" }}>
              Kartu berwarna hijau dengan label &quot;Menunggu&quot; adalah undangan yang perlu tindakan Anda.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filter === "all" ? (
          <>
            {newInvitations.length > 0 && (
              <div className="space-y-3">
                <SectionHeader title="Undangan Menunggu" count={newInvitations.length} highlight />
                {newInvitations.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    inv={inv}
                    expanded={expanded === inv.id}
                    onToggle={() => setExpanded(expanded === inv.id ? null : inv.id)}
                    onRespond={(accepted) => respond(inv.id, accepted)}
                  />
                ))}
              </div>
            )}
            {historyInvitations.length > 0 && (
              <div className="space-y-3">
                <SectionHeader title="Riwayat" count={historyInvitations.length} />
                {historyInvitations.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    inv={inv}
                    expanded={expanded === inv.id}
                    onToggle={() => setExpanded(expanded === inv.id ? null : inv.id)}
                    onRespond={(accepted) => respond(inv.id, accepted)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          filtered.map((inv) => (
            <InvitationCard
              key={inv.id}
              inv={inv}
              expanded={expanded === inv.id}
              onToggle={() => setExpanded(expanded === inv.id ? null : inv.id)}
              onRespond={(accepted) => respond(inv.id, accepted)}
            />
          ))
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--ch-text-soft)" }}>
            <Inbox style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
            <p className="text-[14px] font-medium">
              {search.trim() ? `Tidak ada undangan untuk "${search.trim()}"` : "Tidak ada undangan di kategori ini"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}