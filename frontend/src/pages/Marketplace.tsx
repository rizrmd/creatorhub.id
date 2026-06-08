import { useState } from "react";
import { Search, SlidersHorizontal, Star, CheckCircle, Zap, Award, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreators } from "@/hooks/useCreators";
import type { Creator, CreatorListParams } from "@/types";
import { formatRupiah } from "@/lib/utils";

const CATEGORIES = ["lifestyle", "travel", "beauty", "tech", "food", "sports"];
const CITIES = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan", "Makassar"];

const platformIcon = (p: string) => {
  if (p === "instagram") return <Instagram className="w-3 h-3" />;
  if (p === "youtube") return <Youtube className="w-3 h-3" />;
  return <span className="text-[10px] font-bold">TT</span>;
};

function CreatorCard({ creator, selected, onToggle }: { creator: Creator; selected: boolean; onToggle: () => void }) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0">
            {creator.imageUrl ? (
              <img
                src={creator.imageUrl}
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("style");
                }}
              />
            ) : null}
            <div
              className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500"
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

export default function Marketplace() {
  const [filters, setFilters] = useState<CreatorListParams>({ page: 1, pageSize: 20 });
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["reza-alvaro", "nadia-aurel"]);

  const { data, isLoading } = useCreators({ ...filters, search: search || undefined });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const selectedCreators = data?.data.filter((c) => selectedIds.includes(c.id)) ?? [];

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3">
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
            <SelectTrigger className="w-40">
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
            value={filters.city ?? "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, city: v === "all" ? undefined : v, page: 1 }))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy ?? ""}
            onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v || undefined }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Harga</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Results info */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isLoading ? "Memuat..." : `${data?.total ?? 0} kreator ditemukan`}
          </p>
          <p className="text-xs text-slate-500">
            Halaman {filters.page} dari {data?.totalPages ?? 1}
          </p>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4 space-y-3">
                  <div className="flex gap-3"><Skeleton className="w-14 h-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
                  <Skeleton className="h-12" />
                </CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {data?.data.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  selected={selectedIds.includes(creator.id)}
                  onToggle={() => toggleSelect(creator.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
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
      <aside className="w-[340px] shrink-0 bg-white border-l border-slate-200 flex flex-col">
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
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                  {c.name[0]}
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
                  ×
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
            <Button className="w-full">Buat Kampanye</Button>
          </div>
        )}
      </aside>
    </div>
  );
}
