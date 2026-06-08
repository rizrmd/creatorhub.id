import { CreditCard, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

const payments = [
  { id: "INV-001", creator: "Nadia Aurellia", campaign: "Kampanye Ramadan 2025", amount: 15000000, status: "paid", date: "2025-03-15" },
  { id: "INV-002", creator: "Andi Pratama", campaign: "Kampanye Ramadan 2025", amount: 12000000, status: "paid", date: "2025-03-14" },
  { id: "INV-003", creator: "Reza Alvaro", campaign: "Brand Awareness Q1", amount: 8000000, status: "pending", date: "2025-03-13" },
  { id: "INV-004", creator: "Dimas Arya", campaign: "Brand Awareness Q1", amount: 7000000, status: "pending", date: "2025-03-12" },
  { id: "INV-005", creator: "Fajar Nugroho", campaign: "Kampanye Ramadan 2025", amount: 9500000, status: "failed", date: "2025-03-10" },
];

const statusConfig = {
  paid: { label: "Lunas", variant: "success" as const, icon: CheckCircle, color: "text-green-500" },
  pending: { label: "Menunggu", variant: "warning" as const, icon: Clock, color: "text-amber-500" },
  failed: { label: "Gagal", variant: "destructive" as const, icon: XCircle, color: "text-red-500" },
};

const totalPaid = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
const totalPending = payments.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0);

export default function Payments() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pembayaran</h1>
          <p className="text-sm text-slate-500 mt-1">Riwayat transaksi dan invoice kreator</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Dibayar</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Menunggu Pembayaran</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(totalPending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Transaksi</p>
              <p className="text-xl font-bold text-slate-800">{payments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const cfg = statusConfig[p.status as keyof typeof statusConfig];
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-slate-600">{p.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.creator}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden sm:table-cell">{p.campaign}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                        {new Date(p.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">
                        {formatRupiah(p.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
