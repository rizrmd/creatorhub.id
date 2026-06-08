import { useState, useRef } from "react";
import {
  Search, SlidersHorizontal, Star, CheckCircle, Zap, Award,
  Instagram, Youtube, Users, Megaphone, TrendingUp, Wallet,
  LayoutGrid, List, RotateCcw, X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreators, useMarketplaceStats } from "@/hooks/useCreators";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import type { Creator, CreatorListParams } from "@/types";
import { formatRupiah } from "@/lib/utils";

const CATEGORIES = ["lifestyle", "travel", "beauty", "tech", "food", "sports"];
const CITIES = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan", "Makassar"];
const PLATFORMS = ["instagram", "tiktok", "youtube"];

const FOLLOWERS_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< 300K", value: "0-300000" },
  { label: "300K – 500K", value: "300000-500000" },
  { label: "500K – 700K", value: "500000-700000" },
  { label: "700K+", value: "700000-0" },
];

const ENGAGEMENT_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< 3%", value: "0-3" },
  { label: "3% – 4%", value: "3-4" },
  { label: "4% – 5%", value: "4-5" },
  { label: "5%+", value: "5-0" },
];

const PRICE_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< Rp 7M", value: "0-7000000" },
  { label: "Rp 7M – 10M", value: "7000000-10000000" },
  { label: "Rp 10M – 13M", value: "10000000-13000000" },
  { label: "Rp 13M+", value: "13000000-0" },
];

const platformIcon = (p: string) => {
  if (p === "instagram") return <Instagram className="w-3 h-3" />;
  if (p === "youtube") return <Youtube className="w-3 h-3" />;
  return <span className="text-[10px] font-bold">TT</span>;
};

function StatCard({ label, value, icon: Icon, color, loading }: {
  label: string; value: string; icon: React.ElementType; color: string; loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatorCard({ creator, selected, onToggle, listView }: {
  creator: Creator; selected: boolean; onToggle: () => void; listView: boolean;
}) {
  if (listView) {
    return (
      <Card className={`cursor-pointer transition-all hover:shadow-md ${selected ? "ring-2 ring-blue-500" : ""}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 relative">
              {creator.imageUrl && (
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.removeAttribute("style");
                  }}
                />
              )}
              <div
                className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-500"
                style={creator.imageUrl ? { display: "none" } : undefined}
              >
                {creator.name[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-slate-800 text-sm truncate">{creator.name}</p>
                {creator.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
              </div>
              <p className="text-xs text-slate-500">{creator.city} · <span className="capitalize">{creator.category}</span></p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
              <span className="font-medium">{creator.followersText}</span>
              <span className="font-medium">{creator.engagementRate}% ER</span>
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{creator.rating}
              </span>
              <span className="font-semibold text-slate-700">{creator.priceText}</span>
            </div>
            <Button
              size="sm"
              variant={selected ? "outline" : "default"}
              className="h-7 text-xs shrink-0"
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
            >
              {selected ? "Hapus" : "+ Brief"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0 relative">
            {creator.imageUrl && (
              <img
                src={creator.imageUrl}
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("style");
                }}
              />
            )}
            <div
              className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-500"
              style={creator.imageUrl ? { display: "none" } : undefined}
            >
              {creator.name[0]}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-slate-800 text-sm truncate">{creator.name}</p>
              {creator.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{creator.city}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                {creator.category}
              </Badge>
              {creator.fastResponse && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                  <Zap className="w-2.5 h-2.5 mr-0.5" /> Cepat
                </Badge>
              )}
              {creator.topRated && (
                <Badge variant="success" className="text-[10px] px-1.5 py-0">
                  <Award className="w-2.5 h-2.5 mr-0.5" /> Top
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">{creator.followersText}</p>
            <p className="text-[10px] text-slate-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">{creator.engagementRate}%</p>
            <p className="text-[10px] text-slate-500">Engagement</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {creator.rating}
            </p>
            <p className="text-[10px] text-slate-500">Rating</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {creator.platforms.map((p) => (
              <span key={p} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                {platformIcon(p)}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">{creator.priceText}</span>
            <Button
              size="sm"
              variant={selected ? "outline" : "default"}
              className="h-7 text-xs"
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
            >
              {selected ? "Hapus" : "+ Brief"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function parseRange(val: string): { min?: number; max?: number } {
  if (!val || val === "all") return {};
  const [a, b] = val.split("-").map(Number);
  return { min: a || undefined, max: b || undefined };
}

export default function Marketplace() {
  const [filters, setFilters] = useState<CreatorListParams>({ page: 1, pageSize: 20 });
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [listView, setListView] = useState(false);

  const [followersVal, setFollowersVal] = useState("all");
  const [engagementVal, setEngagementVal] = useState("all");
  const [priceVal, setPriceVal] = useState("all");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", budget: "" });

  const advMinPrice = useRef("");
  const advMaxPrice = useRef("");

  const createMutation = useCreateCampaign();

  const { data, isLoading } = useCreators({ ...filters, search: search || undefined });
  const { data: stats, isLoading: statsLoading } = useMarketplaceStats();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const resetFilters = () => {
    setFilters({ page: 1, pageSize: 20 });
    setSearch("");
    setFollowersVal("all");
    setEngagementVal("all");
    setPriceVal("all");
  };

  const applyFollowers = (val: string) => {
    setFollowersVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minFollowers: min, maxFollowers: max, page: 1 }));
  };

  const applyEngagement = (val: string) => {
    setEngagementVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minEngagement: min, maxEngagement: max, page: 1 }));
  };

  const applyPrice = (val: string) => {
    setPriceVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };

  const handleCreateCampaign = async () => {
    if (!campaignForm.title) return;
    await createMutation.mutateAsync({
      title: campaignForm.title,
      description: campaignForm.description,
      budget: parseInt(campaignForm.budget) || 0,
    });
    setShowCreateCampaign(false);
    setCampaignForm({ title: "", description: "", budget: "" });
    setSelectedIds([]);
    toast.success("Kampanye berhasil dibuat!");
  };

  const selectedCreators = data?.data.filter((c) => selectedIds.includes(c.id)) ?? [];

  const statCards = [
    {
      label: "Total Kreator",
      value: stats ? stats.totalCreators.toLocaleString("id-ID") : "–",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Kampanye Aktif",
      value: stats ? stats.activeCampaigns.toLocaleString("id-ID") : "–",
      icon: Megaphone,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Avg. Engagement",
      value: stats ? `${stats.avgEngagementRate.toFixed(2)}%` : "–",
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      label: "Budget Dikelola",
      value: stats ? formatRupiah(stats.totalBudget) : "–",
      icon: Wallet,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} loading={statsLoading} />
            ))}
          </div>
        </div>

        {/* Filters row 1 */}
        <div className="px-4 pt-3 pb-0 bg-white flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama kreator..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={filters.category ?? "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : v, page: 1 }))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.platform ?? "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, platform: v === "all" ? undefined : v, page: 1 }))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Platform</SelectItem>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city ?? "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, city: v === "all" ? undefined : v, page: 1 }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filters row 2 */}
        <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2">
          <Select value={followersVal} onValueChange={applyFollowers}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Followers" />
            </SelectTrigger>
            <SelectContent>
              {FOLLOWERS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={engagementVal} onValueChange={applyEngagement}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Engagement" />
            </SelectTrigger>
            <SelectContent>
              {ENGAGEMENT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceVal} onValueChange={applyPrice}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Harga" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.verified === undefined ? "all" : filters.verified ? "true" : "false"}
            onValueChange={(v) => setFilters((f) => ({ ...f, verified: v === "all" ? undefined : v === "true", page: 1 }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Belum Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy ?? "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Relevansi</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Harga</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button
            variant="outline" size="icon" className="h-9 w-9"
            onClick={() => setShowAdvanced(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setListView(false)}
              className={`p-2 ${!listView ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setListView(true)}
              className={`p-2 ${listView ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isLoading ? "Memuat..." : `${data?.total ?? 0} kreator ditemukan`}
          </p>
          <p className="text-xs text-slate-500">
            Halaman {filters.page} dari {data?.totalPages ?? 1}
          </p>
        </div>

        {/* Grid / List */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4 space-y-3">
                  <div className="flex gap-3"><Skeleton className="w-14 h-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
                  <Skeleton className="h-10" />
                </CardContent></Card>
              ))}
            </div>
          ) : (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
              {data?.data.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  selected={selectedIds.includes(creator.id)}
                  onToggle={() => toggleSelect(creator.id)}
                  listView={listView}
                />
              ))}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline" size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={filters.page === data.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              >
                Berikutnya
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Brief Panel */}
      <aside className="w-[320px] shrink-0 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Campaign Brief</h2>
          <p className="text-xs text-slate-500 mt-1">{selectedIds.length}/5 kreator dipilih</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {selectedCreators.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Belum ada kreator dipilih</p>
              <p className="text-xs mt-1">Klik "+ Brief" pada kartu kreator</p>
            </div>
          ) : (
            selectedCreators.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 overflow-hidden shrink-0">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    c.name[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.followersText} · {c.priceText}</p>
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-red-500"
                  onClick={() => toggleSelect(c.id)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="p-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Est. Total Budget</span>
              <span className="font-bold text-slate-800">
                {formatRupiah(selectedCreators.reduce((a, c) => a + c.price, 0))}
              </span>
            </div>
            <Button className="w-full" onClick={() => setShowCreateCampaign(true)}>
              Buat Kampanye
            </Button>
          </div>
        )}
      </aside>

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Lanjutan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Harga Minimum (Rp)</label>
              <Input
                type="number"
                placeholder="Contoh: 5000000"
                defaultValue={advMinPrice.current}
                onChange={(e) => { advMinPrice.current = e.target.value; }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Harga Maksimum (Rp)</label>
              <Input
                type="number"
                placeholder="Contoh: 15000000"
                defaultValue={advMaxPrice.current}
                onChange={(e) => { advMaxPrice.current = e.target.value; }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Rating Minimum</label>
              <Select
                onValueChange={(v) => setFilters((f) => ({ ...f, minRating: v === "all" ? undefined : Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Rating</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 flex-1">Hanya Fast Response</label>
              <button
                onClick={() => setFilters((f) => ({ ...f, fastResponse: !f.fastResponse }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.fastResponse ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.fastResponse ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 flex-1">Hanya Top Rated</label>
              <button
                onClick={() => setFilters((f) => ({ ...f, topRated: !f.topRated }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.topRated ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.topRated ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvanced(false)}>Batal</Button>
            <Button onClick={() => {
              setFilters((f) => ({
                ...f,
                minPrice: advMinPrice.current ? Number(advMinPrice.current) : undefined,
                maxPrice: advMaxPrice.current ? Number(advMaxPrice.current) : undefined,
                page: 1,
              }));
              setShowAdvanced(false);
            }}>
              Terapkan Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kampanye dengan {selectedCreators.length} Kreator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Kampanye</label>
              <Input
                placeholder="Contoh: Kampanye Summer 2025"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <Input
                placeholder="Deskripsi singkat kampanye..."
                value={campaignForm.description}
                onChange={(e) => setCampaignForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Budget (Rp)</label>
              <Input
                type="number"
                placeholder={String(selectedCreators.reduce((a, c) => a + c.price, 0))}
                value={campaignForm.budget}
                onChange={(e) => setCampaignForm((f) => ({ ...f, budget: e.target.value }))}
              />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
              <p className="font-medium mb-1">Kreator yang dipilih:</p>
              {selectedCreators.map((c) => (
                <span key={c.id} className="inline-block mr-2 text-xs text-slate-500">· {c.name}</span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Batal</Button>
            <Button onClick={handleCreateCampaign} disabled={createMutation.isPending || !campaignForm.title}>
              {createMutation.isPending ? "Membuat..." : "Buat Kampanye"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
