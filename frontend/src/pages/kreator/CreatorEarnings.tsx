import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { useKreatorData } from "@/context/KreatorDataContext";
import {
  KREATOR_PAYMENTS,
  KREATOR_MONTHLY_EARNINGS,
  KREATOR_EARNINGS_BREAKDOWN,
  formatRp,
  type KreatorPayment,
} from "@/data/kreatorData";

function matchesPaymentSearch(payment: KreatorPayment, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [payment.brand, payment.campaign, payment.id].some((field) => field.toLowerCase().includes(q));
}

const maxMonthly = Math.max(...KREATOR_MONTHLY_EARNINGS.map((m) => m.amount));

export default function CreatorEarnings() {
  const { stats } = useKreatorData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const payments = useMemo(
    () => KREATOR_PAYMENTS.filter((payment) => matchesPaymentSearch(payment, search)),
    [search],
  );

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

      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #16A34A 60%, #4ade80 100%)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-12 translate-x-12" />
        <div className="relative">
          <p className="text-green-200 text-[13px] mb-1 flex items-center gap-1.5">
            <DollarSign style={{ width: 13, height: 13 }} /> Total Earnings
          </p>
          <p className="text-[32px] font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatRp(stats.lifetimeEarnings)}
          </p>
          <p className="text-green-200 text-[13px] mt-0.5 flex items-center gap-1">
            <TrendingUp style={{ width: 13, height: 13 }} />
            <strong className="text-white">
              {stats.earningsGrowthPct >= 0 ? "+" : ""}{stats.earningsGrowthPct}%
            </strong>{" "}
            vs last month
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-8 mt-4">
            <div>
              <p className="text-green-200 text-[11px]">Already Paid</p>
              <p className="text-white font-bold text-[15px]">{formatRp(stats.totalPaid)}</p>
            </div>
            <div>
              <p className="text-green-200 text-[11px]">In Process</p>
              <p className="text-white font-bold text-[15px]">{formatRp(stats.totalPending)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Monthly Earnings</p>
          <div className="flex items-end gap-3 h-[140px]">
            {KREATOR_MONTHLY_EARNINGS.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-semibold" style={{ color: "#16A34A" }}>
                  {m.amount >= 1_000_000 ? `${(m.amount / 1_000_000).toFixed(0)}jt` : ""}
                </p>
                <div className="w-full rounded-t-lg transition-all"
                  style={{ height: `${(m.amount / maxMonthly) * 100}px`, background: "#16A34A", opacity: 0.85 }} />
                <span className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Platform Breakdown</p>
          <div className="space-y-3">
            {KREATOR_EARNINGS_BREAKDOWN.map((b) => (
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

      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
          style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Payment History</p>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--ch-text-soft)" }} />
            <input
              className="w-full rounded-lg border pl-8 pr-3 py-2 text-[12px] outline-none"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              placeholder="Cari pembayaran…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
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
    </div>
  );
}