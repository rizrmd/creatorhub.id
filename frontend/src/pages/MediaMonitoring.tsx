import React, { useState } from "react";
import {
  Settings, MessageSquare, BarChart3, Flame, FileText,
  Search, X, ChevronDown, ExternalLink,
  Heart, MessageCircle, Eye, Share2, Play,
  CheckCircle, Info, Edit3, ThumbsUp, Minus, ThumbsDown,
  Sparkles, Globe, TrendingUp, Layers, Shield, Radio, Download,
  PieChart, Clock,
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

const labelStyle = { color: "#E2E8F0" } as React.CSSProperties;
const mutedStyle = { color: "#94A3B8" } as React.CSSProperties;
const cardStyle = { backgroundColor: "#1A2540", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" } as React.CSSProperties;

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
  const [analysisTab, setAnalysisTab] = useState("summary");
  const [clusterTab, setClusterTab] = useState("issue1");
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
    { value: "overview", icon: PieChart, label: "Overview" },
    { value: "analysis", icon: BarChart3, label: "Analysis" },
    { value: "clusters", icon: Layers, label: "Issue Clusters" },
    { value: "heatmap", icon: Flame, label: "Topical Heatmap" },
    { value: "reports", icon: FileText, label: "Reports" },
    { value: "sources", icon: Radio, label: "Top Sources" },
    { value: "wordcloud", icon: PieChart, label: "Wordcloud" },
  ];

  const analysisTabs = [
    { value: "summary", icon: BarChart3, label: "Summary" },
    { value: "dataset", icon: FileText, label: "Dataset" },
    { value: "landscape", icon: Globe, label: "Conversation Landscape" },
    { value: "sentiment", icon: TrendingUp, label: "General vs Substantive Sentiment" },
    { value: "sentiment-heatmap", icon: Flame, label: "Sentiment Heatmap per Issue" },
    { value: "social-heatmap", icon: Clock, label: "Social Conversation Heatmap" },
    { value: "risk-map", icon: Shield, label: "Public Issue Risk Map" },
  ];

  const clusterTabs = [
    { value: "issue1", icon: Search, label: "Issue Analysis I" },
    { value: "issue2", icon: Search, label: "Issue Analysis II" },
    { value: "issue3", icon: Search, label: "Issue Analysis III" },
  ];

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Media Monitoring
          </h1>
          <p className="text-[14px] mt-1" style={mutedStyle}>Pantau percakapan publik secara real-time di berbagai platform.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "var(--ch-text)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--ch-orange)" }} />
            Project: Jakarta
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>
            <ExternalLink className="w-3.5 h-3.5" />Other Projects
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Header */}
        <div className="flex items-center gap-1 pb-4 overflow-x-auto px-1 rounded-xl" style={{ background: "#0B1120", border: "1px solid rgba(255,255,255,0.06)" }}>
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.value;
            const TabIcon = tab.icon;
            return (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0"
                style={isActive ? {
                  background: "linear-gradient(135deg, #EA580C, #F97316)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(249,115,22,.3)",
                } : {
                  color: "var(--ch-text-muted)",
                  background: "transparent",
                  border: "none",
                }}>
                <TabIcon className="w-3.5 h-3.5" />{tab.label}
              </button>
            );
          })}
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
                      <input type="text" value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10" />
                      <p className="text-[11px]" style={mutedStyle}>The main keyword you want to monitor.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold" style={labelStyle}>Language</label>
                      <div className="relative">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10">
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
                      <input type="text" value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIncludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10" />
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
                      <input type="text" value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExcludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10" />
                      <button onClick={addExcludeKeyword} className="px-4 py-2 text-[12px] font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: "var(--ch-orange)" }}>Add</button>
                    </div>
                    <p className="text-[11px]" style={mutedStyle}>Add one keyword then press comma before pressing Add.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold" style={labelStyle}>Monitoring Name</label>
                    <input type="text" value={monitoringName} onChange={(e) => setMonitoringName(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10" />
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
                      <select value={crawlFrequency} onChange={(e) => setCrawlFrequency(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10">
                        <option>Real-time</option><option>Hourly</option><option>Daily</option><option>Weekly</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={mutedStyle}>Historical Data</label>
                    <div className="relative">
                      <select value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10">
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
                <input type="text" placeholder="Search mentions..." className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10" />
              </div>
              {[platforms, mentionTypes, sentimentTypes, impactLevels].map((opts, i) => (
                <div key={i} className="relative">
                  <select className="px-3 py-2 text-[12px] font-medium rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0C1524] text-slate-300 border border-white/10">
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

        {/* Tab: Overview */}
        <TabsContent value="overview" className="mt-5">
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
              <h3 className="text-[14px] font-bold mb-3" style={labelStyle}>Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: "Total mentions", value: "23.077", change: "+15%", up: true },
                  { label: "Total reach", value: "108M", change: "-6%", up: false },
                  { label: "Positive mentions", value: "3 491", change: "+10%", up: true },
                  { label: "Negative mentions", value: "978", change: "+7%", up: false },
                  { label: "Average Presence Score", value: "75/100", change: "+42%", up: true },
                  { label: "AVE", value: "$7.7M", change: "-5%", up: false },
                  { label: "Social media reach", value: "28M", change: "+78%", up: true },
                  { label: "Non-Social media reach", value: "80M", change: "+19%", up: true },
                  { label: "User generated content", value: "7 046", change: "+4%", up: true },
                  { label: "Social media mentions", value: "5 456", change: "+165%", up: true },
                  { label: "Non-Social media mentions", value: "18K", change: "-20%", up: false },
                  { label: "Social media reactions", value: "793K", change: "+370%", up: true },
                  { label: "Social media comments", value: "27K", change: "+246%", up: true },
                  { label: "Social media shares", value: "63K", change: "+846%", up: true },
                  { label: "Total interactions", value: "883K", change: "+565%", up: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg p-3" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <p className="text-[10px] font-medium mb-1" style={{ color: "var(--ch-text-muted)" }}>{m.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[16px] font-bold" style={{ color: "var(--ch-text)" }}>{m.value}</p>
                      <span className="text-[10px] font-semibold" style={{ color: m.up ? "#22C55E" : "#EF4444" }}>
                        {m.up ? "↑" : "↓"} {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Data — Post & Comment stacked bars */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total Data</h3>
                <div className="w-16 h-0.5 rounded-full" style={{ background: "var(--ch-orange)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="rounded-lg p-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                  <p className="text-[12px] font-bold mb-3" style={{ color: "var(--ch-orange)" }}>Post</p>
                  <div className="w-full h-8 rounded-lg overflow-hidden flex relative" style={{ background: "var(--ch-surface)" }}>
                    <div className="h-full flex items-center justify-center" style={{ width: "32%", background: "#22C55E" }}><span className="text-[9px] font-bold text-white">32%</span></div>
                    <div className="h-full flex items-center justify-center" style={{ width: "18%", background: "#94A3B8" }}><span className="text-[9px] font-bold text-white">18%</span></div>
                    <div className="h-full flex items-center justify-center" style={{ width: "50%", background: "#EF4444" }}><span className="text-[9px] font-bold text-white">50%</span></div>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2.5">
                    {[{ label: "Positive", color: "#22C55E" }, { label: "Neutral", color: "#94A3B8" }, { label: "Negative", color: "#EF4444" }].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: l.color }} /><span className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{l.label}</span></div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg p-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                  <p className="text-[12px] font-bold mb-3" style={{ color: "var(--ch-orange)" }}>Comment</p>
                  <div className="w-full h-8 rounded-lg overflow-hidden flex relative" style={{ background: "var(--ch-surface)" }}>
                    <div className="h-full flex items-center justify-center" style={{ width: "28%", background: "#22C55E" }}><span className="text-[9px] font-bold text-white">28%</span></div>
                    <div className="h-full flex items-center justify-center" style={{ width: "22%", background: "#94A3B8" }}><span className="text-[9px] font-bold text-white">22%</span></div>
                    <div className="h-full flex items-center justify-center" style={{ width: "50%", background: "#EF4444" }}><span className="text-[9px] font-bold text-white">50%</span></div>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2.5">
                    {[{ label: "Positive", color: "#22C55E" }, { label: "Neutral", color: "#94A3B8" }, { label: "Negative", color: "#EF4444" }].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: l.color }} /><span className="text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{l.label}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Word Cloud + Hashtag Map + Share of Voice */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Word Cloud</h3>
                  <div className="w-12 h-0.5 rounded-full" style={{ background: "var(--ch-orange)" }} />
                </div>
                <div className="p-3 flex items-center justify-center overflow-hidden rounded-2xl">
                  <img src="/wordcloud-jakarta.png" alt="Word Cloud Jakarta" className="w-full h-auto rounded-2xl" style={{ maxHeight: "360px", objectFit: "contain" }} />
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Share of Voice</h3>
                  <div className="w-12 h-0.5 rounded-full" style={{ background: "var(--ch-orange)" }} />
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {[
                      { platform: "Instagram", sov: 28, color: "#E1306C" },
                      { platform: "X / Twitter", sov: 24, color: "#94A3B8" },
                      { platform: "TikTok", sov: 22, color: "#69C9D0" },
                      { platform: "News Online", sov: 14, color: "#0EA5E9" },
                      { platform: "Facebook", sov: 8, color: "#1877F2" },
                      { platform: "YouTube", sov: 4, color: "#FF0000" },
                    ].map((p) => (
                      <div key={p.platform}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.platform}</span>
                          <span className="text-[12px] font-bold" style={{ color: "var(--ch-orange)" }}>{p.sov}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                          <div className="h-full rounded-full" style={{ width: `${p.sov}%`, background: p.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Account</h3>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { name: "@dkijakarta", platform: "IG", buzz: 842 },
                    { name: "@TMCPoldaMetro", platform: "X", buzz: 612 },
                    { name: "@jktinfo", platform: "IG", buzz: 534 },
                    { name: "@beritajakarta", platform: "Web", buzz: 298 },
                    { name: "@banjir_jkt", platform: "X", buzz: 186 },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                      <span className="text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)", color: "#fff" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{a.name}</p>
                        <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>{a.platform}</p>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: "var(--ch-orange)" }}>{a.buzz}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  <h3 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Issue</h3>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { issue: "HUT Jakarta ke-499", mentions: 4280, pct: "33.2%" },
                    { issue: "Kualitas udara / AQI", mentions: 2140, pct: "16.6%" },
                    { issue: "Transportasi Rp1", mentions: 1860, pct: "14.4%" },
                    { issue: "Bundaran HI 27-28 Juni", mentions: 1320, pct: "10.2%" },
                    { issue: "SPMB & Job Fair", mentions: 980, pct: "7.6%" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                      <span className="text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)", color: "#fff" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{item.issue}</p>
                        <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>{item.mentions.toLocaleString()} mentions</p>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: "var(--ch-orange)" }}>{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Analysis */}
        <TabsContent value="analysis" className="mt-5">
          <div className="flex rounded-xl overflow-hidden min-h-[600px]" style={cardStyle}>
            {/* Vertical Sub-Tab Sidebar */}
            <div className="w-14 shrink-0 flex flex-col gap-1 p-1" style={{ background: "var(--ch-bg)", borderRight: "1px solid var(--ch-border)" }}>
              {analysisTabs.map((tab) => {
                const isActive = analysisTab === tab.value;
                const TabIcon = tab.icon;
                return (
                  <button key={tab.value} onClick={() => setAnalysisTab(tab.value)}
                    className="flex-1 flex items-center justify-center relative transition-all rounded-lg"
                    style={isActive ? { background: "linear-gradient(135deg, #EA580C, #F97316)", boxShadow: "0 2px 6px rgba(249,115,22,.3)" } : { color: "var(--ch-text-muted)" }}
                    title={tab.label}>
                    <TabIcon className="w-4 h-4 transition-colors" style={{ color: isActive ? "white" : "var(--ch-text-muted)" }} />
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 min-w-0 overflow-y-auto">

              {/* Summary */}
              {analysisTab === "summary" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[22px] font-extrabold tracking-[-0.3px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Summary</h2>
                    <p className="text-[13px] mt-1 leading-relaxed" style={mutedStyle}>Ringkasan analisis percakapan publik terkait keyword "Jakarta" pada periode 16–22 Mei 2024, mencakup distribusi platform, isu dominan, dan sentimen publik.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total Percakapan", value: "23.077", color: "#F97316" },
                      { label: "Platform Ditrack", value: "7", color: "#3B82F6" },
                      { label: "Isu Dominan", value: "3", color: "#22C55E" },
                      { label: "Periode", value: "7 Hari", color: "#8B5CF6", isText: true },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={mutedStyle}>{m.label}</p>
                        <p className="text-[22px] font-extrabold" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                      {[
                        { num: 1, text: <>Analisis dilakukan terhadap <span className="font-bold" style={{ color: "var(--ch-orange)" }}>23.077 percakapan publik digital</span> yang memuat keyword utama <span className="font-bold" style={{ color: "var(--ch-orange)" }}>"Jakarta"</span> serta 15 related keywords yang sedang relevan dalam percakapan publik selama periode <span className="font-bold" style={{ color: "var(--ch-orange)" }}>16–22 Mei 2024</span>. Pemantauan ini bertujuan membaca isu dominan, arah sentimen, serta dinamika percakapan masyarakat terhadap berbagai topik yang berkaitan dengan Jakarta.</> },
                        { num: 2, text: <>Data dikumpulkan dari <span className="font-bold" style={{ color: "var(--ch-orange)" }}>7 platform digital</span> melalui metode crawling, scraping, dan API integration untuk menghimpun postingan, komentar, hashtag, dan konten publik yang relevan. Dari keseluruhan data yang terkumpul, TikTok menjadi platform dengan kontribusi percakapan terbesar, yaitu <span className="font-bold" style={{ color: "var(--ch-orange)" }}>52%</span> dari total percakapan, menunjukkan bahwa diskusi publik terkait Jakarta paling aktif dan menonjol di platform berbasis video pendek.</> },
                        { num: 3, text: <>Dari hasil pemetaan keyword, isu yang paling dominan dalam percakapan adalah <span className="font-bold" style={{ color: "var(--ch-orange)" }}>PON XXI sebesar 32%</span>, disusul <span className="font-bold" style={{ color: "var(--ch-orange)" }}>HUT Jakarta 499 sebesar 24%</span>, dan <span className="font-bold" style={{ color: "var(--ch-orange)" }}>Polusi Udara sebesar 18%</span>. Temuan ini menunjukkan bahwa percakapan publik tentang Jakarta pada periode tersebut tidak hanya didorong oleh isu seremonial dan event, tetapi juga oleh isu kualitas hidup perkotaan yang berdampak langsung pada masyarakat.</> },
                      ].map((item) => (
                        <div key={item.num} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)" }}>
                            <span className="text-[13px] font-bold text-white">{item.num}</span>
                          </div>
                          <div>
                            <p className="text-[12px] leading-relaxed" style={{ color: "var(--ch-text)" }}>{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--ch-orange)" }}>
                          <Search className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-[13px] font-bold" style={labelStyle}>RELATED KEYWORDS JAKARTA</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide" style={mutedStyle}>Keyword Paling Dominan</p>
                        {[
                          { kw: "PON XXI", pct: 32, color: "#F97316" },
                          { kw: "HUT Jakarta 499", pct: 24, color: "#3B82F6" },
                          { kw: "Polusi Udara", pct: 18, color: "#22C55E" },
                          { kw: "Ganjil Genap", pct: 12, color: "#8B5CF6" },
                          { kw: "Urban Heat Island", pct: 8, color: "#0EA5E9" },
                          { kw: "Others", pct: 6, color: "#64748B" },
                        ].map((item) => (
                          <div key={item.kw} className="flex items-center gap-2">
                            <span className="text-[11px] flex-1 font-medium" style={labelStyle}>{item.kw}</span>
                            <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-border)" }}>
                              <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                            </div>
                            <span className="text-[10px] font-bold w-8 text-right" style={{ color: item.color }}>{item.pct}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 mb-4" style={{ borderTop: "1px solid var(--ch-border)" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={mutedStyle}>Distribusi Platform</p>
                        <div className="space-y-2.5">
                          {[
                            { platform: "TikTok", pct: 52, color: "#69C9D0" },
                            { platform: "Instagram", pct: 25.3, color: "#E1306C" },
                            { platform: "YouTube", pct: 13.5, color: "#FF0000" },
                            { platform: "Facebook", pct: 9.2, color: "#1877F2" },
                          ].map((p) => (
                            <div key={p.platform}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-medium" style={labelStyle}>{p.platform}</span>
                                <span className="text-[11px] font-bold" style={{ color: "var(--ch-orange)" }}>{p.pct}%</span>
                              </div>
                              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                        <p className="text-[10px] font-semibold mb-2" style={mutedStyle}>Platform yang Ditrack:</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { name: "TikTok", color: "#000" },
                            { name: "YouTube", color: "#FF0000" },
                            { name: "Instagram", color: "#E1306C" },
                            { name: "X", color: "#94A3B8" },
                            { name: "Facebook", color: "#1877F2" },
                            { name: "News", color: "#0EA5E9" },
                            { name: "Forums", color: "#8B5CF6" },
                          ].map((p) => (
                            <span key={p.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: `${p.color}18`, color: "var(--ch-text)", border: `1px solid ${p.color}30` }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dataset */}
              {analysisTab === "dataset" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-bold" style={labelStyle}>Struktur Dataset Gabungan</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>

                  {/* Dataset Overview */}
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Description */}
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)" }}>
                            <span className="text-[14px] font-bold text-white">01</span>
                          </div>
                          <div>
                            <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
                              Dataset utama terdiri dari <span className="font-bold" style={{ color: "var(--ch-orange)" }}>23.077</span> percakapan publik lintas platform sebagai basis analisis terhadap keyword <span className="font-bold">'Jakarta'</span> dan kata kunci terkait.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)" }}>
                            <span className="text-[14px] font-bold text-white">02</span>
                          </div>
                          <div>
                            <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
                              Percakapan dihimpun dari hasil request pencarian data pada 4 platform utama: <span className="font-bold">TikTok 11.839 percakapan (52,0%)</span>, <span className="font-bold" style={{ color: "#1877F2" }}>Facebook 2.098 percakapan (9,2%)</span>, <span className="font-bold" style={{ color: "#E1306C" }}>Instagram 5.774 percakapan (25,3%)</span>, dan <span className="font-bold" style={{ color: "#FF0000" }}>YouTube 3.074 percakapan (13,5%)</span>.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)" }}>
                            <span className="text-[14px] font-bold text-white">03</span>
                          </div>
                          <div>
                            <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
                              Dataset dihimpun berdasarkan konten publik yang relevan dengan keyword <span className="font-bold">'Jakarta'</span>, termasuk unggahan, komentar, caption, dan interaksi publik yang memiliki eksposur serta keterlibatan tinggi.
                            </p>
                          </div>
                        </div>

                        {/* Platform Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                          {[
                            { platform: "TikTok", icon: "TT", count: "11.839", pct: "52,0%", color: "#000", bgColor: "#000" },
                            { platform: "Facebook", icon: "FB", count: "2.098", pct: "9,2%", color: "#1877F2", bgColor: "#1877F2" },
                            { platform: "Instagram", icon: "IG", count: "5.774", pct: "25,3%", color: "#E1306C", bgColor: "#E1306C" },
                            { platform: "YouTube", icon: "YT", count: "3.074", pct: "13,5%", color: "#FF0000", bgColor: "#FF0000" },
                          ].map((p) => (
                            <div key={p.platform} className="rounded-xl p-4 text-center" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-white mb-2" style={{ background: p.bgColor }}>{p.icon}</span>
                              <p className="text-[11px] font-medium" style={mutedStyle}>{p.platform}</p>
                              <p className="text-[18px] font-bold mt-1 text-white">{p.count}</p>
                              <p className="text-[10px] text-white/60">percakapan</p>
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: p.bgColor }}>{p.pct}</span>
                            </div>
                          ))}
                        </div>

                        {/* Data Collection Flow */}
                        <div className="pt-5 mt-5" style={{ borderTop: "1px solid var(--ch-border)" }}>
                          <p className="text-[12px] font-bold mb-3" style={labelStyle}>Sumber Penghimpunan Data</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {[
                              { icon: Search, label: "Request", sublabel: "Pencarian Data", color: "#3B82F6" },
                              { icon: Globe, label: "Konten Publik", sublabel: "Lintas Platform", color: "#22C55E" },
                              { icon: MessageSquare, label: "Percakapan Relevan", sublabel: "Keyword Jakarta", color: "#F97316" },
                            ].map((step, i) => (
                              <React.Fragment key={step.label}>
                                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${step.color}20` }}>
                                    <step.icon className="w-4 h-4" style={{ color: step.color }} />
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold block" style={{ color: step.color }}>{step.label}</span>
                                    <span className="text-[9px] block" style={mutedStyle}>{step.sublabel}</span>
                                  </div>
                                </div>
                                {i < 2 && (
                                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Donut Chart */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-64 h-64">
                          {/* Donut Chart using CSS */}
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* TikTok 52% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#000" strokeWidth="18"
                              strokeDasharray="114.35 105.56" strokeDashoffset="0" />
                            {/* Instagram 25.3% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#E1306C" strokeWidth="18"
                              strokeDasharray="55.64 164.27" strokeDashoffset="-114.35" />
                            {/* YouTube 13.5% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#FF0000" strokeWidth="18"
                              strokeDasharray="29.69 190.22" strokeDashoffset="-170.00" />
                            {/* Facebook 9.2% */}
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#1877F2" strokeWidth="18"
                              strokeDasharray="20.23 199.68" strokeDashoffset="-199.69" />
                          </svg>
                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[28px] font-extrabold" style={{ color: "var(--ch-text)" }}>23.077</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider" style={mutedStyle}>Percakapan Total</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-xs">
                          {[
                            { platform: "TikTok", pct: "52,0%", color: "#000" },
                            { platform: "Facebook", pct: "9,2%", color: "#1877F2" },
                            { platform: "Instagram", pct: "25,3%", color: "#E1306C" },
                            { platform: "YouTube", pct: "13,5%", color: "#FF0000" },
                          ].map((l) => (
                            <div key={l.platform} className="flex items-center gap-2">
                              {l.color === "#000" ? (
                                <span className="w-3 h-3 rounded-full shrink-0 border-2 border-white" style={{ background: l.color }} />
                              ) : (
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                              )}
                              <span className="text-[12px] font-medium" style={labelStyle}>{l.platform}</span>
                              <span className="text-[12px] font-bold ml-auto text-white">{l.pct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {/* Conversation Landscape */}
              {analysisTab === "landscape" && (
                <div className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>Conversation Landscape</h2>
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="space-y-3">
                      {[
                        { name: "Traffic Congestion", color: "#F97316", mentions: 890, sentiment: "Mostly Negative", pct: 100 },
                        { name: "Flooding", color: "#3B82F6", mentions: 650, sentiment: "Mostly Negative", pct: 73 },
                        { name: "Protests", color: "#EF4444", mentions: 420, sentiment: "Negative", pct: 47 },
                        { name: "Fires", color: "#F59E0B", mentions: 310, sentiment: "Neutral", pct: 35 },
                        { name: "Accidents", color: "#8B5CF6", mentions: 180, sentiment: "Negative", pct: 20 },
                      ].map((b) => (
                        <div key={b.name} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: "var(--ch-surface)" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${b.color}20` }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] font-semibold" style={labelStyle}>{b.name}</span>
                              <span className="text-[12px] font-bold" style={labelStyle}>{b.mentions}</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-border)" }}>
                              <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                            </div>
                          </div>
                          <span className="text-[11px] shrink-0" style={mutedStyle}>{b.sentiment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* General vs Substantive Sentiment */}
              {analysisTab === "sentiment" && (
                <div className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>General vs Substantive Sentiment</h2>
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5 text-[11px]" style={mutedStyle}><span className="w-3 h-3 rounded" style={{ background: "#64748B" }} /> General Sentiment</span>
                      <span className="flex items-center gap-1.5 text-[11px]" style={mutedStyle}><span className="w-3 h-3 rounded" style={{ background: "var(--ch-orange)" }} /> Substantive Sentiment</span>
                    </div>
                    <div className="space-y-4">
                      {[{ issue: "Traffic Congestion", general: 65, substantive: 82 }, { issue: "Flooding", general: 45, substantive: 78 }, { issue: "Protests", general: 30, substantive: 88 }, { issue: "Fires", general: 20, substantive: 65 }, { issue: "Accidents", general: 35, substantive: 72 }].map((s) => (
                        <div key={s.issue} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold" style={labelStyle}>{s.issue}</span>
                            <span className="text-[11px]" style={mutedStyle}>General: {s.general}% · Substantive: {s.substantive}%</span>
                          </div>
                          <div className="flex gap-1 h-5">
                            <div className="rounded" style={{ width: `${s.general}%`, background: "#64748B" }} />
                            <div className="rounded" style={{ width: `${s.substantive}%`, background: "var(--ch-orange)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sentiment Heatmap per Issue */}
              {analysisTab === "sentiment-heatmap" && (
                <div className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>Sentiment Heatmap per Issue</h2>
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="grid grid-cols-4 gap-2 text-[11px]">
                      <div />
                      <div className="text-center font-semibold py-2" style={{ color: "#22C55E" }}>Positive</div>
                      <div className="text-center font-semibold py-2" style={{ color: "#94A3B8" }}>Neutral</div>
                      <div className="text-center font-semibold py-2" style={{ color: "#EF4444" }}>Negative</div>
                      {[
                        { issue: "Traffic", pos: 15, neu: 25, neg: 60 },
                        { issue: "Flooding", pos: 10, neu: 20, neg: 70 },
                        { issue: "Protests", pos: 8, neu: 15, neg: 77 },
                        { issue: "Fires", pos: 5, neu: 30, neg: 65 },
                        { issue: "Accidents", pos: 12, neu: 22, neg: 66 },
                      ].map((r) => (
                        <React.Fragment key={r.issue}>
                          <div className="flex items-center font-semibold py-3" style={labelStyle}>{r.issue}</div>
                          <div className="flex items-center justify-center py-3 rounded-lg font-bold" style={{ background: `rgba(34,197,94,${r.pos / 100})`, color: r.pos > 30 ? "white" : "#4ADE80" }}>{r.pos}%</div>
                          <div className="flex items-center justify-center py-3 rounded-lg font-bold" style={{ background: `rgba(148,163,184,${r.neu / 100})`, color: r.neu > 30 ? "white" : "#CBD5E1" }}>{r.neu}%</div>
                          <div className="flex items-center justify-center py-3 rounded-lg font-bold" style={{ background: `rgba(239,68,68,${r.neg / 100})`, color: r.neg > 30 ? "white" : "#FCA5A5" }}>{r.neg}%</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Conversation Heatmap */}
              {analysisTab === "social-heatmap" && (
                <div className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>Social Conversation Heatmap</h2>
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="grid grid-cols-8 gap-1 text-[10px]">
                      <div />
                      {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "00:00"].map((h) => (
                        <div key={h} className="text-center py-1" style={mutedStyle}>{h}</div>
                      ))}
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <React.Fragment key={day}>
                          <div className="flex items-center font-semibold" style={labelStyle}>{day}</div>
                          {[30, 75, 45, 60, 90, 40, 25, 15].map((v, i) => (
                            <div key={i} className="h-8 rounded flex items-center justify-center text-[9px] font-bold"
                              style={{ background: `rgba(249,115,22,${v / 100})`, color: v > 50 ? "white" : "var(--ch-text-muted)" }}>
                              {v}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Map */}
              {analysisTab === "risk-map" && (
                <div className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>Public Issue Risk Map</h2>
                  <div className="rounded-xl p-6" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <div className="relative h-80 border-l border-b" style={{ borderColor: "var(--ch-border)" }}>
                      <div className="absolute top-0 left-0 right-0 text-center text-[10px] font-semibold pb-1" style={mutedStyle}>Urgency →</div>
                      <div className="absolute bottom-0 left-0 top-0 flex items-center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
                        <span className="text-[10px] font-semibold" style={mutedStyle}>← Severity</span>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                        <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-lg" style={{ background: "rgba(249,115,22,.05)" }} />
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 rounded-tr-lg" style={{ background: "rgba(239,68,68,.08)" }} />
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-bl-lg" style={{ background: "rgba(34,197,94,.05)" }} />
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-br-lg" style={{ background: "rgba(249,115,22,.08)" }} />
                      </div>
                      {[
                        { name: "Traffic", x: 80, y: 25, color: "#F97316" },
                        { name: "Flooding", x: 65, y: 15, color: "#3B82F6" },
                        { name: "Protests", x: 55, y: 10, color: "#EF4444" },
                        { name: "Fires", x: 45, y: 18, color: "#F59E0B" },
                        { name: "Accidents", x: 70, y: 35, color: "#8B5CF6" },
                      ].map((p) => (
                        <div key={p.name} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5" style={{ left: `${p.x}%`, bottom: `${p.y}%` }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: p.color, boxShadow: `0 0 12px ${p.color}60` }} />
                          <span className="text-[10px] font-semibold whitespace-nowrap" style={labelStyle}>{p.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                      <span className="text-[10px] flex items-center gap-1" style={mutedStyle}><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E" }} /> Low Risk</span>
                      <span className="text-[10px] flex items-center gap-1" style={mutedStyle}><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F97316" }} /> Monitor</span>
                      <span className="text-[10px] flex items-center gap-1" style={mutedStyle}><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} /> High Risk</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </TabsContent>

        {/* Tab: Issue Clusters */}
        <TabsContent value="clusters" className="mt-5">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              {clusterTabs.map((tab) => {
                const isActive = clusterTab === tab.value;
                const TabIcon = tab.icon;
                return (
                  <button key={tab.value} onClick={() => setClusterTab(tab.value)}
                    className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all duration-150"
                    style={isActive ? {
                      background: "linear-gradient(135deg, #EA580C, #F97316)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(249,115,22,.3)",
                    } : {
                      color: "var(--ch-text-muted)",
                      background: "var(--ch-surface)",
                      border: "1px solid var(--ch-border)",
                    }}>
                    <TabIcon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                );
              })}
            </div>
            <div className="rounded-xl p-6 min-h-[400px]" style={cardStyle}>
              {["issue1", "issue2", "issue3"].map((issueKey, idx) => clusterTab === issueKey && (
                <div key={issueKey} className="space-y-6">
                  <h2 className="text-[18px] font-bold" style={labelStyle}>{["Issue Analysis I: Traffic Congestion", "Issue Analysis II: Flooding", "Issue Analysis III: Protests & Civil Unrest"][idx]}</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Mentions", value: ["890", "650", "420"][idx] },
                      { label: "Sentiment Score", value: ["-0.62", "-0.71", "-0.58"][idx] },
                      { label: "Top Platform", value: ["X (Twitter)", "YouTube", "TikTok"][idx] },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                        <p className="text-[11px]" style={mutedStyle}>{s.label}</p>
                        <p className="text-[20px] font-bold mt-1" style={labelStyle}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-5" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <h3 className="text-[14px] font-bold mb-3" style={labelStyle}>Top Posts</h3>
                    <div className="space-y-3">
                      {mentions.filter((m) => m.aiTopic === ["Traffic", "Flooding", "Protests"][idx] || m.aiTopic === ["Kemacetan", "Banjir", "Demo"][idx] || m.aiTopic === ["Traffic Update", "Banjir Rob", "Protes Warga"][idx]).slice(0, 3).map((m) => (
                        <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--ch-surface)" }}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: m.platformColor }}>{m.platformIcon}</span>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold" style={labelStyle}>{m.username} <span className="font-normal" style={mutedStyle}>· {m.time}</span></p>
                            <p className="text-[12px] mt-0.5 truncate" style={mutedStyle}>{m.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Topical Heatmap */}
        <TabsContent value="heatmap" className="mt-5">
          <div className="space-y-5">
            <div>
              <h2 className="text-[20px] font-extrabold" style={labelStyle}>Heatmap Sentimen per Isu Jakarta</h2>
              <p className="text-[12px] mt-1" style={mutedStyle}>Pembacaan sentimen pada kata kunci dominan berdasarkan percakapan publik digital periode 16–22 Mei 2024</p>
            </div>

            <div className="rounded-xl p-3 flex items-center gap-3 flex-wrap" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
              <span className="text-[11px] font-bold" style={{ color: "var(--ch-orange)" }}>RELATED KEYWORDS JAKARTA</span>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { kw: "PON XXI", pct: "32%" },
                  { kw: "HUT Jakarta 499", pct: "24%" },
                  { kw: "Polusi Udara", pct: "18%" },
                  { kw: "Ganjil Genap", pct: "12%" },
                  { kw: "Urban Heat Island", pct: "8%" },
                  { kw: "Others", pct: "6%" },
                ].map((item) => (
                  <span key={item.kw} className="text-[11px]" style={labelStyle}>
                    <span className="font-bold">{item.kw}</span> <span style={{ color: "var(--ch-orange)" }}>{item.pct}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                <table className="w-full text-[12px]">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-bold" style={{ background: "#1E3A5F", color: "white" }}>
                        <span className="flex items-center gap-1.5">Isu Utama</span>
                      </th>
                      <th className="text-center p-3 font-bold" style={{ background: "#22C55E", color: "white" }}>
                        <span className="flex items-center justify-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> Positif</span>
                      </th>
                      <th className="text-center p-3 font-bold" style={{ background: "#F59E0B", color: "white" }}>
                        <span className="flex items-center justify-center gap-1.5"><Minus className="w-3.5 h-3.5" /> Netral</span>
                      </th>
                      <th className="text-center p-3 font-bold" style={{ background: "#EF4444", color: "white" }}>
                        <span className="flex items-center justify-center gap-1.5"><ThumbsDown className="w-3.5 h-3.5" /> Negatif/Kritis</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { issue: "PON XXI", icon: "🏆", pos: 42, neu: 36, neg: 22 },
                      { issue: "HUT Jakarta 499", icon: "🏛️", pos: 48, neu: 34, neg: 18 },
                      { issue: "Polusi Udara", icon: "🌫️", pos: 8, neu: 24, neg: 68 },
                      { issue: "Ganjil Genap", icon: "🚗", pos: 15, neu: 30, neg: 55 },
                      { issue: "Urban Heat Island", icon: "🌡️", pos: 10, neu: 35, neg: 55 },
                      { issue: "Others", icon: "💬", pos: 20, neu: 45, neg: 35 },
                    ].map((r) => (
                      <tr key={r.issue} className="border-t" style={{ borderColor: "var(--ch-border)" }}>
                        <td className="p-3 font-semibold" style={labelStyle}>
                          <span className="flex items-center gap-2">
                            <span>{r.icon}</span>
                            {r.issue}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold" style={{ background: `rgba(34,197,94,${r.pos / 100 * 0.4})`, color: "#22C55E" }}>{r.pos}%</td>
                        <td className="p-3 text-center font-bold" style={{ background: `rgba(245,158,11,${r.neu / 100 * 0.4})`, color: "#F59E0B" }}>{r.neu}%</td>
                        <td className="p-3 text-center font-bold" style={{ background: `rgba(239,68,68,${r.neg / 100 * 0.4})`, color: "#EF4444" }}>{r.neg}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-3 p-3 border-t" style={{ borderColor: "var(--ch-border)" }}>
                  <span className="text-[10px] font-semibold" style={mutedStyle}>Skala Intensitas Sentimen</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden flex">
                    <div className="h-full" style={{ width: "33%", background: "#EF4444" }} />
                    <div className="h-full" style={{ width: "33%", background: "#F59E0B" }} />
                    <div className="h-full" style={{ width: "34%", background: "#22C55E" }} />
                  </div>
                  <div className="flex justify-between flex-1 -mt-1">
                    <span className="text-[9px]" style={mutedStyle}>Lebih Negatif</span>
                    <span className="text-[9px]" style={mutedStyle}>Campuran / Netral</span>
                    <span className="text-[9px]" style={mutedStyle}>Lebih Positif</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--ch-orange)" }}>
                    <span className="text-white text-sm">⭐</span>
                  </div>
                  <p className="text-[14px] font-bold" style={labelStyle}>Pembacaan Utama</p>
                </div>
                <div className="space-y-3">
                  {[
                    { num: 1, text: <>Polusi Udara menjadi isu dengan tekanan sentimen negatif paling kuat, menunjukkan tingginya kekhawatiran publik terhadap kualitas udara dan dampak kesehatan.</> },
                    { num: 2, text: <>Ganjil Genap dan Urban Heat Island juga menunjukkan kecenderungan kritik yang tinggi karena berkaitan langsung dengan pengalaman harian warga Jakarta.</> },
                    { num: 3, text: <>PON XXI dan HUT Jakarta 499 cenderung memperoleh persepsi lebih positif karena berasosiasi dengan event, perayaan, dan kebanggaan kota.</> },
                    { num: 4, text: <>Heatmap ini menunjukkan bahwa isu berbasis kualitas hidup perkotaan masih menjadi sumber tekanan sentimen paling dominan dibandingkan isu seremonial dan event.</> },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ background: "var(--ch-orange)" }}>{item.num}</span>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text)" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--ch-orange)" }}>
                <span className="text-white text-sm">💡</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--ch-orange)" }}>Key Insight</p>
                <p className="text-[12px] leading-relaxed font-medium" style={{ color: "var(--ch-text)" }}>Sentimen terhadap isu Jakarta tidak merata pada semua topik. Tekanan persepsi paling kritis terkonsentrasi pada <span className="font-bold" style={{ color: "var(--ch-orange)" }}>Polusi Udara</span>, <span className="font-bold" style={{ color: "var(--ch-orange)" }}>Ganjil Genap</span>, dan <span className="font-bold" style={{ color: "var(--ch-orange)" }}>Urban Heat Island</span>, sementara PON XXI dan HUT Jakarta 499 cenderung dibaca lebih positif.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Reports */}
        <TabsContent value="reports" className="mt-5">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 mx-auto" style={{ color: "var(--ch-border-strong)" }} />
              <p className="text-[14px] font-semibold" style={labelStyle}>Reports</p>
              <p className="text-[12px]" style={mutedStyle}>Coming soon — generate monitoring reports automatically.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Top Sources */}
        <TabsContent value="sources" className="mt-5">
          <div className="space-y-6">
            <h2 className="text-[18px] font-bold" style={labelStyle}>Top Sources</h2>
            <div className="rounded-xl p-5" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="space-y-3">
                {[
                  { name: "Kompas TV", platform: "YouTube", reach: "12.1M", engagement: "4.2%", sentiment: "Negative", color: "#FF0000" },
                  { name: "@infojakarta", platform: "X", reach: "5.4M", engagement: "3.8%", sentiment: "Negative", color: "#000" },
                  { name: "MetroJakarta TV", platform: "YouTube", reach: "4.8M", engagement: "3.1%", sentiment: "Neutral", color: "#FF0000" },
                  { name: "CNN Indonesia", platform: "YouTube", reach: "4.2M", engagement: "2.9%", sentiment: "Negative", color: "#FF0000" },
                  { name: "@lambe_turah", platform: "Instagram", reach: "3.5M", engagement: "5.2%", sentiment: "Negative", color: "#E1306C" },
                  { name: "TVOne News", platform: "YouTube", reach: "3.1M", engagement: "2.7%", sentiment: "Negative", color: "#FF0000" },
                  { name: "@jaksel.info", platform: "Instagram", reach: "2.8M", engagement: "4.1%", sentiment: "Negative", color: "#E1306C" },
                  { name: "@jakartakini", platform: "TikTok", reach: "2.4M", engagement: "6.8%", sentiment: "Negative", color: "#000" },
                ].map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
                    <span className="text-[14px] font-bold w-6 text-center" style={mutedStyle}>{i + 1}</span>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: s.color }}>{s.platform[0]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={labelStyle}>{s.name}</p>
                      <p className="text-[11px]" style={mutedStyle}>{s.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold" style={labelStyle}>{s.reach}</p>
                      <p className="text-[10px]" style={mutedStyle}>{s.engagement} engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Wordcloud */}
        <TabsContent value="wordcloud" className="mt-5">
          <div className="space-y-6">
            <h2 className="text-[18px] font-bold" style={labelStyle}>Wordcloud</h2>
            <div className="rounded-xl p-8" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { word: "Jakarta", weight: 100 }, { word: "Macet", weight: 88 },
                  { word: "Banjir", weight: 82 }, { word: "Transportasi", weight: 68 },
                  { word: "Demo", weight: 62 }, { word: "Protes", weight: 55 },
                  { word: "Kebakaran", weight: 50 }, { word: "Kecelakaan", weight: 45 },
                  { word: "Kerusuhan", weight: 42 }, { word: "Cilandak", weight: 38 },
                  { word: "Tebet", weight: 35 }, { word: "Kuningan", weight: 32 },
                  { word: "Hujan", weight: 30 }, { word: "Banjir Rob", weight: 28 },
                  { word: "Flyover", weight: 25 }, { word: "Drainase", weight: 22 },
                  { word: "Contraflow", weight: 20 }, { word: "Evakuasi", weight: 18 },
                  { word: "Lalu Lintas", weight: 40 }, { word: "Warga", weight: 36 },
                ].map((w) => (
                  <span key={w.word} className="font-bold transition-all hover:scale-110 cursor-default"
                    style={{
                      fontSize: `${Math.max(12, w.weight * 0.22)}px`,
                      color: w.weight > 70 ? "var(--ch-orange)" : w.weight > 40 ? "var(--ch-text)" : "var(--ch-text-muted)",
                      opacity: Math.max(0.5, w.weight / 100),
                    }}>
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
