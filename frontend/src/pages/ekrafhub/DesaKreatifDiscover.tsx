import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, Eye } from "lucide-react";

interface TourPackage {
  id: string;
  title: string;
  duration: string;
  location: string;
  views: number;
  image: string;
  creator: string;
  creatorAvatar: string;
}

const TOUR_PACKAGES: TourPackage[] = [
  { id: "1", title: "1hariDiJakartaBaratTes", duration: "1 Hari", location: "Jakarta Barat Tes", views: 0, image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&h=300&fit=crop", creator: "User Atourin", creatorAvatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", title: "1hariDiYogyakarta", duration: "1 Hari", location: "Yogyakarta", views: 563, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", creator: "Syah Ari Wiharjo (Ari)", creatorAvatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", title: "3 hari di Surabaya", duration: "3 Hari", location: "Surabaya", views: 480, image: "https://images.unsplash.com/photo-1547483238-f40e3c7ac494?w=400&h=300&fit=crop", creator: "Mighfari Arilianza", creatorAvatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", title: "One Day Tour In Central Lombok", duration: "1 Hari", location: "Lombok Tengah", views: 424, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", creator: "Andrean Saputra", creatorAvatar: "https://i.pravatar.cc/150?img=4" },
  { id: "5", title: "One Day Tour West Lombok", duration: "1 Hari", location: "Lombok Barat", views: 274, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop", creator: "Anisa Latifah Arisanti", creatorAvatar: "https://i.pravatar.cc/150?img=5" },
  { id: "6", title: "Hidden Heritage Tour", duration: "1 Hari", location: "Lombok", views: 227, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop", creator: "Laela Urfiya Azzahra", creatorAvatar: "https://i.pravatar.cc/150?img=6" },
  { id: "7", title: "2 hari di Garut", duration: "2 Hari", location: "Garut", views: 201, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop", creator: "Thoriq Abror", creatorAvatar: "https://i.pravatar.cc/150?img=7" },
  { id: "8", title: "The Lost Age at Lahat", duration: "1 Hari", location: "Lahat", views: 199, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", creator: "Welly Wiliyanto", creatorAvatar: "https://i.pravatar.cc/150?img=8" },
  { id: "9", title: "Yogyakarta Odyssey in 3D2N", duration: "3 Hari", location: "Yogyakarta", views: 252, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop", creator: "Winnuar Dwina Novarani", creatorAvatar: "https://i.pravatar.cc/150?img=9" },
  { id: "10", title: "2 hari bersama Garut", duration: "2 Hari", location: "Garut", views: 149, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop", creator: "SARAH LUTHFIA HUMAIRA", creatorAvatar: "https://i.pravatar.cc/150?img=10" },
  { id: "11", title: "Sabu Raijua One Day Tour", duration: "1 Hari", location: "Sabu Raijua", views: 340, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", creator: "Reza Permadi", creatorAvatar: "https://i.pravatar.cc/150?img=11" },
  { id: "12", title: "1hariDiYogyakarta", duration: "3 Hari", location: "Yogyakarta", views: 184, image: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&h=300&fit=crop", creator: "Muhamad Rovianto", creatorAvatar: "https://i.pravatar.cc/150?img=12" },
];

const LOCATIONS = Array.from(new Set(TOUR_PACKAGES.map((p) => p.location))).sort();
const DURATIONS = Array.from(new Set(TOUR_PACKAGES.map((p) => p.duration))).sort();

export default function DesaKreatifDiscover() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const filtered = useMemo(() => {
    return TOUR_PACKAGES.filter((p) => {
      const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.creator.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === "all" || p.location === locationFilter;
      const matchDuration = durationFilter === "all" || p.duration === durationFilter;
      return matchSearch && matchLocation && matchDuration;
    });
  }, [search, locationFilter, durationFilter]);

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/dashboard/ekrafhub/desa-kreatif")}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
          style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Desa Kreatif Discover
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari paket wisata..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-[13px] border outline-none transition-colors focus:ring-1"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)", "--tw-ring-color": "var(--ch-primary)" } as React.CSSProperties}
          />
        </div>
        <div className="relative">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Lokasi</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="relative">
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Durasi</option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-xl border overflow-hidden transition-all hover:scale-[1.02]"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                  {pkg.duration} &bull; {pkg.location}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                  <Eye className="w-3.5 h-3.5" />
                  {pkg.views}
                </span>
              </div>
              <h3 className="text-[13px] font-bold mb-2 leading-tight" style={{ color: "var(--ch-text)" }}>
                {pkg.title}
              </h3>
              <div className="flex items-center gap-2">
                <img src={pkg.creatorAvatar} alt={pkg.creator} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{pkg.creator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Tidak ada paket wisata yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
