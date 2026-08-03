import { useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Building2, Users, X, Camera, Share2, Image, Video, BookOpen, ExternalLink } from "lucide-react";

const DESA_DATA: Record<string, { name: string; location: string; image: string; description: string; tipologi: string }> = {
  gampongnusa: { name: "Gampong Nusa", location: "Aceh Besar", image: "/desa-photos/Gampong Nusa.jpg", description: "Gampong Nusa kuat sebagai desa ekraf digital karena punya wisata berbasis komunitas, homestay, kuliner, kriya, budaya, dan potensi Kekayaan Intelektual yang bisa dikemas jadi konten, produk, dan promosi digital lokal.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desawisatajaboi: { name: "Desa Wisata Jaboi", location: "Sabang", image: "/desa-photos/Desa Wisata Jaboi.jpeg", description: "Desa wisata dengan keindahan alam pegunungan dan udara sejuk.", tipologi: "Desa/Kel Kreatif Rintisan" },
  gamponglampulo: { name: "Gampong Lampulo", location: "Banda Aceh", image: "/desa-photos/Gampong Lampulo.jpg", description: "Kampung nelayan tradisional dengan warisan budaya bahari.", tipologi: "Desa/Kel Kreatif Produktif" },
  desaiboih: { name: "Desa Iboih", location: "Sabang", image: "/desa-photos/Desa Iboih.jpeg", description: "Desa wisata bahari dengan snorkeling dan diving kelas dunia.", tipologi: "Desa/Kel Kreatif Produktif" },
  gamponguleelhue: { name: "Gampong Ulee Lhue", location: "Banda Aceh", image: "/desa-photos/Gampong Ulee Lhue.jpg", description: "Kawasan pesisir dengan aktivitas perdagangan ikan tradisional.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desaaluejang: { name: "Desa Alue Jang", location: "Aceh Jaya", image: "/desa-photos/Desa Alue Jang.jpg", description: "Desa pertanian dengan potensi agrowisata yang menjanjikan.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desaaneuklaot: { name: "Desa Aneuk Laot", location: "Sabang", image: "/desa-photos/Desa Aneuk Laot.jpg", description: "Desa nelayan dengan budaya laut yang masih kental.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desasuaktimah: { name: "Desa Suak Timah", location: "Aceh Barat", image: "/desa-photos/Desa Suak Timah.jpeg", description: "Desa pesisir dengan potensi tambak dan perikanan.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desageunteut: { name: "Desa Geunteut", location: "Aceh Besar", image: "/desa-photos/Desa Geunteut.jpg", description: "Desa dengan warisan budaya dan tradisi adat yang kuat.", tipologi: "Desa/Kel Kreatif Rintisan" },
  desauleenyue: { name: "Desa Ulee Nyeue", location: "Aceh Utara", image: "/desa-photos/Desa Ulee Nyeue.jpg", description: "Desa dengan potensi perkebunan dan ekonomi kreatif.", tipologi: "Desa/Kel Kreatif Rintisan" },
};

const TIM_DESA = [
  { role: "Digital Coordinator", name: "Rizky Pratama", avatar: "https://i.pravatar.cc/150?img=11", desc: "Menyusun kalender kampanye, membagi tugas tim, koordinasi dengan pemerintah desa dan EKRAF.", platforms: ["Instagram", "TikTok"] },
  { role: "Storytelling & Content", name: "Aisyah Putri", avatar: "https://i.pravatar.cc/150?img=5", desc: "Menulis caption dan cerita warga, mengangkat budaya, wisata, kuliner, dan UMKM.", platforms: ["Instagram", "YouTube"] },
  { role: "Visual Documentation", name: "Fauzan Mubarak", avatar: "https://i.pravatar.cc/150?img=7", desc: "Mengambil foto dan video kegiatan desa, mendokumentasikan produk UMKM.", platforms: ["Instagram", "TikTok"] },
  { role: "Social Media & Community Officer", name: "Nurul Hidayah", avatar: "https://i.pravatar.cc/150?img=9", desc: "Mengelola upload harian, membalas komentar dan DM, menjalankan challenge warga.", platforms: ["TikTok", "Facebook"] },
  { role: "Brand Ambassador Desa", name: "Made Aditya", avatar: "https://i.pravatar.cc/150?img=12", desc: "Membangun narasi besar desa, menginspirasi nano influencer, host konten utama.", platforms: ["TikTok", "YouTube", "Instagram"] },
  { role: "Nano Influencer Coordinator", name: "Siti Rahmawati", avatar: "https://i.pravatar.cc/150?img=25", desc: "Merekrut kreator lokal, membuat grup koordinasi, memberikan brief mingguan.", platforms: ["Instagram", "TikTok"] },
];

const KOC_DATA = [
  { name: "Made Aditya", photo: "https://i.pravatar.cc/150?img=12", bio: "Brand Ambassador Desa Kreatif Digital", platforms: [{ name: "TikTok", handle: "@madeaditya", followers: "22.1K", er: "9.2%" }, { name: "Instagram", handle: "@madeaditya", followers: "6.3K", er: "7.1%" }] },
  { name: "Elvi Safrita", photo: "https://i.pravatar.cc/150?img=23", bio: "Influencer Kuliner", platforms: [{ name: "TikTok", handle: "@elvisafrita", followers: "5.2K", er: "6.3%" }] },
  { name: "Raudhatussyifa", photo: "https://i.pravatar.cc/150?img=24", bio: "Influencer Fashion", platforms: [{ name: "Instagram", handle: "@raudhatussyifa", followers: "2.1K", er: "4.8%" }, { name: "TikTok", handle: "@raudhatussyifa", followers: "1.7K", er: "5.5%" }] },
  { name: "M Rifqi Haikal", photo: "https://i.pravatar.cc/150?img=33", bio: "Influencer Travel", platforms: [{ name: "YouTube", handle: "@mrifqinkl", followers: "12.1K", er: "7.2%" }] },
  { name: "Faeri Hafriza", photo: "https://i.pravatar.cc/150?img=34", bio: "Influencer Komedi", platforms: [{ name: "X", handle: "@faerihfriza", followers: "2.4K", er: "3.8%" }] },
];

interface AkunData {
  name: string;
  photo: string;
  bio: string;
  platforms: { name: string; handle: string; followers: string; er: string }[];
}

const NANO_ACCOUNTS: AkunData[] = [
  { name: "Nura Sahirah", photo: "https://i.pravatar.cc/150?img=31", bio: "Travel & Culture", platforms: [{ name: "Instagram", handle: "@nurasahirah", followers: "2,017", er: "0.8%" }] },
  { name: "Warga Gampong Nusa", photo: "https://i.pravatar.cc/150?img=37", bio: "Community Account", platforms: [{ name: "X", handle: "@wargagampongnusa", followers: "2,100", er: "2.9%" }] },
  { name: "Komunitas Gampong Nusa", photo: "https://i.pravatar.cc/150?img=43", bio: "Community Hub", platforms: [{ name: "Facebook", handle: "KomunitasGN", followers: "3,200", er: "3.8%" }] },
  { name: "sr.king__", photo: "https://i.pravatar.cc/150?img=36", bio: "Travel Content", platforms: [{ name: "Instagram", handle: "@sr.king__", followers: "8,432", er: "3.2%" }] },
  { name: "endang.supriyati", photo: "https://i.pravatar.cc/150?img=41", bio: "Kuliner & UMKM", platforms: [{ name: "Instagram", handle: "@endang.supriyati", followers: "5,127", er: "4.1%" }] },
  { name: "arrofimoez", photo: "https://i.pravatar.cc/150?img=57", bio: "Lifestyle & Creative", platforms: [{ name: "Instagram", handle: "@arrofimoez", followers: "9,814", er: "2.7%" }] },
  { name: "mearvic", photo: "https://i.pravatar.cc/150?img=60", bio: "Travel & Culture", platforms: [{ name: "Instagram", handle: "@mearvic", followers: "6,543", er: "3.9%" }] },
];

const MICRO_ACCOUNTS: AkunData[] = [
  { name: "Gampong Nusa Ku", photo: "https://i.pravatar.cc/150?img=48", bio: "Travel & Tourism", platforms: [{ name: "Instagram", handle: "@gampongnusaku", followers: "5.7K", er: "4.2%" }] },
  { name: "Opie Zahri", photo: "https://i.pravatar.cc/150?img=38", bio: "Lifestyle & Creative", platforms: [{ name: "Instagram", handle: "@opiezahri", followers: "6.5K", er: "0.6%" }] },
  { name: "Gampong Nusa Youth", photo: "https://i.pravatar.cc/150?img=45", bio: "Youth Community", platforms: [{ name: "TikTok", handle: "@gampongnusayouth", followers: "8.4K", er: "7.1%" }] },
  { name: "Desa Kreatif Aceh", photo: "https://i.pravatar.cc/150?img=53", bio: "Creative Village", platforms: [{ name: "Instagram", handle: "@desakreatifaceh", followers: "12.3K", er: "3.5%" }] },
];

const AKUN_HOMELESS: AkunData[] = [
  { name: "Explore Aceh", photo: "https://i.pravatar.cc/150?img=55", bio: "Travel & Tourism", platforms: [{ name: "Instagram", handle: "@exploreacehh", followers: "130K", er: "5.2%" }] },
  { name: "Aceh Daily", photo: "https://i.pravatar.cc/150?img=59", bio: "News & Media", platforms: [{ name: "Instagram", handle: "@acehdaily", followers: "89K", er: "4.1%" }] },
  { name: "Aceh Tourism", photo: "https://i.pravatar.cc/150?img=61", bio: "Tourism Promotion", platforms: [{ name: "X", handle: "@AcehTourism", followers: "45K", er: "3.7%" }] },
  { name: "Wisata Aceh Official", photo: "https://i.pravatar.cc/150?img=65", bio: "Official Tourism", platforms: [{ name: "YouTube", handle: "@wisataaceh", followers: "67K", er: "6.3%" }] },
  { name: "Jelajah Aceh", photo: "https://i.pravatar.cc/150?img=64", bio: "Travel Content", platforms: [{ name: "TikTok", handle: "@jelajahaceh", followers: "210K", er: "8.9%" }] },
];

function socialPlatformIcon(p: string) {
  const lower = p.toLowerCase();
  const colors: Record<string, string> = { instagram: "#E1306C", youtube: "#FF0000", tiktok: "#000000", facebook: "#1877F2", x: "#000000" };
  const color = colors[lower] || "#6B7280";
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: color }}>
      {lower === "x" && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
      {lower === "instagram" && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
      {lower === "facebook" && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
      {lower === "tiktok" && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>}
      {lower === "youtube" && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
      {!["x","instagram","facebook","tiktok","youtube"].includes(lower) && <Camera className="w-3 h-3" />}
    </span>
  );
}

const TIPOLOGI = [
  { label: "Desa/Kel Kreatif Rintisan", color: "#F97316" },
  { label: "Desa/Kel Kreatif Produktif", color: "#3B82F6" },
  { label: "Desa/Kel Kreatif Berdaya", color: "#22C55E" },
  { label: "Desa/Kel Kreatif Mandiri", color: "#A855F7" },
];

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 md:p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary)20", color: "var(--ch-primary)" }}>
          {icon}
        </div>
        <h3 className="text-sm font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function DesaKreatifDetail() {
  const { id } = useParams();
  const desa = DESA_DATA[id || ""] || DESA_DATA["gampongnusa"];
  const [showTim, setShowTim] = useState(false);
  const [akunTab, setAkunTab] = useState<"nano" | "micro" | "homeless">("nano");
  const [activeTab, setActiveTab] = useState<"ekosistem" | "social" | "produk" | "peran">("ekosistem");

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100vh" }}>
      {/* Modal Tim Digital Desa */}
      {showTim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
            <div className="sticky top-0 flex items-center justify-between p-5 pb-4" style={{ background: "var(--ch-surface)", borderBottom: "1px solid var(--ch-border)" }}>
              <div>
                <h2 className="text-lg font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Struktur Tim Digital Desa</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--ch-text-muted)" }}>9 anggota tim • {desa.name}</p>
              </div>
              <button onClick={() => setShowTim(false)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {TIM_DESA.map((t) => (
                <div key={t.role} className="rounded-xl p-4 transition-all hover:scale-[1.01]" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                  <div className="flex items-start gap-3">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold truncate" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</h4>
                      </div>
                      <p className="text-[11px] font-semibold mb-1.5" style={{ color: "var(--ch-primary)" }}>{t.role}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{t.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="flex border-b" style={{ borderColor: "var(--ch-border)" }}>
          {[
            { id: "ekosistem" as const, label: "Ekosistem Konten Desa Kreatif Digital" },
            { id: "social" as const, label: "Postingan Media Sosial" },
            { id: "produk" as const, label: "Produk Kreatif Unggulan" },
            { id: "peran" as const, label: "Peran Aktif Masyarakat" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 px-4 py-4 text-[15px] font-extrabold transition-all relative"
              style={{
                background: activeTab === tab.id ? "rgba(249,115,22,0.08)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "var(--ch-text-muted)",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t"
                  style={{ background: "var(--ch-orange)" }} />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-6">
          {/* Tab 1: Ekosistem Konten Desa Kreatif Digital */}
          {activeTab === "ekosistem" && (
            <div className="space-y-5">
              <Section title={`Tentang Desa Kreatif Digital ${desa.name}`} icon={<span className="text-[14px]">ℹ️</span>}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-56 shrink-0">
              <img src={desa.image} alt={desa.name} className="w-full h-44 md:h-full object-cover rounded-xl" />
            </div>
            <div className="flex-1">
              <p className="text-xs leading-relaxed" style={{ color: "var(--ch-text)" }}>
                Gampong Nusa memiliki potensi kuat sebagai desa ekonomi kreatif digital karena menggabungkan wisata berbasis komunitas, homestay, kuliner lokal, kriya, budaya, dan kekayaan intelektual dalam satu ekosistem desa. Karakter lokal yang kuat membuat Gampong Nusa mudah dikembangkan menjadi konten digital, mulai dari storytelling budaya, video perjalanan, katalog produk, hingga promosi paket wisata. Kehadiran homestay dan aktivitas warga juga membuka peluang experience tourism yang autentik. Melalui dukungan kreator lokal, citizen journalist, media sosial, dan marketplace digital, potensi Gampong Nusa dapat diperluas menjadi produk kreatif, kampanye destinasi, serta model desa kreatif yang berkelanjutan.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  <span className="text-white">🏠</span>
                  Profil Desa
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  Seni dan Budaya
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  Kuliner
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  Kriya
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  Teknologi dan Konten Digital
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105" style={{ background: "var(--ch-primary)", color: "#fff" }}>
                  Konten Digital
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Tipologi */}
        <Section title="Tipologi Desa/Kelurahan" icon={<span className="text-[16px] leading-none">#️⃣</span>}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIPOLOGI.map((t) => {
              const isActive = desa.tipologi === t.label;
              return (
                <div
                  key={t.label}
                  className="rounded-xl p-3 text-center transition-all"
                  style={{
                    background: isActive ? `${t.color}25` : `${t.color}10`,
                    border: isActive ? `2px solid ${t.color}` : `1px solid ${t.color}30`,
                    boxShadow: isActive ? `0 0 0 4px ${t.color}20` : "none",
                    transform: isActive ? "scale(1.05)" : "none",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ background: isActive ? t.color : `${t.color}40` }}
                  >
                    <Building2 className="w-4 h-4" style={{ color: isActive ? "#fff" : t.color }} />
                  </div>
                  <p className="text-[10px] font-bold leading-tight" style={{ color: t.color }}>{t.label}</p>
                  {isActive && (
                    <span className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.color, color: "#fff" }}>
                      Saat Ini
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

          {/* Score Desa Kreatif Digital */}
          <div className="rounded-xl p-4 mb-4"
            style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="md:w-44 shrink-0">
                <h3 className="text-[14px] font-extrabold mb-1" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Score Desa Kreatif Digital
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "#fff" }}>
                  Skor mencerminkan kualitas, pemanfaatan, dan dampak konten digital desa.
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  {/* Gradient bar */}
                  <div className="h-10 rounded-full overflow-hidden relative" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                    <div className="h-full flex">
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #B91C1C, #DC2626)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #DC2626, #EA580C)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #EA580C, #D97706)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #D97706, #CA8A04)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #CA8A04, #65A30D)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #65A30D, #16A34A)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #16A34A, #15803D)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #15803D, #166534)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #166534, #14532D)" }} />
                      <div className="h-full" style={{ width: "10%", background: "linear-gradient(90deg, #14532D, #0F4423)" }} />
                    </div>
                    {/* Score box inside bar */}
                    <div className="absolute flex items-center justify-center px-2.5 py-1 rounded-md text-[13px] font-extrabold text-white"
                      style={{ left: "70%", top: "50%", transform: "translate(-50%, -50%)", background: "#1E293B", border: "2px solid #0F172A", zIndex: 10 }}>
                      72
                    </div>
                  </div>
                  {/* Tick marks + numbers */}
                  <div className="relative mt-2">
                    <div className="flex justify-between">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                        <div key={n} className="flex flex-col items-center" style={{ width: "10%" }}>
                          <div className="w-px h-1.5 mb-0.5" style={{ background: "#fff" }} />
                          <span className="text-[10px] font-semibold" style={{ color: "#fff" }}>{n}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex mt-2" style={{ borderTop: "1px solid var(--ch-border)" }}>
                      <div className="flex-1 text-center py-1.5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "var(--ch-border)" }} />
                        <span className="text-[10px] font-semibold" style={{ color: "#fff" }}>Perlu Ditingkatkan</span>
                      </div>
                      <div className="flex-1 text-center py-1.5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "var(--ch-border)" }} />
                        <span className="text-[10px] font-semibold" style={{ color: "#fff" }}>Cukup</span>
                      </div>
                      <div className="flex-1 text-center py-1.5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "var(--ch-border)" }} />
                        <span className="text-[10px] font-semibold" style={{ color: "#fff" }}>Baik</span>
                      </div>
                      <div className="flex-1 text-center py-1.5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "var(--ch-border)" }} />
                        <span className="text-[10px] font-semibold" style={{ color: "#fff" }}>Sangat Baik</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Tim Digital Desa */}
            <div className="rounded-xl border p-4 flex flex-col"
              style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                <h3 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Tim Digital Desa
                </h3>
              </div>
              <p className="text-[12px] mb-4" style={{ color: "#fff" }}>Tim digital memproduksi, mengelola, dan mendistribusikan aset konten desa untuk memperkuat promosi potensi desa secara berkelanjutan. Selain itu, tim juga melakukan listing, kurasi, dan pemetaan KOC, akun komunitas, serta homeless media yang aktif mempublikasikan konten terkait potensi, aktivitas, dan perkembangan desa.</p>

              <div className="grid grid-cols-2 gap-2 flex-1">
                {TIM_DESA.map((t) => (
                  <div key={t.name} className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate leading-tight" style={{ color: "var(--ch-text)" }}>{t.name}</p>
                      <p className="text-[10px] font-semibold truncate leading-tight mb-1.5" style={{ color: "var(--ch-primary)" }}>{t.role}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex flex-wrap gap-1">
                          {t.platforms.map((p) => (
                            <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(59,130,246,0.1)", color: "var(--ch-primary)" }}>
                              {p}
                            </span>
                          ))}
                        </div>
                        <button className="ml-auto shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded transition-all hover:scale-105"
                          style={{ background: "var(--ch-primary)", color: "#fff" }}>
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pusat Aset Konten */}
            <div className="rounded-xl border p-4 flex flex-col"
              style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                <h3 className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Pusat Aset Konten
                </h3>
              </div>
              <p className="text-[12px] mb-4" style={{ color: "#fff" }}>Pusat penyimpanan aset digital desa yang mencakup dokumentasi foto, video, siaran pers, katalog produk, informasi destinasi, dan materi promosi yang dikumpulkan, dikurasi, serta siap digunakan untuk kebutuhan publikasi dan kampanye digital.</p>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[
                  { label: "Photos", icon: Image, image: "/desa-photos/Gampong Nusa.jpg" },
                  { label: "Videos", icon: Video, image: "/desa-photos/Gampong Lampulo.jpg" },
                  { label: "Katalog Digital", icon: BookOpen, image: "/desa-photos/Desa Aneuk Laot.jpg" },
                  { label: "Press Release", icon: FileText, image: "/desa-photos/Desa Suak Timah.jpeg" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg overflow-hidden relative group"
                    style={{ border: "1px solid var(--ch-border)" }}>
                    <div className="h-28 overflow-hidden">
                      <img src={item.image} alt={item.label}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center gap-1.5"
                      style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                      <item.icon className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold text-white">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all hover:scale-[1.02]"
                style={{ background: "var(--ch-primary)", color: "#fff" }}>
                Buka Pusat Aset Konten
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        {/* Key Opinion Community */}
        <Section title="Key Opinion Community" icon={<Users className="w-4 h-4" />}>
          <p className="text-xs mb-3" style={{ color: "#fff" }}>Figur publik atau kreator di desa {desa.name} yang memiliki pengaruh digital berdasarkan kekuatan akun, jangkauan audiens, tingkat interaksi, dan konsistensi aktivitas di berbagai platform media sosial.</p>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--ch-border)" }}>
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "var(--ch-bg)" }}>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Creator</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Short Bio</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Lokasi</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Platform</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-primary)" }}>Followers</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-primary)" }}>E/R</th>
                </tr>
              </thead>
              <tbody>
                {KOC_DATA.map((koc) => (
                  <tr key={koc.name} style={{ borderTop: "1px solid var(--ch-border)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={koc.photo} alt={koc.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                        <span className="text-[13px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>{koc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-[11px]" style={{ color: "#fff" }}>{koc.bio}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-[11px]" style={{ color: "#fff" }}>Desa Gampong Nusa, Aceh Besar, Aceh</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {koc.platforms.map((p) => (
                          <div key={p.name} className="flex items-center gap-2">
                            {socialPlatformIcon(p.name)}
                            <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                            <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {koc.platforms.map((p) => (
                          <div key={p.name} className="flex items-center justify-end" style={{ height: "22px" }}>
                            <span className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)" }}>{p.followers}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {koc.platforms.map((p) => (
                          <div key={p.name} className="flex items-center justify-end" style={{ height: "22px" }}>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>{p.er}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Akun Komunitas & Homeless Media */}
        <Section title="Akun Komunitas & Homeless Media" icon={<Users className="w-4 h-4" />}>
          <div className="flex gap-1 mb-4">
            <button
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background: akunTab === "nano" ? "var(--ch-primary)" : "var(--ch-bg)", color: akunTab === "nano" ? "#fff" : "var(--ch-text)", border: "1px solid var(--ch-border)" }}
              onClick={() => setAkunTab("nano")}
            >
              Nano Accounts
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background: akunTab === "micro" ? "var(--ch-primary)" : "var(--ch-bg)", color: akunTab === "micro" ? "#fff" : "var(--ch-text)", border: "1px solid var(--ch-border)" }}
              onClick={() => setAkunTab("micro")}
            >
              Micro Accounts
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{ background: akunTab === "homeless" ? "#8B5CF6" : "var(--ch-bg)", color: akunTab === "homeless" ? "#fff" : "var(--ch-text)", border: "1px solid var(--ch-border)" }}
              onClick={() => setAkunTab("homeless")}
            >
              Homeless Media
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--ch-border)" }}>
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "var(--ch-bg)" }}>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Creator</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Short Bio</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Lokasi</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-primary)" }}>Platform</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-primary)" }}>Followers</th>
                  <th className="px-4 py-3 text-[10px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-primary)" }}>E/R</th>
                </tr>
              </thead>
              <tbody>
                {(akunTab === "nano" ? NANO_ACCOUNTS : akunTab === "micro" ? MICRO_ACCOUNTS : AKUN_HOMELESS).map((akun) => (
                  <tr key={akun.name} style={{ borderTop: "1px solid var(--ch-border)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={akun.photo} alt={akun.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <span className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{akun.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-[11px]" style={{ color: "#fff" }}>{akun.bio}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-[11px]" style={{ color: "#fff" }}>Desa Gampong Nusa, Aceh Besar, Aceh</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {akun.platforms.map((p) => (
                          <div key={p.name} className="flex items-center gap-2">
                            {socialPlatformIcon(p.name)}
                            <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.name}</span>
                            <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {akun.platforms.map((p) => (
                          <div key={p.name} className="flex items-center justify-end" style={{ height: "22px" }}>
                            <span className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)" }}>{p.followers}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="space-y-2">
                        {akun.platforms.map((p) => (
                          <div key={p.name} className="flex items-center justify-end" style={{ height: "22px" }}>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>{p.er}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
            </div>
          )}

          {/* Tab 2: Social Media Posts */}
          {activeTab === "social" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: Overview Stats */}
              <div className="lg:col-span-1 rounded-xl border p-4"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                <h3 className="text-[13px] font-extrabold mb-3" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Overview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Total mentions", value: "70", change: "+84%", up: true },
                    { label: "Total reach", value: "216,133", change: "+68%", up: true },
                    { label: "Positive mentions", value: "0", change: "", up: true },
                    { label: "Negative mentions", value: "0", change: "", up: true },
                    { label: "Average Presence Score", value: "18/100", change: "+64%", up: true },
                    { label: "AVE", value: "$22,313", change: "+67%", up: true },
                    { label: "Social media reach", value: "4,068", change: "", up: true },
                    { label: "Non-Social media reach", value: "212,065", change: "+65%", up: true },
                    { label: "User generated content", value: "4", change: "", up: true },
                    { label: "Social media mentions", value: "2", change: "", up: true },
                    { label: "Non-Social media mentions", value: "68", change: "+79%", up: true },
                    { label: "Social media reactions", value: "15", change: "", up: true },
                    { label: "Social media comments", value: "0", change: "", up: true },
                    { label: "Social media shares", value: "1", change: "", up: true },
                    { label: "Total social media interactions", value: "16", change: "", up: true },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-lg p-2.5"
                      style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                      <p className="text-[9px] mb-1" style={{ color: "var(--ch-text-muted)" }}>{stat.label}</p>
                      <p className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)" }}>{stat.value}</p>
                      {stat.change && (
                        <p className="text-[9px] font-semibold flex items-center gap-0.5" style={{ color: stat.up ? "#22C55E" : "#EF4444" }}>
                          {stat.up ? "↑" : "↓"} {stat.change}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Mentions List */}
              <div className="lg:col-span-2 space-y-3">
                {[
                  { platform: "X", platformColor: "#000", platformIcon: "X", account: "garuda.24jamnews.com", domain: "tiktok.com", followers: "2,394 followers", views: "349 views", influence: "7/10", date: "2026-07-23 09:43 AM", sentiment: "Neutral", content: "Menyusul game, aplikasi, film, dan musik yang pertumbuhannya sangat pesat. Untuk menjaga momentum. [...] Pertama, <strong>Desa Kreatif</strong> untuk memperkuat ekosistem kreatif dari akar di daerah. Kedua, Creative Hub sebagai ruang bagi para talenta tumbuh bersama", site: "tiktok.com" },
                  { platform: "Jurnal", platformColor: "#C62828", platformIcon: "JP", account: "Kementerian Ekraf dan Yayasan Pena Bangsa Bahas ...", domain: "jpnn.com", followers: "2.4M visits", influence: "7/10", date: "2026-07-31 10:27 AM", sentiment: "Neutral", content: "direktorat. Kementerian Ekraf memiliki sejumlah program unggulan mulai dari aktivasi <strong>desa kreatif</strong> hingga aktivasi creative hub dan dapat berkolaborasi dengan Yayasan Pena", site: "jpnn.com" },
                  { platform: "Republika", platformColor: "#C62828", platformIcon: "R", account: "Menerkafr Bekali Tim Ekspedisi Patriot 2026 Petakan Potensi ...", domain: "news.republika.co.id", followers: "1.9M visits", influence: "7/10", date: "2026-07-31 10:13 AM", sentiment: "Neutral", content: "tiga program unggulan Kementerian Ekraf. Ketiga program tersebut adalah Aktivasi <strong>Desa Kreatif</strong>, Aktivasi Creative Hub, dan Creative by Indonesia.Selain itu, tim juga", site: "republika.co.id" },
                  { platform: "Kabar", platformColor: "#1565C0", platformIcon: "K", account: "Ekonomi Kreatif Serap 27,4 Juta Tenaga Kerja, Investasi ...", domain: "katadata.co.id", followers: "3.5M visits", influence: "7/10", date: "2026-07-31 08:45 AM", sentiment: "Neutral", content: "dan lembaga keuangan.Pemerintah juga memfokuskan tiga program prioritas seperti aktivasi <strong>desa kreatif</strong>, aktivasi creative hub, dan pengembangan merek lokal melalui program Creative", site: "katadata.co.id" },
                  { platform: "Indotipikor", platformColor: "#2E7D32", platformIcon: "IT", account: "Hari Koperasi Nasional, Kemendikbud Dorong Desa Kreatif Jadi Pusat Ekono...", domain: "indotipikor.com", followers: "975 visits", influence: "1/10", date: "2026-07-14 04:09 PM", sentiment: "Positive", content: "\"Masterplan menjadi payung bagi program unggulan nasional, salah satunya Aktivasi <strong>Desa Kreatif</strong> sebagai upaya mengembangkan desa dan kelurahan menjadi pusat ekonomi kreatif. [...] Program Aktivasi <strong>Desa Kreatif</strong> diharapkan mampu memperkuat potensi ekonomi lokal melalui pengembangan talenta, peningkatan nilai tambah produk kreatif, serta perluasan a", site: "indotipikor.com" },
                  { platform: "Berita", platformColor: "#D32F2F", platformIcon: "BR", account: "Kementerian Ekraf dan Pena Bangsa Bahas Pengembangan Talenta Muda di...", domain: "beritabuana.co", followers: "25K visits", influence: "3/10", date: "2026-07-03 03:24 AM", sentiment: "Neutral", content: "Kementerian Ekraf memiliki sejumlah program unggulan mulai dari aktivasi <strong>desa kreatif</strong> hingga aktivasi creative hub dan dapat berkolaborasi dengan Yayasan Pena Bangsa,\" kata Menteri Ekraf di Kantor Kementerian Ekraf, Jakarta, Kamis (3/7/2026) [...] Program <strong>desa kreatif</strong> ini disambut baik oleh Deputi Bidang Kreativitas Media, Cecep Rukendi [...]", site: "beritabuana.co" },
                ].map((post, i) => (
                  <div key={i} className="rounded-xl border overflow-hidden transition-all hover:scale-[1.01]"
                    style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                            style={{ background: post.platformColor }}>
                            {post.platformIcon}
                          </div>
                          <div>
                            <h4 className="text-[12px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>{post.account}</h4>
                            <p className="text-[9px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                              {post.domain} · {post.followers} · {post.views} · Influence score: {post.influence} · {post.date}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0" style={{
                          background: post.sentiment === "Positive" ? "#22C55E15" : post.sentiment === "Negative" ? "#EF444415" : "#6B728015",
                          color: post.sentiment === "Positive" ? "#22C55E" : post.sentiment === "Negative" ? "#EF4444" : "#9CA3AF",
                          border: `1px solid ${post.sentiment === "Positive" ? "#22C55E30" : post.sentiment === "Negative" ? "#EF444430" : "#6B728030"}`
                        }}>
                          {post.sentiment}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed mt-2 mb-2" style={{ color: "var(--ch-text)" }} dangerouslySetInnerHTML={{ __html: post.content }} />
                      <div className="flex items-center gap-3 flex-wrap pt-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
                        <button className="flex items-center gap-1 text-[9px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--ch-primary)" }}>
                          <span>🔗</span> Visit
                        </button>
                        <button className="flex items-center gap-1 text-[9px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--ch-text-muted)" }}>
                          <span>🏷️</span> Tags
                        </button>
                        <button className="flex items-center gap-1 text-[9px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--ch-text-muted)" }}>
                          <span>🗑️</span> Delete
                        </button>
                        <button className="flex items-center gap-1 text-[9px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--ch-text-muted)" }}>
                          <span>📄</span> Add to PDF report
                        </button>
                        <button className="flex items-center gap-1 text-[9px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--ch-text-muted)" }}>
                          <span>🔇</span> Mute {post.site}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Produk Kreatif Unggulan */}
          {activeTab === "produk" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Kopi Gampong Nusa", category: "Kuliner", desc: "Kopi robusta premium dari kebun kopi desa, diproses secara tradisional.", price: "Rp 45.000/pack" },
                  { name: "Kain Tenun Aceh", category: "Kriya", desc: "Kain tenun tangan dengan motif tradisional Aceh, dibuat oleh pengrajin lokal.", price: "Rp 250.000/lembar" },
                  { name: "Homestay Gampong Nusa", category: "Jasa", desc: "Penginapan ramah lingkungan dengan pemandangan alam perbukitan.", price: "Rp 200.000/malam" },
                  { name: "Paket Wisata Desa", category: "Jasa", desc: "Paket wisata lengkap termasuk tur desa, kuliner, dan workshop budaya.", price: "Rp 150.000/orang" },
                  { name: "Kerajinan Batik", category: "Kriya", desc: "Batik handmade dengan motif flora-fauna khas Aceh Besar.", price: "Rp 180.000/lembar" },
                  { name: "Sambal Gampong Nusa", category: "Kuliner", desc: "Sambal tradisional dengan resep turun-temurun, pedas dan gurih.", price: "Rp 25.000/botol" },
                ].map((produk, i) => (
                  <div key={i} className="rounded-xl border p-4 transition-all hover:scale-[1.01]"
                    style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                        style={{ background: "var(--ch-primary)15", color: "var(--ch-primary)" }}>
                        {produk.category}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-bold mb-1" style={{ color: "var(--ch-text)" }}>{produk.name}</h4>
                    <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{produk.desc}</p>
                    <p className="text-[12px] font-extrabold" style={{ color: "var(--ch-primary)" }}>{produk.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Peran Aktif Masyarakat */}
          {activeTab === "peran" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { role: "Pengrajin Lokal", count: 15, desc: "Menghasilkan produk kriya unggulan seperti tenun, batik, dan kerajinan tangan.", icon: "🎨" },
                  { role: "Pelaku UMKM", count: 23, desc: "Usaha mikro kecil menengah di bidang kuliner, fashion, dan jasa wisata.", icon: "🏪" },
                  { role: "Guide Wisata", count: 8, desc: "Pemandu wisata lokal yang mengenal betul potensi desa.", icon: "🗺️" },
                  { role: "Kreator Konten", count: 12, desc: "Warga yang aktif memproduksi konten digital untuk promosi desa.", icon: "📱" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border"
                    style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ background: "var(--ch-primary)10" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{item.role}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{ background: "var(--ch-primary)15", color: "var(--ch-primary)" }}>
                          {item.count} orang
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
