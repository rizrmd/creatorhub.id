import { useState } from "react";
import { Download, CheckCircle, Clock, XCircle, Shield, Lock, Plus, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
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

const statusChip = {
  paid:    { label: "Lunas",    bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A", icon: CheckCircle },
  pending: { label: "Menunggu", bg: "#FEF3C7", fg: "#B45309", dot: "#F59E0B", icon: Clock },
  failed:  { label: "Gagal",    bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626", icon: XCircle },
};

const monthlySpend = [
  { month: "Jan", amount: 12000000 },
  { month: "Feb", amount: 18000000 },
  { month: "Mar", amount: 15000000 },
  { month: "Apr", amount: 22000000 },
  { month: "Mei", amount: 28000000 },
  { month: "Jun", amount: 20500000 },
];
const maxSpend = Math.max(...monthlySpend.map((m) => m.amount));

const totalPaid    = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
const totalPending = payments.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0);
const escrow       = 120000000;
const lifetimeTotal = 485000000;

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

function downloadInvoice(p: (typeof payments)[0]) {
  const cfg = statusChip[p.status as keyof typeof statusChip];
  const content = [
    "========================================",
    "         INVOICE CREATORHUB.ID         ",
    "========================================",
    `Invoice No : #${p.id}`,
    `Tanggal    : ${new Date(p.date).toLocaleDateString("id-ID")}`,
    `Kreator    : ${p.creator}`,
    `Kampanye   : ${p.campaign}`,
    `Jumlah     : ${formatRupiah(p.amount)}`,
    `Status     : ${cfg.label}`,
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
    <div className="p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Payments & Escrow
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Setujui pembayaran, pantau budget, dan unduh invoice
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)", background: "var(--ch-surface)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
        >
          <Download style={{ width: 15, height: 15 }} />
          Export CSV
        </button>
      </div>

      {/* Wallet hero */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 bg-white translate-y-12 -translate-x-12" />
        <div className="relative">
          <div className="flex items-center gap-2 text-blue-200 text-[13px] mb-2">
            <Wallet style={{ width: 15, height: 15 }} />
            <span>CreatorHub Wallet</span>
          </div>
          <p className="text-[32px] font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatRupiah(lifetimeTotal)}
          </p>
          <p className="text-blue-200 text-[13px] mt-0.5">Lifetime total spent</p>
          <div className="flex gap-8 mt-5">
            <div>
              <p className="text-blue-200 text-[11px]">Tersedia</p>
              <p className="text-white font-bold text-[15px]">{formatRupiah(escrow)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Menunggu</p>
              <p className="text-white font-bold text-[15px]">{formatRupiah(totalPending)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[11px]">Dibayarkan</p>
              <p className="text-white font-bold text-[15px]">{formatRupiah(totalPaid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Dibayar", value: formatRupiah(totalPaid), sub: "Semua payout disetujui", icon: CheckCircle, hue: 142 },
          { label: "Dalam Escrow", value: formatRupiah(escrow), sub: "Dilindungi Escrow", icon: Shield, hue: 220, lock: true },
          { label: "Invoice Belum Lunas", value: formatRupiah(totalPending), sub: "Jatuh tempo 14 hari", icon: Clock, hue: 42 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-5 flex items-center gap-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{ background: `hsl(${stat.hue}, 80%, 95%)`, color: `hsl(${stat.hue}, 60%, 40%)` }}>
              <stat.icon style={{ width: 18, height: 18 }} />
              {stat.lock && <Lock style={{ width: 9, height: 9, position: "absolute", bottom: -1, right: -1, color: "#1D4ED8" }} />}
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{stat.label}</p>
              <p className="text-[17px] font-bold" style={{ color: "var(--ch-text)" }}>{stat.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: `hsl(${stat.hue}, 60%, 40%)` }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transaction table */}
        <div className="xl:col-span-2 rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Riwayat Transaksi</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid gap-4 px-4 py-3 border-b" style={{
                gridTemplateColumns: "1.2fr 0.9fr 1.8fr 1.1fr 1fr 0.9fr auto",
                borderColor: "var(--ch-border)"
              }}>
                {["Invoice", "Kreator", "Kampanye", "Tanggal", "Jumlah", "Status", ""].map((h, i) => (
                  <div key={i} className={`font-semibold ${i >= 3 ? "text-right" : "text-left"} ${i === 2 ? "hidden sm:block" : ""}`}
                    style={{ color: "var(--ch-text-muted)", fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    {h}
                  </div>
                ))}
              </div>
              {/* Body */}
              {payments.map((p) => {
                const cfg = statusChip[p.status as keyof typeof statusChip];
                const Icon = cfg.icon;
                return (
                  <div key={p.id} className="grid gap-4 px-4 py-3 border-b transition-colors hover:bg-[#F8FAFC]"
                    style={{ borderColor: "var(--ch-border)", gridTemplateColumns: "1.2fr 0.9fr 1.8fr 1.1fr 1fr 0.9fr auto" }}>
                    <div className="text-[12px] font-mono" style={{ color: "var(--ch-text-muted)" }}>#{p.id}</div>
                    <div className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.creator}</div>
                    <div className="text-[12px] hidden sm:block" style={{ color: "var(--ch-text-muted)" }}>{p.campaign}</div>
                    <div className="text-[12px] text-right" style={{ color: "var(--ch-text-muted)" }}>
                      {new Date(p.date).toLocaleDateString("id-ID")}
                    </div>
                    <div className="text-[13px] font-semibold text-right" style={{ color: "var(--ch-text)" }}>
                      {formatRupiah(p.amount)}
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ background: cfg.bg, color: cfg.fg }}>
                        <Icon style={{ width: 10, height: 10 }} />
                        {cfg.label}
                      </span>
                    </div>
                    <div>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
                        style={{ color: "var(--ch-text-soft)" }}
                        onClick={() => downloadInvoice(p)}>
                        <Download style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Monthly spend chart */}
          <div className="rounded-xl border p-5"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp style={{ width: 15, height: 15, color: "var(--ch-primary)" }} />
              <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Monthly Spend</p>
            </div>
            <div className="flex items-end gap-1.5 h-[88px]">
              {monthlySpend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm transition-all"
                    style={{ height: `${(m.amount / maxSpend) * 72}px`, background: "var(--ch-primary)", opacity: 0.8 }} />
                  <span className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Credit card */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Metode Pembayaran</p>
            <div className="rounded-2xl p-4 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 60%, #0369a1 100%)" }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-white -translate-y-6 translate-x-6" />
              <div className="relative space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] text-blue-200 uppercase tracking-wide">Corporate Spend Card</p>
                  <p className="text-base font-black italic tracking-widest">VISA</p>
                </div>
                <p className="font-mono text-[13px] tracking-widest">•••• •••• •••• 5683</p>
                <div className="flex justify-between text-[11px]">
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
            <button
              onClick={() => setShowCardModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-[13px] font-semibold transition-colors"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
            >
              <Plus style={{ width: 14, height: 14 }} />
              Link New Corporate Card
            </button>
          </div>
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
