import { useState } from "react";
import { Plus, Megaphone, Calendar, DollarSign, Trash2, Users, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaigns, useCreateCampaign, useDeleteCampaign, useUpdateCampaign } from "@/hooks/useCampaigns";
import { formatRupiah } from "@/lib/utils";
import { CAMPAIGN_STATUS } from "@/types";
import type { Campaign, CampaignStatus } from "@/types";

const STATUS_TABS = [
  { value: "all",       label: "Semua" },
  { value: "active",    label: "Aktif" },
  { value: "in-review", label: "In Review" },
  { value: "draft",     label: "Draft" },
  { value: "completed", label: "Selesai" },
  { value: "paused",    label: "Dijeda" },
] as const;

const MOCK_KOL: Record<string, { hired: number; total: number }> = {};

function getKol(c: Campaign) {
  if (!MOCK_KOL[c.id]) {
    const total = c.status === "active" ? 5 : c.status === "completed" ? 4 : 8;
    const hired =
      c.status === "active" ? 2 :
      c.status === "completed" ? total :
      0;
    MOCK_KOL[c.id] = { hired, total };
  }
  return MOCK_KOL[c.id];
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const s = CAMPAIGN_STATUS[status] ?? CAMPAIGN_STATUS.draft;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function Campaigns() {
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns();
  const createMutation = useCreateCampaign();
  const deleteMutation = useDeleteCampaign();
  const updateMutation = useUpdateCampaign();

  const [tab, setTab] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", budget: "" });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", title: "", description: "", budget: "" });

  const handleCreate = async () => {
    if (!form.title) return;
    await createMutation.mutateAsync({
      title: form.title,
      description: form.description,
      budget: parseInt(form.budget) || 0,
    });
    setOpen(false);
    setForm({ title: "", description: "", budget: "" });
    toast.success("Kampanye berhasil dibuat!");
  };

  const openEdit = (c: Campaign) => {
    setEditForm({ id: c.id, title: c.title, description: c.description, budget: String(c.budget) });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editForm.title) return;
    await updateMutation.mutateAsync({
      id: editForm.id,
      data: { title: editForm.title, description: editForm.description, budget: parseInt(editForm.budget) || 0 },
    });
    setEditOpen(false);
    toast.success("Kampanye berhasil diperbarui!");
  };

  const handleAction = (c: Campaign) => {
    if (c.status === "active" || c.status === "paused") navigate(`/campaigns/${c.id}`);
    else if (c.status === "draft") openEdit(c);
    else if (c.status === "completed") navigate("/analytics");
  };

  const actionLabel: Record<string, string> = {
    active: "Kelola",
    draft: "Edit Brief",
    completed: "Lihat Laporan",
    paused: "Lihat Detail",
  };

  const filtered = tab === "all" ? (campaigns ?? []) : (campaigns ?? []).filter((c) => c.status === tab);

  return (
    <div className="p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kampanye
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Kelola semua kampanye influencer marketing Anda</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-bold transition-colors"
          style={{ background: "var(--ch-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ch-primary-600)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ch-primary)")}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Buat Kampanye
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: "var(--ch-border)" }}>
        {STATUS_TABS.map((t) => {
          const count = t.value === "all"
            ? (campaigns?.length ?? 0)
            : (campaigns?.filter((c) => c.status === t.value).length ?? 0);
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors"
              style={tab === t.value
                ? { borderColor: "var(--ch-primary)", color: "var(--ch-primary)" }
                : { borderColor: "transparent", color: "var(--ch-text-muted)" }}
            >
              {t.label}
              {!isLoading && (
                <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full"
                  style={tab === t.value
                    ? { background: "var(--ch-primary-100)", color: "var(--ch-primary)" }
                    : { background: "#F1F5F9", color: "var(--ch-text-muted)" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const kol = getKol(c);
            const pct = kol.total > 0 ? Math.round((kol.hired / kol.total) * 100) : 0;
            const hue = c.hue ?? 220;
            const delivTotal = c.deliverables?.total ?? 0;
            const delivDone  = c.deliverables?.completed ?? 0;
            return (
              <div key={c.id}
                className="rounded-xl border overflow-hidden transition-all cursor-pointer"
                style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)", boxShadow: "var(--ch-shadow-sm)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--ch-shadow-md)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--ch-shadow-sm)")}
              >
                {/* Hue-tinted header strip */}
                <div className="h-1.5" style={{ background: `hsl(${hue}, 70%, 55%)` }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold leading-snug" style={{ color: "var(--ch-text)" }}>{c.title}</p>
                      {c.brand && <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{c.brand}</p>}
                    </div>
                    <StatusBadge status={c.status as CampaignStatus} />
                  </div>

                  {c.description && (
                    <p className="text-[13px] line-clamp-2 mb-3" style={{ color: "var(--ch-text-muted)" }}>{c.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-[12px] mb-3" style={{ color: "var(--ch-text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <DollarSign style={{ width: 13, height: 13 }} />
                      {formatRupiah(c.budget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users style={{ width: 13, height: 13 }} />
                      KOL: {kol.hired} / {kol.total}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar style={{ width: 13, height: 13 }} />
                      {new Date(c.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    {c.daysLeft != null && c.daysLeft > 0 && (
                      <span className="flex items-center gap-1" style={{ color: "#16A34A" }}>
                        ⏳ {c.daysLeft}h lagi
                      </span>
                    )}
                  </div>

                  {/* Deliverables progress */}
                  {delivTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--ch-text-muted)" }}>
                        <span className="flex items-center gap-1">
                          {delivDone === delivTotal ? <CheckCircle2 style={{ width: 11, height: 11, color: "#16A34A" }} /> : <Circle style={{ width: 11, height: 11 }} />}
                          Deliverables
                        </span>
                        <span className="font-semibold">{delivDone}/{delivTotal}</span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${delivTotal > 0 ? (delivDone / delivTotal) * 100 : 0}%`, background: `hsl(${hue}, 70%, 55%)` }} />
                      </div>
                    </div>
                  )}

                  {/* KOL progress bar (fallback) */}
                  {delivTotal === 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--ch-text-muted)" }}>
                        <span>Progress KOL</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: `hsl(${hue}, 70%, 55%)` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      className="flex-1 py-1.5 px-3 rounded-lg border text-[12px] font-semibold transition-colors"
                      style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
                      onClick={() => handleAction(c)}
                    >
                      {actionLabel[c.status] ?? "Lihat"}
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:border-red-200 hover:text-red-500"
                      style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-soft)" }}
                      onClick={() => deleteMutation.mutate(c.id)}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Megaphone className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">Belum ada kampanye</p>
          <p className="text-sm mt-1">Buat kampanye pertama Anda untuk mulai berkolaborasi</p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Buat Kampanye
          </Button>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kampanye Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Kampanye</label>
              <Input
                placeholder="Contoh: Kampanye Lebaran 2025"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <Input
                placeholder="Deskripsi singkat kampanye..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Budget (Rp)</label>
              <Input
                type="number"
                placeholder="50000000"
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending || !form.title}>
              {createMutation.isPending ? "Menyimpan..." : "Buat Kampanye"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brief Kampanye</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Kampanye</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Budget (Rp)</label>
              <Input
                type="number"
                value={editForm.budget}
                onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending || !editForm.title}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
