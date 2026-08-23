import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, MapPin } from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return value;
}

interface DesaKreatif {
  id: string;
  name: string;
  location: string;
  province: string;
  kecamatan: string;
  image: string;
  subsectors?: string[];
}

const DESA_KREATIF: DesaKreatif[] = [
  { id: "gampongnusa", name: "Gampong Nusa", location: "Aceh Besar", province: "Aceh", kecamatan: "Indrapuri", image: "/desa-photos/Gampong Nusa.jpg" },
  { id: "desawisatajaboi", name: "Desa Wisata Jaboi", location: "Sabang", province: "Aceh", kecamatan: "Sukakarya", image: "/desa-photos/Desa Wisata Jaboi.jpeg" },
  { id: "gamponglampulo", name: "Gampong Lampulo", location: "Banda Aceh", province: "Aceh", kecamatan: "Kuta Alam", image: "/desa-photos/Gampong Lampulo.jpg" },
  { id: "desaiboih", name: "Desa Iboih", location: "Sabang", province: "Aceh", kecamatan: "Sukajaya", image: "/desa-photos/Desa Iboih.jpeg" },
  { id: "gamponguleelhue", name: "Gampong Ulee Lhue", location: "Banda Aceh", province: "Aceh", kecamatan: "Banda Raya", image: "/desa-photos/Gampong Ulee Lhue.jpg" },
  { id: "desaaluejang", name: "Desa Alue Jang", location: "Aceh Jaya", province: "Aceh", kecamatan: "Krueng Sabee", image: "/desa-photos/Desa Alue Jang.jpg" },
  { id: "desaaneuklaot", name: "Desa Aneuk Laot", location: "Sabang", province: "Aceh", kecamatan: "Sukajaya", image: "/desa-photos/Desa Aneuk Laot.jpg" },
  { id: "desasuaktimah", name: "Desa Suak Timah", location: "Aceh Barat", province: "Aceh", kecamatan: "Johan Pahlawan", image: "/desa-photos/Desa Suak Timah.jpeg" },
  { id: "desageunteut", name: "Desa Geunteut", location: "Aceh Besar", province: "Aceh", kecamatan: "Ingin Jaya", image: "/desa-photos/Desa Geunteut.jpg" },
  { id: "desauleenyue", name: "Desa Ulee Nyeue", location: "Aceh Utara", province: "Aceh", kecamatan: "Banda Baro", image: "/desa-photos/Desa Ulee Nyeue.jpg" },
];

const KLASTER_DATA: Record<string, string[]> = {
  "Klaster Seni dan Budaya": ["Kuliner", "Kriya", "Seni Rupa", "Seni Pertunjukan", "Fesyen"],
  "Klaster Desain": ["Arsitektur", "Desain Interior", "Desain Komunikasi Visual (DKV)", "Desain Produk", "Modifikasi Otomotif"],
  "Klaster Teknologi dan Konten Digital": ["Pengembangan Permainan (Game)", "Aplikasi", "Teknologi Baru", "Konten Digital", "Sulih Suara"],
  "Klaster Media dan Distribusi Kreatif": ["Film, Animasi, dan Video", "Musik", "Fotografi", "Televisi dan Radio", "Periklanan", "Penerbitan"],
};

const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Kepulauan Riau", "Riau",
  "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung", "Banten", "DKI Jakarta",
  "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Timur",
  "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Utara", "Maluku",
  "Maluku Utara", "Papua", "Papua Barat", "Papua Barat Daya", "Papua Tengah",
];

export default function DesaKreatifDiscover() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [kabupatenFilter, setKabupatenFilter] = useState("all");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [klasterFilter, setKlasterFilter] = useState("all");
  const [subsectorFilter, setSubsectorFilter] = useState("all");

  const provinceCount = useCountUp(31);
  const subsectorCount = useCountUp(21);

  const kabupatenList = useMemo(() => {
    const set = new Set(DESA_KREATIF.filter((d) => provinceFilter === "all" || d.province === provinceFilter).map((d) => d.location));
    return [...set].sort();
  }, [provinceFilter]);

  const kecamatanList = useMemo(() => {
    const filtered = DESA_KREATIF.filter((d) => {
      if (provinceFilter !== "all" && d.province !== provinceFilter) return false;
      if (kabupatenFilter !== "all" && d.location !== kabupatenFilter) return false;
      return true;
    });
    const set = new Set(filtered.map((d) => d.kecamatan));
    return [...set].sort();
  }, [provinceFilter, kabupatenFilter]);

  const filtered = useMemo(() => {
    return DESA_KREATIF.filter((d) => {
      const matchSearch = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
      const matchProvince = provinceFilter === "all" || d.province === provinceFilter;
      const matchKabupaten = kabupatenFilter === "all" || d.location === kabupatenFilter;
      const matchKecamatan = kecamatanFilter === "all" || d.kecamatan === kecamatanFilter;
      const matchSubsector = subsectorFilter === "all" || d.subsectors?.includes(subsectorFilter);
      return matchSearch && matchProvince && matchKabupaten && matchKecamatan && matchSubsector;
    });
  }, [search, provinceFilter, kabupatenFilter, kecamatanFilter, subsectorFilter]);

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
          Temukan Desa Kreatif
        </h1>
        <span className="ml-auto text-[12px] font-semibold whitespace-nowrap" style={{ color: "var(--ch-text-muted)" }}>
          Total: <span className="text-[15px] font-extrabold" style={{ color: "var(--ch-primary)" }}>{provinceCount}</span> Provinsi | <span className="text-[15px] font-extrabold" style={{ color: "var(--ch-primary)" }}>{subsectorCount}</span> Subsektor Ekonomi Kreatif
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
          <input
            type="text"
            placeholder="Temukan Desa Kreatif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-[13px] border outline-none transition-colors focus:ring-1"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)", "--tw-ring-color": "var(--ch-primary)" } as React.CSSProperties}
          />
        </div>
        <div className="relative">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Provinsi</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="relative">
          <select
            value={kabupatenFilter}
            onChange={(e) => { setKabupatenFilter(e.target.value); setKecamatanFilter("all"); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Kabupaten</option>
            {kabupatenList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="relative">
          <select
            value={kecamatanFilter}
            onChange={(e) => setKecamatanFilter(e.target.value)}
            disabled={kabupatenFilter === "all"}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Kecamatan</option>
            {kabupatenFilter !== "all" && kecamatanList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="relative">
          <select
            value={klasterFilter}
            onChange={(e) => { setKlasterFilter(e.target.value); setSubsectorFilter("all"); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Klaster</option>
            {Object.keys(KLASTER_DATA).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
        <div className="relative">
          <select
            value={subsectorFilter}
            onChange={(e) => setSubsectorFilter(e.target.value)}
            disabled={klasterFilter === "all"}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg text-[13px] font-semibold border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <option value="all">Semua Subsektor</option>
            {klasterFilter !== "all" && KLASTER_DATA[klasterFilter]?.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((desa) => (
          <div
            key={desa.id}
            onClick={() => navigate(`/dashboard/ekrafhub/desa-kreatif/discover/${desa.id}`)}
            className="rounded-xl border overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={desa.image} alt={desa.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h3 className="text-[13px] font-bold mb-1 leading-tight" style={{ color: "var(--ch-text)" }}>
                {desa.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--ch-text-muted)" }} />
                <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                  {desa.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Tidak ada desa kreatif yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
