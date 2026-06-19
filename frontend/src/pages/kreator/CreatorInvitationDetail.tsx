import { useParams, useNavigate } from "react-router-dom";
import { useSetBreadcrumbTitle } from "@/contexts/BreadcrumbContext";
import { ArrowLeft, Calendar, Clock, Coins, Tag, FileText } from "lucide-react";
import { toast } from "sonner";
import { useKreatorData } from "@/context/KreatorDataContext";
import {
  formatRp,
  formatReceivedAgo,
  formatDeadlineLeft,
  isNewInvitation,
  type InvitationStatus,
  type KreatorInvitation,
} from "@/data/kreatorData";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: InvitationStatus }) {
  const map: Record<InvitationStatus, { label: string; bg: string; fg: string }> = {
    pending: { label: "Menunggu respons", bg: "#FEF3C7", fg: "#B45309" },
    accepted: { label: "Diterima", bg: "#DCFCE7", fg: "#15803D" },
    declined: { label: "Ditolak", bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

function DetailStat({
  label,
  value,
  sub,
  icon: Icon,
  hue,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  hue: number;
}) {
  return (
    <div
      className="rounded-xl border p-5 flex items-center gap-4"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `hsl(${hue}, 80%, 95%)`, color: `hsl(${hue}, 60%, 40%)` }}
      >
        <Icon style={{ width: 18, height: 18 }} />
      </div>
      <div>
        <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{label}</p>
        <p
          className="text-[18px] font-extrabold"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {value}
        </p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{sub}</p>}
      </div>
    </div>
  );
}

function InvitationHero({ inv }: { inv: KreatorInvitation }) {
  const isNew = isNewInvitation(inv);

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6",
        isNew && "ring-2 ring-green-200",
      )}
      style={{
        background: isNew ? "#F0FDF4" : "var(--ch-surface)",
        borderColor: isNew ? "#86EFAC" : "var(--ch-border)",
        boxShadow: "var(--ch-shadow-sm)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-[18px] shrink-0"
          style={{ background: isNew ? "#16A34A" : "var(--ch-primary)" }}
        >
          {inv.brand[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.5px]"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {inv.campaign}
            </h1>
            {isNew && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                style={{ background: "#16A34A", color: "white" }}
              >
                Menunggu
              </span>
            )}
            <StatusBadge status={inv.status} />
          </div>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            {inv.brand} · {inv.category}
          </p>
          <p className="text-[12px] mt-1 flex flex-wrap items-center gap-2" style={{ color: "var(--ch-text-soft)" }}>
            <span className="flex items-center gap-1">
              <Clock style={{ width: 12, height: 12 }} />
              Diterima {formatReceivedAgo(inv.receivedAt)}
            </span>
            <span>·</span>
            <span>{new Date(inv.receivedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreatorInvitationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invitations, respondToInvitation } = useKreatorData();

  const inv = invitations.find((i) => i.id === id);

  useSetBreadcrumbTitle(inv?.campaign);

  const respond = (accepted: boolean) => {
    if (!id) return;
    respondToInvitation(id, accepted);
    toast.success(accepted ? "Undangan diterima! 🎉" : "Undangan ditolak");
    navigate("/dashboard/kreator/invitations");
  };

  if (!inv) {
    return (
      <div className="p-6 text-center" style={{ background: "var(--ch-bg)" }}>
        <p style={{ color: "var(--ch-text-muted)" }}>Undangan tidak ditemukan.</p>
        <button
          onClick={() => navigate("/dashboard/kreator/invitations")}
          className="mt-4 px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer"
          style={{ background: "#16A34A" }}
        >
          Kembali ke Undangan
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <button
        onClick={() => navigate("/dashboard/kreator/invitations")}
        className="flex items-center gap-2 text-[13px] font-semibold cursor-pointer transition-colors hover:opacity-80"
        style={{ color: "var(--ch-text-muted)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Undangan
      </button>

      <InvitationHero inv={inv} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DetailStat label="Budget" value={formatRp(inv.budget)} icon={Coins} hue={142} />
        <DetailStat
          label="Deadline"
          value={new Date(inv.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          sub={formatDeadlineLeft(inv.deadline)}
          icon={Calendar}
          hue={28}
        />
        <DetailStat label="Kategori" value={inv.category} icon={Tag} hue={220} />
      </div>

      <div
        className="rounded-xl border p-5 md:p-6"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText style={{ width: 16, height: 16, color: "var(--ch-primary)" }} />
          <h2 className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>
            Brief Kampanye
          </h2>
        </div>
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
          {inv.brief}
        </p>
      </div>

      {inv.status === "pending" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => respond(false)}
            className="flex-1 py-3 rounded-xl border text-[14px] font-semibold cursor-pointer transition-colors hover:bg-red-50"
            style={{ borderColor: "#FCA5A5", color: "#DC2626" }}
          >
            Tolak Undangan
          </button>
          <button
            onClick={() => respond(true)}
            className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: "#16A34A" }}
          >
            Terima Undangan
          </button>
        </div>
      )}

      {inv.status === "accepted" && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
        >
          <p className="text-[13px]" style={{ color: "#065F46" }}>
            Anda telah menerima undangan ini. Cek halaman{" "}
            <button
              onClick={() => navigate("/dashboard/kreator/work")}
              className="font-bold underline cursor-pointer"
              style={{ color: "#16A34A" }}
            >
              Pekerjaan Aktif
            </button>{" "}
            untuk melihat deliverables.
          </p>
        </div>
      )}
    </div>
  );
}