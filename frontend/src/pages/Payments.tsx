import { useState } from "react";
import { Download, CheckCircle, Clock, XCircle, Shield, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/utils";

const payments = [
  { id: "INV-9281", creator: "Reza Alvaro", campaign: "Summer Getaway 2025", amount: 6000000, status: "paid", date: "2025-06-05" },
  { id: "INV-9214", creator: "Nadia Aurellia", campaign: "Summer Getaway 2025", amount: 8000000, status: "paid", date: "2025-06-04" },
  { id: "INV-8951", creator: "Andi Pratama", campaign: "Kampanye Ramadan 2025", amount: 6500000, status: "paid", date: "2025-05-20" },
  { id: "INV-9304", creator: "Dimas Arya", campaign: "Brand Awareness Q1", amount: 7500000, status: "pending", date: "2025-06-07" },
  { id: "INV-9105", creator: "Fajar Nugroho", campaign: "Brand Awareness Q1", amount: 9500000, status: "failed", date: "2025-06-01" },
];

const statusConfig = {
  paid: { label: "Lunas", variant: "success" as const, icon: CheckCircle },
  pending: { label: "Menunggu", variant: "warning" as const, icon: Clock },
  failed: { label: "Gagal", variant: "destructive" as const, icon: XCircle },
};

const totalPaid = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
const totalPending = payments.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0);
const escrow = 120000000;

function downloadBlob(content: string, filename: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const header = "Invoice,Kreator,Kampanye,Tanggal,Jumlah,Status";
  const rows = payments.map((p) =>
    `${p.id},${p.creator},${p.campaign},${p.date},${p.amount},${p.status}`
  );
  downloadBlob([header, ...rows].join("\n"), "payments.csv", "text/csv");
  toast.success("CSV berhasil diunduh");
}

function downloadInvoice(p: typeof payments[0]) {
  const content = [
    "========================================",
    "         INVOICE CREATORHUB.ID         ",
    "========================================",
    `Invoice No : #${p.id}`,
    `Tanggal    : ${new Date(p.date).toLocaleDateString("id-ID")}`,
    `Kreator    : ${p.creator}`,
    `Kampanye   : ${p.campaign}`,
    `Jumlah     : ${formatRupiah(p.amount)}`,
    `Status     : ${statusConfig[p.status as keyof typeof statusConfig].label}`,
    "========================================",
    "Terima kasih telah menggunakan CreatorHub.id",
  ].join("\n");
  downloadBlob(content, `${p.id}.txt`);
  toast.success(`Invoice ${p.id} diunduh`);
}

export default function Payments() {
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ number: "", holder: "", expiry: "", cvv: "" });

  const handleSaveCard = () => {
    if (!cardForm.number || !cardForm.holder || !cardForm.expiry || !cardForm.cvv) {
      toast.error("Semua field harus diisi");
      return;
    }
    setShowCardModal(false);
    setCardForm({ number: "", holder: "", expiry: "", cvv: "" });
    toast.success("Kartu berhasil ditambahkan!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payments & Escrow</h1>
          <p className="text-sm text-slate-500 mt-1">Setujui pembayaran, pantau budget, dan unduh invoice</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Dibayar</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(totalPaid)}</p>
              <p className="text-xs text-green-600 mt-0.5">Semua payout disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center relative">
              <Shield className="w-5 h-5 text-blue-600" />
              <Lock className="w-2.5 h-2.5 text-blue-800 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Dalam Escrow</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(escrow)}</p>
              <p className="text-xs text-blue-600 mt-0.5">Dilindungi Escrow</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Invoice Belum Lunas</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(totalPending)}</p>
              <p className="text-xs text-amber-600 mt-0.5">Jatuh tempo 14 hari</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transaction table */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Kreator</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Kampanye</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Tanggal</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Jumlah</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const cfg = statusConfig[p.status as keyof typeof statusConfig];
                    const Icon = cfg.icon;
                    return (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">#{p.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.creator}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 hidden sm:table-cell">{p.campaign}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                          {new Date(p.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">
                          {formatRupiah(p.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={cfg.variant} className="gap-1">
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700"
                            onClick={() => downloadInvoice(p)}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Credit card panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Card mockup */}
              <div className="rounded-2xl p-5 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0052cc 60%, #0369a1 100%)" }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 bg-white translate-y-8 -translate-x-8" />
                <div className="relative space-y-4">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-blue-200 font-medium uppercase tracking-wide">Corporate Spend Card</p>
                    <p className="text-xl font-black italic tracking-widest">VISA</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-6 rounded-sm bg-amber-300 opacity-80" />
                  </div>
                  <p className="font-mono text-base tracking-widest">•••• •••• •••• 5683</p>
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="text-blue-200">Card Holder</p>
                      <p className="font-semibold">Arif Budiman</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200">Expires</p>
                      <p className="font-semibold">12/28</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 gap-2" onClick={() => setShowCardModal(true)}>
                <Plus className="w-4 h-4" />
                Link New Corporate Card
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Link Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Kartu Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nomor Kartu</label>
              <Input
                placeholder="•••• •••• •••• ••••"
                maxLength={19}
                value={cardForm.number}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                  setCardForm((f) => ({ ...f, number: v }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Pemegang Kartu</label>
              <Input
                placeholder="Nama sesuai kartu"
                value={cardForm.holder}
                onChange={(e) => setCardForm((f) => ({ ...f, holder: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Expired (MM/YY)</label>
                <Input
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardForm.expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                    setCardForm((f) => ({ ...f, expiry: v }));
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">CVV</label>
                <Input
                  placeholder="•••"
                  type="password"
                  maxLength={4}
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCardModal(false)}>Batal</Button>
            <Button onClick={handleSaveCard}>Simpan Kartu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
