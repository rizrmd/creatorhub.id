import { DollarSign, TrendingUp, Clock, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";

const payments = [
  { id: "P-001", brand: "ASUS",     campaign: "ROG Phone Launch",   amount: 8000000,  status: "paid",    date: "2026-06-20" },
  { id: "P-002", brand: "Wardah",   campaign: "Ramadan Glow",       amount: 5000000,  status: "pending", date: "2026-07-02" },
  { id: "P-003", brand: "Tokopedia", campaign: "Flash Sale Juni",   amount: 3500000,  status: "paid",    date: "2026-06-10" },
  { id: "P-004", brand: "Eiger",    campaign: "Outdoor Ready",      amount: 2500000,  status: "paid",    date: "2026-05-28" },
];

const monthly = [
  { month: "Jan", amount: 8000000 },
  { month: "Feb", amount: 12000000 },
  { month: "Mar", amount: 7500000 },
  { month: "Apr", amount: 15000000 },
  { month: "Mei", amount: 19000000 },
  { month: "Jun", amount: 24000000 },
];
const maxMonthly = Math.max(...monthly.map((m) => m.amount));

const breakdown = [
  { label: "Instagram Reels", pct: 52, color: "#E1306C" },
  { label: "TikTok",          pct: 31, color: "#010101" },
  { label: "YouTube",         pct: 17, color: "#FF0000" },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const totalPaid    = payments.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0);
const totalPending = payments.filter(p => p.status === "pending").reduce((a, p) => a + p.amount, 0);
const lifetimeTotal = 124600000;

export default function CreatorEarnings() {
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Earnings
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Track your income and payment history
        </p>
      </div>

      {/* Wallet hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #16A34A 60%, #4ade80 100%)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-12 translate-x-12" />
        <div className="relative">
          <p className="text-green-200 text-[13px] mb-1 flex items-center gap-1.5">
            <DollarSign style={{ width: 13, height: 13 }} /> Total Earnings
          </p>
          <p className="text-[32px] font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatRp(lifetimeTotal)}
          </p>
          <p className="text-green-200 text-[13px] mt-0.5 flex items-center gap-1">
            <TrendingUp style={{ width: 13, height: 13 }} />
            <strong className="text-white">+28%</strong> vs last month
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-8 mt-4">
            <div>
              <p className="text-green-200 text-[11px]">Already Paid</p>
              <p className="text-white font-bold text-[15px]">{formatRp(totalPaid)}</p>
            </div>
            <div>
              <p className="text-green-200 text-[11px]">In Process</p>
              <p className="text-white font-bold text-[15px]">{formatRp(totalPending)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <div className="xl:col-span-2 rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Monthly Earnings</p>
          <div className="flex items-end gap-3 h-[140px]">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-semibold" style={{ color: "#16A34A" }}>
                  {m.amount >= 1000000 ? `${(m.amount / 1000000).toFixed(0)}jt` : ""}
                </p>
                <div className="w-full rounded-t-lg transition-all"
                  style={{ height: `${(m.amount / maxMonthly) * 100}px`, background: "#16A34A", opacity: 0.85 }} />
                <span className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown donut */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Platform Breakdown</p>
          <div className="space-y-3">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span style={{ color: "var(--ch-text)" }}>{b.label}</span>
                  <span className="font-bold" style={{ color: "var(--ch-text)" }}>{b.pct}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: "var(--ch-border)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Payment History</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
              {["ID", "Brand", "Campaign", "Date", "Amount", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold"
                  style={{ color: "var(--ch-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const isPaid = p.status === "paid";
              return (
                <tr key={p.id} className="border-b hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "var(--ch-border)" }}>
                  <td className="px-4 py-3 text-[12px] font-mono" style={{ color: "var(--ch-text-muted)" }}>{p.id}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.brand}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{p.campaign}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                    {new Date(p.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-bold" style={{ color: "#16A34A" }}>{formatRp(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={isPaid ? { background: "#DCFCE7", color: "#15803D" } : { background: "#FEF3C7", color: "#B45309" }}>
                      {isPaid ? <CheckCircle style={{ width: 9, height: 9 }} /> : <Clock style={{ width: 9, height: 9 }} />}
                      {isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isPaid && (
                      <button onClick={() => toast.success(`Invoice ${p.id} downloaded`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                        style={{ color: "var(--ch-text-soft)" }}>
                        <Download style={{ width: 13, height: 13 }} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
