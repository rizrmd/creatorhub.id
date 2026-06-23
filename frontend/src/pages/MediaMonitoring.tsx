import { useState } from "react";
import {
  Settings, MessageSquare, BarChart3, Flame, FileText,
  Search, X, ChevronDown, ExternalLink,
  Heart, MessageCircle, Eye, Share2, Play,
  CheckCircle, Info, Edit3,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const dataSources = [
  { id: "twitter", name: "X (Twitter)", icon: "X", checked: true, color: "#000" },
  { id: "instagram", name: "Instagram", icon: "IG", checked: true, color: "#E1306C" },
  { id: "facebook", name: "Facebook", icon: "FB", checked: true, color: "#1877F2" },
  { id: "tiktok", name: "TikTok", icon: "TT", checked: true, color: "#000" },
  { id: "youtube", name: "YouTube", icon: "YT", checked: true, color: "#FF0000" },
  { id: "news", name: "News Websites", icon: "NW", checked: true, color: "#0EA5E9" },
  { id: "forums", name: "Forums & Blogs", icon: "FB", checked: true, color: "#8B5CF6" },
];

const includeKeywords = ["demo", "kebakaran", "kerusuhan", "demonstrasi", "protes", "tabrakan", "kecelakaan", "rusuh"];
const excludeKeywords = ["Jakarta band", "Jakarta song", "Jakarta movie"];

const mentions = [
  {
    id: 1, platform: "X", platformIcon: "X", platformColor: "#000", username: "@infojakarta", verified: true, time: "15m ago",
    content: "Macet parah di Jl. TB Simatupang arah Cilandak sejak pagi. Banyak warga ngeluh waktu tempuh makin panjang. #Jakarta #macet",
    matchedKeywords: ["Jakarta", "macet", "TB Simatupang", "Cilandak"],
    thumbnail: "https://picsum.photos/seed/traffic1/200/150", hasVideo: false,
    comments: 620, reposts: "1.8K", likes: "8.4K", views: "245K",
    aiSentiment: "Negative", aiTopic: "Macet", aiLocation: "Kec. Cilandak, Kel. Lebak Bulus",
  },
  {
    id: 2, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@jaksel.info", verified: true, time: "32m ago",
    content: "Hujan deras sejak dini hari bikin beberapa wilayah Jakarta tergenang lagi. Semoga cepat surut.",
    matchedKeywords: ["Jakarta", "banjir", "hujan"],
    thumbnail: "https://picsum.photos/seed/flood1/200/150", hasVideo: false,
    likes: "3.4K", comments: 412, shares: 732, views: "82K",
    aiSentiment: "Negative", aiTopic: "Banjir", aiLocation: "Kec. Pesanggrahan, Kel. Bintaro",
  },
  {
    id: 3, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@warga.jaksel", verified: false, time: "1h ago",
    content: "Setiap hari macet, solusi transportasi kapan ya? Jakarta harus berubah! #jakarta #macet #transportasi",
    matchedKeywords: ["Jakarta", "macet", "transportasi"],
    thumbnail: "https://picsum.photos/seed/transport1/200/150", hasVideo: true, videoDuration: "06:30",
    likes: "5.8K", comments: 860, shares: "1.2K", views: "128K",
    aiSentiment: "Negative", aiTopic: "Transportasi", aiLocation: "Kec. Tebet, Kel. Tebet Barat",
  },
  {
    id: 4, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "MetroJakarta TV", verified: true, time: "2h ago",
    content: "Kemacetan Jakarta Selatan Meningkat saat Jam Pulang Kerja",
    matchedKeywords: ["Jakarta", "kemacetan", "jam pulang kerja"],
    thumbnail: "https://picsum.photos/seed/commute1/200/150", hasVideo: true, videoDuration: "04:32",
    likes: "1.2K", comments: 238, views: "56K",
    aiSentiment: "Neutral", aiTopic: "Kemacetan", aiLocation: "Kec. Kebayoran Baru, Kel. Senayan",
  },
  {
    id: 5, platform: "X", platformIcon: "X", platformColor: "#000", username: "@dkijakarta", verified: true, time: "3h ago",
    content: "Update: Banjir di area Rawajati sudah surut 80%. Petugas masih di lokasi untuk membersihkan lumpur. Terima kasih warga yang sudah bantu.",
    matchedKeywords: ["Jakarta", "banjir", "Rawajati"],
    thumbnail: "https://picsum.photos/seed/flood2/200/150", hasVideo: false,
    comments: 189, reposts: "2.1K", likes: "5.6K", views: "312K",
    aiSentiment: "Positive", aiTopic: "Banjir", aiLocation: "Kec. Pancoran, Kel. Rawajati",
  },
  {
    id: 6, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@jakselupdate", verified: false, time: "4h ago",
    content: "Kebakaran ringan di pasar minggu pagi ini. Alhamdulillah tidak ada korban jiwa. Api sudah berhasil dipadamkan oleh Damkar.",
    matchedKeywords: ["kebakaran", "pasar"],
    thumbnail: "https://picsum.photos/seed/fire1/200/150", hasVideo: false,
    likes: "1.2K", comments: 87, shares: 234, views: "45K",
    aiSentiment: "Neutral", aiTopic: "Kebakaran", aiLocation: "Kec. Pasar Minggu, Kel. Pejaten Timur",
  },
  {
    id: 7, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@jakartakini", verified: true, time: "5h ago",
    content: "Demo besar-besaran di depan gedung DPR RI today! Mahasiswa tuntut penurunan harga BBM. Traffic parah di Senayan.",
    matchedKeywords: ["demo", "demonstrasi", "protes"],
    thumbnail: "https://picsum.photos/seed/demo1/200/150", hasVideo: true, videoDuration: "03:45",
    likes: "12.3K", comments: "2.1K", shares: "4.5K", views: "1.2M",
    aiSentiment: "Negative", aiTopic: "Demo", aiLocation: "Kec. Tanah Abang, Kel. Gelora",
  },
  {
    id: 8, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "Warta Kota", verified: true, time: "6h ago",
    content: "Kecelakaan beruntun di tol Dalam Kota arah Semanggi pagi ini. 5 kendaraan terlibat. Pengemudi diminta hati-hati.",
    matchedKeywords: ["kecelakaan", "tabrakan"],
    thumbnail: "https://picsum.photos/seed/accident1/200/150", hasVideo: true, videoDuration: "02:30",
    likes: "3.4K", comments: 567, views: "234K",
    aiSentiment: "Negative", aiTopic: "Kecelakaan", aiLocation: "Kec. Setiabudhi, Kel. Karet",
  },
  {
    id: 9, platform: "X", platformIcon: "X", platformColor: "#000", username: "@sudirmanku", verified: false, time: "7h ago",
    content: "Protes warga Menteng Atas soal pembangunan mall baru yang mengganggu saluran air. Sudah 2 bulan banjir tiap hujan.",
    matchedKeywords: ["protes", "banjir"],
    thumbnail: "https://picsum.photos/seed/protest1/200/150", hasVideo: false,
    comments: 234, reposts: 890, likes: "2.1K", views: "78K",
    aiSentiment: "Negative", aiTopic: "Protes Warga", aiLocation: "Kec. Menteng Dalam, Kel. Menteng Atas",
  },
  {
    id: 10, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@lambe_turah", verified: true, time: "8h ago",
    content: "Viral! Kerusuhan di daerah Kemanggisan malam tadi. Polisi sudah turun ke lokasi. Warga diminta tenang.",
    matchedKeywords: ["kerusuhan", "rusuh"],
    thumbnail: "https://picsum.photos/seed/riot1/200/150", hasVideo: true, videoDuration: "01:22",
    likes: "8.9K", comments: "1.5K", shares: "3.2K", views: "890K",
    aiSentiment: "Negative", aiTopic: "Kerusuhan", aiLocation: "Kec. Palmerah, Kel. Kemanggisan",
  },
  {
    id: 11, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@traffichunter", verified: false, time: "9h ago",
    content: "Alternatif saat macet TB Simatupang: lewat Jl. Antasari → RS Fatmawati → Cilandak Town Square. Lebih lancar!",
    matchedKeywords: ["macet", "TB Simatupang", "Cilandak"],
    thumbnail: "https://picsum.photos/seed/traffic2/200/150", hasVideo: false,
    likes: "4.5K", comments: 342, shares: "1.1K", views: "156K",
    aiSentiment: "Positive", aiTopic: "Traffic Update", aiLocation: "Kec. Cilandak, Kel. Cilandak Barat",
  },
  {
    id: 12, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "CNN Indonesia", verified: true, time: "10h ago",
    content: "Banjir rob menggenangi kawasan Muara Angke. Ketinggian air mencapai 50cm. Nelayan terdampak.",
    matchedKeywords: ["banjir", "Jakarta"],
    thumbnail: "https://picsum.photos/seed/flood3/200/150", hasVideo: true, videoDuration: "05:10",
    likes: "6.7K", comments: 890, views: "445K",
    aiSentiment: "Negative", aiTopic: "Banjir Rob", aiLocation: "Kec. Penjaringan, Kel. Muara Angke",
  },
  {
    id: 13, platform: "X", platformIcon: "X", platformColor: "#000", username: "@jababekaid", verified: true, time: "11h ago",
    content: "Tabrakan motor vs mobil di perempatan Kuningan pagi ini. Pengendara motor luka ringan. Polisi sedang olah TKP.",
    matchedKeywords: ["tabrakan", "kecelakaan"],
    thumbnail: "https://picsum.photos/seed/accident2/200/150", hasVideo: false,
    comments: 456, reposts: "1.2K", likes: "3.8K", views: "189K",
    aiSentiment: "Negative", aiTopic: "Kecelakaan", aiLocation: "Kec. Setiabudhi, Kel. Karet Kuningan",
  },
  {
    id: 14, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@jakbar_info", verified: false, time: "12h ago",
    content: "Hujan deras sore hari bikin genangan di Jl. Panjang, Kebon Jeruk. Drainase mampet! Warga komplain ke kelurahan.",
    matchedKeywords: ["hujan", "banjir"],
    thumbnail: "https://picsum.photos/seed/rain1/200/150", hasVideo: false,
    likes: "2.3K", comments: 198, shares: 445, views: "67K",
    aiSentiment: "Negative", aiTopic: "Banjir", aiLocation: "Kec. Kebon Jeruk, Kel. Kebon Jeruk",
  },
  {
    id: 15, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@jakartapedia", verified: true, time: "13h ago",
    content: "Protes sopir angkot di Cawang karena rute dibatarkan tanpa ganti rugi. Massa blokir separuh jalan.",
    matchedKeywords: ["protes", "demonstrasi"],
    thumbnail: "https://picsum.photos/seed/protest2/200/150", hasVideo: true, videoDuration: "02:15",
    likes: "7.8K", comments: "1.2K", shares: "2.9K", views: "678K",
    aiSentiment: "Negative", aiTopic: "Protes", aiLocation: "Kec. Kramat Jati, Kel. Cawang",
  },
  {
    id: 16, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "TVOne News", verified: true, time: "14h ago",
    content: "Kebakaran hanguskan 10 rumah di kampung melayu. 200 jiwa mengungsi. Penyebab masih diselidiki.",
    matchedKeywords: ["kebakaran"],
    thumbnail: "https://picsum.photos/seed/fire2/200/150", hasVideo: true, videoDuration: "06:45",
    likes: "9.1K", comments: "1.8K", views: "1.5M",
    aiSentiment: "Negative", aiTopic: "Kebakaran", aiLocation: "Kec. Jatinegara, Kel. Bali Mester",
  },
  {
    id: 17, platform: "X", platformIcon: "X", platformColor: "#000", username: "@safetymetro", verified: true, time: "15h ago",
    content: "Update lalu lintas: Contraflow masih diberlakukan di Sudirman hingga jam 10 WIB. Hati-hati ya commuters!",
    matchedKeywords: ["macet", "transportasi"],
    thumbnail: "https://picsum.photos/seed/traffic3/200/150", hasVideo: false,
    comments: 312, reposts: "1.5K", likes: "4.2K", views: "201K",
    aiSentiment: "Positive", aiTopic: "Traffic Update", aiLocation: "Kec. Menteng, Kel. Gondangdia",
  },
  {
    id: 18, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@infodepok", verified: false, time: "16h ago",
    content: "Kecelakaan maut di flyover Cawang tadi malam. Truk tabrak pembatas jalan. Alhamdulillah tidak ada korban jiwa.",
    matchedKeywords: ["kecelakaan", "tabrakan"],
    thumbnail: "https://picsum.photos/seed/accident3/200/150", hasVideo: false,
    likes: "5.6K", comments: 678, shares: "1.3K", views: "345K",
    aiSentiment: "Negative", aiTopic: "Kecelakaan", aiLocation: "Kec. Kramat Jati, Kel. Cawang",
  },
  {
    id: 19, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@krisnawati", verified: false, time: "17h ago",
    content: "Kerusuhan terjadi di sekitar Tanah Abang blok G. Pedagang bentrok dengan petugas PP. VIDEO DI AKUN LAIN!",
    matchedKeywords: ["kerusuhan", "rusuh"],
    thumbnail: "https://picsum.photos/seed/riot2/200/150", hasVideo: true, videoDuration: "04:12",
    likes: "15.2K", comments: "3.4K", shares: "5.6K", views: "2.3M",
    aiSentiment: "Negative", aiTopic: "Kerusuhan", aiLocation: "Kec. Tanah Abang, Kel. Kebon Kacang",
  },
  {
    id: 20, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "Kompas TV", verified: true, time: "18h ago",
    content: "Banjir kiriman dari Bogor mulai merendam Ciledug. Ketinggian air meningkat 10cm per jam. Evakuasi dimulai.",
    matchedKeywords: ["banjir", "Jakarta"],
    thumbnail: "https://picsum.photos/seed/flood4/200/150", hasVideo: true, videoDuration: "03:55",
    likes: "4.8K", comments: 723, views: "289K",
    aiSentiment: "Negative", aiTopic: "Banjir", aiLocation: "Kec. Ciledug, Kel. Paninggilan",
  },
];

const platforms = [
  { id: "all", label: "All Platforms" }, { id: "twitter", label: "X (Twitter)" },
  { id: "instagram", label: "Instagram" }, { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" }, { id: "youtube", label: "YouTube" },
];
const mentionTypes = [
  { id: "all", label: "All Types" }, { id: "post", label: "Post" },
  { id: "comment", label: "Comment" }, { id: "story", label: "Story" }, { id: "reel", label: "Reel" },
];
const sentimentTypes = [
  { id: "all", label: "All Sentiment" }, { id: "positive", label: "Positive" },
  { id: "neutral", label: "Neutral" }, { id: "negative", label: "Negative" },
];
const impactLevels = [
  { id: "all", label: "All Impact" }, { id: "high", label: "High" },
  { id: "medium", label: "Medium" }, { id: "low", label: "Low" },
];

const inputStyle = { background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" };
const labelStyle = { color: "var(--ch-text)" };
const mutedStyle = { color: "var(--ch-text-muted)" };
const cardStyle = { background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" };

export default function MediaMonitoring() {
  const [activeTab, setActiveTab] = useState("setup");
  const [primaryKeyword, setPrimaryKeyword] = useState("Jakarta");
  const [language, setLanguage] = useState("Indonesian");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [monitoringName, setMonitoringName] = useState("Jakarta – Public Conversation Monitor");
  const [crawlFrequency, setCrawlFrequency] = useState("Real-time");
  const [historicalData, setHistoricalData] = useState("Last 7 Days");
  const [sources, setSources] = useState(dataSources);
  const [incKeywords, setIncKeywords] = useState(includeKeywords);
  const [excKeywords, setExcKeywords] = useState(excludeKeywords);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(mentions.length / perPage);
  const paginatedMentions = mentions.slice((currentPage - 1) * perPage, currentPage * perPage);


  const toggleSource = (id: string) => setSources((prev) => prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)));
  const addIncludeKeyword = () => { if (includeInput.trim() && !incKeywords.includes(includeInput.trim())) { setIncKeywords((prev) => [...prev, includeInput.trim()]); setIncludeInput(""); } };
  const removeIncludeKeyword = (kw: string) => setIncKeywords((prev) => prev.filter((k) => k !== kw));
  const addExcludeKeyword = () => { if (excludeInput.trim() && !excKeywords.includes(excludeInput.trim())) { setExcKeywords((prev) => [...prev, excludeInput.trim()]); setExcludeInput(""); } };
  const removeExcludeKeyword = (kw: string) => setExcKeywords((prev) => prev.filter((k) => k !== kw));

  const tabItems = [
    { value: "setup", icon: Settings, label: "Setup" },
    { value: "mentions", icon: MessageSquare, label: "Mentions" },
    { value: "analysis", icon: BarChart3, label: "Analysis" },
    { value: "heatmap", icon: Flame, label: "Topical Heatmap" },
    { value: "reports", icon: FileText, label: "Reports" },
    { value: "projects", icon: BarChart3, label: "Projects" },
  ];

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-4">
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Media Monitoring
        </h1>
        <p className="text-[14px] mt-1" style={mutedStyle}>Pantau percakapan publik secara real-time di berbagai platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Header */}
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--ch-border)" }}>
          <div className="flex items-center gap-2">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.value;
              const TabIcon = tab.icon;
              return (
                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-150"
                  style={isActive ? { background: "var(--ch-orange)", color: "white", boxShadow: "0 2px 8px rgba(249,115,22,.35)" } : { color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
                  <TabIcon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
          </div>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold hover:underline px-4" style={{ color: "var(--ch-orange)" }}>
            <ExternalLink className="w-3.5 h-3.5" />View Other Projects
          </button>
        </div>

        {/* Tab: Setup */}
        <TabsContent value="setup" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="rounded-xl p-6" style={cardStyle}>
                <h2 className="text-[18px] font-bold mb-1" style={labelStyle}>Keyword Monitoring Setup</h2>
                <p className="text-[13px] mb-6" style={mutedStyle}>Create and configure keyword monitoring to track public conversations.</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold" style={labelStyle}>Primary Keyword <span className="text-red-500">*</span></label>
                      <input type="text" value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <p className="text-[11px]" style={mutedStyle}>The main keyword you want to monitor.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold" style={labelStyle}>Language</label>
                      <div className="relative">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                          <option>Indonesian</option><option>English</option><option>Malay</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold flex items-center gap-1.5" style={labelStyle}>Include <Info className="w-3.5 h-3.5" style={mutedStyle} /></label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {incKeywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: "#14532D", color: "#4ADE80", border: "1px solid #166534" }}>
                          {kw}<button onClick={() => removeIncludeKeyword(kw)} className="hover:text-green-300 ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIncludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <button onClick={addIncludeKeyword} className="px-4 py-2 text-[12px] font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: "var(--ch-orange)" }}>Add</button>
                    </div>
                    <p className="text-[11px]" style={mutedStyle}>Add one keyword then press comma before pressing Add.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold" style={labelStyle}>Exclusion Keywords <span className="text-red-500">(Exclude)</span></label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {excKeywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: "#450A0A", color: "#FCA5A5", border: "1px solid #7F1D1D" }}>
                          {kw}<button onClick={() => removeExcludeKeyword(kw)} className="hover:text-red-300 ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExcludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <button onClick={addExcludeKeyword} className="px-4 py-2 text-[12px] font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: "var(--ch-orange)" }}>Add</button>
                    </div>
                    <p className="text-[11px]" style={mutedStyle}>Add one keyword then press comma before pressing Add.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold" style={labelStyle}>Monitoring Name</label>
                    <input type="text" value={monitoringName} onChange={(e) => setMonitoringName(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                    <p className="text-[11px]" style={mutedStyle}>Give your monitoring a recognizable name.</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors hover:opacity-80" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}>Cancel</button>
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white transition-colors flex items-center gap-1.5" style={{ background: "var(--ch-orange)" }}>
                      <CheckCircle className="w-4 h-4" />Save Monitoring
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl p-5" style={cardStyle}>
                <h3 className="text-[15px] font-bold mb-1" style={labelStyle}>Data Sources</h3>
                <p className="text-[12px] mb-4" style={mutedStyle}>Select platforms & sources to crawl</p>
                <div className="space-y-3">
                  {sources.map((src) => (
                    <label key={src.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={src.checked} onChange={() => toggleSource(src.id)} className="w-5 h-5 rounded border-2 cursor-pointer accent-orange-500" style={{ borderColor: "var(--ch-border)" }} />
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: src.color }}>
                        {src.id === "twitter" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                        {src.id === "instagram" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                        {src.id === "facebook" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                        {src.id === "tiktok" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>}
                        {src.id === "youtube" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                        {src.id === "news" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V6h10v2z"/></svg>}
                        {src.id === "forums" && <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>}
                      </span>
                      <span className="text-[13px] font-medium" style={labelStyle}>{src.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-5" style={cardStyle}>
                <h3 className="text-[15px] font-bold mb-4" style={labelStyle}>Crawl Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={mutedStyle}>Crawl Frequency</label>
                    <div className="relative">
                      <select value={crawlFrequency} onChange={(e) => setCrawlFrequency(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                        <option>Real-time</option><option>Hourly</option><option>Daily</option><option>Weekly</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={mutedStyle}>Historical Data</label>
                    <div className="relative">
                      <select value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                        <option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>All Time</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Mentions */}
        <TabsContent value="mentions" className="mt-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
                <input type="text" placeholder="Search mentions..." className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
              </div>
              {[platforms, mentionTypes, sentimentTypes, impactLevels].map((opts, i) => (
                <div key={i} className="relative">
                  <select className="px-3 py-2 text-[12px] font-medium rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                    {opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={mutedStyle} />
                </div>
              ))}
              <button className="px-3 py-2 text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1.5" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>
                More Filters <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium" style={{ color: "var(--ch-text)" }}>Active Filters:</span>
              {["Project: Jakarta", "Date: May 16 – May 22, 2024", "All Platforms"].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", boxShadow: "0 0 8px rgba(255,255,255,.08)" }}>
                  {f} <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              ))}
              <button className="text-[12px] font-semibold ml-1 hover:underline text-white">Clear all</button>
            </div>

            <div className="space-y-4">
              {paginatedMentions.map((m) => (
                <div key={m.id} className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md" style={cardStyle}>
                  <div className="flex">
                    <div className="flex flex-col items-center gap-2 p-4 shrink-0">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: m.platformColor }}>{m.platformIcon}</span>
                      <div className="w-[120px] h-[90px] rounded-lg overflow-hidden relative" style={{ background: "var(--ch-border)" }}>
                        <img src={m.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        {m.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"><Play className="w-4 h-4 text-white fill-white ml-0.5" /></div>
                            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">{m.videoDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold" style={labelStyle}>{m.username}</span>
                        {m.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                        <span className="text-[11px]" style={mutedStyle}>· {m.time}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--ch-text)" }}>{m.content}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[11px] font-medium" style={mutedStyle}>Matched Keywords:</span>
                        {m.matchedKeywords.map((kw) => (<span key={kw} className="text-[11px] font-semibold" style={{ color: "var(--ch-orange)" }}>{kw}</span>))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          <Sparkles className="w-3 h-3 text-purple-400" /> AI Analysis
                          <span className="font-semibold px-1.5 py-0.5 rounded-full text-[10px]"
                            style={m.aiSentiment === "Negative" ? { background: "#450A0A", color: "#FCA5A5", border: "1px solid #7F1D1D" }
                              : m.aiSentiment === "Positive" ? { background: "#14532D", color: "#4ADE80", border: "1px solid #166534" }
                              : { background: "#1E293B", color: "#CBD5E1", border: "1px solid #334155" }}>
                            {m.aiSentiment}
                          </span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          AI Topic <span className="w-2 h-2 rounded-full bg-blue-500" /> <span className="font-semibold" style={labelStyle}>{m.aiTopic}</span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          Detected Keyword Location <span className="w-2 h-2 rounded-full bg-purple-500" /> <span className="font-semibold" style={labelStyle}>{m.aiLocation}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col items-end justify-between shrink-0" style={{ borderLeft: "1px solid var(--ch-border)" }}>
                      <div className="flex flex-col items-end gap-2.5">
                        {m.comments !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-semibold" style={labelStyle}>{typeof m.comments === "number" ? m.comments.toLocaleString("id-ID") : m.comments}</span>
                            <span className="text-[9px] w-14 text-right" style={mutedStyle}>Comments</span>
                          </span>
                        )}
                        {m.reposts !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Share2 className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.reposts}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Reposts</span>
                          </span>
                        )}
                        {m.likes !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Heart className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.likes}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Likes</span>
                          </span>
                        )}
                        {m.shares !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Share2 className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.shares}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Shares</span>
                          </span>
                        )}
                        {m.views !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Eye className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.views}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Views</span>
                          </span>
                        )}
                      </div>
                      <button className="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:opacity-80" style={{ border: "1px solid rgba(249,115,22,.3)", color: "var(--ch-orange)" }}>
                        <Edit3 className="w-3 h-3" />Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 pt-4">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--ch-text)", border: "1px solid var(--ch-border)" }}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 rounded-lg text-[12px] font-semibold transition-all"
                  style={currentPage === page
                    ? { background: "var(--ch-orange)", color: "white", boxShadow: "0 2px 8px rgba(249,115,22,.35)" }
                    : { color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--ch-text)", border: "1px solid var(--ch-border)" }}>Next</button>
              <span className="text-[11px] ml-2" style={mutedStyle}>{mentions.length} results · Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </TabsContent>

        {/* Placeholder tabs */}
        {(["analysis", "heatmap", "reports", "projects"] as const).map((tab) => {
          const icons = { analysis: BarChart3, heatmap: Flame, reports: FileText, projects: BarChart3 };
          const titles = { analysis: "Analysis Dashboard", heatmap: "Topical Heatmap", reports: "Reports", projects: "Projects" };
          const descs = { analysis: "Deeper insights into your monitoring data.", heatmap: "Visualize trending topics across platforms.", reports: "Generate monitoring reports automatically.", projects: "Manage and track your monitoring projects." };
          const Icon = icons[tab];
          return (
            <TabsContent key={tab} value={tab} className="mt-5">
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-2">
                  <Icon className="w-12 h-12 mx-auto" style={{ color: "var(--ch-border-strong)" }} />
                  <p className="text-[14px] font-semibold" style={labelStyle}>{titles[tab]}</p>
                  <p className="text-[12px]" style={mutedStyle}>Coming soon — {descs[tab]}</p>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
