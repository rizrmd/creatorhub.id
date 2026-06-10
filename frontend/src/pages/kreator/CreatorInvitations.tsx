import { useState } from "react";
import { Inbox, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { toast } from "sonner";

type Status = "pending" | "accepted" | "declined";

const INITIAL = [
  { id: "1", brand: "Wardah",    campaign: "Ramadan Glow Campaign", budget: 5000000,  deadline: "2026-07-02", category: "Beauty",        status: "pending"  as Status, brief: "Buat 2 konten IG Reel + 1 Story unboxing produk Wardah terbaru." },
  { id: "2", brand: "Tokopedia", campaign: "Flash Sale Juli 2026",  budget: 3500000,  deadline: "2026-07-07", category: "E-Commerce",     status: "pending"  as Status, brief: "Review & unboxing haul produk dari Tokopedia Flash Sale." },
  { id: "3", brand: "Grab",      campaign: "GrabFood Summer Promo", budget: 4200000,  deadline: "2026-07-10", category: "Food",           status: "pending"  as Status, brief: "Konten kuliner & vlog pengiriman GrabFood musim panas." },
  { id: "4", brand: "ASUS",      campaign: "ROG Phone Launch",      budget: 8000000,  deadline: "2026-06-28", category: "Tech",           status: "accepted" as Status, brief: "Unboxing + first look ROG Phone 9 series." },
  { id: "5", brand: "Eiger",     campaign: "Outdoor Ready",         budget: 2500000,  deadline: "2026-06-20", category: "Lifestyle",      status: "declined" as Status, brief: "Konten outdoor & hiking menampilkan gear Eiger." },
];

const TAB_FILTERS: { key: "all" | Status; label: string; icon: React.ElementType }[] = [
  { key: "all",      label: "Semua",    icon: Inbox },
  { key: "pending",  label: "Menunggu", icon: Clock },
  { key: "accepted", label: "Diterima", icon: CheckCircle },
  { key: "declined", label: "Ditolak",  icon: XCircle },
];

const statusChip = (status: Status) => {
  const map: Record<Status, { label: string; bg: string; fg: string }> = {
    pending:  { label: "Menunggu", bg: "#FEF3C7", fg: "#B45309" },
    accepted: { label: "Diterima", bg: "#DCFCE7", fg: "#15803D" },
    declined: { label: "Ditolak",  bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}>{s.label}</span>
  );
};

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function CreatorInvitations() {
  const [invs, setInvs] = useState(INITIAL);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const respond = (id: string, accepted: boolean) => {
    setInvs((list) =>
      list.map((i) => i.id === id ? { ...i, status: accepted ? "accepted" : "declined" } : i)
    );
    toast.success(accepted ? "Undangan diterima! 🎉" : "Undangan ditolak");
  };

  const filtered = filter === "all" ? invs : invs.filter((i) => i.status === filter);

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Undangan Brand
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola undangan kolaborasi dari brand
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: "var(--ch-border)" }}>
        {TAB_FILTERS.map((t) => {
          const Icon = t.icon;
          const count = t.key === "all" ? invs.length : invs.filter((i) => i.status === t.key).length;
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors"
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
        <div className="ml-auto flex items-center">
          <Filter style={{ width: 14, height: 14, color: "var(--ch-text-soft)" }} />
        </div>
      </div>

      {/* Pro tip */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
        <span className="text-lg">💡</span>
        <div>
          <p className="text-[13px] font-bold" style={{ color: "#064E3B" }}>Pro tip</p>
          <p className="text-[12px] mt-0.5" style={{ color: "#065F46" }}>
            Respons undangan dalam 12 jam meningkatkan peluang kolaborasi jangka panjang sebesar 40%.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((inv) => (
          <div key={inv.id} className="rounded-xl border overflow-hidden"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="p-4 flex items-center gap-4"
              style={{ cursor: "pointer" }}
              onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[15px] shrink-0"
                style={{ background: "var(--ch-primary)" }}>
                {inv.brand[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{inv.campaign}</p>
                  {statusChip(inv.status)}
                </div>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                  {inv.brand} · {inv.category} · Deadline {new Date(inv.deadline).toLocaleDateString("id-ID")}
                </p>
              </div>
              <p className="text-[14px] font-bold shrink-0" style={{ color: "#16A34A" }}>
                {formatRp(inv.budget)}
              </p>
            </div>

            {expanded === inv.id && (
              <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--ch-border)" }}>
                <p className="text-[12px] mt-3" style={{ color: "var(--ch-text-muted)" }}>Brief:</p>
                <p className="text-[13px] mt-1 mb-4" style={{ color: "var(--ch-text)" }}>{inv.brief}</p>
                {inv.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => respond(inv.id, false)}
                      className="flex-1 py-2 rounded-lg border text-[13px] font-semibold"
                      style={{ borderColor: "#FCA5A5", color: "#DC2626" }}>
                      Tolak
                    </button>
                    <button onClick={() => respond(inv.id, true)}
                      className="flex-1 py-2 rounded-lg text-white text-[13px] font-semibold"
                      style={{ background: "#16A34A" }}>
                      Terima Undangan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--ch-text-soft)" }}>
            <Inbox style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
            <p className="text-[14px] font-medium">Tidak ada undangan di kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
