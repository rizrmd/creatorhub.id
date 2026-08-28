import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Image, Video, BookOpen, FileText, ExternalLink } from "lucide-react";
import { creatorsApi } from "@/lib/api";
import { resolveCreatorPhoto } from "@/lib/utils";

const TEAM_PHOTOS: Record<string, [string, string]> = {
  "Ainul Mardhiah Lubis": ["/gampongnusa/pasted-1787728284146-0.png", "50% 12%"],
  "Tengku Putri Isna": ["/gampongnusa/pasted-1787757067589-0.png", "52% 22%"],
  "M. Rais Syahizinda": ["/gampongnusa/pasted-1787757151189-0.png", "50% 22%"],
  "Cut Dhara Maulydistira": ["/gampongnusa/pasted-1787757082493-0.png", "30% 18%"],
  "Maulinda Yani": ["/gampongnusa/pasted-1787757174654-0.png", "48% 20%"],
};

const TEAM = [
  { name: "Ainul Mardhiah Lubis", role: "Digital Coordinator", platforms: ["Instagram", "TikTok"], desc: "Menyusun kalender konten, mengoordinasi tim produksi, dan memastikan publikasi desa berjalan konsisten di seluruh kanal.", slug: "ainul-mardhiah-lubis" },
  { name: "M. Rais Syahizinda", role: "Storytelling & Content", platforms: ["Instagram", "YouTube"], desc: "Menulis naskah dan caption, mengemas cerita budaya serta aktivitas warga menjadi konten yang layak publikasi.", slug: "m-rais-syahizinda" },
  { name: "Tengku Putri Isna", role: "Visual Documentation", platforms: ["Instagram", "TikTok"], desc: "Mendokumentasikan foto dan video kegiatan desa, mengedit, serta mengarsipkan aset ke Pusat Aset Konten.", slug: "tengku-putri-isna" },
  { name: "Cut Dhara Maulydistira", role: "Social Media & Community Officer", platforms: ["TikTok", "Facebook"], desc: "Mengelola akun resmi desa, menjadwalkan unggahan, dan membalas interaksi audiens serta komunitas.", slug: "cut-dhara-maulydistira" },
  { name: "Maulinda Yani", role: "Nano Influencer Coordinator", platforms: ["Instagram", "TikTok"], desc: "Melakukan listing dan pendampingan nano influencer desa serta mengukur performa kolaborasi konten.", slug: "maulinda-yani" },
];

const KOC_PHOTOS: Record<string, [string, string, string]> = {
  "Ainul Mardhiah Lubis": ["/gampongnusa/pasted-1787728284146-0.png", "50% 12%", "cover"],
  "Cut Intan": ["/gampongnusa/pasted-1787858916858-0.png", "50% 22%", "cover"],
  "Ponjria": ["/gampongnusa/pasted-1787859092682-0.png", "38% 36%", "300%"],
  "Rayhanna Bella Syakilla": ["/gampongnusa/pasted-1787859160594-0.png", "50% 18%", "175%"],
  "Avisena": ["/gampongnusa/pasted-1787859192655-0.png", "48% 42%", "380%"],
};

const KOC_NOTES: Record<string, string> = {
  "Ainul Mardhiah Lubis": "Cukup dikenal di Desa Gampong, selain mengkoordinasikan tim digital, Ainul juga menjadi brand ambassador digital.",
  "Rayhanna Bella Syakilla": "Aktif di TikTok sejak 2021. Mengulas warung dan jajanan rumahan Aceh Besar, sesekali memasak resep khas bersama warga.",
  "Cut Intan": "Aktif sejak akhir 2020. Padu-padan busana harian dengan kain dan sulaman Aceh bersama penjahit desa.",
  "Avisena": "Ngonten di X sejak 2019. Menulis utas humor soal kehidupan desa dan obrolan warung kopi yang ramai dibagikan warga.",
  "Ponjria": "Vlogger YouTube sejak 2018. Merekam perjalanan ke destinasi Aceh, termasuk rute dan biaya homestay warga.",
};

const KOC_DATA = [
  { name: "Ainul Mardhiah Lubis", bio: "Brand Ambassador", platforms: [{ name: "TikTok", handle: "@ainulmardhiah", followers: "22.1K", er: "9.2%" }, { name: "Instagram", handle: "@ainulmardhiah", followers: "6.3K", er: "7.1%" }] },
  { name: "Rayhanna Bella Syakilla", bio: "Influencer Kuliner", platforms: [{ name: "TikTok", handle: "@rayhannabella", followers: "5.2K", er: "6.3%" }] },
  { name: "Cut Intan", bio: "Influencer Fashion", platforms: [{ name: "Instagram", handle: "@cutintan", followers: "2.1K", er: "4.8%" }, { name: "TikTok", handle: "@cutintan", followers: "103.6K", er: "5.5%" }] },
  { name: "Avisena", bio: "Influencer Komedi", platforms: [{ name: "X", handle: "@avisena", followers: "2.4K", er: "3.8%" }] },
  { name: "Ponjria", bio: "Influencer Travel", platforms: [{ name: "YouTube", handle: "@ponjria", followers: "12.1K", er: "7.2%" }] },
];

const COMMUNITY_ACCOUNT = {
  name: "Gampong Nusa Lhoknga",
  bio: "Community Hub",
  platforms: [
    { name: "Facebook", type: "FB Group", handle: "@gampongnusaku", followers: "3,200", er: "3.8%" },
    { name: "Instagram", type: "Akun", handle: "@gampongnusaku", followers: "—", er: "—" },
    { name: "TikTok", type: "Akun", handle: "desawisatanusa", followers: "—", er: "—" },
  ],
};

const NANO_ACCOUNTS = [
  { name: "Nura Sahirah", bio: "Travel & Culture", platforms: [{ name: "Instagram", handle: "@nurasahirah", followers: "2,017", er: "0.8%" }] },
  { name: "Warga Gampong Nusa", bio: "Community Account", platforms: [{ name: "X", handle: "@wargagampongnusa", followers: "2,100", er: "2.9%" }] },
  { name: "Komunitas Gampong Nusa", bio: "Community Hub", platforms: [{ name: "Facebook", handle: "KomunitasGN", followers: "3,200", er: "3.8%" }] },
  { name: "sr.king__", bio: "Travel Content", platforms: [{ name: "Instagram", handle: "@sr.king__", followers: "8,432", er: "3.2%" }] },
  { name: "endang.supriyati", bio: "Kuliner & UMKM", platforms: [{ name: "Instagram", handle: "@endang.supriyati", followers: "5,127", er: "4.1%" }] },
  { name: "arrofimoez", bio: "Lifestyle & Creative", platforms: [{ name: "Instagram", handle: "@arrofimoez", followers: "9,814", er: "2.7%" }] },
  { name: "mearvic", bio: "Travel & Culture", platforms: [{ name: "Instagram", handle: "@mearvic", followers: "6,543", er: "3.9%" }] },
];

const MICRO_ACCOUNTS = [
  { name: "Desa Wisata Aceh", bio: "Regional Tourism", platforms: [{ name: "Instagram", handle: "@desawisataaceh", followers: "18,900", er: "2.1%" }] },
  { name: "Kopi Nusantara Aceh", bio: "Kuliner & Kopi", platforms: [{ name: "Instagram", handle: "@kopinusantara.aceh", followers: "24,500", er: "3.4%" }] },
  { name: "Jelajah Aceh Besar", bio: "Travel Guide", platforms: [{ name: "YouTube", handle: "JelajahAcehBesar", followers: "31,200", er: "2.8%" }] },
];

const HOMELESS_ACCOUNTS = [
  { name: "Info Aceh Besar", bio: "Citizen Journalism", platforms: [{ name: "X", handle: "@infoacehbesar", followers: "14,200", er: "1.4%" }] },
  { name: "Kabar Gampong", bio: "Local News Aggregator", platforms: [{ name: "Facebook", handle: "KabarGampong", followers: "9,800", er: "2.0%" }] },
  { name: "Suara Aceh Besar", bio: "Regional News", platforms: [{ name: "Instagram", handle: "@suaraacehbesar", followers: "21,000", er: "1.7%" }] },
];

const TIPOLOGI = [
  { label: "Desa/Kel Kreatif Rintisan", current: true, color: "#f5841f", svgPath: "M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" },
  { label: "Desa/Kel Kreatif Produktif", current: false, color: "#eab308", svgPath: "M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM17 18h1M12 18h1M7 18h1" },
  { label: "Desa/Kel Kreatif Berdaya", current: false, color: "#84cc16", svgPath: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" },
  { label: "Desa/Kel Kreatif Mandiri", current: false, color: "#22c55e", svgPath: "M11.56 3.27a.5.5 0 0 1 .88 0l2.95 5.6a1 1 0 0 0 1.51.29l4.28-3.66a.5.5 0 0 1 .8.52l-2.84 10.25a1 1 0 0 1-.95.73H5.81a1 1 0 0 1-.96-.73L2.02 6.02a.5.5 0 0 1 .8-.52L7.1 9.16a1 1 0 0 0 1.51-.29zM5 21h14" },
];

const THEMES = [
  { title: "Lanskap Alam Estetis", fit: "Cocok untuk Cinematic Video & Prewedding", color: "#22c55e", ideas: [
    { title: "1. Persawahan Berlatar Bukit Barisan", desc: "Spot paling ikonik di sini adalah hamparan sawah hijau atau kuning yang dikelilingi oleh megahnya gugusan Bukit Barisan. Tempat ini sering menjadi pilihan utama untuk foto prewedding outdoor.", formats: ["Foto", "Prewedding"], image: "/gampongnusa/pasted-1787729493836-0.png", pos: "50% 50%", video: "" },
    { title: "2. Golden Hour Bersepeda", desc: "Rekam video POV atau drone shot anak-anak lokal atau wisatawan mengayuh sepeda di atas pematang sawah saat matahari terbit atau terbenam.", formats: ["POV", "Drone"], image: "", pos: "50% 50%", video: "/gampongnusa/Golden hour terbaik ✨Rute gowes sore ini bener-bener definisi healing. Jalan desa, langit jingga.mp4" },
    { title: "3. Jembatan Kayu & Sungai", desc: "Terdapat area santai berupa jembatan kayu di atas sungai kecil jernih yang mengalir membelah desa. Sangat pas untuk konten bernuansa tenang (healing/ambient video).", formats: ["Ambient", "Reels"], image: "/gampongnusa/pasted-1787729963131-0.png", pos: "50% 50%", video: "" },
  ]},
  { title: "Kebudayaan & Atraksi Tradisional", fit: "Cocok untuk Konten Vlog & Budaya", color: "#f5841f", ideas: [
    { title: "4. Tari Tradisional & Rapai", desc: "Dokumentasikan keindahan gerak tari selamat datang atau tabuhan Rapai yang dinamis dalam balutan pakaian adat Aceh yang penuh warna.", formats: ["Vlog", "Video"], image: "/gampongnusa/pasted-1787730670740-0.png", pos: "50% 50%", video: "" },
    { title: "5. Permainan Tradisional", desc: "Buat video seru (fun/reels) yang interaktif dengan merekam momen wisatawan bermain galah panjang, patok lele, atau boie bersama anak-anak gampong.", formats: ["Reels", "Fun"], image: "/gampongnusa/pasted-1787730721435-0.png", pos: "50% 22%", video: "" },
    { title: "6. Momen Adat & Kenduri", desc: "Jika datang di waktu yang tepat, abadikan kemeriahan tradisi lokal seperti Khanduri Maulid, Meugang Day, atau Khanduri Pade yang sarat akan nilai kebersamaan.", formats: ["Foto", "Dokumenter"], image: "/gampongnusa/pasted-1787730847112-0.png", pos: "50% 50%", video: "" },
  ]},
  { title: "Wisata Edukasi & Eco-Tourism", fit: "Cocok untuk Konten Naratif & Inspiratif", color: "#84cc16", ideas: [
    { title: "7. Daur Ulang Sampah Kreatif", desc: "Gampong Nusa terkenal dengan sistem waste management-nya. Ambil video proses aesthetic pembuatan kerajinan tangan dari sampah plastik dan rotan, seperti tas, bunga, atau kotak tisu.", formats: ["Proses", "Reels"], image: "/gampongnusa/pasted-1787730948180-0.png", pos: "50% 50%", video: "" },
    { title: "8. Storytelling Resiliensi Tsunami", desc: "Buat konten dokumenter mini yang menyentuh hati mengenai bagaimana desa ini bangkit dari puing tsunami 2004 hingga memenangkan penghargaan internasional.", formats: ["Dokumenter", "Naratif"], image: "/gampongnusa/pasted-1787730912367-0.png", pos: "50% 50%", video: "" },
  ]},
  { title: "Kuliner Tradisional Aceh", fit: "Cocok untuk Konten Foodies & ASMR", color: "#eab308", ideas: [
    { title: "9. Cooking Class Kuliner Khas", desc: "Buat video tutorial atau ASMR memasak Kuah Pliek U, Ayam Tangkap, Gulai Ikan Sawah, atau Ikan Kayu (Keumamah) bersama ibu-ibu lokal di dapur warga.", formats: ["Tutorial", "ASMR"], image: "/gampongnusa/pasted-1787731086695-0.png", pos: "50% 50%", video: "" },
    { title: "10. Produk Kreatif Keripik Daun Temurui", desc: "Ambil visual detail (close-up) pembuatan keripik unik dari daun temurui (daun kari) yang menjadi camilan unggulan desa.", formats: ["Close-up", "Foto"], image: "/gampongnusa/Kripik Gampong Nusa.jpg", pos: "50% 50%", video: "" },
  ]},
  { title: "Pengalaman Menginap", fit: "Cocok untuk Konten Review & Travel-Inspo", color: "#e0842a", ideas: [
    { title: "11. Homestay Berstandar ASEAN", desc: "Buat konten room tour atau review jujur mengenai pengalaman tinggal langsung di rumah kayu panggung milik warga yang asri dan telah tersertifikasi kelayakannya di tingkat Asia Tenggara.", formats: ["Room Tour", "Review"], image: "/gampongnusa/pasted-1787731209549-0.png", pos: "50% 50%", video: "" },
  ]},
];

const PRODUCT_GROUPS = [
  { title: "Kuliner & Pangan Alternatif Inovatif", color: "#f5841f", items: [
    { name: "12. Tempe Kacang Koro", unit: "Rumah Tempe Nusa", desc: "Produk ini dikembangkan oleh Rumah Tempe Nusa sebagai alternatif tempe berbasis pangan lokal non-kedelai untuk memperluas pilihan pangan sehat.", image: "/gampongnusa/pasted-1787880292973-0.png" },
    { name: "13. Pliek U dan Asam Sunti Modern", unit: "Kelompok Kuliner LPN", desc: "Kuliner tradisional bumbu khas Aceh (patana bumbu) yang diproduksi oleh Kelompok Kuliner LPN. Produk dikemas secara higienis agar tahan lama sebagai oleh-oleh premium bagi wisatawan.", image: "/gampongnusa/pasted-1787880412768-0.png" },
    { name: "14. Kue Timpan Instan / Frozen", unit: "Komunitas Ibu-Ibu Lokal", desc: "Inovasi kue basah tradisional khas Aceh yang diproduksi massal oleh komunitas ibu-ibu lokal agar bisa dibawa keluar daerah.", image: "/gampongnusa/pasted-1787880453481-0.png" },
  ]},
  { title: "Kerajinan Tangan & Kriya Daur Ulang", color: "#22c55e", items: [
    { name: "15. Suvenir Kriya Sampah Plastik", unit: "Unit Usaha Kriya LPN", desc: "Produk tas, dompet rajut, dan kotak tisu berbahan limbah ini diproduksi secara terpusat oleh Unit Usaha Kriya Lembaga Pariwisata Nusa (LPN).", image: "/gampongnusa/pasted-1787880569318-0.png" },
  ]},
  { title: "Paket Wisata Edukasi Kreatif", color: "#eab308", items: [
    { name: "16. Cooking Class & Workshop Ekowisata", unit: "Lembaga Pariwisata Nusa (LPN)", desc: "Dikelola langsung secara swakelola oleh Lembaga Pariwisata Nusa (LPN). Mereka menawarkan paket pengalaman langsung bagi wisatawan untuk belajar membuat keripik daun temurui.", image: "/gampongnusa/pasted-1787880862730-0.png" },
  ]},
  { title: "Kerajinan Kriya & Tradisional", color: "#84cc16", items: [
    { name: "17. Kerajinan Anyaman Rotan", unit: "Unit Kriya LPN", desc: "Berkolaborasi erat dengan perajin dari desa tetangga (Gampong Keude Bieng), Unit Kriya LPN memasarkan wadah, keranjang, dan hiasan dinding rotan autentik.", image: "/gampongnusa/pasted-1787880970245-0.png" },
    { name: "18. Anyaman Keranjang & Kreasi Daun Kelapa (Bleut)", unit: "Komunitas Ibu-Ibu Lansia Gampong Nusa", desc: "Edukasi pembuatan bleut (anyaman daun kelapa tradisional) yang diproduksi langsung oleh Komunitas Ibu-Ibu Lansia Gampong Nusa.", image: "" },
  ]},
  { title: "Kuliner & Produk Pangan Tradisional Lanjutan", color: "#f5841f", items: [
    { name: "19. Kuliner Toet Tumpoe", unit: "UMKM Kue Tradisional LPN", desc: "Warisan hidangan zaman kesultanan berbahan tepung beras, gula, dan pisang ambon goreng yang dihidangkan bersama ketan.", image: "/gampongnusa/pasted-1787881253700-0.png" },
    { name: "20. Paket Lauk Premium Khas Lhoknga", unit: "Kelompok Dapur Kuliner Nusa", desc: "Dikemas praktis oleh Kelompok Dapur Kuliner Nusa, produk siap saji seperti Keumamah (ikan kayu), Udeung Tumeh (tumis udang Aceh).", image: "" },
  ]},
];

const PROGRAMS = [
  { name: "Pelatihan Fotografi & Videografi Ponsel", participants: 32, period: "Jun 2026", status: "Selesai", statusBg: "#0e1f16", statusColor: "#22c55e" },
  { name: "Workshop Storytelling Budaya Desa", participants: 28, period: "Jul 2026", status: "Selesai", statusBg: "#0e1f16", statusColor: "#22c55e" },
  { name: "Pendampingan Digital Marketing UMKM", participants: 40, period: "Ags 2026", status: "Berjalan", statusBg: "#3a2414", statusColor: "#f5841f" },
  { name: "Pelatihan Pengelolaan Homestay", participants: 15, period: "Ags 2026", status: "Berjalan", statusBg: "#3a2414", statusColor: "#f5841f" },
  { name: "Gotong Royong Dokumentasi Wisata Mangrove", participants: 60, period: "Sep 2026", status: "Terjadwal", statusBg: "#2a2410", statusColor: "#eab308" },
  { name: "Bootcamp Content Creator Muda Desa", participants: 22, period: "Okt 2026", status: "Terjadwal", statusBg: "#2a2410", statusColor: "#eab308" },
];

const BRAND: Record<string, string> = { TikTok: "#010101", Instagram: "#e1306c", YouTube: "#ff0000", X: "#010101", Facebook: "#1877f2" };
const GLYPH: Record<string, string> = {
  TikTok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z",
  Instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z",
  YouTube: "M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.9 4.1 12 4.1 12 4.1s-4.9 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 8.8 2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.8.2 6.8.2 6.8.2s4.9 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2zM10 14.6V8.9l5.2 2.9-5.2 2.8z",
  X: "M17.7 3h3.2l-7 8 7.4 10h-5.6l-4.4-6-5 6H3.1l7.3-8.6L3.2 3h5.7l4.1 5.6L17.7 3z",
  Facebook: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.7-1.6h1.5V4.2c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.2H7v3.2h2.7V22h3.8z",
};

function PlatformIcon({ name, size = 11 }: { name: string; size?: number }) {
  const bg = BRAND[name] || "#666";
  const path = GLYPH[name] || "";
  return (
    <span className="inline-flex items-center justify-center rounded" style={{ width: 18, height: 18, background: bg, flex: "none" }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" fillRule="evenodd"><path d={path} /></svg>
    </span>
  );
}

function SectionHeader({ label, gradient }: { label: string; gradient?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-4 h-4 rounded" style={{ background: gradient || "linear-gradient(135deg, #f5841f, #84cc16)" }} />
      <h3 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{label}</h3>
    </div>
  );
}

export default function DesaKreatifDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"ekosistem" | "social" | "aset">("ekosistem");
  const [storyTab, setStoryTab] = useState<"jelajah" | "produk" | "peran">("jelajah");
  const [flowTab, setFlowTab] = useState<"story" | "hub" | "monitoring" | "boost" | "reports">("story");
  const [akunTab, setAkunTab] = useState<"nano" | "micro" | "homeless">("nano");
  const [teamPhotos, setTeamPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    TEAM.forEach((m) => {
      creatorsApi.getById(m.slug).then((c) => {
        const photo = resolveCreatorPhoto(c.img, c.imageUrl);
        setTeamPhotos((prev) => ({ ...prev, [m.slug]: photo }));
      }).catch(() => {});
    });
  }, []);

  void id;

  return (
    <div className="p-4 md:p-6 space-y-4" style={{ background: "var(--ch-bg)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
        <Link to="/dashboard/ekrafhub" className="hover:underline" style={{ color: "var(--ch-primary)" }}>EkrafHub</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/dashboard/ekrafhub/desa-kreatif" className="hover:underline" style={{ color: "var(--ch-primary)" }}>Desa Kreatif</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/dashboard/ekrafhub/desa-kreatif/discover" className="hover:underline" style={{ color: "var(--ch-primary)" }}>Discover</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-extrabold" style={{ color: "var(--ch-primary)" }}>Gampong Nusa</span>
      </nav>

      {/* Top Tabs */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex border-b" style={{ borderColor: "var(--ch-border)" }}>
          {([
            { key: "ekosistem" as const, label: "Ekosistem Konten" },
            { key: "social" as const, label: "Digital Campaigns" },
            { key: "aset" as const, label: "Pusat Aset Konten" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-6 py-3.5 text-[15px] font-extrabold transition-all relative"
              style={{
                background: activeTab === tab.key ? "rgba(249,115,22,0.08)" : "transparent",
                color: activeTab === tab.key ? "#fff" : "var(--ch-text-muted)",
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t" style={{ background: "#f5841f" }} />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-6">
          {/* ======================== TAB 1: EKOSISTEM KONTEN ======================== */}
          {activeTab === "ekosistem" && (
            <div className="space-y-5">
              {/* Tentang Desa */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <SectionHeader label="Tentang Desa Kreatif Digital Gampong Nusa" />
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-[400px] shrink-0 aspect-[750/473] rounded-lg overflow-hidden">
                    <img src="/gampongnusa/pasted-1787753721123-0.png" alt="Wisata Desa Gampong Nusa" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-[13px] leading-[1.7] font-semibold mb-3" style={{ color: "var(--ch-text)" }}>
                      Gampong Nusa memiliki potensi kuat sebagai desa ekonomi kreatif digital karena menggabungkan wisata berbasis komunitas, homestay, kuliner lokal, kriya, budaya, dan kekayaan intelektual dalam satu ekosistem desa.
                    </p>
                    <p className="text-[12px] leading-[1.75]" style={{ color: "var(--ch-text-muted)" }}>
                      Karakter lokal yang kuat membuat Gampong Nusa mudah dikembangkan menjadi konten digital, mulai dari storytelling budaya, video perjalanan, katalog produk, hingga promosi paket wisata. Kehadiran homestay dan aktivitas warga juga membuka peluang experience tourism yang autentik. Melalui dukungan kreator lokal, citizen journalist, media sosial, dan marketplace digital, potensi Gampong Nusa dapat diperluas menjadi produk kreatif, kampanye destinasi, serta model desa kreatif yang berkelanjutan.
                    </p>
                    <div className="flex items-center gap-2.5 mt-auto pt-4 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold" style={{ background: "rgba(245,132,31,0.12)", border: "1px solid #f5841f", color: "#f5841f" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5841f]" /> Profil Desa
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>Subsektor Unggulan</span>
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold" style={{ background: "rgba(132,204,22,0.14)", border: "1px solid rgba(132,204,22,0.5)", color: "#84cc16" }}>Kuliner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipologi */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <SectionHeader label="Tipologi Desa/Kelurahan" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIPOLOGI.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 relative overflow-hidden"
                      style={{
                        background: t.current ? `linear-gradient(160deg, ${t.color}18, var(--ch-surface))` : "var(--ch-surface)",
                        border: t.current ? `2px solid ${t.color}` : "1px solid var(--ch-border)",
                        boxShadow: t.current ? `0 0 0 4px ${t.color}15` : "none",
                      }}
                    >
                      {t.current && <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: t.color }} />}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.color}20` }}>
                          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={t.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d={t.svgPath} />
                          </svg>
                        </div>
                        <span className="text-[18px] font-extrabold" style={{ color: t.color, opacity: 0.3 }}>0{i + 1}</span>
                      </div>
                      <div className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "var(--ch-text-muted)" }}>Tahap 0{i + 1}</div>
                      <div className="text-[12px] font-bold leading-tight mb-2" style={{ color: t.current ? t.color : "var(--ch-text)" }}>{t.label}</div>
                      {t.current && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold" style={{ background: "#f5841f", color: "#0a0e17" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a0e17]" /> Posisi Saat Ini
                        </span>
                      )}
                      {!t.current && i === 1 && (
                        <span className="inline-block border border-dashed rounded-full px-2.5 py-1 text-[9px] font-bold" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>Target Berikutnya</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="rounded-xl p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="md:w-96 shrink-0">
                    <h3 className="text-[14px] font-bold mb-1.5" style={{ color: "var(--ch-text)" }}>Score Desa Kreatif Digital</h3>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>Skor mencerminkan kualitas, pemanfaatan, dan dampak konten digital desa. Semakin tinggi skor, semakin siap desa memasarkan potensinya secara digital.</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-[36px] font-extrabold leading-none tracking-tight" style={{ color: "#84cc16" }}>72</span>
                      <span className="text-[13px] font-bold" style={{ color: "var(--ch-text-muted)" }}>/100</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(132,204,22,0.14)", border: "1px solid rgba(132,204,22,0.55)", color: "#84cc16" }}>Kategori: Baik</span>
                    </div>
                  </div>
                </div>
                {/* Heat map bar */}
                <div className="mt-5">
                  <div className="flex gap-[3px] items-end">
                    {Array.from({ length: 18 }, (_, i) => {
                      const lo = 10 + i * 5;
                      const active = 72 >= lo && 72 < lo + 5;
                      const t = i / 17;
                      const colorStops: [number, [number, number, number]][] = [[0, [224, 52, 42]], [0.3, [245, 132, 31]], [0.52, [234, 179, 8]], [0.74, [132, 204, 22]], [1, [34, 197, 94]]];
                      let c = colorStops[0][1];
                      for (let s = 1; s < colorStops.length; s++) {
                        if (t <= colorStops[s][0]) {
                          const [p0, a] = colorStops[s - 1];
                          const [, b] = colorStops[s];
                          const k = (t - p0) / (colorStops[s][0] - p0);
                          c = a.map((v, j) => Math.round(v + (b[j] - v) * k)) as [number, number, number];
                          break;
                        }
                      }
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: 12 + Math.round(t * 10),
                            background: `rgb(${c.join(",")})`,
                            opacity: active ? 1 : 0.5,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="relative mt-2">
                    <div className="flex justify-between">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                        <span key={v} className="text-[10px] font-semibold" style={{ color: v === 70 ? "var(--ch-text)" : "var(--ch-text-muted)" }}>{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t flex-wrap" style={{ borderColor: "var(--ch-border)" }}>
                    {([
                      { label: "Perlu Ditingkatkan", range: "10–32", color: "#e0342a" },
                      { label: "Cukup", range: "33–55", color: "#f5841f" },
                      { label: "Baik", range: "56–78", color: "#84cc16" },
                      { label: "Sangat Baik", range: "79–100", color: "#22c55e" },
                    ]).map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-2 text-[10px] font-semibold" style={{ color: i === 2 ? b.color : "var(--ch-text-muted)" }}>
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: b.color, opacity: i === 2 ? 1 : 0.42 }} />
                        {b.label} <span style={{ color: "var(--ch-text-muted)", opacity: 0.5 }}>{b.range}</span>
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] font-semibold" style={{ color: "#84cc16" }}>Konten rutin, terkurasi, dan mulai berdampak.</span>
                  </div>
                </div>
              </div>

              {/* Tim Digital Desa + KOC side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {/* Tim Digital Desa */}
                <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <SectionHeader label="Tim Digital Desa" />
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>Tim digital memproduksi, mengelola, dan mendistribusikan aset konten desa untuk memperkuat promosi potensi desa secara berkelanjutan. Selain itu, tim juga melakukan listing, kurasi, dan pemetaan KOC, akun komunitas, serta homeless media yang aktif mempublikasikan konten terkait potensi, aktivitas, dan perkembangan desa.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TEAM.map((m) => {
                      const photo = TEAM_PHOTOS[m.name];
                      const apiPhoto = teamPhotos[m.slug];
                      return (
                        <a key={m.name} href={`/dashboard/ekrafhub/creators/${m.slug}`} target="_blank" rel="noopener noreferrer"
                          className="rounded-lg p-3 transition-all hover:opacity-80" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                          <div className="flex gap-2.5 items-start">
                            <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden" style={{ background: "#1a2233" }}>
                              {photo && <img src={apiPhoto || photo[0]} alt={m.name} className="w-full h-full object-cover" style={{ objectPosition: photo[1] }} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{m.name}</div>
                              <div className="text-[10px] font-semibold truncate" style={{ color: "var(--ch-text-muted)" }}>{m.role}</div>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed mt-2" style={{ color: "var(--ch-text-muted)" }}>{m.desc}</p>
                          <div className="flex justify-end mt-2">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: "rgba(245,132,31,0.14)", border: "1px solid rgba(245,132,31,0.5)", color: "#f5841f" }}>Chat</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* KOC */}
                <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <SectionHeader label="Key Opinion Community" />
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>Figur publik atau kreator di desa Gampong Nusa yang memiliki pengaruh digital berdasarkan kekuatan akun, jangkauan audiens, tingkat interaksi, dan konsistensi aktivitas di berbagai platform media sosial.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {KOC_DATA.map((k) => {
                      const photo = KOC_PHOTOS[k.name];
                      return (
                        <div key={k.name} className="rounded-lg p-3" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                          <div className="flex gap-2.5 items-start">
                            <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden" style={{ background: "#1a2233" }}>
                              {photo && <img src={photo[0]} alt={k.name} className="w-full h-full object-cover" style={{ objectPosition: photo[1], backgroundSize: photo[2] || "cover" }} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{k.name}</div>
                              <div className="text-[10px] font-semibold truncate" style={{ color: "var(--ch-text-muted)" }}>{k.bio}</div>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed mt-2 line-clamp-3" style={{ color: "var(--ch-text-muted)" }}>{KOC_NOTES[k.name]}</p>
                          <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: "var(--ch-border)" }}>
                            <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>
                              <span className="w-[18px]" /> <span className="flex-1">HANDLER</span> <span className="w-14 text-right">FOLLOWERS</span> <span className="w-16 text-right">ENG. RATE</span>
                            </div>
                            {k.platforms.map((p) => (
                              <div key={p.name} className="flex items-center gap-1.5 text-[10px]">
                                <PlatformIcon name={p.name} />
                                <span className="flex-1 truncate" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</span>
                                <span className="w-14 text-right font-bold" style={{ color: "var(--ch-text)" }}>{p.followers}</span>
                                <span className="w-16 text-right font-bold" style={{ color: "#22c55e" }}>{p.er}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Akun Komunitas */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <SectionHeader label="Akun Komunitas" />
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>Akun milik komunitas dan warga yang rutin memublikasikan aktivitas desa, dipetakan sebagai kanal pendukung distribusi konten.</p>
                <div className="rounded-lg p-3 flex flex-col md:flex-row gap-4 items-start" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                  <div className="flex gap-2.5 items-center md:w-[230px] shrink-0">
                    <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "#22c55e" }} />
                    <div>
                      <div className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{COMMUNITY_ACCOUNT.name}</div>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{COMMUNITY_ACCOUNT.bio}</div>
                    </div>
                  </div>
                  <p className="flex-1 text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>Dikelola bergantian oleh pemuda desa sejak 2022. Membagikan agenda gotong royong, kegiatan wisata, dan pengumuman warga.</p>
                  <div className="w-full md:w-[420px] shrink-0 space-y-1 md:pl-5 md:border-l" style={{ borderColor: "var(--ch-border)" }}>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>
                      <span className="w-[18px]" /> <span className="flex-1">HANDLER</span> <span className="w-20">TYPE</span> <span className="w-16 text-right">FOLLOWERS</span> <span className="w-24 text-right">ENGAGEMENT RATE</span>
                    </div>
                    {COMMUNITY_ACCOUNT.platforms.map((p) => (
                      <div key={p.name} className="flex items-center gap-1.5 text-[10px]">
                        <PlatformIcon name={p.name} />
                        <span className="flex-1 truncate" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</span>
                        <span className="w-20" style={{ color: "var(--ch-text-muted)" }}>{p.type}</span>
                        <span className="w-16 text-right font-bold" style={{ color: "var(--ch-text)" }}>{p.followers}</span>
                        <span className="w-24 text-right font-bold" style={{ color: "#22c55e" }}>{p.er}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audience tabs */}
                <div className="flex gap-1.5 mt-4 mb-3">
                  {([
                    { key: "nano" as const, label: "Nano Accounts" },
                    { key: "micro" as const, label: "Micro Accounts" },
                    { key: "homeless" as const, label: "Homeless Media" },
                  ]).map((tab) => (
                    <button key={tab.key} onClick={() => setAkunTab(tab.key)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: akunTab === tab.key ? "#f5841f" : "var(--ch-bg)",
                        color: akunTab === tab.key ? "#0a0e17" : "var(--ch-text-muted)",
                        border: "1px solid var(--ch-border)",
                      }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--ch-border)" }}>
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ background: "var(--ch-bg)" }}>
                        <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>Creator</th>
                        <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>Bio</th>
                        <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                        <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                        <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase text-right" style={{ color: "var(--ch-text-muted)" }}>E/R</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(akunTab === "nano" ? NANO_ACCOUNTS : akunTab === "micro" ? MICRO_ACCOUNTS : HOMELESS_ACCOUNTS).map((a) =>
                        a.platforms.map((p, pi) => (
                          <tr key={`${a.name}-${p.name}`} style={{ borderTop: "1px solid var(--ch-border)" }}>
                            <td className="px-3 py-2">{pi === 0 && <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{a.name}</span>}</td>
                            <td className="px-3 py-2">{pi === 0 && <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{a.bio}</span>}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5">
                                <PlatformIcon name={p.name} />
                                <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right"><span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{p.followers}</span></td>
                            <td className="px-3 py-2 text-right"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{p.er}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================== TAB 2: DIGITAL CAMPAIGNS ======================== */}
          {activeTab === "social" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="rounded-xl p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <SectionHeader label="Desa Kreatif Digital" />
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>
                      Gampong Nusa di Aceh Besar adalah ladang konten visual yang sangat kaya. Baik untuk kebutuhan Feeds/Grid estetis, video pendek (Reels/TikTok), maupun dokumenter, desa wisata ini menawarkan perpaduan lanskap alam yang magis dan kehangatan budaya. Berikut adalah rangkuman ide konten video dan foto yang bisa Anda garap di Gampong Nusa, yang dikelompokkan berdasarkan tema.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold tracking-wider" style={{ color: "var(--ch-text-muted)" }}>KONTRIBUTOR</span>
                      <div className="flex items-center">
                        {TEAM.slice(0, 5).map((m) => {
                          const photo = TEAM_PHOTOS[m.name];
                          return (
                            <div key={m.name} title={m.name} className="w-8 h-8 rounded-full overflow-hidden border-2 -ml-2 first:ml-0" style={{ borderColor: "var(--ch-surface)" }}>
                              {photo && <img src={teamPhotos[m.slug] || photo[0]} alt={m.name} className="w-full h-full object-cover" style={{ objectPosition: photo[1] }} />}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{TEAM.slice(0, 5).map((m) => m.name).join(" · ")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 shrink-0 w-full md:w-auto">
                    {[
                      { value: "5", label: "Tema kampanye", color: "#4d8dfa" },
                      { value: "11", label: "Ide konten", color: "#f5841f" },
                      { value: "4", label: "Kanal distribusi", color: "#22c55e" },
                      { value: "3", label: "Spot ikonik", color: "#a855f7" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-lg p-2.5" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                        <p className="text-[16px] font-extrabold leading-tight" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Flow tabs */}
              <div className="flex gap-1 flex-wrap">
                {([
                  { key: "story" as const, label: "Story Ideas" },
                  { key: "hub" as const, label: "Content Hub" },
                  { key: "monitoring" as const, label: "Campaign Monitoring" },
                  { key: "boost" as const, label: "Boost Ads" },
                  { key: "reports" as const, label: "Executive Reports" },
                ]).map((ft) => (
                  <button key={ft.key} onClick={() => setFlowTab(ft.key)}
                    className="px-4 py-2 rounded-lg text-[12px] font-extrabold transition-all"
                    style={{
                      background: flowTab === ft.key ? "#f5841f" : "var(--ch-surface)",
                      color: flowTab === ft.key ? "#fff" : "var(--ch-text-muted)",
                      border: flowTab === ft.key ? "none" : "1px solid var(--ch-border)",
                    }}>
                    {ft.label}
                  </button>
                ))}
              </div>

              {/* Story Ideas */}
              {flowTab === "story" && (
                <div className="space-y-4">
                  {/* Story sub-tabs */}
                  <div className="flex gap-4 border-b pb-0" style={{ borderColor: "var(--ch-border)" }}>
                    {([
                      { key: "jelajah" as const, label: "Jelajah Desa" },
                      { key: "produk" as const, label: "Produk & Ekonomi Kreatif" },
                      { key: "peran" as const, label: "Peran Aktif Masyarakat" },
                    ]).map((st) => (
                      <button key={st.key} onClick={() => setStoryTab(st.key)}
                        className="pb-2 text-[12px] font-extrabold transition-all border-b-2"
                        style={{
                          borderColor: storyTab === st.key ? "#f5841f" : "transparent",
                          color: storyTab === st.key ? "#f5841f" : "var(--ch-text-muted)",
                        }}>
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Jelajah Desa */}
                  {storyTab === "jelajah" && (
                    <div className="space-y-3">
                      {THEMES.map((theme, ti) => (
                        <div key={ti} className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", borderTop: ti > 0 ? "1px solid var(--ch-border)" : "none" }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-extrabold shrink-0" style={{ background: `${theme.color}1f`, border: `1px solid ${theme.color}80`, color: theme.color }}>0{ti + 1}</div>
                            <div>
                              <div className="text-[8px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>Tema</div>
                              <div className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{theme.title}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {theme.ideas.map((idea, ii) => (
                              <div key={ii} className="rounded-lg overflow-hidden" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                                <div className="aspect-video relative overflow-hidden" style={{ background: "#0d1320" }}>
                                  {idea.video ? (
                                    <video src={idea.video} playsInline muted preload="metadata" className="w-full h-full object-cover" />
                                  ) : idea.image ? (
                                    <img src={idea.image} alt={idea.title} className="w-full h-full object-cover" style={{ objectPosition: idea.pos }} />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-center px-2" style={{ color: "var(--ch-text-muted)" }}>{idea.title}</div>
                                  )}
                                </div>
                                <div className="p-3 space-y-2">
                                  <div className="flex gap-1 flex-wrap">
                                    {idea.formats.map((f) => (
                                      <span key={f} className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--ch-text-muted)" }}>{f}</span>
                                    ))}
                                  </div>
                                  <div className="text-[12px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>{idea.title}</div>
                                  <div className="text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{idea.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Peran Aktif Masyarakat */}
                  {storyTab === "peran" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: "312", label: "Warga Terlibat Aktif", color: "#f5841f" },
                          { value: "18", label: "Pelatihan Digital Diikuti", color: "#eab308" },
                          { value: "47", label: "UMKM Aktif Berpromosi", color: "#84cc16" },
                          { value: "620", label: "Konten Dihasilkan Warga", color: "#22c55e" },
                        ].map((s, i) => (
                          <div key={i} className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                            <div className="w-9 h-9 rounded-lg mb-3" style={{ background: `${s.color}20` }} />
                            <div className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{s.value}</div>
                            <div className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                        <SectionHeader label="Program & Pelibatan Warga" />
                        <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>Aktivitas pelatihan, pendampingan, dan partisipasi warga dalam pengembangan ekosistem konten desa kreatif digital.</p>
                        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--ch-border)" }}>
                          <table className="w-full text-left">
                            <thead>
                              <tr style={{ background: "var(--ch-bg)" }}>
                                <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>PROGRAM</th>
                                <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>PESERTA</th>
                                <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>PERIODE</th>
                                <th className="px-3 py-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--ch-text-muted)" }}>STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {PROGRAMS.map((pr, i) => (
                                <tr key={i} style={{ borderTop: "1px solid var(--ch-border)" }}>
                                  <td className="px-3 py-2.5 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{pr.name}</td>
                                  <td className="px-3 py-2.5 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{pr.participants} warga</td>
                                  <td className="px-3 py-2.5 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{pr.period}</td>
                                  <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-2.5 py-1 rounded-md" style={{ background: pr.statusBg, color: pr.statusColor }}>{pr.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Produk & Ekonomi Kreatif */}
                  {storyTab === "produk" && (
                    <div className="space-y-3">
                      <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                        <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--ch-text-muted)" }}>
                          Gampong Nusa, Aceh Besar, mengelola produk kreatif unggulannya secara kolektif berbasis komunitas di bawah naungan Lembaga Pariwisata Nusa (LPN). Sebagian besar usaha ekonomi kreatif di desa ini dijalankan oleh kelompok ibu-ibu dan pemuda setempat melalui unit-unit usaha kreatif terintegrasi.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold" style={{ background: "rgba(245,132,31,0.12)", border: "1px solid #f5841f", color: "#f5841f" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f5841f]" /> Lembaga Pariwisata Nusa (LPN)
                          </span>
                          {["Nusa Festival", "Anugerah Desa Wisata Indonesia (ADWI)", "Jadesta Kemenparekraf"].map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-md text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "var(--ch-text-muted)" }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      {PRODUCT_GROUPS.map((g, gi) => (
                        <div key={gi} className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: g.color }} />
                            <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{g.title}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {g.items.map((p, pi) => (
                              <div key={pi} className="rounded-lg overflow-hidden" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                                <div className="aspect-video relative overflow-hidden" style={{ background: "#0d1320" }}>
                                  {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-center px-2" style={{ color: "var(--ch-text-muted)" }}>{p.name}</div>
                                  )}
                                </div>
                                <div className="p-3 space-y-1.5">
                                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded" style={{ color: g.color, background: "rgba(255,255,255,0.06)" }}>{p.unit}</span>
                                  <div className="text-[12px] font-bold leading-tight" style={{ color: "var(--ch-text)" }}>{p.name}</div>
                                  <div className="text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{p.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* Content Hub */}
              {flowTab === "hub" && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
                    <h3 className="text-[15px] font-extrabold">Content Production Pipeline</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>Cari konten atau kreator...</span>
                      <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{ background: "#f5841f", color: "#fff" }}>+ Create Topic</span>
                    </div>
                  </div>
                  <div className="text-center p-8">
                    <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Content Production Pipeline menampilkan daftar topik konten yang sedang diproduksi.</p>
                  </div>
                </div>
              )}

              {/* Campaign Monitoring */}
              {flowTab === "monitoring" && (
                <div className="rounded-xl p-10 text-center" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <div className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Campaign Monitoring belum diisi</div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Bagian ini menyusul setelah materinya siap.</div>
                </div>
              )}

              {/* Boost Ads */}
              {flowTab === "boost" && (
                <div className="rounded-xl p-10 text-center" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <div className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Boost Ads belum diisi</div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Bagian ini menyusul setelah materinya siap.</div>
                </div>
              )}

              {/* Executive Reports */}
              {flowTab === "reports" && (
                <div className="rounded-xl p-10 text-center" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <div className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Executive Reports belum diisi</div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Bagian ini menyusul setelah materinya siap.</div>
                </div>
              )}
            </div>
          )}

          {/* ======================== TAB 3: PUSAT ASET KONTEN ======================== */}
          {activeTab === "aset" && (
            <div className="rounded-xl p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
              <SectionHeader label="Pusat Aset Konten" />
              <p className="text-[11px] leading-relaxed mb-4" style={{ color: "var(--ch-text-muted)" }}>
                Pusat penyimpanan aset digital desa yang mencakup dokumentasi foto, video, siaran pers, katalog produk, informasi destinasi, dan materi promosi yang dikumpulkan, dikurasi, serta siap digunakan untuk kebutuhan publikasi dan kampanye digital.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Photos", icon: Image, image: "/gampongnusa/pasted-1787726694502-0.png" },
                  { label: "Videos", icon: Video, image: "/gampongnusa/pasted-1787726710046-0.png" },
                  { label: "Katalog Digital", icon: BookOpen, image: "/gampongnusa/pasted-1787726728046-0.png" },
                  { label: "Press Release", icon: FileText, image: "/gampongnusa/pasted-1787726743582-0.png" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="aspect-[16/10] rounded-lg overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                      <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[11px] font-semibold mt-2" style={{ color: "var(--ch-text)" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold" style={{ background: "#f5841f", color: "#fff" }}>
                Buka Pusat Aset Konten <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
