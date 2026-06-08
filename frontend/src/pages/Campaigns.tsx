import { useState } from "react";
import { Plus, Megaphone, Calendar, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaigns, useCreateCampaign, useDeleteCampaign } from "@/hooks/useCampaigns";
import { formatRupiah } from "@/lib/utils";

const statusVariant: Record<string, "default" | "success" | "secondary" | "warning"> = {
  active: "success",
  draft: "secondary",
  completed: "default",
  paused: "warning",
};

const statusLabel: Record<string, string> = {
  active: "Aktif",
  draft: "Draft",
  completed: "Selesai",
  paused: "Dijeda",
};

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createMutation = useCreateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", budget: "" });

  const handleCreate = async () => {
    if (!form.title) return;
    await createMutation.mutateAsync({
      title: form.title,
      description: form.description,
      budget: parseInt(form.budget) || 0,
    });
    setOpen(false);
    setForm({ title: "", description: "", budget: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kampanye</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola semua kampanye influencer marketing Anda</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Buat Kampanye
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-12" /></CardContent></Card>
          ))}
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{c.title}</CardTitle>
                  <Badge variant={statusVariant[c.status]}>{statusLabel[c.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    {formatRupiah(c.budget)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(c.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Lihat Detail</Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                    onClick={() => deleteMutation.mutate(c.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
}
