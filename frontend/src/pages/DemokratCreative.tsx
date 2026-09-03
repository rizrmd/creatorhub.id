import { useState, useRef } from "react";
import {
  Palette, BarChart3, Target, Megaphone, FileText,
  ChevronDown, Search, X,
  Calendar, Heart, Info, Users, Download, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const GOALS = [
  { title: "Menghadirkan HUT di ruang digital", desc: "Perayaan hidup di linimasa jutaan orang, bukan hanya di lokasi acara." },
  { title: "Melibatkan publik muda sebagai kreator", desc: "Panggung bagi talenta kreatif lintas medium di seluruh Indonesia." },
  { title: "Memperkuat citra partai modern", desc: "Partai yang dekat, terbuka, dan percaya pada kreativitas anak muda." },
  { title: "Membangun arsip karya organik", desc: "Ratusan karya menjadi aset konten partai yang berumur panjang." },
];

const HASHTAGS = [
  { label: "#25tahunpartaidemokrat", color: "#93C5FD", bg: "rgba(37,99,235,.14)", border: "rgba(37,99,235,.5)" },
  { label: "#BersamaRakyat", color: "#93C5FD", bg: "rgba(37,99,235,.14)", border: "rgba(37,99,235,.5)" },
  { label: "#demokratcreativechallenge", color: "#93C5FD", bg: "rgba(37,99,235,.14)", border: "rgba(37,99,235,.5)" },
  { label: "#videodemokrat", color: "#CBD5E1", bg: "#0F172A", border: "#1E293B" },
  { label: "#designposterdemokrat", color: "#CBD5E1", bg: "#0F172A", border: "#1E293B" },
  { label: "#bumperlogoHUTdemokrat", color: "#CBD5E1", bg: "#0F172A", border: "#1E293B" },
  { label: "#voiceoverdemokrat", color: "#CBD5E1", bg: "#0F172A", border: "#1E293B" },
  { label: "@creativedemokrat", color: "#F1F5F9", bg: "rgba(220,38,38,.12)", border: "rgba(220,38,38,.45)" },
  { label: "@pdemokrat", color: "#F1F5F9", bg: "rgba(220,38,38,.12)", border: "rgba(220,38,38,.45)" },
];

const WEIGHTS = [
  { label: "Kreativitas & ide", width: "40%", color: "#3B82F6" },
  { label: "Kesesuaian tema", width: "30%", color: "#60A5FA" },
  { label: "Kualitas teknis", width: "20%", color: "#93C5FD" },
  { label: "Engagement", width: "10%", color: "#DC2626" },
];

const CONTESTS = [
  { num: "01", title: "Video Pendek", spec: "30\u201360 detik \u00b7 9:16 \u00b7 min. 1080p", prize: "Rp6 / 3 / 1,5 jt", tag: "#videodemokrat",
    desc: "Cerita perjalanan, harapan, atau kisah personal bersama Partai Demokrat.",
    rules: ["Perorangan atau tim maks. 3 orang.", "Musik & footage bebas pelanggaran hak cipta.", "Gate: rasio 9:16 dan resolusi 1080p wajib."] },
  { num: "02", title: "Poster Digital", spec: "1080\u00d71350 px \u00b7 PNG/JPG", prize: "Rp5 / 2,5 / 1,5 jt", tag: "#designposterdemokrat",
    desc: "Key visual yang merepresentasikan semangat HUT ke-25.",
    rules: ["Maksimal 2 karya per peserta.", "Wajib memuat elemen HUT ke-25 dan warna khas partai.", "Aset dan font harus berlisensi atau bebas."] },
  { num: "03", title: "Bumper Logo HUT", spec: "3\u201310 detik \u00b7 motion graphic", prize: "Rp5 / 2,5 / 1,5 jt", tag: "#bumperlogoHUTdemokrat",
    desc: "Motion graphic audio visual untuk logo terpilih HUT ke-25.",
    rules: ["Menggunakan logo terpilih HUT ke-25.", "Karya orisinal, bebas musik berhak cipta.", "Juri: pembuat logo (Boogie/Storikka) + juri internal."] },
  { num: "04", title: "Voice Over", spec: "30\u201390 detik \u00b7 MP3/WAV", prize: "Rp4 / 2 / 1 jt", tag: "#voiceoverdemokrat",
    desc: "Narasi suara untuk video yang telah disediakan panitia.",
    rules: ["Bahasa Indonesia; artikulasi & intonasi penilaian utama.", "Rekaman jernih tanpa musik latar berhak cipta.", "Naskah resmi panitia atau naskah orisinal."] },
];

const TIMELINE = [
  { date: "26 Agustus 2026", title: "Sosialisasi & S&K", desc: "Pendaftaran dibuka (gratis); kampanye sosialisasi lintas kanal.", dot: "#22C55E", dateColor: "#94A3B8", badge: "SELESAI", badgeColor: "#4ADE80", badgeBg: "rgba(34,197,94,.12)", badgeBorder: "rgba(34,197,94,.4)" },
  { date: "26 Agu \u2013 4 Sep 2026", title: "Masa berkarya & submisi", desc: "Periode produksi dan pengunggahan; window spesifik per mata lomba.", dot: "#3B82F6", dateColor: "#93C5FD", badge: "BERJALAN", badgeColor: "#93C5FD", badgeBg: "rgba(37,99,235,.14)", badgeBorder: "rgba(37,99,235,.5)" },
  { date: "4\u20135 September 2026", title: "Kurasi administrasi", desc: "Seleksi administrasi, cek format dan orisinalitas; penetapan longlist.", dot: "#334155", dateColor: "#64748B", badge: "MENUNGGU", badgeColor: "#64748B", badgeBg: "#0F172A", badgeBorder: "#1E293B" },
  { date: "5\u20137 September 2026", title: "Penjurian", desc: "Penilaian juri internal dan praktisi untuk karya yang lolos admin.", dot: "#334155", dateColor: "#64748B", badge: "MENUNGGU", badgeColor: "#64748B", badgeBg: "#0F172A", badgeBorder: "#1E293B" },
  { date: "8 September 2026", title: "Pengumuman pemenang", desc: "Diumumkan pada perayaan puncak HUT ke-25 Partai Demokrat.", dot: "#DC2626", dateColor: "#64748B", badge: "PUNCAK", badgeColor: "#FCA5A5", badgeBg: "rgba(220,38,38,.12)", badgeBorder: "rgba(220,38,38,.45)" },
];

const BUDGET = [
  { label: "Video Pendek (J1/J2/J3)", value: "Rp10,5 jt" },
  { label: "Poster Digital (J1/J2/J3)", value: "Rp9 jt" },
  { label: "Bumper Logo HUT (J1/J2/J3)", value: "Rp9 jt" },
  { label: "Voice Over (J1/J2/J3)", value: "Rp7 jt" },
  { label: "Terfavorit pilihan publik & lain-lain", value: "Rp28 jt" },
];

const JURY = [
  { cat: "Video Pendek", body: "BPI \u2014 Badan Perfilman Indonesia \u00b7 kandidat praktisi sutradara." },
  { cat: "Poster Digital", body: "ADGI \u2014 Asosiasi Desainer Grafis Indonesia \u00b7 art director senior." },
  { cat: "Voice Over", body: "Voice Institute Indonesia \u2014 voice talent profesional." },
  { cat: "Bumper Logo", body: "Boogie Wijayanto (Storikka), pemenang logo HUT ke-25." },
];

// Content Hub pipeline
interface PipelineItem {
  key: string; topic: string; hashtags: string[]; creator: string; role: string;
  avatar: string; igType: string; ttType: string; d: number; h: number; min: number;
  steps: string; pct: string; slot: string; video: boolean;
}
const PIPELINE: PipelineItem[] = [
  { key:"p0", topic:"Highlight Finalis Video Pendek", hashtags:["#KreasiBiru2026","#demokratcreativechallenge"], creator:"Rizki Ananda", role:"Tim Kreatif Digital", avatar:"#2563EB", igType:"Reels", ttType:"TikTok Video", d:8, h:8, min:0, steps:"8/8", pct:"100%", slot:"thumbnail\nreels", video:true },
  { key:"p1", topic:"Pengumuman 20 Karya Terpilih", hashtags:["#KreasiBiru2026","#20KaryaTerpilih"], creator:"Salsabila Putri", role:"Editor Konten", avatar:"#1D4ED8", igType:"Instagram Carousel", ttType:"TikTok Photo Mode", d:4, h:10, min:0, steps:"6/8", pct:"75%", slot:"thumbnail\ncarousel", video:false },
  { key:"p2", topic:"Behind the Scene Penjurian", hashtags:["#KreasiBiru2026","#ProsesPenjurian"], creator:"Bagas Nugroho", role:"Videografer", avatar:"#0EA5E9", igType:"Instagram Reels", ttType:"TikTok Video", d:5, h:20, min:0, steps:"5/8", pct:"62%", slot:"thumbnail\nreels", video:true },
  { key:"p3", topic:"Countdown HUT ke-25", hashtags:["#25tahunpartaidemokrat","#HUTke25"], creator:"Nadia Rahmawati", role:"Desainer Grafis", avatar:"#3B82F6", igType:"Instagram Feed", ttType:"TikTok Photo Mode", d:6, h:18, min:0, steps:"4/8", pct:"50%", slot:"thumbnail\nfeed", video:false },
  { key:"p4", topic:"Kompilasi Voice Over Terbaik", hashtags:["#KreasiBiru2026","#VoiceOver"], creator:"Yoga Pratama", role:"Audio & VO", avatar:"#1E40AF", igType:"Instagram Reels", ttType:"TikTok Video", d:7, h:19, min:30, steps:"3/8", pct:"37%", slot:"thumbnail\nreels", video:true },
  { key:"p5", topic:"Profil Juri Praktisi BPI & ADGI", hashtags:["#KreasiBiru2026","#DewanJuri"], creator:"Salsabila Putri", role:"Editor Konten", avatar:"#1D4ED8", igType:"Instagram Carousel", ttType:"TikTok Photo Mode", d:8, h:11, min:0, steps:"3/8", pct:"37%", slot:"thumbnail\ncarousel", video:false },
  { key:"p6", topic:"Testimoni Peserta Luar Jabodetabek", hashtags:["#KreasiBiru2026","#SuaraPeserta"], creator:"Rizki Ananda", role:"Tim Kreatif Digital", avatar:"#2563EB", igType:"Instagram Reels", ttType:"TikTok Video", d:9, h:20, min:0, steps:"2/8", pct:"25%", slot:"thumbnail\nreels", video:true },
  { key:"p7", topic:"Bumper Logo HUT Terpilih", hashtags:["#25tahunpartaidemokrat","#BumperLogo"], creator:"Nadia Rahmawati", role:"Desainer Grafis", avatar:"#3B82F6", igType:"Instagram Feed Video", ttType:"TikTok Video", d:10, h:17, min:0, steps:"1/8", pct:"12%", slot:"thumbnail\nbumper", video:true },
];

const HUB_STAGES = [
  { label: "Ide & Brief", count: 12, desc: "Naskah dan referensi visual disusun bersama tim kreatif.", color: "#64748B" },
  { label: "Produksi", count: 9, desc: "Perekaman, desain, dan voice over sedang dikerjakan.", color: "#3B82F6" },
  { label: "Review Internal", count: 6, desc: "Menunggu persetujuan penanggung jawab konten.", color: "#FBBF24" },
  { label: "Siap Tayang", count: 8, desc: "Sudah disetujui dan menunggu jadwal publikasi.", color: "#22C55E" },
];

const HUB_ASSETS = [
  { label: "Logo HUT ke-25", desc: "6 varian \u00b7 PNG & SVG" },
  { label: "Template Caption", desc: "14 naskah siap pakai" },
  { label: "Palet & Font Resmi", desc: "Panduan merek 12 halaman" },
  { label: "Bumper Logo Terpilih", desc: "3\u201310 dtk \u00b7 MP4 & MOV" },
];

// Campaign Monitoring posts
interface PostInsight {
  v: string; f: string; nf: string; home: string; other: string; profile: string; viewers: string;
  inter: string; iF: string; iNF: string; likes: string; shares: string; saves: string; comments: string;
  engaged: string; visits: string; taps: string; addr: string; follows: string;
}

interface PostData {
  topic: string; plat: string; type: string; poster: string; date: string; link: string;
  slot: string; v: string; l: string; c: string; rp: string; s: string; sv: string; er: string;
  ret: string; hot: boolean; caption?: string; tags?: string[]; href?: string; img?: string;
  sent: [string, string, string][];
  themes: [string, string, number, string][];
  ins: [string, string][];
  rows: [string, string][];
  detail?: PostInsight;
  realComments?: { user: string; text: string; likes: number; replies?: { user: string; text: string }[] }[];
  collab?: string;
  rec: string;
}
const POSTS: PostData[] = [
  { topic:"Satu panggung, lima medium, satu semangat!", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"26 Agu 2026", link:"instagram.com/p/DcgMK85j3w9", slot:"thumbnail\ncarousel", v:"-", l:"298", c:"50", rp:"7", s:"353", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    caption:"Satu panggung, lima medium, satu semangat!\nSaatnya karya anak muda Indonesia bersinar di Demokrat Creative Challenge 2026 🌟\n\nTunjukkan kreasimu dan pilih medium terbaikmu:\n🎨 Poster Digital\n📲 Video Pendek\n🎙️ Voice Over\n🎬 Bumper Logo HUT ke-25\n\nKompetisi ini 100% GRATIS dan kamu boleh mengirim karya di lebih dari satu kategori lomba.\n\n📌 Siapkan karya terbaikmu dari sekarang!\nAktifkan notifikasi postingan akun ini & tunggu pengumuman pendaftaran lengkapnya!\n\n#PartaiDemokrat\n#CreativeDemokrat\n#25TahunPartaiDemokrat\n#BersamaRakyat\n#DemokratCreativeChallenge",
    img:"https://instagram.ffab1-2.fna.fbcdn.net/v/t51.82787-15/784351121_18091044572241648_5439134344827287162_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzk3MjE5ODA2MTQwODM2NzM2OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=RAxnqLfThGcQ7kNvwFn4Jdw&_nc_oc=AdodcMacTwCnRCwOjJp13ldKaWbw64TQ7EnDWeJV-54ds-QX7gI9Zg3MQ4dbE9nywTJDUzEvHFzITch0erHvOYHV&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ffab1-2.fna&_nc_gid=5b1GxaRLkttf1doEEMmESA&_nc_ss=7a22e&oh=00_AQIp2MoNr7qHyWwzvdjb5vbMwrVn7zxDbmSlp_a3aVQ18A&oe=6A9F1E22",
    sent:[["Positif","60%","#22C55E"],["Netral","30%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias lomba","72%",180,"#22C55E"],["Tanya cara daftar","45%",112,"#3B82F6"],["Tag teman","32%",80,"#64748B"],["Kritik deadline","12%",30,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Post pembuka campaign. Engagement tinggi, jadikan pinned post." },
  { topic:"DEMOKRAT BERNADA", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"26 Agu 2026", link:"instagram.com/p/DcgYuRqj9YH", slot:"thumbnail\ncarousel",
    caption:"DEMOKRAT BERNADA\nPunya sesuatu yang ingin kamu sampaikan? Sampaikan lewat nada.\n\nKami mengajak kamu, siapa pun kamu, di mana pun kamu, untuk menciptakan lagu tentang Partai Demokrat. Tentang nilainya, semangatnya, perjalanannya, atau apa pun makna yang kamu tangkap dari partai ini.\n\nNggak perlu studio mahal. Nggak perlu jadi musisi profesional. Rekaman kamar pun boleh, asal suaranya jelas dan ceritanya jujur.\n\nGenre bebas, pop, rock, folk, dangdut, hip-hop, sampai keroncong. Yang penting karyamu sendiri, bukan cover.\n\nCara ikutan:\n\n1. Ciptakan lagu original, durasi 2–5 menit\n2. Upload potongan maksimal 30 detik ke IG dan TikTok kamu, pakai #DemokratBernada dan mention @creativedemokrat & @pdemokrat\n3. Kirim lagu lengkap + lirik ke bit.ly/DemokratBernada\n\nGratis. Terbuka untuk umum.\nPendaftaran ditutup 5 September 2026.\n\nSuarakan gagasanmu lewat nada. 🎵\n\n#PartaiDemokrat #CreativeDemokrat #25TahunPartaiDemokrat #BersamaRakyat",
    img:"https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/783777152_18091085165241648_8213308036607215596_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzk3MjI4MzU0ODUzOTA3NjU4MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTIwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=3f5iN-pS7FYQ7kNvwGDJyqE&_nc_oc=AdrX4XlyVcFhkDQiZ8Y-1kEB3XZJqlxW6By0Q29U5QNyEzVl9M2-7QsPDm9XQLGiRZQh4hXPZswAJcX8AwBDugeb&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=u149MxffdejQfIBxmuvw1w&_nc_ss=7a22e&oh=00_AQIbvriygLxU1O3CSdl7QjJxv5nilO0YLFeGMaSV-R1nhw&oe=6A9F1DDB", v:"-", l:"248", c:"41", rp:"53", s:"166", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Minat ikut lomba","68%",170,"#22C55E"],["Tanya syarat","42%",105,"#3B82F6"],["Apresiasi kreativitas","30%",75,"#64748B"],["Skeptis","8%",20,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Kompetisi cipta lagu. Engagement bagus, boost untuk jangkauan lebih luas." },
  { topic:"MENTION TEMEN LO YANG JAGO BIKIN LAGU!", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"27 Agu 2026", link:"instagram.com/p/Dci1tR9FDLn", slot:"thumbnail\ncarousel",
    caption:"MENTION TEMEN LO YANG JAGO BIKIN LAGU! 🔥\n\nPartai Demokrat lagi bikin kompetisi cipta lagu bernama Demokrat Bernada. Terbuka untuk umum, gratis, dan yang menarik: genre-nya bebas total. Pop, rock, folk, dangdut, hip-hop, sampai keroncong semuanya boleh ikutan!\n\nYang bikin ini beda dari lomba musik kebanyakan, nggak wajib rekaman studio. Rekaman kamar pun diterima, asal vokal sama musiknya kedengeran jelas. Jadi yang dinilai bener-bener karyanya, bukan seberapa mahal produksinya.\n\nSyaratnya lagu original, bukan cover, durasi 2–5 menit, lirik dan melodi harus sudah utuh.\n\nPendaftaran ditutup 5 September 2026. Info lengkapnya cek di @creativedemokrat sekarang! 🚀\n\nAda yang mau ikut? 👀\n#indomusikgram",
    img:"https://scontent-iad3-2.cdninstagram.com/v/t51.82787-15/788705196_18625358503051212_8978946579657445561_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk3Mjk3MzM0MDc1ODgyOTk4Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Ui_tJbk3NQMQ7kNvwHzRqZA&_nc_oc=Adp_0LdknWFSamMsXTpJ-O748IdDcIjlxhpLmq4HkRcryfBbXmK80oKSmi6jT6TjzfnXUDdlVASVqBkuKcEwoWiL&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-iad3-2.cdninstagram.com&_nc_gid=fomrGmwdOpOYvEfcB6aEaA&_nc_ss=7a22e&oh=00_AQJEHtWMUlnnbg0tVg-JwAb9DOykiu7lsYis1b1GiN9TxA&oe=6A9F0D8A", v:"-", l:"N/A", c:"314", rp:"80", s:"1.064", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    sent:[["Positif","50%","#22C55E"],["Netral","35%","#64748B"],["Negatif","15%","#DC2626"]],
    themes:[["Mention teman","75%",234,"#22C55E"],["Tanya deadline","40%",125,"#3B82F6"],["Diskusi genre","28%",87,"#64748B"],["Kritik syarat","10%",31,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Komentar tertinggi (312). Viral hook, pertahankan format mention." },
  { topic:"LOMBA POSTER DIGITAL - CREATIVE DEMOKRAT 2026", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"27 Agu 2026", link:"instagram.com/p/Dci7TVrD8yA", slot:"thumbnail\ncarousel",
    caption:"🎨 LOMBA POSTER DIGITAL — CREATIVE DEMOKRAT 2026\n\nPunya ide visual yang ingin kamu tuangkan jadi sebuah karya? \nMari wujudkan kreativitasmu dalam bentuk poster yang merepresentasikan semangat “25 Tahun Demokrat Bersama Rakyat” ✨\n\nBuat karya yang unik, orisinal, dan relevan dengan tema. Tunjukkan bagaimana kamu menerjemahkan semangat tersebut melalui visual versimu sendiri!\n\n📌 Ketentuan utama:\n• Feed: 1080 × 1350 px\n• Story: 1080 × 1920 px\n• Resolusi: 300 dpi\n• Maksimal 2 karya\n• Wajib menggunakan elemen resmi HUT ke-25 & warna khas partai\n• Karya orisinal dan aset/font berlisensi atau bebas hak cipta\n• Diunggah di akun Instagram dan TikTok aktif\n• Mention @creativedemokrat & @pdemokrat\n\n📧 Jangan lupa kirimkan hasil karyamu ke:\ncreativedemokrat@gmail.com\nSubjek: NAMA PESERTA_LOMBA POSTER DIGITAL\n\n📅 26 Agustus – 4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n\nKamu punya 2 kesempatan untuk menunjukkan karya terbaikmu. Jangan berhenti di ide, wujudkan jadi visual! 🎨🔥\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#DesignPosterDemokrat",
    img:"https://scontent-yyz1-1.cdninstagram.com/v/t51.82787-15/786827870_18091386488241648_9119240588451319778_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzk3Mjk5ODQ3NDQ4MzE5OTAyMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=EqOJ6yzUSDMQ7kNvwFioBEe&_nc_oc=AdqZRplU3AjqTJkjOnQMPAFi2qJkKVuDUMc7J3oNgB6k6Cmp61M9TXBWyVldm-d2hVY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_gid=4Z6DF7mqezNcuwcZKN9kQg&_nc_ss=7a22e&oh=00_AQJhJTtfimv6IJM6_EqVcX-Lm4chim3N_JyAkRuZGlJ6mQ&oe=6A9F0F36", v:"-", l:"99", c:"30", rp:"18", s:"32", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","65%","#22C55E"],["Netral","25%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Minat ikut poster","70%",69,"#22C55E"],["Tanya format","35%",35,"#3B82F6"],["Apresiasi desain","25%",25,"#64748B"],["Kritik","5%",5,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Post edukasi lomba poster. Stabil, perlu amplifikasi." },
  { topic:"LOMBA VIDEO PENDEK - CREATIVE DEMOKRAT 2026", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"27 Agu 2026", link:"instagram.com/p/Dci7msvj22L", slot:"thumbnail\ncarousel",
    caption:"🎬 LOMBA VIDEO PENDEK — CREATIVE DEMOKRAT 2026\n\nPunya cerita, pesan, atau ide kreatif yang ingin kamu tuangkan lewat video? \nYuk, buat video pendek yang merepresentasikan semangat “25 Tahun Demokrat Bersama Rakyat” ✨\n\n🎭 Bebas berekspresi:\nCinematic • Mini Vlog • Drama Short • Sketsa Komedi • Opini Kreatif\n\n📌 Ketentuan utama:\n• Durasi 30–60 detik\n• Format vertikal 9:16\n• Resolusi minimal 1080p\n• Akun Instagram/TikTok wajib publik\n• Karya orisinal & materi audio/visual bebas pelanggaran hak cipta\n• Maksimal 2 karya per peserta\n• Boleh perorangan atau tim (maks. 3 orang)\n\n📅 26 Agustus – 4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n\nPunya ide cerita menarik? \nJangan cuma disimpan; rekam, kreasikan, dan tunjukkan versimu! 🎥🔥\n\n📧 Kirimkan karyamu ke:\ncreativedemokrat@gmail.com\nSubjek: NAMA PESERTA_LOMBA VIDEO PENDEK\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#VideoDemokrat",
    img:"https://scontent-waw2-1.cdninstagram.com/v/t51.82787-15/784716676_18091387439241648_8671389096545239439_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=Mzk3Mjk5OTg0MDU3NjQ1Nzg3NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=-pXeNQtpyokQ7kNvwE0zeJc&_nc_oc=AdoBZXJQWzvIkvrKVuNCyhq2O4uAxJcnrJhO08OOdV_4WZ3jZ3QS5HnpOnnBlT7KsScI5NQ0VYxreBZW7C3YAMrY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-waw2-1.cdninstagram.com&_nc_gid=reD-hWTvrNv-RC5GAAJQUg&_nc_ss=7a22e&oh=00_AQK_4a5HDDyjXJgvQTNehu1eQA0dcV9Z4pWMl3xulDeVDQ&oe=6A9F296B", v:"-", l:"103", c:"36", rp:"23", s:"45", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","62%","#22C55E"],["Netral","28%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Minat video pendek","68%",69,"#22C55E"],["Tanya teknis","38%",39,"#3B82F6"],["Apresiasi","22%",22,"#64748B"],["Kritik","8%",8,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Video pendek mata lomba terpopuler. Konsisten posting reminder." },
  { topic:"LOMBA BUMPER LOGO HUT - CREATIVE DEMOKRAT 2026", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"27 Agu 2026", link:"instagram.com/p/Dci7w0ID4jp", slot:"thumbnail\ncarousel",
    caption:"🎬 LOMBA BUMPER LOGO HUT — CREATIVE DEMOKRAT 2026\n\nPunya ide motion yang bisa bikin sebuah logo jadi lebih hidup? \nSaatnya tunjukkan kreativitasmu! ✨\n\nUbah Master Logo Resmi RAW HUT ke-25 Partai Demokrat menjadi bumper logo yang singkat, kuat, memukau, dan berkarakter.\n\n📌 Ketentuan utama:\n• Durasi 3–10 detik\n• Format video motion\n• Wajib menggunakan Master Logo Resmi RAW HUT ke-25\n• Karya animasi & elemen tambahan orisinal/berlisensi\n• Audio/sound effect bebas hak cipta atau berlisensi\n• Maksimal 2 karya per peserta\n\n📅 26 Agustus – 4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n\n📱 Unggah karyamu di Instagram/TikTok, lalu kirimkan hasil karya ke:\n📧 creativedemokrat@gmail.com\nSubjek: NAMA PESERTA_LOMBA BUMPER LOGO HUT\n\nPastikan kedua tahap dilakukan agar karyamu dapat diproses oleh tim kurasi.\n\nGerakkan identitasnya. Tunjukkan karakter motion-mu! 🎬🔥\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#BumperLogoHUTDemokrat",
    img:"https://scontent-ber1-1.cdninstagram.com/v/t51.82787-15/787596801_18091387667241648_5100590943573699994_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzk3MzAwMDQ2OTMzNjkzNTIwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=D7DKK_D-kvkQ7kNvwH4u8fr&_nc_oc=AdpHWX--110BY5bB70ffAVcfMcVlRDwjwGouRW50qvuYMBN13SU0nTtMPyOpQGfqY7w&_nc_ad=z-m&_nc_cid=1365&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=2jdIIBs27nF0OcfuzvaysQ&_nc_ss=7a22e&oh=00_AQIkCrYFMlzLL1v7ctAZ1nomX04ssWzIu7sj07DhrFcuYQ&oe=6A9F0393", v:"-", l:"110", c:"36", rp:"2", s:"28", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","60%","#22C55E"],["Netral","30%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Minat bumper logo","65%",71,"#22C55E"],["Tanya format","35%",38,"#3B82F6"],["Apresiasi motion","25%",27,"#64748B"],["Kritik","5%",5,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Niche tapi engagement solid. Targetkan ke komunitas motion designer." },
  { topic:"TOTAL HADIAH PULUHAN JUTA RUPIAH MENANTIMU!", plat:"Instagram", type:"Image", poster:"@creativedemokrat", date:"28 Agu 2026", link:"instagram.com/p/DckzlgGvGPt", slot:"thumbnail\nfeed",
    caption:"🏆 TOTAL HADIAH PULUHAN JUTA RUPIAH MENANTIMU! 🔥\n\nPunya karya kreatif? Saatnya bawa karyamu ke Demokrat Creative Challenge 2026! ✨\n\n🎥 Lomba Video Pendek\n🥇 Rp6.000.000 | 🥈 Rp3.000.000 | 🥉 Rp1.500.000\n\n🎨 Lomba Poster Digital\n🥇 Rp5.000.000 | 🥈 Rp2.500.000 | 🥉 Rp1.500.000\n\n✨ Lomba Bumper Logo HUT\n🥇 Rp5.000.000 | 🥈 Rp2.500.000 | 🥉 Rp1.500.000\n\n🎙️ Lomba Voice Over\n🥇 Rp4.000.000 | 🥈 Rp2.000.000 | 🥉 Rp1.000.000\n\n🌟 Penghargaan Terfavorit Pilihan Publik\n💰 Rp2.000.000 untuk 1 pemenang favorit di setiap kategori!\n\n📅 26 Agustus – 4 September 2026\n🆓 100% GRATIS & TERBUKA UNTUK UMUM\n\nKirimkan karya terbaikmu ke:\n📧 creativedemokrat@gmail.com\n\nJangan sampai ketinggalan! \nSaatnya karya kamu dilihat, didengar, dan diapresiasi!\n\n#PartaiDemokrat \n#CreativeDemokrat \n#25TahunPartaiDemokrat \n#DemokratCreativeChallenge \n#BersamaRakyat",
    img:"https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/788139863_18091612208241648_7460811108353314730_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=Mzk3MzUyNzY0ODcxMzA3MzY0NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=aH5StnngHdcQ7kNvwEHxGwF&_nc_oc=AdrifjICLLo3TybDW-7s5xnlZBReF4RylytuM20zSDobmrn02jGw-DJPwsrx5S_NOx8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=dZPoDzuQvdTfF3j-1Mv4AA&_nc_ss=7a22e&oh=00_AQJwRZkp8xLeR1CQFuK0TLfGVZ563NJh9qmgiFmo9IIf8Q&oe=6A9F1882", v:"-", l:"310", c:"174", rp:"57", s:"132", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    sent:[["Positif","58%","#22C55E"],["Netral","30%","#64748B"],["Negatif","12%","#DC2626"]],
    themes:[["Motivasi hadiah","70%",216,"#22C55E"],["Tanya cara daftar","45%",139,"#3B82F6"],["Tag teman","30%",92,"#64748B"],["Skeptis hadiah","10%",31,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Engagement tertinggi ke-2. Hook hadiah bekerja, boost post ini." },
  { topic:"H-7 menuju penutupan!", plat:"Instagram", type:"Image", poster:"@creativedemokrat", date:"28 Agu 2026", link:"instagram.com/p/DclHt0OyPoL", slot:"thumbnail\nfeed",
    caption:"⏳ H-7 menuju penutupan!\n \nTinggal 7 hari lagi! 🔥 \nSudah punya karya? Jangan tunggu last minute!\n \n📅 Deadline: 4 September 2026\n🆓 GRATIS!\n \nUpload & kirimkan karyamu sekarang ke:\ncreativedemokrat@gmail.com\n\n#PartaiDemokrat\n#CreativeDemokrat\n#25TahunPartaiDemokrat\n#DemokratCreativeChallenge\n#BersamaRakyat",
    img:"https://scontent-yyz1-1.cdninstagram.com/v/t51.82787-15/788666278_18091658162241648_7516075614783715876_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=Mzk3MzYxNjE4MTAwODk4ODY4Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMiJ9&_nc_ohc=Wrp2BsX3aF8Q7kNvwENngNp&_nc_oc=Ado0dI7muZ_Qa1FEz-7p1W5FstC_1XIUdkv20OfSxj-VVuOLOmp_kGWgXutwXAHvAFY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_gid=3ZX7vSnqSdMLeZbrwZ-piw&_nc_ss=7a22e&oh=00_AQJhOKoWhbWA3pD9qcw40TgTI1O6L_3D9sGD4azYbpMx2g&oe=6A9F2FDE", v:"-", l:"90", c:"22", rp:"22", s:"5", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Urgensi deadline","65%",58,"#22C55E"],["Tanya sisa waktu","40%",36,"#3B82F6"],["Motivasi submit","25%",22,"#64748B"],["Keluhan mepet","10%",9,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Countdown reminder. Format efektif, lanjutkan H-5, H-3, H-1." },
  { topic:"LOMBA VOICE OVER - CREATIVE DEMOKRAT 2026", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"29 Agu 2026", link:"instagram.com/p/DcnMDdlD2u4", slot:"thumbnail\ncarousel",
    caption:"🎙️ LOMBA VOICE OVER — CREATIVE DEMOKRAT 2026\n\nPunya suara, cerita, dan cara sendiri dalam menyampaikan sebuah pesan?\nHidupkan pesan lewat suaramu di Creative Demokrat 2026! ✨\n\nBuat Voice Over menggunakan suara asli kamu dan kembangkan naskah/teks versimu sendiri sesuai konteks video serta tema “25 Tahun Demokrat Bersama Rakyat”.\n\n🎬 Aset video resmi telah disediakan panitia dan dapat diakses melalui link di bio.\n\n📌 Ketentuan utama:\n• Durasi 30–90 detik\n• Format MP3/WAV\n• Bahasa Indonesia\n• Video mentah resmi wajib digunakan\n• Naskah/teks Voice Over dibuat dan dikembangkan sendiri\n• Voice Over wajib menggunakan suara manusia asli\n• AI Voice Generator dilarang\n• Maksimal 2 karya per peserta\n• Karya & audio tambahan wajib bebas hak cipta\n\n📅 26 Agustus – 4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n\n📧 Kirimkan karyamu ke:\ncreativedemokrat@gmail.com\nSubjek: NAMA PESERTA_LOMBA VOICE OVER\n\nSuaramu. Ceritamu. Ekspresimu.\nSaatnya buat pesanmu terdengar! 🎙️🔥\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#VoiceOverDemokrat",
    img:"https://instagram.fymq3-1.fna.fbcdn.net/v/t51.82787-15/787619942_18091920017241648_6124246270397921191_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzk3NDE5ODExMTQ0NjcyOTQwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=g2_IHb9lqN0Q7kNvwGar-le&_nc_oc=AdpL5hPRSE4NT9aDWc7Rp-XCIcp1SwOpLPoFOgK3ZKy31wTwpJTlCtyCM61xOXWpq-zY0KfT7tGZIX5IBpO_s89m&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fymq3-1.fna&_nc_gid=7PG7fpOAqs5Zo46PNkFUWg&_nc_ss=7a22e&oh=00_AQK9LlvfkRE5zoA5GpjfXoe-upjMawxA8yu5v_uJJJS1YQ&oe=6A9F01B0", v:"-", l:"111", c:"20", rp:"27", s:"53", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","65%","#22C55E"],["Netral","25%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Minat voice over","60%",66,"#22C55E"],["Tanya syarat","35%",39,"#3B82F6"],["Apresiasi niche","25%",28,"#64748B"],["Kritik","5%",6,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Voice over kategori unik. Engagement stabil, targetkan ke komunitas VO." },
  { topic:"H-5 menuju penutupan!", plat:"Instagram", type:"Image", poster:"@creativedemokrat", date:"30 Agu 2026", link:"instagram.com/p/Dcpv_wXRBAA", slot:"thumbnail\nfeed",
    caption:"⏳ H-5 menuju penutupan!\n\nTinggal 5 hari lagi! 🔥 \nSudah punya karya? Jangan tunggu last minute!\n\n📅 Deadline: 4 September 2026\n🆓 GRATIS!\n\nUpload & kirimkan karyamu sekarang ke:\ncreativedemokrat@gmail.com\n\n#PartaiDemokrat\n#CreativeDemokrat\n#25TahunPartaiDemokrat\n#DemokratCreativeChallenge\n#BersamaRakyat",
    img:"https://scontent-waw2-2.cdninstagram.com/v/t51.82787-15/790880756_18092237828241648_1665879844258259665_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzk3NDkxOTIzNTU3NDE3MzY5Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=LnH-2ahkdHoQ7kNvwERODJo&_nc_oc=Adp-Bvzaw9jPQvwzF2ns0ds7onwRw9LEEErftFH9B415jozHdzTWz6_LXgogjmxXU8E&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-waw2-2.cdninstagram.com&_nc_gid=bSKxmkJcj3kMIQSn-w8Syg&_nc_ss=7a22e&oh=00_AQJy_YzsNPzkgXPmllNDG5PDQaxlv10Q4WMd1CESxOm8QA&oe=6A9F06AD", v:"-", l:"101", c:"6", rp:"22", s:"6", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","50%","#22C55E"],["Netral","40%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Urgensi","60%",61,"#22C55E"],["Reminder submit","35%",35,"#3B82F6"],["Motivasi","20%",20,"#64748B"],["Keluhan","5%",5,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Countdown reminder. Likes tinggi tapi komentar rendah, CTA kurang kuat." },
  { topic:"MAU VOICE OVER-MU TERDENGAR LEBIH MENARIK?", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"31 Agu 2026", link:"instagram.com/p/Dcsib-rD8-X", slot:"thumbnail\ncarousel",
    caption:"🎙️ MAU VOICE OVER-MU TERDENGAR LEBIH MENARIK?\n\nBukan cuma soal punya suara yang enak didengar. Cara kamu mengucapkan, memainkan intonasi, dan menghayati naskah juga penting!\n\nCoba kuasai 3 hal ini:\n01. ARTIKULASI JELAS\nPastikan setiap kata terdengar jelas dan mudah dipahami.\n\n02. INTONASI PAS\nSesuaikan tinggi-rendah suara dengan konteks dan emosi yang ingin disampaikan.\n\n03. PENGHAYATAN KUAT\nJangan sekadar membaca. Sampaikan pesan dengan ekspresi dan karakter suaramu.\n\n🎧 BONUS TIP:\nGunakan audio yang bersih dan hindari musik berhak cipta.\n\nKalau sudah siap, waktunya latihan dan mulai rekam! 🎙️🔥\n📌 Bahasa Indonesia\n⏱️ Durasi 30–90 detik\n🎧 Format MP3/WAV\n\n📅 Submit karya: 26 Agustus–4 September 2026\n🔗 Cek S&K: bit.ly/regulationcreativedmkrt\n\nSave postingan ini sebagai panduan sebelum recording!\n\n#PartaiDemokrat \n#CreativeDemokrat \n#25TahunPartaiDemokrat \n#DemokratCreativeChallenge \n#BersamaRakyat",
    img:"https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/787817984_18092583731241648_2000654951656490322_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzk3NTcwMzk0MzgwNzA2Nzc4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=BwW6RNPr4FgQ7kNvwHzEUPi&_nc_oc=AdrfszbTjGGco8Zo01ZPQGLJ85-kOOB9Tam8lf_WGC5l-BxwmKli4qVFIh5xVO1SoYw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=E3P9mAHrlYUQMghkMOL8gg&_nc_ss=7a22e&oh=00_AQIQh8exYKrjiMPLEIVQNmrqulU5H6CXGQujWmONmWkPtg&oe=6A9F22E6", v:"-", l:"100", c:"5", rp:"22", s:"14", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","60%","#22C55E"],["Netral","30%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Tips VO","55%",55,"#22C55E"],["Tanya teknik","30%",30,"#3B82F6"],["Apresiasi","20%",20,"#64748B"],["Kritik","5%",5,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Konten edukasi VO. Komentar rendah, perlu CTA lebih kuat." },
  { topic:"CARA IKUT LOMBA VIDEO PENDEK", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"31 Agu 2026", link:"instagram.com/p/Dcs_BuPjy3X", slot:"thumbnail\ncarousel",
    caption:"VIDEO PENDEK\n🎬 CARA IKUT LOMBA VIDEO PENDEK!\nMasih bingung gimana cara ikutannya? Tenang, cuma 3 langkah simpel! 👀\n\n1️⃣ REKAM IDE CREATIVEMU\nBuat video 30–60 detik bertema “25 Tahun Demokrat Bersama Rakyat”\nBebas pilih gaya: Cinematic, Mini Vlog, Drama, Sketsa Komedi, atau gaya kreatif lainnya!\n\n2️⃣ UPLOAD KE REELS / TIKTOK\nUnggah dalam format vertikal 9:16. Pastikan akunmu PUBLIC dan seluruh audio & visual aman dari hak cipta.\n\n3️⃣ TAG & KIRIM KARYAMU\nGunakan hashtag & mention resmi @creativedemokrat dan @pdemokrat, lalu kirimkan hasil karyamu ke:\n📧 creativedemokrat@gmail.com\nSubjek: NAMA PESERTA_VIDEO PENDEK\n\n📅 26 Agustus – 4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n🔗 Cek S&K: bit.ly/regulationcreativedmkrt\n\nSudah tahu caranya? Sekarang giliran kamu! \nTunjukkan kreativitas dan kemampuan visual storytelling-mu! 🔥\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#VideoDemokrat",
    img:"https://scontent-icn2-1.cdninstagram.com/v/t51.82787-15/789489049_18092642081241648_6857008710861359277_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzk3NTgyOTU4MDEzMTc2MDc1NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzI3Ny5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=T-XFLw0LNn0Q7kNvwGYW5ne&_nc_oc=AdqYThOtVNGv8-5suJf8SkOu4xqa1gmdZdzaqx6IkCstxGtMCfFV3TzbHpkW4y_QwEY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_gid=CW8AmIDxP8d30xrhYPWxag&_nc_ss=7a22e&oh=00_AQJ9YFn-i9npPlTbpjdFFeNGLm7AY5bMbH1pjkrNt8163Q&oe=6A9F0244", v:"-", l:"79", c:"4", rp:"16", s:"20", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Tutorial ikut","60%",47,"#22C55E"],["Tanya format","30%",24,"#3B82F6"],["Apresiasi","15%",12,"#64748B"],["Kritik","5%",4,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Tutorial cara ikut. Engagement rendah, mungkin timing kurang tepat." },
  { topic:"DEMOKRAT BERNADA: Kompetisi Cipta Lagu", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"31 Agu 2026", link:"instagram.com/p/DctG4Zsj1RP", slot:"thumbnail\ncarousel",
    caption:"5 HARI LAGI BUAT IKUTAN DEMOKRAT BERNADA: Kompetisi Cipta Lagu Partai Demokrat!\n\nPartai Demokrat mengundang seluruh masyarakat Indonesia untuk berpartisipasi dalam kompetisi cipta lagu original bertema Partai Demokrat.\n\nKetentuan singkat:\n🎵 Lagu original, bukan cover — durasi 2–5 menit\n🎵 Genre bebas, rekaman rumahan diperbolehkan\n🎵 Terbuka untuk perorangan maupun grup\n🎵 Gratis, tanpa biaya pendaftaran\n\nCara mengikuti:\nUnggah potongan lagu maksimal 30 detik ke Instagram atau TikTok dengan hashtag #DemokratBernada, mention @creativedemokrat dan @pdemokrat, lalu kirimkan karya lengkap melalui bit.ly/DemokratBernada\n\nPendaftaran ditutup 5 September 2026.\nInformasi lengkap tersedia di link bio.\n\n#DemokratBernada #KompetisiMusik #CiptaLagu",
    img:"https://instagram.fbrs4-2.fna.fbcdn.net/v/t51.82787-15/787666404_18092659610241648_8712018789076333657_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk3NTg2NDA0NjA5NTEyMjIyNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTIwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=orr7hB67kO8Q7kNvwH5HQEl&_nc_oc=Adq2-rQquJy_A-IQOVIYx9efUljbMrsEDmcQC1fvF9yJSk6-CD7lzP3mlnP7qgNZoJ8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fbrs4-2.fna&_nc_gid=0uLr5Q7721btZtVbzIK59w&_nc_ss=7a22e&oh=00_AQJu5njJudxkjrMcb4xInNdbWxH73PtavZBTK_p9s_cT9Q&oe=6A9F2304", v:"-", l:"409", c:"50", rp:"45", s:"60", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    sent:[["Positif","62%","#22C55E"],["Netral","28%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias lomba lagu","70%",277,"#22C55E"],["Tanya cara ikut","40%",158,"#3B82F6"],["Tag musisi","30%",119,"#64748B"],["Kritik deadline","8%",32,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Likes tertinggi (396)! Format kompetisi lagu sangat resonan. Boost post ini." },
  { topic:"DARI LOGO DIAM JADI ANIMASI BERKELAS!", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"1 Sep 2026", link:"instagram.com/p/DcvAj0ij3W2", slot:"thumbnail\ncarousel",
    caption:"LOGO BUMPER HUT\n🎬 DARI LOGO DIAM JADI ANIMASI BERKELAS!\n\nBikin bumper logo yang singkat bukan berarti gerakannya harus biasa aja! 👀\n\nKalau mau karya motion-mu lebih menarik, perhatikan 3 hal ini:\n1️⃣ Konsep Motion Kreatif\nBuat alur gerakan yang punya karakter, bukan sekadar fade in/out.\n\n2️⃣ Gerakan Presisi\nTiming, easing, dan transisi yang rapi bikin animasi terasa lebih smooth.\n\n3️⃣ Selaras Audio & Tema\nPilih sound effect yang mendukung visual dan semangat 25 Tahun Demokrat Bersama Rakyat.\n\n✨ Saatnya gerakkan Master Logo RAW HUT ke-25 dan wujudkan ide motion-mu!\n📁 Aset Logo RAW tersedia di link bio\n\n📅 26 Agustus – 4 September 2026\n🔗 Cek S&K: bit.ly/regulationcreativedmkrt\n\nSaatnya gerakkan identitasnya! 🔥\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#BumperLogoHUTDemokrat",
    img:"https://scontent-icn2-1.cdninstagram.com/v/t51.82787-15/791129811_18092926685241648_9006840114897148257_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzk3NjM5OTM3MjE0NDE4MTkxOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=exANo2u_KB8Q7kNvwEHORxt&_nc_oc=AdrjA2miLDiUkTSi5t0pIrsU1U5iOj4zgO_cT9VrbKeUf3ZSgPi6tb9kxYZMewbx02I&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_gid=QNZ9PTt9B04VFPATSdn8Xw&_nc_ss=7a22e&oh=00_AQJjMR9jVwus756qRrrwjffnCMepV2JYHaeuahKI1einDA&oe=6A9F2AC5", v:"-", l:"81", c:"7", rp:"20", s:"3", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","60%","#22C55E"],["Netral","30%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Tutorial bumper","55%",45,"#22C55E"],["Tanya tools","30%",24,"#3B82F6"],["Apresiasi","20%",16,"#64748B"],["Kritik","5%",4,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Konten edukasi bumper. Niche, perlu targeting ke komunitas motion." },
  { topic:"BIKIN POSTER, BUKAN SEKADAR DESAIN!", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"1 Sep 2026", link:"instagram.com/p/DcvMRGwFGYk", slot:"thumbnail\ncarousel",
    caption:"POSTER DIGITAL\n\n🎨 BIKIN POSTER, BUKAN SEKADAR DESAIN!\nPoster yang menarik bukan cuma soal visual yang keren, \ntapi juga bagaimana ide dan pesan bisa tersampaikan dengan kuat 👀✨\n\nIni 3 kunci yang bisa kamu terapkan:\n1️⃣ Visual yang Kuat\nPilih elemen visual yang menarik dan tetap relevan dengan tema.\n\n2️⃣ Komposisi yang Rapi\nAtur layout, tipografi, dan elemen desain agar nyaman dilihat dan mudah dipahami.\n\n3️⃣ Pesan yang Jelas\nSampaikan semangat “25 Tahun Demokrat Bersama Rakyat” lewat konsep yang kreatif dan inspiratif.\n\nSudah punya ide? Wujudkan jadi poster digital versimu! 🔥\n📐 Feed: 1080 × 1350 px\n📱 Story: 1080 × 1920 px\n✨ Maks. 2 karya\n📁 Aset resmi HUT ke-25 tersedia di link bio\n\n📅 26 Agustus – 4 September 2026\n🔗 Cek S&K: bit.ly/regulationcreativedmkrt\n\nKreasikan visimu, sampaikan semangatmu! 🎨\n\n#25TahunPartaiDemokrat \n#BersamaRakyat \n#DemokratCreativeChallenge \n#DesignPosterDemokrat",
    img:"https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/790425052_18092950013241648_4727952491622989146_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk3NjQ1MDczNjYxMzIwNzk1Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=O19wlmTgqiYQ7kNvwHKkxop&_nc_oc=AdruljdUe4qCUhtk_3ku4zXfVZLm1C0DNpZG_pWah1RXgBqiGNucUIi_294XVM-gA0g&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=YXo8SltiZ3AlvympYJVpXQ&_nc_ss=7a22e&oh=00_AQLYri4VRRPnPjtGoPGuiXShiQzRUf8D7_KrSfZeHma08w&oe=6A9F0A8A", v:"-", l:"4", c:"12", rp:"14", s:"8", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Tips poster","50%",32,"#22C55E"],["Tanya teknik","30%",19,"#3B82F6"],["Apresiasi","15%",9,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    rec:"Engagement terendah. Coba format berbeda atau Reels." },
  { topic:"H-3 menuju penutupan!", plat:"Instagram", type:"Image", poster:"@creativedemokrat", date:"1 Sep 2026", link:"instagram.com/p/DcvgYU2qqmS", slot:"thumbnail\nfeed",
    caption:"⏳ H-3 menuju penutupan!\n\nTinggal 3 hari lagi! 🔥 \nSudah punya karya? Jangan tunggu last minute!\n\n📅 Deadline: 4 September 2026\n🆓 GRATIS!\n\nUpload & kirimkan karyamu sekarang ke:\ncreativedemokrat@gmail.com\n\n#PartaiDemokrat\n#CreativeDemokrat\n#25TahunPartaiDemokrat\n#DemokratCreativeChallenge\n#BersamaRakyat",
    img:"https://scontent-waw2-2.cdninstagram.com/v/t51.82787-15/790945143_18092991836241648_2049937078608420964_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzk3NjUzOTQwNTEzOTIyNDk3OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=DN_GZiH5QUcQ7kNvwGiMCWd&_nc_oc=AdoMF0rEkkj1WpnFKl8EfLY7C5ATpPClyXZyKio6uGVwHr_M-DfWtLifufDpAVLvr74pwaIse4lAR70YUWvYdQpR&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-waw2-2.cdninstagram.com&_nc_gid=__JFunWRlciqW4k0kVxFWg&_nc_ss=7a22e&oh=00_AQLh1TGvMAZN_gJFVCQ4SGSPCZ_DNZrYbIAAkXi8cJ91Tg&oe=6A9F1CF2", v:"-", l:"342", c:"10", rp:"8", s:"51", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Urgensi deadline","65%",222,"#22C55E"],["Motivasi submit","30%",103,"#3B82F6"],["Reminder","20%",68,"#64748B"],["Keluhan mepet","5%",17,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    detail:{ v:"2.258", f:"35.6%", nf:"64.4%", home:"1.318", other:"29", profile:"911", viewers:"1.021",
      inter:"423", iF:"27.7%", iNF:"72.3%", likes:"344", shares:"51", saves:"10", comments:"10",
      engaged:"64", visits:"34", taps:"8", addr:"0", follows:"1" },
    rec:"Likes tinggi (342) meski komentar sedikit. Countdown format bekerja." },
  { topic:"PUNYA TEMEN YANG JAGO BIKIN LAGU? MENTION!", plat:"Instagram", type:"Carousel", poster:"@creativedemokrat", date:"2 Sep 2026", link:"instagram.com/p/DcyIw7VFIYn", slot:"thumbnail\ncarousel",
    caption:"PUNYA TEMEN YANG KATANYA JAGO BIKIN LAGU? MENTION SEKARANG SEBELUM KEHILANGAN KESEMPATAN DAPETIN TOTAL 20 JUTA!🔥\n\nPendaftaran ditutup 5 September 2026 alias SEBENTAR LAGU! Info lengkapnya cek di @creativedemokrat sekarang cepeeet! 🚀\n\n#indomusikgram",
    img:"https://instagram.fcia5-1.fna.fbcdn.net/v/t51.82787-15/789506536_18627424642051212_3348675778298318496_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=Mzk3NzI3OTMzMDMxNjYwNjkyOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=a_4S5NKTLIAQ7kNvwF7Y7V_&_nc_oc=AdqNEYm5mGNprHgd-mwii-71Ab0NTHNe6-74olElSeUpM2TEG6fPvJ-UZz7uCuS8ab4&_nc_ad=z-m&_nc_cid=1093&_nc_zt=23&_nc_ht=instagram.fcia5-1.fna&_nc_gid=Bfd0MeaDJqf0wTtMnVBahw&_nc_ss=7a22e&oh=00_AQJ3l2u1OeVkLdr2UGvuzMRoBjNzkr51bg3cwsHHWDur8g&oe=6A9F1A8F", v:"-", l:"N/A", c:"22", rp:"11", s:"52", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","50%","#22C55E"],["Netral","35%","#64748B"],["Negatif","15%","#DC2626"]],
    themes:[["Mention teman","60%",12,"#22C55E"],["Tanya deadline","30%",6,"#3B82F6"],["Diskusi","20%",4,"#64748B"],["Kritik","10%",2,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    collab:"@indomusikgram",
    rec:"Post terakhir. Likes hidden, komentar sedikit â€” mungkin audience lelah." },
  { topic:"SIAP JADI JUARA?", plat:"Instagram", type:"Image", poster:"@creativedemokrat", date:"2 Sep 2026", link:"instagram.com/p/DcyKOpQqRWn", slot:"thumbnail\nfeed",
    caption:"🏆 SIAP JADI JUARA?\nSaatnya tunjukkan kreativitasmu di Demokrat Creative Challenge 2026! ✨\n\nPilih kategorimu: \n🎨 Poster Digital\n📲 Video Pendek\n🎙️ Voice Over\n🎬 Bumper Logo HUT\n\nBuat karya terbaikmu, upload ke media sosial!\nKirimkan file karyamu ke:\n📧 creativedemokrat@gmail.com\nSubjek: NAMA PESERTA_KATEGORI LOMBA\n\n📅 26 Agustus–4 September 2026\n🆓 GRATIS & TERBUKA UNTUK UMUM\n🔗 Cek S&K: bit.ly/regulationcreativedmkrt\n\nWujudkan, kirim, dan buktikan karyamu! 🔥\n\n#PartaiDemokrat \n#CreativeDemokrat \n#25TahunPartaiDemokrat \n#DemokratCreativeChallenge \n#BersamaRakyat",
    img:"https://scontent-icn2-1.cdninstagram.com/v/t51.82787-15/793867330_18093331751241648_5679214505778991294_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk3NzI4NjQwNzc2MjI4NTk5MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMzI3Ny5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=6AEk0BS8YFkQ7kNvwG_AiiR&_nc_oc=Adrh3axIoPEbsvJYgyr-y4W5Ae-3QR11vhgHDVBoFrvLfz35-cLHOuZ0eka2W4TNPSc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_gid=xwc0r2VLp3bxhQShQ3wajg&_nc_ss=7a22e&oh=00_AQLT3XvemB5vRIi_VtEI-y2ZK2NCWJbZTeBepxnD-ak5qQ&oe=6A9F123C", v:"-", l:"117", c:"4", rp:"11", s:"10", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    sent:[["Positif","60%","#22C55E"],["Netral","30%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Motivasi juara","55%",63,"#22C55E"],["Tanya pengumuman","30%",34,"#3B82F6"],["Antusias","20%",23,"#64748B"],["Kritik","5%",6,"#DC2626"]],
    ins:[["-","Akun dijangkau"],["-","Impresi"],["-","Kunjungan profil"],["-","Pengikut baru"]],
    rows:[["-","-"],["-","-"],["-","-"],["-","-"]],
    detail:{ v:"4.426", f:"32.3%", nf:"67.7%", home:"2.890", other:"827", profile:"709", viewers:"1.949",
      inter:"148", iF:"58.3%", iNF:"41.7%", likes:"118", shares:"10", saves:"5", comments:"4",
      engaged:"123", visits:"100", taps:"20", addr:"0", follows:"7" },
    realComments:[
      { user:"aysa_chintia_rezki", text:"min, artinya besok hari terakhir yaa buat ikut lombanya? dan penutupan pendaftaran lomba tanggal 5 ya min?", likes:0 },
      { user:"daudvidian", text:"Udah siapp banget min \u{1F60D}\u{1F4AA}", likes:0 },
      { user:"mohammadsubur2022", text:"Min boleh krim Bannyak ga karyanya", likes:1,
        replies:[ { user:"creativedemokrat", text:"@mohammadsubur2022 peserta boleh mengikuti lebih dari 1 lomba ya kak \u{1F64C}" } ] }
    ],
    rec:"Post penutup. Likes solid, komentar rendah â€” CTA kurang engaging." },
  // TikTok posts
  { topic:"Satu panggung, lima medium, satu semangat!", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"26 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7678345806696484116", slot:"thumbnail\ntiktok", v:"143", l:"2", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/63c8c4668f904b36bc576f41faeafb58~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=lgeqvuXmPdWEFBrEpQEBuWUx1zY%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"Satu panggung, lima medium, satu semangat!\nSaatnya karya anak muda Indonesia bersinar di Demokrat Creative Challenge 2026",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["143","Views"],["2","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post pertama." },
  { topic:"DEMOKRAT BERNADA", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"27 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7678658930549001492", slot:"thumbnail\ntiktok", v:"217", l:"9", c:"2", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/4b5a21cfafae410e8313498769b933dc~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=P7yVfNU%2BgjoJSvFK%2FRl05wTyZ%2FI%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"DEMOKRAT BERNADA\nPunya sesuatu yang ingin kamu sampaikan? Sampaikan lewat nada.",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["217","Views"],["9","Likes"],["2","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"LOMBA BUMPER LOGO HUT - CREATIVE DEMOKRAT 2026", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"27 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7678709644520426773", slot:"thumbnail\ntiktok", v:"137", l:"2", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/6f570ea846804ce28bcb63aa6e8c1928~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=QOzDLzeNkKc4Tth8ncgt2quVSNo%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"LOMBA BUMPER LOGO HUT - CREATIVE DEMOKRAT 2026\n\nPunya ide motion yang bisa bikin sebuah logo jadi lebih hidup?",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["137","Views"],["2","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"TOTAL HADIAH PULUHAN JUTA RUPIAH MENANTIMU!", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"28 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7678978533305224468", slot:"thumbnail\ntiktok", v:"328", l:"10", c:"3", rp:"1", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/7a15031765aa461b8e96462e9f433ca7~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=o9wNsfWPRGF5SCo3nM4CTmqRGqo%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"TOTAL HADIAH PULUHAN JUTA RUPIAH MENANTIMU!\n\nPunya karya kreatif? Saatnya bawa karyamu ke Demokrat Creative Challenge 2026!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["328","Views"],["10","Likes"],["3","Comments"],["1","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","1"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"H-7 menuju penutupan!", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"28 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7679023810883980565", slot:"thumbnail\ntiktok", v:"428", l:"3", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/6cd7c26e87dc4df9b49bd32d41cfe60b~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=E4TmWyuZ5gfIOpb78voqbZBkea8%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"H-7 menuju penutupan!\n\nTinggal 7 hari lagi!\nSudah punya karya? Jangan tunggu last minute!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["428","Views"],["3","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"H-5 menuju penutupan!", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"30 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7679692637804465429", slot:"thumbnail\ntiktok", v:"310", l:"4", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/801473a1e3bf4d52bf8bb34b850202c2~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=qFPGpa%2FyExPtzU2aMuPRtPpLmlg%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"H-5 menuju penutupan!\n\nTinggal 5 hari lagi!\nSudah punya karya? Jangan tunggu last minute!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["310","Views"],["4","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"MAU VOICE OVER-MU TERDENGAR LEBIH MENARIK?", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"31 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7680093307095059733", slot:"thumbnail\ntiktok", v:"1160", l:"8", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/d8491927d8074fdf96c6eb46112e40cb~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=oQcJMZRByWKdszIBjtOww8i5%2B4I%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"MAU VOICE OVER-MU TERDENGAR LEBIH MENARIK?\n\nBukan cuma soal punya suara yang enak didengar.",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["1160","Views"],["8","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"Views tertinggi (1160). Konten edukasi VO resonan di TikTok." },
  { topic:"5 HARI LAGI BUAT IKUTAN DEMOKRAT BERNADA", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"31 Agu 2026", link:"tiktok.com/@creativedemokrat/video/7680175092269174024", slot:"thumbnail\ntiktok", v:"323", l:"12", c:"1", rp:"1", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/fbc6c49cec884a83a9f458af4cd27dcd~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=zWmPDh6NGDHTyYCLYiwaquq0bro%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"5 HARI LAGI BUAT IKUTAN DEMOKRAT BERNADA: Kompetisi Cipta Lagu Partai Demokrat!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["323","Views"],["12","Likes"],["1","Comments"],["1","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","1"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"LOGO BUMPER HUT", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"1 Sep 2026", link:"tiktok.com/@creativedemokrat/video/7680448917506477333", slot:"thumbnail\ntiktok", v:"218", l:"6", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/610c3093ece24eb394e13c6f059d6198~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=26X2tl6WO8gIEzGTpGTlkEwuFqM%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"LOGO BUMPER HUT\nDARI LOGO DIAM JADI ANIMASI BERKELAS!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["218","Views"],["6","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"H-3 menuju penutupan!", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"1 Sep 2026", link:"tiktok.com/@creativedemokrat/video/7680520446265101588", slot:"thumbnail\ntiktok", v:"204", l:"3", c:"0", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:false,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/ddc40c44ad8b412ea32690262fa1e9be~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=GnuwqAA6yGv%2F8wTXGbNweQkAI5Q%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"H-3 menuju penutupan!\n\nTinggal 3 hari lagi!\nSudah punya karya? Jangan tunggu last minute!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["204","Views"],["3","Likes"],["0","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
  { topic:"SIAP JADI JUARA?", plat:"TikTok", type:"Slideshow", poster:"@creativedemokrat", date:"2 Sep 2026", link:"tiktok.com/@creativedemokrat/video/7680903005662825736", slot:"thumbnail\ntiktok", v:"234", l:"5", c:"1", rp:"0", s:"-", sv:"-", er:"-", ret:"3 Sep 2026, 06:00 WIB", hot:true,
    img:"https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/43a25773b4274ebd835450ae6cf1dcdb~tplv-photomode-image.jpeg?dr=9616&x-expires=1788602400&x-signature=dNrZvzfAWBAwhCTmW3F0WhMDppo%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast5&ftpl=1",
    caption:"SIAP JADI JUARA?\nSaatnya tunjukkan kreativitasmu di Demokrat Creative Challenge 2026!",
    sent:[["Positif","55%","#22C55E"],["Netral","35%","#64748B"],["Negatif","10%","#DC2626"]],
    themes:[["Antusias","60%",30,"#22C55E"],["Tanya","30%",15,"#3B82F6"],["Diskusi","20%",10,"#64748B"],["Kritik","5%",3,"#DC2626"]],
    ins:[["234","Views"],["5","Likes"],["1","Comments"],["0","Shares"]],
    rows:[["Ditonton penuh","-"],["Rata-rata durasi tonton","-"],["Dibagikan","0"],["Klik tautan bio","-"]],
    rec:"TikTok post." },
];

// Executive Reports
const EXEC_LEVELS = [
  { q:"Apa yang telah dipublikasikan?",
    ind:"Jumlah karya masuk, peserta aktif, mata lomba, platform, penggunaan tagar resmi, sebaran wilayah, konsistensi jadwal submisi",
    sum:"Selama periode 26 Agustus\u20134 September 2026, Kreasi Biru menerima 148 karya dari 96 peserta di empat mata lomba, tayang di Instagram dan TikTok peserta dengan mention @creativedemokrat dan @pdemokrat. Tagar #demokratcreativechallenge digunakan pada 141 publikasi atau 95,3% dari karya yang masuk.",
    facts:[["Total karya masuk","148 karya dari 96 peserta (23 di antaranya mengikuti lebih dari satu mata lomba)"],["Kepatuhan tagar","141 karya (95,3%) memakai seluruh tagar wajib; 7 karya ditandai untuk klarifikasi admin"],["Sebaran wilayah","31 kota/kabupaten di 18 provinsi; 44% dari luar Jabodetabek"],["Konsistensi submisi","Puncak submisi H-2 penutupan (39% karya masuk pada 2\u20134 September)"],["Status kurasi","132 karya lolos seleksi administrasi; 16 gugur (format/durasi/hak cipta)"]],
    table:"Output Publikasi per Platform",
    rows:[["Karya tayang","86","62","148"],["Peserta aktif","61","48","96"],["Mata lomba terwakili","4","4","4"],["Kepatuhan tagar","95,3%","95,2%","95,3%"],["Rata-rata karya/peserta","1,4","1,3","1,5"],["Lolos seleksi admin","78","54","132"]] },
  { q:"Seberapa luas karya tersebar?",
    ind:"Reach, impressions, views, unique viewers, video completion rate, pertumbuhan mention",
    sum:"Seluruh karya peserta beserta repost kanal resmi menghasilkan 4,50 juta jangkauan dan 8,82 juta impresi. TikTok menyumbang 68% jangkauan berkat distribusi For You.",
    facts:[["Total jangkauan","4,50 juta akun unik lintas dua platform"],["Total impresi","8,82 juta tayangan"],["Pertumbuhan mention","+312% dibanding periode Juli 2026"],["Video completion rate","34,6% rata-rata seluruh karya video"],["Jangkauan berbayar","18,4% dari total (boost 6 karya pilihan)"]],
    table:"Exposure per Platform",
    rows:[["Jangkauan","1,42 jt","3,08 jt","4,50 jt"],["Impresi","2,94 jt","5,88 jt","8,82 jt"],["Views video","1,08 jt","4,16 jt","5,24 jt"],["Penonton unik","862rb","2,21 jt","3,07 jt"],["Completion rate","38,2%","31,4%","34,6%"],["Mention akun resmi","918","1.264","2.182"]] },
  { q:"Bagaimana audiens merespons?",
    ind:"Likes, komentar, share, save, engagement rate, rasio komentar bermakna",
    sum:"Interaksi terkumpul 612 ribu aksi dengan engagement rate rata-rata 14,1% terhadap views.",
    facts:[["Total interaksi","612.480 aksi (like, komentar, share, save)"],["Engagement rate","14,1% terhadap views; di atas target internal 10%"],["Komentar bermakna","68% komentar berisi opini atau pertanyaan, bukan emoji tunggal"],["Karya terbaik","\"Demokrat Muda Bicara\" \u2014 412,8rb views, 13,2% ER"],["Waktu tayang optimal","19.00\u201321.00 WIB (42% interaksi harian)"]],
    table:"Engagement per Platform",
    rows:[["Likes","184rb","286rb","470rb"],["Komentar","12,4rb","24,8rb","37,2rb"],["Share","18,6rb","42,1rb","60,7rb"],["Save","28,4rb","16,2rb","44,6rb"],["Engagement rate","14,4%","13,9%","14,1%"],["Balasan admin","1.240","1.860","3.100"]] },
  { q:"Bagaimana nada percakapan publik?",
    ind:"Distribusi sentimen, tema komentar dominan, isu negatif yang perlu direspons",
    sum:"Sentimen keseluruhan positif 61%, netral 28%, negatif 11%.",
    facts:[["Sentimen positif","61% \u2014 apresiasi panggung kreatif dan kualitas karya peserta"],["Sentimen netral","28% \u2014 pertanyaan teknis: syarat, tenggat, format"],["Sentimen negatif","11% \u2014 skeptisisme politis; 2,4% menyoroti transparansi penjurian"],["Respons panitia","3.100 balasan; rata-rata waktu respons 3,4 jam"],["Isu yang dieskalasi","4 komentar diteruskan ke tim hukum & kepatuhan"]],
    table:"Sentimen per Platform",
    rows:[["Positif","66%","55%","61%"],["Netral","27%","30%","28%"],["Negatif","7%","15%","11%"],["Komentar dianalisis","12,4rb","24,8rb","37,2rb"],["Waktu respons rata-rata","2,8 jam","3,9 jam","3,4 jam"],["Isu dieskalasi","1","3","4"]] },
  { q:"Siapa yang ikut menyebarkan?",
    ind:"Jumlah peserta yang repost, nano influencer aktif, user generated content turunan, duet/stitch",
    sum:"Advokasi tumbuh dari peserta sendiri: 96 peserta membagikan karyanya ke jaringan masing-masing, memicu 214 konten turunan.",
    facts:[["Peserta membagikan ulang","96 peserta, rata-rata 2,3 kanal per orang"],["Konten turunan","214 duet/stitch/repost dari akun di luar peserta"],["Nano influencer aktif","38 akun (1rb\u201310rb pengikut) ikut menyebarkan"],["Komunitas terlibat","11 komunitas film, desain, dan kreator kampus"],["Nilai media setara","Rp184 juta estimasi earned media value"]],
    table:"Advocacy per Platform",
    rows:[["Repost peserta","128","96","224"],["Duet / stitch","\u2014","164","164"],["Repost komunitas","32","18","50"],["Nano influencer aktif","21","17","38"],["Story mention","486","\u2014","486"],["Earned media value","Rp72 jt","Rp112 jt","Rp184 jt"]] },
  { q:"Apa hasil yang berubah pada kanal partai?",
    ind:"Pertumbuhan pengikut, kunjungan profil, klik tautan bio, pendaftaran peserta baru, retensi audiens",
    sum:"Kanal resmi tumbuh 16.052 pengikut baru dalam periode lomba, dengan 5.804 kunjungan profil dan 1.056 klik ke microsite pendaftaran.",
    facts:[["Pengikut baru","16.052 akun (IG 4.212 + TikTok 11.840)"],["Kunjungan profil","5.804 kunjungan lintas kanal"],["Klik microsite","1.056 klik; 612 menyelesaikan pendaftaran"],["Retensi audiens","74% pengikut baru masih aktif setelah 14 hari"],["Biaya per pengikut","Rp467 (dari anggaran boost Rp7,5 jt)"]],
    table:"Outcome per Platform",
    rows:[["Pengikut baru","4.212","11.840","16.052"],["Kunjungan profil","2.194","3.610","5.804"],["Klik tautan bio","402","654","1.056"],["Pendaftaran selesai","241","371","612"],["Retensi 14 hari","78%","72%","74%"],["Biaya per pengikut","Rp612","Rp398","Rp467"]] },
  { q:"Apa dampak jangka panjangnya bagi partai?",
    ind:"Arsip karya, persepsi publik, kaderisasi kreatif, kesiapan aset konten HUT",
    sum:"Kreasi Biru menghasilkan 132 karya siap pakai sebagai arsip konten partai berumur panjang, memperkenalkan 96 kreator baru ke ekosistem digital partai.",
    facts:[["Arsip karya","132 karya lolos kurasi siap dipakai ulang sepanjang 2026\u20132027"],["Talenta baru","96 kreator terdata; 24 direkomendasikan masuk jaringan Creative Demokrat"],["Aset HUT","Bumper logo terpilih dipakai pada seluruh video resmi HUT ke-25"],["Persepsi publik","Asosiasi \"partai modern & terbuka\" naik pada 61% komentar positif"],["Efisiensi anggaran","Rp63,5 jt apresiasi menghasilkan Rp184 jt earned media value (2,9\u00d7)"]],
    table:"Impact per Platform",
    rows:[["Karya masuk arsip","78","54","132"],["Kreator direkomendasikan","14","10","24"],["Aset dipakai ulang","31","22","53"],["Rasio EMV / biaya","2,4\u00d7","3,3\u00d7","2,9\u00d7"],["Kolaborasi lanjutan","6","5","11"],["Liputan media","4 media","3 media","7 media"]] },
];

// Nano influencer data
const NANO_ROWS = [
  { handle:"@rara.kreasi", plat:"Instagram", followers:"8,4rb", reposts:"6", reach:"142rb", status:"AKTIF" },
  { handle:"@bangdimasfilm", plat:"TikTok", followers:"9,1rb", reposts:"5", reach:"196rb", status:"AKTIF" },
  { handle:"@studio.senja", plat:"Instagram", followers:"4,6rb", reposts:"4", reach:"84rb", status:"AKTIF" },
  { handle:"@voice.of.nusa", plat:"TikTok", followers:"6,2rb", reposts:"3", reach:"118rb", status:"MENUNGGU" },
  { handle:"@kampuskreatif.id", plat:"Instagram", followers:"7,8rb", reposts:"2", reach:"62rb", status:"MENUNGGU" },
];


// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function makeCalendar(year: number, month: number, selectedDay: number) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells: { label: string; bg: string; color: string; weight: number; day: number }[] = [];
  for (let k = 0; k < lead; k++) cells.push({ label: "", bg: "transparent", color: "transparent", weight: 400, day: 0 });
  for (let d = 1; d <= total; d++) {
    const active = d === selectedDay;
    cells.push({ label: String(d), bg: active ? "#2563EB" : "transparent", color: active ? "#fff" : "#CBD5E1", weight: active ? 800 : 500, day: d });
  }
  return cells;
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TabButton({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon: React.ElementType }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-sm font-extrabold tracking-tight transition-all whitespace-nowrap"
      style={active
        ? { background: "#2563EB", color: "#fff" }
        : { background: "transparent", color: "#64748B" }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: active ? "#fff" : "#475569" }} />
      {label}
    </button>
  );
}

function StatCard({ label, value, color = "#F1F5F9" }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
      <div className="text-[9.5px] font-extrabold tracking-wider" style={{ color: "#64748B" }}>{label}</div>
      <div className="text-lg font-extrabold mt-1 tabular-nums" style={{ color }}>{value}</div>
    </div>
  );
}

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide"
      style={{ color, background: bg, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

// â”€â”€â”€ Ringkasan Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RingkasanTab() {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Header card */}
      <div className="flex gap-3.5">
        <div className="flex-[1.5] rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
          <div className="text-[9.5px] font-extrabold tracking-widest" style={{ color: "#64748B" }}>LOMBA BERBASIS DIGITAL & RANGKAIAN HUT KE-25 PARTAI DEMOKRAT</div>
          <div className="text-2xl font-extrabold mt-2 tracking-tight" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kreasi Biru 2026</div>
          <div className="text-sm mt-1.5" style={{ color: "#CBD5E1" }}>Lomba Kreator Digital &mdash; Suara Kreatif untuk 25 Tahun Demokrat Bersama Rakyat.</div>
          <div className="text-xs mt-3 leading-relaxed" style={{ color: "#94A3B8" }}>
            Kreasi Biru membuka panggung bagi kreativitas publik: mengubah generasi muda dari penonton menjadi pembuat cerita, dengan bahasa dan medium mereka sendiri. Project ini memantau seluruh karya yang tayang di kanal peserta melalui tagar dan mention resmi.
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            {GOALS.map((g, i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                <div className="text-xs font-extrabold" style={{ color: "#93C5FD" }}>{g.title}</div>
                <div className="text-[11px] mt-1 leading-relaxed" style={{ color: "#94A3B8" }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3.5">
          {/* Hashtags */}
          <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <div className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>TAGAR & MENTION RESMI YANG DIPANTAU</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {HASHTAGS.map((h, i) => (
                <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded"
                  style={{ color: h.color, background: h.bg, border: `1px solid ${h.border}` }}>
                  {h.label}
                </span>
              ))}
            </div>
            <div className="text-[11px] mt-3 leading-relaxed" style={{ color: "#64748B" }}>
              Karya wajib diunggah di akun Instagram dan TikTok peserta yang aktif, memakai seluruh tagar dan mention di atas. Pembelian views/engagement berakibat diskualifikasi.
            </div>
          </div>

          {/* Weights */}
          <div className="rounded-xl p-4 flex-1" style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <div className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>BOBOT PENILAIAN UMUM</div>
            <div className="flex flex-col gap-2.5 mt-3">
              {WEIGHTS.map((w, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="flex-1 text-[11.5px]" style={{ color: "#CBD5E1" }}>{w.label}</span>
                  <span className="shrink-0 w-[150px] h-[7px] rounded overflow-hidden" style={{ background: "#0B1220" }}>
                    <span className="block h-full rounded" style={{ width: w.width, background: w.color }} />
                  </span>
                  <span className="shrink-0 w-[34px] text-right text-[11.5px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{w.width}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] mt-3 leading-relaxed" style={{ color: "#64748B" }}>
              Penjurian berlapis: juri internal DPP, praktisi/asosiasi sesuai kategori, dan penilaian publik untuk kategori terfavorit.
            </div>
          </div>
        </div>
      </div>

      {/* Contest categories */}
      <div>
        <div className="text-[11px] font-extrabold tracking-wider mb-2.5" style={{ color: "#CBD5E1" }}>EMPAT MATA LOMBA</div>
        <div className="grid grid-cols-4 gap-3">
          {CONTESTS.map((c) => (
            <div key={c.num} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#111827", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold"
                  style={{ background: "rgba(37,99,235,.16)", border: "1px solid rgba(37,99,235,.45)", color: "#93C5FD" }}>{c.num}</span>
                <span className="text-[13.5px] font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>{c.title}</span>
              </div>
              <div className="text-[10.5px] font-bold" style={{ color: "#93C5FD" }}>{c.spec}</div>
              <div className="text-[11.5px] leading-relaxed" style={{ color: "#94A3B8" }}>{c.desc}</div>
              <div className="flex flex-col gap-1 mt-0.5">
                {c.rules.map((r, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: "#475569" }} />
                    <span className="text-[11px] leading-snug" style={{ color: "#CBD5E1" }}>{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-2.5 border-t flex items-baseline gap-2" style={{ borderColor: "#1E293B" }}>
                <span className="text-[10px] font-bold tracking-wider" style={{ color: "#64748B" }}>HADIAH J1&ndash;J3</span>
                <span className="ml-auto text-[11.5px] font-extrabold" style={{ color: "#F1F5F9" }}>{c.prize}</span>
              </div>
              <div className="text-[10px]" style={{ color: "#64748B" }}>Tagar khusus: <span className="font-bold" style={{ color: "#93C5FD" }}>{c.tag}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline + Budget + Jury */}
      <div className="flex gap-3.5">
        <div className="flex-[1.4] rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
          <div className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>KALENDER INDUK</div>
          <div className="flex flex-col mt-3">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-3 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(30,41,59,.8)" : "none" }}>
                <span className="shrink-0 w-[150px] text-[11px] font-extrabold leading-snug" style={{ color: t.dateColor }}>{t.date}</span>
                <span className="shrink-0 w-2.5 h-2.5 rounded-full mt-1" style={{ background: t.dot }} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[12.5px] font-extrabold" style={{ color: "#F1F5F9" }}>{t.title}</span>
                  <span className="block text-[11px] mt-0.5 leading-relaxed" style={{ color: "#94A3B8" }}>{t.desc}</span>
                </span>
                <Badge label={t.badge} color={t.badgeColor} bg={t.badgeBg} border={t.badgeBorder} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3.5">
          <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <div className="flex items-baseline gap-2.5">
              <span className="flex-1 text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>ANGGARAN APRESIASI</span>
              <span className="shrink-0 text-lg font-extrabold" style={{ color: "#93C5FD" }}>Rp63,5 jt</span>
            </div>
            {BUDGET.map((b, i) => (
              <div key={i} className="flex items-baseline gap-2.5 py-1.5 border-t mt-1.5" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                <span className="flex-1 text-[11.5px]" style={{ color: "#CBD5E1" }}>{b.label}</span>
                <span className="shrink-0 text-[11.5px] font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{b.value}</span>
              </div>
            ))}
            <div className="text-[10.5px] mt-2.5 leading-relaxed" style={{ color: "#64748B" }}>
              Termasuk penghargaan terfavorit pilihan publik Rp2 jt per kategori dan lain-lain Rp20 jt. Angka simulasi.
            </div>
          </div>

          <div className="rounded-xl p-4 flex-1" style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <div className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>DEWAN JURI (ANCHOR ASOSIASI)</div>
            {JURY.map((j, i) => (
              <div key={i} className="flex gap-2.5 py-2 border-t mt-2" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                <span className="shrink-0 w-[104px] text-[11px] font-extrabold leading-snug" style={{ color: "#93C5FD" }}>{j.cat}</span>
                <span className="flex-1 text-[11px] leading-snug" style={{ color: "#CBD5E1" }}>{j.body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Content Hub Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ContentHubTab() {
  const [query, setQuery] = useState("");
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [dates, setDates] = useState<Record<string, { d: number; m: number; y: number; h: number; min: number }>>({});

  const filtered = query.trim()
    ? PIPELINE.filter(f => (f.topic + " " + f.creator + " " + f.role + " " + f.hashtags.join(" ")).toLowerCase().includes(query.toLowerCase()))
    : PIPELINE;

  const getDate = (f: PipelineItem) => dates[f.key] ?? { d: f.d, m: 8, y: 2026, h: f.h, min: f.min };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs leading-relaxed" style={{ color: "#CBD5E1" }}>
        Ruang kerja produksi konten kanal resmi: dari ide dan brief, produksi, review internal, sampai siap tayang. Konten yang sudah publish otomatis masuk ke Campaign Monitoring.
      </div>

      {/* Stage cards */}
      <div className="grid grid-cols-4 gap-3">
        {HUB_STAGES.map((s, i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: "#111827", border: "1px solid #1E293B", borderTopWidth: 2, borderTopColor: s.color }}>
            <div className="flex items-baseline gap-2">
              <span className="flex-1 text-xs font-extrabold" style={{ color: "#F1F5F9" }}>{s.label}</span>
              <span className="text-lg font-extrabold tabular-nums" style={{ color: s.color }}>{s.count}</span>
            </div>
            <div className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "#94A3B8" }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Pipeline table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,.12)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-base font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Content Production Pipeline ({filtered.length})</div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 w-[230px]" style={{ background: "#111827", border: "1px solid #334155" }}>
              <Search className="w-3.5 h-3.5" style={{ color: "#64748B" }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari konten atau kreator..."
                className="flex-1 bg-transparent border-0 outline-none text-xs" style={{ color: "#F1F5F9" }} />
              {query && <button onClick={() => setQuery("")}><X className="w-3 h-3" style={{ color: "#94A3B8" }} /></button>}
            </div>
            <button className="text-xs font-extrabold px-3.5 py-2 rounded-lg text-white whitespace-nowrap"
              style={{ background: "linear-gradient(180deg,#3B82F6,#1D4ED8)", border: "1px solid #60A5FA" }}>
              + Create Topic
            </button>
          </div>
        </div>

        {/* Header row */}
        <div className="grid text-[11px] font-extrabold tracking-wider"
          style={{ gridTemplateColumns: "44px 100px 1.5fr 1.4fr 1fr 1.3fr 1.4fr 1fr 42px", color: "#CBD5E1", background: "#0B1220", borderTop: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(37,99,235,.6)" }}>
          {["NO.","THUMBNAIL","TOPICS & HASHTAG","CONTENT CREATORS","DIGITAL ASSET LINKS","POST SCHEDULE","CONTENT TYPE","PROGRESS",""].map((h, i) => (
            <div key={i} className="px-2 py-2.5 text-center leading-tight" style={{ borderRight: i < 8 ? "1px solid rgba(255,255,255,.07)" : "none" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: "#94A3B8" }}>Tidak ada konten atau kreator yang cocok dengan pencarian.</div>
        )}
        {filtered.map((f, i) => {
          const v = getDate(f);
          return (
            <div key={f.key} className="grid items-stretch"
              style={{ gridTemplateColumns: "44px 100px 1.5fr 1.4fr 1fr 1.3fr 1.4fr 1fr 42px", background: i % 2 === 1 ? "rgba(255,255,255,.015)" : "transparent" }}>
              <div className="flex items-center px-3 py-3 text-xs font-bold tabular-nums" style={{ color: "#64748B", borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex items-center justify-center px-2 py-2" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div className={`rounded flex items-center justify-center font-mono text-[8.5px] text-center leading-tight ${f.video ? "w-[86px] h-12" : "w-[54px] h-[90px]"}`}
                  style={{ background: "repeating-linear-gradient(45deg,#1E293B,#1E293B 6px,#334155 6px,#334155 12px)", color: "#64748B" }}>
                  {f.slot.split("\n").map((l, j) => <span key={j} className="block">{l}</span>)}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-1 px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div className="text-xs font-bold leading-snug" style={{ color: "#F1F5F9" }}>{f.topic}</div>
                <div className="flex flex-wrap gap-1.5">
                  {f.hashtags.map((t, j) => <span key={j} className="text-[11.5px]" style={{ color: "#60A5FA" }}>{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: f.avatar }}>
                  {f.creator.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-bold truncate" style={{ color: "#F1F5F9" }}>{f.creator}</span>
                  <span className="block text-[11px]" style={{ color: "#64748B" }}>{f.role}</span>
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5 px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                {[{ l: "Drive", c: "#FBBF24", bg: "rgba(251,191,36,.12)", b: "rgba(251,191,36,.45)" },
                  { l: "Canva", c: "#60A5FA", bg: "rgba(96,165,250,.12)", b: "rgba(96,165,250,.45)" },
                  { l: "CapCut", c: "#4ADE80", bg: "rgba(74,222,128,.12)", b: "rgba(74,222,128,.45)" }
                ].map((a, j) => (
                  <span key={j} className="text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer whitespace-nowrap"
                    style={{ color: a.c, background: a.bg, border: `1px solid ${a.b}` }}>{a.l}</span>
                ))}
              </div>
              <div className="relative flex items-center px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <button onClick={() => setOpenDate(openDate === f.key ? null : f.key)}
                  className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2 py-1.5"
                  style={{ background: "#1E293B", border: "1px solid #334155", color: "#CBD5E1" }}>
                  <Calendar className="w-3 h-3" style={{ color: "#60A5FA" }} />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[11.5px]">{v.d} {MONTHS_ID[v.m]} {v.y}</span>
                    <span className="text-[11px]" style={{ color: "#94A3B8" }}>{String(v.h).padStart(2, "0")}.{String(v.min).padStart(2, "0")} WIB</span>
                  </span>
                  <ChevronDown className="w-2.5 h-2.5" style={{ color: "#64748B" }} />
                </button>
                {openDate === f.key && (
                  <div className="absolute left-0 top-full mt-1.5 z-20 rounded-lg p-3 w-[242px]"
                    style={{ background: "#111827", border: "1px solid #334155", boxShadow: "0 14px 34px rgba(0,0,0,.55)" }}>
                    <div className="flex items-center justify-between">
                      <button className="w-6 h-6 rounded flex items-center justify-center text-[11px]"
                        style={{ background: "#1E293B", color: "#CBD5E1" }}
                        onClick={() => setDates(d => ({ ...d, [f.key]: { ...getDate(f), m: Math.max(0, getDate(f).m - 1) } }))}>&#8249;</button>
                      <div className="text-xs font-bold" style={{ color: "#F1F5F9" }}>{MONTHS_ID[v.m]} {v.y}</div>
                      <button className="w-6 h-6 rounded flex items-center justify-center text-[11px]"
                        style={{ background: "#1E293B", color: "#CBD5E1" }}
                        onClick={() => setDates(d => ({ ...d, [f.key]: { ...getDate(f), m: Math.min(11, getDate(f).m + 1) } }))}>&#8250;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 mt-2">
                      {["S","S","R","K","J","S","M"].map((w, j) => <div key={j} className="text-center text-[9px] font-bold pb-0.5" style={{ color: "#64748B" }}>{w}</div>)}
                      {makeCalendar(v.y, v.m, v.d).map((c, j) => (
                        <button key={j} className="h-6 rounded flex items-center justify-center text-[11px]"
                          style={{ background: c.bg, color: c.color, fontWeight: c.weight }}
                          onClick={() => { if (c.day) { setDates(d => ({ ...d, [f.key]: { d: c.day, m: v.m, y: v.y, h: v.h, min: v.min } })); setOpenDate(null); } }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[9.5px] font-bold tracking-wider mt-2 pt-2" style={{ color: "#64748B", borderTop: "1px solid #1E293B" }}>
                      <span>JAM</span>
                      <select value={v.h} onChange={e => setDates(d => ({ ...d, [f.key]: { ...getDate(f), h: Number(e.target.value) } }))}
                        className="flex-1 rounded px-1.5 py-1.5 text-xs font-normal"
                        style={{ background: "#0F172A", color: "#fff", border: "1px solid #334155" }}>
                        {Array.from({ length: 24 }, (_, k) => <option key={k} value={k}>{String(k).padStart(2, "0")}</option>)}
                      </select>
                      <span style={{ color: "#94A3B8" }}>:</span>
                      <select value={v.min} onChange={e => setDates(d => ({ ...d, [f.key]: { ...getDate(f), min: Number(e.target.value) } }))}
                        className="flex-1 rounded px-1.5 py-1.5 text-xs font-normal"
                        style={{ background: "#0F172A", color: "#fff", border: "1px solid #334155" }}>
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(k => <option key={k} value={k}>{String(k).padStart(2, "0")}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t" style={{ borderColor: "#1E293B" }}>
                      <button onClick={() => setOpenDate(null)} className="text-[11.5px] font-bold px-3 py-1.5 rounded"
                        style={{ color: "#CBD5E1", border: "1px solid #334155" }}>Close</button>
                      <button onClick={() => setOpenDate(null)} className="text-[11.5px] font-bold px-3 py-1.5 rounded text-white"
                        style={{ background: "#2563EB" }}>Set</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-1 px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "#CBD5E1" }}>
                  <span className="w-4 h-4 flex items-center justify-center"><svg viewBox="0 0 24 24" width="14" height="14" fill="#F04E23" fillRule="evenodd"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"/></svg></span>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{f.igType}</span>
                </div>
                <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "#CBD5E1" }}>
                  <span className="w-4 h-4 flex items-center justify-center"><svg viewBox="0 0 24 24" width="14" height="14" fill="#F1F5F9" fillRule="evenodd"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"/></svg></span>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{f.ttType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-3" style={{ borderRight: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `conic-gradient(#3B82F6 ${f.pct}, rgba(255,255,255,.1) 0)` }}>
                  <div className="w-[31px] h-[31px] rounded-full flex items-center justify-center text-[10px] font-extrabold tabular-nums"
                    style={{ background: "#0F172A", color: "#93C5FD" }}>{f.pct}</div>
                </div>
                <span className="text-[11.5px] tabular-nums" style={{ color: "#94A3B8" }}>{f.steps} Steps</span>
              </div>
              <div className="relative flex items-center justify-center px-2 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <button onClick={() => setOpenMenu(openMenu === f.key ? null : f.key)}
                  className="w-7 h-7 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                  style={{ color: "#94A3B8", background: openMenu === f.key ? "#1E293B" : "transparent" }}>
                  <span className="w-[3px] h-[3px] rounded-full bg-current" />
                  <span className="w-[3px] h-[3px] rounded-full bg-current" />
                  <span className="w-[3px] h-[3px] rounded-full bg-current" />
                </button>
                {openMenu === f.key && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 rounded-lg p-1 w-[132px]"
                    style={{ background: "#111827", border: "1px solid #334155", boxShadow: "0 14px 34px rgba(0,0,0,.55)" }}>
                    {["View", "Edit", "Save", "Delete"].map(l => (
                      <button key={l} onClick={() => setOpenMenu(null)}
                        className="block w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded cursor-pointer"
                        style={{ color: l === "Delete" ? "#EF4444" : "#CBD5E1" }}>{l}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official assets */}
      <div className="rounded-lg p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
        <div className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>ASET RESMI HUT KE-25</div>
        <div className="grid grid-cols-4 gap-x-4">
          {HUB_ASSETS.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 mt-2.5" style={{ borderTop: "1px solid rgba(30,41,59,.8)" }}>
              <span className="w-8 h-8 shrink-0 rounded-lg" style={{ background: "repeating-linear-gradient(45deg,#1E293B,#1E293B 5px,#334155 5px,#334155 10px)" }} />
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-extrabold" style={{ color: "#F1F5F9" }}>{a.label}</span>
                <span className="block text-[10.5px] mt-0.5" style={{ color: "#94A3B8" }}>{a.desc}</span>
              </span>
              <Download className="w-3.5 h-3.5 shrink-0" style={{ color: "#64748B" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Campaign Monitoring Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CampaignMonitoringTab() {
  const [filter, setFilter] = useState(0); // 0=IG, 1=TT
  const [selIdx, setSelIdx] = useState(0);
  const [tab, setTab] = useState(0); // 0=Content, 1=Comments, 2=Analysis
  const [openCaption, setOpenCaption] = useState<string | null>(null);
  const [openReply, setOpenReply] = useState<string | null>(null);
  const leftListRef = useRef<HTMLDivElement>(null);
  const [panelTop, setPanelTop] = useState(0);

  const handleSelect = (i: number) => {
    setSelIdx(i);
    // Align right panel to the same scroll position as the clicked card
    requestAnimationFrame(() => {
      const listEl = leftListRef.current;
      if (!listEl) return;
      const cards = listEl.querySelectorAll<HTMLElement>("[data-mm-card]");
      const card = cards[i];
      if (!card) return;
      const wrap = listEl.parentElement; // the relative flex container
      if (wrap) {
        const cardTop = card.getBoundingClientRect().top - wrap.getBoundingClientRect().top;
        setPanelTop(cardTop);
      }
    });
  };

  const wantPlat = filter === 0 ? "Instagram" : "TikTok";
  const allRows = POSTS.filter(p => p.plat === wantPlat).slice().reverse(); // newest first
  const rows = allRows;
  const p = rows[selIdx] ?? rows[0] ?? allRows[0];

  return (
    <div>
      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
        <div className="text-xs leading-relaxed min-w-0" style={{ color: "#CBD5E1" }}>
          Data yang ditampilkan untuk hari ini merupakan hasil scrap berkala pada pukul 06.00, 12.00, 18.00, dan 23.59 WIB. Data akan disimpan sebagai catatan harian.
        </div>
        <button onClick={() => { setSelIdx(0); }}
          className="ml-auto shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "#111827", border: "1px solid #334155", color: "#CBD5E1" }}>
          <span className="mr-1">&#8249;</span>Previous Day
        </button>
        <button onClick={() => { toast.success("Data saved as daily record"); }}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "#1D4ED8", color: "#fff" }}>
          Save Data
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3.5">
        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#60A5FA" }} />
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg" style={{ background: "#111827", border: "1px solid #334155", color: "#CBD5E1" }}>
          Data scraped on — Kamis, 3 September 2026
        </span>
      </div>

      {/* Account cards */}
      <div className="flex gap-3.5 mb-4">
        {[
          { plat: "Instagram", ring: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
            stats: [["POSTS", "18", "15 Agu – 3 Sep 2026", ""], ["FOLLOWERS", "543", "as of 3 Sep 2026", "+1.3% vs yesterday"], ["FOLLOWING", "2", "as of 3 Sep 2026", ""]] },
          { plat: "TikTok", ring: "linear-gradient(135deg,#25F4EE,#0B1220 55%,#FE2C55)",
            stats: [["FOLLOWING", "0", "as of 3 Sep 2026", ""], ["FOLLOWERS", "68", "as of 3 Sep 2026", "+4.6% vs yesterday"], ["LIKES", "70", "15 Agu – 3 Sep 2026", ""]] },
        ].map((a) => (
          <div key={a.plat} className="flex-1 rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: a.ring }}>
                {a.plat === "Instagram" ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" fillRule="evenodd"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" fillRule="evenodd"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"/></svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold" style={{ color: "#F1F5F9" }}>@creativedemokrat</div>
                <div className="text-[10.5px] mt-0.5" style={{ color: "#64748B" }}>Demokrat Creative Challenge</div>
              </div>
              <span className="text-[10px] font-extrabold tracking-wider px-2 py-1 rounded shrink-0"
                style={{ color: "#4ADE80", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.4)" }}>AKTIF</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0 cursor-pointer"
                style={{ background: "#0F172A", border: "1px solid #334155" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" style={{ flex: "none" }}><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>
                <span className="text-[10.5px] font-bold text-nowrap" style={{ color: "#CBD5E1" }}>as of 3 Sep 2026</span>
                <span className="text-[8px]" style={{ color: "#64748B" }}>▾</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden mt-3" style={{ background: "#1E293B", border: "1px solid #1E293B" }}>
              {a.stats.map((s, j) => (
                <div key={j} className="text-center py-2.5" style={{ background: "#0F172A" }}>
                  <div className="text-[8.5px] font-extrabold tracking-wider" style={{ color: "#64748B" }}>{s[0]}</div>
                  <div className="text-base font-extrabold mt-1 tabular-nums" style={{ color: "#F1F5F9" }}>{s[1]}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "#64748B" }}>{s[2]}</div>
                  {s[3] && <div className="text-[9px] font-bold mt-0.5" style={{ color: "#4ADE80" }}>{s[3]}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex gap-4 items-start">
        {/* Left: content list */}
        <div ref={leftListRef} className="shrink-0 w-[660px] flex flex-col gap-2.5">
          {/* Platform filter */}
          <div className="flex gap-1 border-b pb-1.5" style={{ borderColor: "rgba(37,99,235,.32)" }}>
            {["Instagram", "TikTok"].map((label, i) => (
              <button key={i} onClick={() => { setFilter(i); setSelIdx(0); }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-sm font-extrabold tracking-tight"
                style={filter === i
                  ? { background: "#2563EB", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,.45)" }
                  : { background: "transparent", color: "#64748B" }}>
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  {i === 0 ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill={filter === i ? "#fff" : "#475569"} fillRule="evenodd"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill={filter === i ? "#fff" : "#475569"} fillRule="evenodd"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"/></svg>
                  )}
                </span>
                {label}
              </button>
            ))}
            <span className="ml-auto text-[11px] pb-1.5" style={{ color: "#64748B" }}>{rows.length} posts</span>
          </div>

          {/* Content cards */}
          {rows.map((m, i) => {
            const on = m === p;
            return (
              <button key={i} data-mm-card onClick={() => handleSelect(i)}
                className="relative rounded-2xl p-4 text-left flex flex-col gap-3 cursor-pointer transition-all"
                style={{
                  background: on ? "#111C2E" : "#111827",
                  border: `1px solid ${on ? "#2563EB" : "#1E293B"}`,
                  boxShadow: on ? "0 0 0 3px rgba(37,99,235,.14)" : "0 1px 2px rgba(0,0,0,.3)",
                }}>
                <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{ background: on ? "#2563EB" : (m.plat === "Instagram" ? "#DD2A7B" : "#25F4EE") }} />

                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full shrink-0 text-[10px] font-extrabold tabular-nums"
                    style={{ background: "rgba(37,99,235,.16)", border: "1px solid rgba(37,99,235,.45)", color: "#93C5FD" }}>
                    #{String(rows.length - i).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2 px-2 py-1 rounded-lg text-[10.5px] font-extrabold"
                    style={{ background: "#0B1220", border: "1px solid #1E293B", color: "#F1F5F9" }}>
                    {m.plat === "Instagram" ? (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="#F04E23" fillRule="evenodd"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="#F1F5F9" fillRule="evenodd"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"/></svg>
                    )}
                    {m.plat} | {m.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: "#64748B" }}>
                    <span style={{ color: "#475569" }}>ER by views</span>
                    <span className="text-[11.5px] font-extrabold tabular-nums" style={{ color: "#93C5FD" }}>{m.er}</span>
                  </span>
                  {m.hot && on && (
                    <span className="ml-auto flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg text-white"
                      style={{ background: "linear-gradient(180deg,#3B82F6,#1D4ED8)", border: "1px solid #93C5FD" }}>
                      <TrendingUp className="w-3 h-3" /> More Information
                    </span>
                  )}
                </div>

                <div className="flex gap-3.5">
                  <div className="shrink-0 w-[104px] h-24 rounded-lg flex items-center justify-center font-mono text-[8.5px] text-center leading-tight overflow-hidden"
                    style={{ background: m.img ? "transparent" : "repeating-linear-gradient(45deg,#1E293B,#1E293B 6px,#334155 6px,#334155 12px)", color: "#94A3B8" }}>
                    {m.img ? (
                      <img src={m.img} alt={m.topic} className="w-full h-full object-cover" />
                    ) : (
                      m.slot.split("\n").map((l, j) => <span key={j} className="block">{l}</span>)
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap text-[10.5px]" style={{ color: "#64748B" }}>
                      <span className="font-extrabold text-[11.5px]" style={{ color: "#F1F5F9" }}>{m.poster}</span>
                      <span style={{ color: "#334155" }}>|</span>
                      <a href={m.href || ("https://www." + m.link)} target="_blank" rel="noopener" className="font-bold no-underline hover:underline" style={{ color: "#60A5FA" }}>{m.link}</a>
                      <span style={{ color: "#334155" }}>|</span>
                      <span>Posted on {m.date}</span>
                    </div>
                    <div className="text-[13.5px] font-extrabold tracking-tight leading-snug" style={{ color: "#F1F5F9" }}>{m.topic}</div>
                    {m.caption && (
                      <div className="rounded-lg p-2.5 mt-1" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                        <div className="text-[9px] font-extrabold tracking-widest" style={{ color: "#64748B" }}>CAPTION</div>
                        <div className="text-[11.5px] font-semibold leading-relaxed mt-1.5 whitespace-pre-line" style={{ color: "#E2E8F0" }}>
                          {openCaption === m.topic ? m.caption : m.caption.length > 140 ? m.caption.substring(0, 140) + "\u2026" : m.caption}
                        </div>
                        {m.caption.length > 140 && (
                          <button onClick={(e) => { e.stopPropagation(); setOpenCaption(openCaption === m.topic ? null : m.topic); }}
                            className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold mt-2 cursor-pointer"
                            style={{ color: "#60A5FA" }}>
                            {openCaption === m.topic ? "Show Less" : "Show More"}
                            <span className="text-[9px]">{openCaption === m.topic ? "\u25B2" : "\u25BC"}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 rounded-lg overflow-hidden" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                  {[{ l: "LIKES", v: m.l }, { l: "COMMENTS", v: m.c }, { l: "REPOST", v: m.rp }, { l: "SHARES", v: m.s }].map((s, j) => (
                    <div key={j} className="px-1.5 py-2.5 text-center" style={{ borderLeft: j > 0 ? "1px solid #1E293B" : "none" }}>
                      <div className="text-[8.5px] font-extrabold tracking-wider" style={{ color: "#64748B" }}>{s.l}</div>
                      <div className="text-base font-extrabold mt-1 tabular-nums" style={{ color: "#F1F5F9" }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail panel — follows the selected card position (no sticky, no jump-to-top) */}
        <div className="absolute left-[676px] right-0 transition-[top] duration-300 ease-out rounded-xl overflow-hidden"
          style={{ top: panelTop, background: "#0F172A", border: "1px solid #1E293B" }}>
          <div className="px-4 py-3.5 border-b" style={{ background: "#0B1220", borderColor: "#1E293B" }}>
            <div className="text-[11.5px] font-extrabold mb-2.5" style={{ color: "#F1F5F9" }}>{p.topic} &mdash; {p.plat} {p.type}</div>
            {p.collab && (
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                <span className="inline-flex items-center text-[10.5px] font-extrabold px-2 py-1 rounded-lg"
                  style={{ color: "var(--ch-orange)", background: "rgba(245,132,31,.12)", border: "1px solid rgba(245,132,31,.4)" }}>
                  Collaboration with @{p.collab.replace("@", "")}
                </span>
                <span className="inline-flex items-center text-[10.5px] font-bold px-2 py-1 rounded-lg"
                  style={{ color: "#FBBF24", background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.35)" }}>
                  Request data from @{p.collab.replace("@", "")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {["Content Insights", "Comments", "Analysis"].map((label, i) => (
                <button key={i} onClick={() => setTab(i)}
                  className="flex-1 text-center text-[11.5px] font-extrabold py-2 rounded-lg"
                  style={{
                    background: tab === i ? "rgba(37,99,235,.14)" : "#0F172A",
                    border: `1px solid ${tab === i ? "#2563EB" : "#1E293B"}`,
                    color: tab === i ? "#93C5FD" : "#94A3B8",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 max-h-none overflow-y-auto">
            {/* Content Insights tab */}
            {tab === 0 && (
              <>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#60A5FA" }} />
                  <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg" style={{ background: "#111827", border: "1px solid #334155", color: "#CBD5E1" }}>
                    Data fetched on — {p.ret}
                  </span>
                </div>

                {/* Views */}
                <div className="rounded-lg p-4" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Views</span>
                    <Info className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </div>
                  <div className="flex items-baseline justify-between mt-4">
                    <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Views</span>
                    <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail ? p.detail.v : p.v}</span>
                  </div>
                  {p.detail && (
                    <>
                      <div className="flex flex-col gap-2.5 mt-3">
                        {[{ label: "Followers", pct: p.detail.f }, { label: "Non-followers", pct: p.detail.nf }].map((v, i) => (
                          <div key={i} className="flex flex-col gap-1.5">
                            <span className="text-xs" style={{ color: "#CBD5E1" }}>{v.label}</span>
                            <div className="flex items-center gap-2.5">
                              <span className="flex-1 h-2 rounded overflow-hidden" style={{ background: "#E2E8F0" }}>
                                <span className="block h-full rounded" style={{ width: v.pct, background: i === 0 ? "#D946EF" : "#6D28D9" }} />
                              </span>
                              <span className="shrink-0 w-14 text-right text-xs font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v.pct}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-px my-4" style={{ background: "#1E293B" }} />
                      <div className="flex flex-col">
                        {[{ label: "From Home", value: p.detail.home }, { label: "From Other", value: p.detail.other }, { label: "From Profile", value: p.detail.profile }].map((v, i) => (
                          <div key={i} className="flex items-baseline justify-between py-2">
                            <span className="text-xs" style={{ color: "#CBD5E1" }}>{v.label}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="h-px my-4" style={{ background: "#1E293B" }} />
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Viewers</span>
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail.viewers}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Interactions */}
                <div className="rounded-lg p-4" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Interactions</span>
                    <Info className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </div>
                  <div className="flex items-baseline justify-between mt-4">
                    <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Interactions</span>
                    <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail ? p.detail.inter : p.ins[0]?.[0] ?? "-"}</span>
                  </div>
                  {p.detail && (
                    <>
                      <div className="flex flex-col gap-2.5 mt-3">
                        {[{ label: "Followers", pct: p.detail.iF }, { label: "Non-followers", pct: p.detail.iNF }].map((v, i) => (
                          <div key={i} className="flex flex-col gap-1.5">
                            <span className="text-xs" style={{ color: "#CBD5E1" }}>{v.label}</span>
                            <div className="flex items-center gap-2.5">
                              <span className="flex-1 h-2 rounded overflow-hidden" style={{ background: "#E2E8F0" }}>
                                <span className="block h-full rounded" style={{ width: v.pct, background: i === 0 ? "#D946EF" : "#6D28D9" }} />
                              </span>
                              <span className="shrink-0 w-14 text-right text-xs font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v.pct}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-px my-4" style={{ background: "#1E293B" }} />
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Post interactions</span>
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail.inter}</span>
                      </div>
                      <div className="flex flex-col mt-2">
                        {[{ label: "Likes", value: p.detail.likes, icon: "M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.4 12 20 12 20z" },
                          { label: "Shares", value: p.detail.shares, icon: "M22 3 11 14M22 3l-7 19-4-8-8-4 19-7z" },
                          { label: "Saves", value: p.detail.saves, icon: "M6 3h12v18l-6-5-6 5V3z" },
                          { label: "Comments", value: p.detail.comments, icon: "M21 12a8 8 0 0 1-8 8H8l-5 3 1.4-4.2A8 8 0 1 1 21 12z" }].map((v, i) => (
                          <div key={i} className="flex items-center gap-2.5 py-2">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#CBD5E1" strokeWidth="1.8" className="shrink-0"><path d={v.icon} /></svg>
                            <span className="flex-1 text-xs" style={{ color: "#CBD5E1" }}>{v.label}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="h-px my-4" style={{ background: "#1E293B" }} />
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Accounts engaged</span>
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail.engaged}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Profile */}
                <div className="rounded-lg p-4" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Profile</span>
                    <Info className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                  </div>
                  {p.detail ? (
                    <>
                      <div className="flex items-baseline justify-between mt-4">
                        <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Profile activity</span>
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{p.detail.engaged}</span>
                      </div>
                      <div className="flex flex-col mt-2">
                        {[{ label: "Profile visits", value: p.detail.visits }, { label: "External link taps", value: p.detail.taps }, { label: "Business address taps", value: p.detail.addr }, { label: "Follows", value: p.detail.follows }].map((v, i) => (
                          <div key={i} className="flex items-baseline justify-between py-2">
                            <span className="text-xs" style={{ color: "#CBD5E1" }}>{v.label}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    p.rows.map((r, i) => (
                      <div key={i} className="flex items-baseline justify-between py-2 border-t" style={{ borderColor: "rgba(30,41,59,.7)" }}>
                        <span className="text-[12.5px] font-bold" style={{ color: "#CBD5E1" }}>{r[0]}</span>
                        <span className="text-sm font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{r[1]}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Comments tab */}
            {tab === 1 && (
              <>
                {p.realComments && p.realComments.length > 0 ? (
                  p.realComments.map((cm, i) => {
                    return (
                      <div key={i} className="flex gap-3 py-3 border-b" style={{ borderColor: "rgba(30,41,59,.7)" }}>
                        <span className="shrink-0 w-5 text-right text-[10.5px] font-extrabold tabular-nums pt-2" style={{ color: "#475569" }}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11.5px] font-extrabold" style={{ color: "#F1F5F9" }}>@{cm.user}</span>
                            <span className="ml-auto flex items-center gap-1 text-[10.5px] font-bold" style={{ color: "#F472B6" }}>
                              <Heart className="w-3 h-3 fill-current" /> {cm.likes}
                            </span>
                          </div>
                          <div className="text-xs leading-relaxed mt-1" style={{ color: "#E2E8F0" }}>{cm.text}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold cursor-pointer" style={{ color: "#64748B" }}>Reply</span>
                          </div>

                          {/* Replies */}
                          {cm.replies && cm.replies.length > 0 && (
                            <div className="mt-2 ml-4 pl-3 border-l-2" style={{ borderColor: "rgba(37,99,235,.35)" }}>
                              {openReply === cm.user ? (
                                <>
                                  <div className="flex items-center gap-2 flex-wrap pt-2">
                                    <span className="text-[10px] font-extrabold" style={{ color: "#93C5FD" }}>@{cm.user}</span>
                                    <span className="text-[10px] font-bold cursor-pointer" style={{ color: "#64748B" }}>Reply</span>
                                  </div>
                                  {cm.replies.map((r, j) => (
                                    <div key={j} className="mt-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-extrabold" style={{ color: "#F1F5F9" }}>@{r.user}</span>
                                        <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded"
                                          style={{ color: "#93C5FD", background: "rgba(37,99,235,.16)", border: "1px solid rgba(96,165,250,.35)" }}>AUTHOR</span>
                                      </div>
                                      <div className="text-[11px] leading-relaxed mt-1" style={{ color: "#CBD5E1" }}>{r.text}</div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <button onClick={(e) => { e.stopPropagation(); setOpenReply(cm.user); }}
                                  className="inline-flex items-center gap-1.5 text-[10.5px] font-bold mt-2 cursor-pointer"
                                  style={{ color: "#60A5FA" }}>
                                  View {cm.replies.length} more reply
                                  <span className="text-[8px]">&#9662;</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg p-6 text-center" style={{ background: "#111827", border: "1px dashed #334155" }}>
                    <div className="text-xs font-bold" style={{ color: "#94A3B8" }}>Belum ada komentar yang ditarik untuk konten ini.</div>
                    <div className="text-[10.5px] mt-1.5" style={{ color: "#64748B" }}>Tarik komentar dari kanal terkait untuk memulai analisis.</div>
                  </div>
                )}
              </>
            )}

            {/* Analysis tab */}
            {tab === 2 && (
              <>
                {/* Sentiment */}
                <div className="rounded-lg p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#60A5FA" }} />
                    <span className="text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>ANALISIS SENTIMEN KOMENTAR</span>
                  </div>
                  <div className="text-[11.5px] mt-1.5" style={{ color: "#64748B" }}>{p.topic}</div>
                  <div className="flex h-4 rounded-full overflow-hidden mt-3" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                    {p.sent.map((s, i) => (
                      <div key={i} style={{ width: s[1], background: s[2] }} className="h-full transition-all" />
                    ))}
                  </div>
                  <div className="flex gap-4 flex-wrap mt-2.5">
                    {p.sent.map((s, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded" style={{ background: s[2] }} />
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>{s[0]}</span>
                        <span className="text-xs font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{s[1]}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-3.5">
                    {p.themes.map((th, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: th[3] }} />
                        <span className="flex-1 text-[11.5px]" style={{ color: "#CBD5E1" }}>{th[0]}</span>
                        <span className="shrink-0 w-[130px] h-1.5 rounded overflow-hidden" style={{ background: "#0B1220" }}>
                          <span className="block h-full rounded" style={{ width: th[1], background: th[3] }} />
                        </span>
                        <span className="shrink-0 w-10 text-right text-[11px] font-extrabold tabular-nums" style={{ color: "#94A3B8" }}>{th[2]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Insight */}
                <div className="rounded-lg p-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3B82F6" }} />
                    <span className="flex-1 text-[11px] font-extrabold tracking-wider" style={{ color: "#CBD5E1" }}>POST INSIGHT &mdash; DARI PEMILIK AKUN</span>
                  </div>
                  <div className="flex gap-0.5 mt-3 rounded-lg p-2.5" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                    {p.ins.map((it, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-lg font-extrabold tabular-nums" style={{ color: "#93C5FD" }}>{it[0]}</div>
                        <div className="text-[9.5px] text-center" style={{ color: "#64748B" }}>{it[1]}</div>
                      </div>
                    ))}
                  </div>
                  {p.rows.map((r, i) => (
                    <div key={i} className="flex items-baseline gap-3 py-1.5 border-t mt-1.5" style={{ borderColor: "rgba(30,41,59,.7)" }}>
                      <span className="flex-1 text-[11.5px] font-bold" style={{ color: "#CBD5E1" }}>{r[0]}</span>
                      <span className="shrink-0 text-xs font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[1]}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="rounded-lg p-4" style={{ background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.4)" }}>
                  <div className="text-[11px] font-extrabold tracking-wider mb-2" style={{ color: "#93C5FD" }}>REKOMENDASI</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#CBD5E1" }}>{p.rec}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Digital Amplification Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DigitalAmplificationTab() {
  const [panel, setPanel] = useState(0); // 0=Boost Ads, 1=Nano
  const [goal, setGoal] = useState(1);
  const [aud, setAud] = useState(1);

  const GOALS = [
    ["Jangkauan", "lebih luas"], ["Tayangan", "video"], ["Interaksi", "profil"],
    ["Pengikut", "baru"], ["Traffic ke", "microsite"], ["Pendaftaran", "peserta"],
  ];

  return (
    <div className="flex">
      {/* Vertical tab rail */}
      <div className="flex flex-col gap-0.5 shrink-0">
        {["Boost Ads", "Nano Influencer"].map((label, i) => (
          <button key={i} onClick={() => setPanel(i)}
            className="cursor-pointer px-2 py-4 rounded-l-lg"
            style={{ background: panel === i ? "rgba(37,99,235,.14)" : "transparent", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            <span className="text-lg font-extrabold tracking-tight whitespace-nowrap"
              style={{ color: panel === i ? "#93C5FD" : "#64748B" }}>{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 rounded-r-lg rounded-br-lg p-5"
        style={{ background: "rgba(37,99,235,.05)", border: "1px solid rgba(37,99,235,.32)", borderLeftColor: "#2563EB" }}>

        {panel === 0 && (
          <>
            <div className="text-lg font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Boost Ads &mdash; Instagram & TikTok</div>
            <div className="text-xs leading-relaxed mt-2 max-w-[700px]" style={{ color: "#CBD5E1" }}>
              Rencana dan realisasi iklan berbayar untuk mendorong karya pilihan Kreasi Biru menjangkau audiens baru.
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-0 mt-4">
              {["Konten", "Tujuan", "Audiens", "Anggaran", "Tinjau"].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                    style={{ background: i <= 3 ? "#2563EB" : "#1E293B", color: i <= 3 ? "#fff" : "#64748B" }}>{i + 1}</span>
                  <span className="text-xs font-semibold whitespace-nowrap"
                    style={{ color: i <= 3 ? "#F1F5F9" : "#64748B", fontWeight: i === 3 ? 800 : 600 }}>{label}</span>
                  {i < 4 && <span className="flex-1 h-px mx-3" style={{ background: "#1E293B" }} />}
                </div>
              ))}
            </div>

            <div className="flex gap-6 mt-5 items-start">
              <div className="flex-1 min-w-0 flex flex-col gap-5">
                {/* Step 1: Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: "#2563EB" }}>1</span>
                    <span className="text-[13.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Pilih konten yang dipromosikan</span>
                  </div>
                  <div className="ml-7 mt-2">
                    <div className="text-xs" style={{ color: "#94A3B8" }}>Tempel tautan karya Kreasi Biru yang sudah tayang di kanal resmi.</div>
                    <div className="flex gap-2.5 mt-2.5">
                      <div className="flex-1 rounded-lg px-3 py-2.5 text-xs truncate" style={{ background: "#070B14", border: "1px solid #334155", color: "#CBD5E1" }}>
                        https://www.tiktok.com/@creativedemokrat/video/...
                      </div>
                      <button className="shrink-0 text-xs font-extrabold px-4 py-2.5 rounded-lg text-white"
                        style={{ background: "#2563EB", border: "1px solid #60A5FA" }}>Muat Konten</button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Goal */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: "#2563EB" }}>2</span>
                    <span className="text-[13.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Tentukan tujuan kampanye</span>
                  </div>
                  <div className="ml-7 mt-2">
                    <div className="text-xs" style={{ color: "#94A3B8" }}>Pilih hasil yang ingin diprioritaskan platform.</div>
                    <div className="flex gap-2 flex-wrap mt-2.5">
                      {GOALS.map((g, i) => (
                        <button key={i} onClick={() => setGoal(i)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                          style={{
                            background: goal === i ? "rgba(37,99,235,.14)" : "#0F172A",
                            border: `1px solid ${goal === i ? "#2563EB" : "#1E293B"}`,
                          }}>
                          <span className="text-[11.5px] font-bold leading-tight" style={{ color: goal === i ? "#F1F5F9" : "#CBD5E1" }}>
                            {g[0]}<br />{g[1]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 3: Audience */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: "#2563EB" }}>3</span>
                    <span className="text-[13.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Pilih audiens</span>
                  </div>
                  <div className="ml-7 flex gap-3 mt-2.5">
                    {[
                      ["Otomatis (Advantage+)", "Platform mencari audiens mirip pengikut @creativedemokrat."],
                      ["Kustom \u2014 Gen Z & Milenial", "Usia 17\u201340, minat kreator konten, film, desain; Jabodetabek + 12 kota."],
                    ].map(([title, desc], i) => (
                      <button key={i} onClick={() => setAud(i)}
                        className="flex-1 flex items-center gap-3 rounded-lg p-3 cursor-pointer"
                        style={{
                          background: aud === i ? "rgba(37,99,235,.14)" : "#0F172A",
                          border: `1px solid ${aud === i ? "#2563EB" : "#1E293B"}`,
                        }}>
                        <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background: "#1E293B" }}>
                          <Users className="w-4 h-4" style={{ color: "#CBD5E1" }} />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block text-xs font-extrabold" style={{ color: aud === i ? "#93C5FD" : "#F1F5F9" }}>{title}</span>
                          <span className="block text-[11px] mt-0.5 leading-relaxed" style={{ color: "#94A3B8" }}>{desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Budget */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: "#2563EB" }}>4</span>
                    <span className="text-[13.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Anggaran & jadwal</span>
                  </div>
                  <div className="ml-7 grid grid-cols-4 gap-2.5 mt-2.5">
                    {[
                      { label: "ANGGARAN HARIAN", value: "Rp1,5 jt" },
                      { label: "DURASI", value: "5 hari" },
                      { label: "TOTAL", value: "Rp7,5 jt", color: "#93C5FD" },
                      { label: "MULAI", value: "3 Sep 2026" },
                    ].map((b, i) => (
                      <div key={i} className="rounded-lg p-3" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                        <div className="text-[9.5px] font-extrabold tracking-wider" style={{ color: "#64748B" }}>{b.label}</div>
                        <div className="text-sm font-extrabold mt-1 tabular-nums" style={{ color: b.color || "#F1F5F9" }}>{b.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 ml-7">
                  <button className="text-xs font-extrabold px-5 py-2.5 rounded-lg text-white"
                    style={{ background: "linear-gradient(180deg,#3B82F6,#1D4ED8)", border: "1px solid #60A5FA" }}>Tinjau Kampanye</button>
                  <button className="text-xs font-bold px-4 py-2.5 rounded-lg"
                    style={{ color: "#CBD5E1", border: "1px solid #334155" }}>Simpan Draf</button>
                </div>
              </div>

              {/* Ad preview */}
              <div className="shrink-0 w-[320px]">
                <div className="text-sm font-extrabold" style={{ color: "#F1F5F9" }}>Pratinjau Iklan</div>
                <div className="mt-2.5 rounded-xl overflow-hidden" style={{ background: "#070B14", border: "1px solid #1E293B" }}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">GM</div>
                    <span className="flex-1">
                      <span className="block text-xs font-extrabold" style={{ color: "#F1F5F9" }}>creativedemokrat</span>
                      <span className="block text-[10.5px] mt-0.5" style={{ color: "#94A3B8" }}>Bersponsor</span>
                    </span>
                  </div>
                  <div className="h-[280px] flex items-end justify-center pb-3 font-mono text-[10.5px]"
                    style={{ background: "repeating-linear-gradient(45deg,#111C2E,#111C2E 10px,#16233A 10px,#16233A 20px)", color: "#64748B" }}>
                    pratinjau media konten
                  </div>
                  <div className="px-3 py-3">
                    <div className="text-[11.5px] leading-relaxed" style={{ color: "#CBD5E1" }}>Caption ditarik dari konten terpilih dan tidak dapat diubah di sini.</div>
                    <div className="mt-2.5 text-center text-[11.5px] font-extrabold text-white py-2 rounded-lg" style={{ background: "#2563EB" }}>Tonton Selengkapnya</div>
                  </div>
                </div>
                <div className="rounded-lg p-3 mt-3" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                  <div className="text-[10.5px] font-extrabold tracking-wider" style={{ color: "#94A3B8" }}>ESTIMASI HASIL</div>
                  <div className="text-[11.5px] mt-1.5 leading-relaxed" style={{ color: "#CBD5E1" }}>
                    Estimasi jangkauan <strong style={{ color: "#93C5FD" }}>46rb&ndash;92rb</strong> akun selama 5 hari. Angka final muncul setelah sinkronisasi dengan platform.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {panel === 1 && (
          <>
            <div className="text-lg font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>Nano Influencer &mdash; Amplifikasi Organik</div>
            <div className="text-xs leading-relaxed mt-2 max-w-[700px]" style={{ color: "#CBD5E1" }}>
              Distribusi karya finalis melalui jaringan nano influencer dan komunitas kreatif daerah.
            </div>

            <div className="flex gap-2.5 mt-4">
              {[
                { label: "AKUN AKTIF", value: "38", color: "#F1F5F9" },
                { label: "TOTAL REPOST", value: "224", color: "#F1F5F9" },
                { label: "JANGKAUAN ORGANIK", value: "862rb", color: "#93C5FD" },
                { label: "EARNED MEDIA VALUE", value: "Rp184 jt", color: "#4ADE80" },
              ].map((n, i) => (
                <StatCard key={i} label={n.label} value={n.value} color={n.color} />
              ))}
            </div>

            <div className="rounded-lg overflow-hidden mt-4" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
              <div className="grid" style={{ gridTemplateColumns: "1.6fr .9fr .8fr .8fr .9fr", background: "#0B1220", borderBottom: "1px solid #1E293B" }}>
                {["AKUN", "PENGIKUT", "REPOST", "JANGKAUAN", "STATUS"].map((h, i) => (
                  <div key={i} className="text-[11px] font-extrabold tracking-wider px-3.5 py-2.5"
                    style={{ color: i === 4 ? "#93C5FD" : "#94A3B8", borderLeft: i > 0 ? "1px solid #1E293B" : "none" }}>{h}</div>
                ))}
              </div>
              {NANO_ROWS.map((r, i) => (
                <div key={i} className="grid" style={{ gridTemplateColumns: "1.6fr .9fr .8fr .8fr .9fr", borderBottom: "1px solid rgba(30,41,59,.7)" }}>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <span className="w-6 h-6 rounded-full shrink-0" style={{ background: "repeating-linear-gradient(45deg,#1E293B,#1E293B 3px,#334155 3px,#334155 6px)" }} />
                    <span className="flex-1 text-xs font-bold truncate" style={{ color: "#F1F5F9" }}>{r.handle}</span>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill={r.plat === "Instagram" ? "#F04E23" : "#F1F5F9"} fillRule="evenodd">
                      <path d={r.plat === "Instagram"
                        ? "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"
                        : "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"} />
                    </svg>
                  </div>
                  <div className="text-xs px-3.5 py-2.5 tabular-nums" style={{ color: "#CBD5E1", borderLeft: "1px solid #1E293B" }}>{r.followers}</div>
                  <div className="text-xs px-3.5 py-2.5 tabular-nums" style={{ color: "#CBD5E1", borderLeft: "1px solid #1E293B" }}>{r.reposts}</div>
                  <div className="text-xs font-bold px-3.5 py-2.5 tabular-nums" style={{ color: "#93C5FD", borderLeft: "1px solid #1E293B" }}>{r.reach}</div>
                  <div className="px-3.5 py-2.5" style={{ borderLeft: "1px solid #1E293B" }}>
                    <Badge label={r.status}
                      color={r.status === "AKTIF" ? "#4ADE80" : "#94A3B8"}
                      bg={r.status === "AKTIF" ? "rgba(34,197,94,.12)" : "#0F172A"}
                      border={r.status === "AKTIF" ? "rgba(34,197,94,.4)" : "#1E293B"} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 mt-4">
              <button className="text-xs font-extrabold px-5 py-2.5 rounded-lg text-white"
                style={{ background: "linear-gradient(180deg,#3B82F6,#1D4ED8)", border: "1px solid #60A5FA" }}>Kirim Brief Repost</button>
              <button className="text-xs font-bold px-4 py-2.5 rounded-lg"
                style={{ color: "#CBD5E1", border: "1px solid #334155" }}>Tambah Akun</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Executive Reports Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ExecutiveReportsTab() {
  const [exec, setExec] = useState(0);
  const level = EXEC_LEVELS[exec];

  return (
    <div className="flex flex-col gap-5">
      {/* Tab buttons */}
      <div className="flex gap-2">
        {["Output", "Exposure", "Engagement", "Sentiment", "Advocacy", "Outcome", "Impact"].map((label, i) => (
          <button key={i} onClick={() => setExec(i)}
            className="flex-1 min-w-0 rounded-lg px-3 py-2.5 cursor-pointer"
            style={{
              background: exec === i ? "rgba(37,99,235,.14)" : "#0F172A",
              border: `1px solid ${exec === i ? "#2563EB" : "#1E293B"}`,
            }}>
            <div className="text-[10.5px] font-extrabold tracking-wider" style={{ color: exec === i ? "#93C5FD" : "#475569" }}>{String(i + 1).padStart(2, "0")}</div>
            <div className="text-xs font-bold mt-0.5" style={{ color: exec === i ? "#F1F5F9" : "#94A3B8" }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Question & Indicators */}
      <div className="rounded-lg overflow-hidden" style={{ background: "linear-gradient(120deg,rgba(37,99,235,.16),rgba(15,23,42,.75))", border: "1.5px solid rgba(37,99,235,.6)" }}>
        <div className="grid" style={{ gridTemplateColumns: "200px 1fr" }}>
          <div className="text-xs font-extrabold px-4 py-3" style={{ color: "#93C5FD", background: "rgba(37,99,235,.16)", borderBottom: "1.5px solid rgba(37,99,235,.45)" }}>Pertanyaan Utama</div>
          <div className="text-xs font-bold leading-relaxed px-4 py-3" style={{ color: "#F1F5F9", borderBottom: "1.5px solid rgba(37,99,235,.45)", borderLeft: "1.5px solid rgba(37,99,235,.45)" }}>{level.q}</div>
          <div className="text-xs font-extrabold px-4 py-3" style={{ color: "#93C5FD", background: "rgba(37,99,235,.16)" }}>Indikator yang Dipantau</div>
          <div className="text-xs leading-relaxed px-4 py-3" style={{ color: "#E2E8F0", borderLeft: "1.5px solid rgba(37,99,235,.45)" }}>{level.ind}</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-lg p-4" style={{ background: "#0F172A", border: "1px solid #1E293B", borderLeftWidth: 3, borderLeftColor: "#2563EB" }}>
        <div className="text-sm font-extrabold" style={{ color: "#F1F5F9" }}>Executive Summary</div>
        <div className="text-xs leading-relaxed mt-2.5" style={{ color: "#CBD5E1" }}>{level.sum}</div>
        <div className="rounded-lg overflow-hidden mt-3" style={{ border: "1px solid #1E293B" }}>
          {level.facts.map((f, i) => (
            <div key={i} className="grid" style={{ gridTemplateColumns: "210px 1fr", borderBottom: i < level.facts.length - 1 ? "1px solid rgba(30,41,59,.7)" : "none" }}>
              <div className="text-xs font-extrabold px-3.5 py-2.5" style={{ color: "#F1F5F9", background: "#0B1220" }}>{f[0]}</div>
              <div className="text-xs leading-relaxed px-3.5 py-2.5" style={{ color: "#CBD5E1", borderLeft: "1px solid #1E293B" }}>{f[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform table */}
      <div>
        <div className="text-[14.5px] font-extrabold tracking-tight" style={{ color: "#F1F5F9" }}>{level.table}</div>
        <div className="rounded-lg overflow-hidden mt-2.5" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
          <div className="grid" style={{ gridTemplateColumns: "1.25fr 1fr 1fr 1fr", background: "#0B1220", borderBottom: "1px solid #1E293B" }}>
            {["INDIKATOR", "INSTAGRAM", "TIKTOK", "KESELURUHAN"].map((h, i) => (
              <div key={i} className="text-[11.5px] font-extrabold tracking-wider px-3.5 py-2.5"
                style={{ color: i === 3 ? "#93C5FD" : "#CBD5E1", borderLeft: i > 0 ? "1px solid #1E293B" : "none" }}>{h}</div>
            ))}
          </div>
          {level.rows.map((r, i) => (
            <div key={i} className="grid" style={{ gridTemplateColumns: "1.25fr 1fr 1fr 1fr", borderBottom: i < level.rows.length - 1 ? "1px solid rgba(30,41,59,.7)" : "none" }}>
              <div className="text-xs font-bold px-3.5 py-2.5" style={{ color: "#CBD5E1" }}>{r[0]}</div>
              <div className="text-xs leading-relaxed px-3.5 py-2.5 tabular-nums" style={{ color: "#F1F5F9", borderLeft: "1px solid #1E293B" }}>{r[1]}</div>
              <div className="text-xs leading-relaxed px-3.5 py-2.5 tabular-nums" style={{ color: "#F1F5F9", borderLeft: "1px solid #1E293B" }}>{r[2]}</div>
              <div className="text-xs font-bold leading-relaxed px-3.5 py-2.5 tabular-nums" style={{ color: "#93C5FD", borderLeft: "1px solid #1E293B" }}>{r[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TABS = [
  { key: "ringkasan", label: "Ringkasan", icon: FileText },
  { key: "content-hub", label: "Content Hub", icon: Palette },
  { key: "monitoring", label: "Campaign Monitoring", icon: BarChart3 },
  { key: "amplification", label: "Digital Amplification", icon: Megaphone },
  { key: "reports", label: "Executive Reports", icon: Target },
];

export default function DemokratCreative() {
  const [flow, setFlow] = useState(0);

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Project header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-[1.1px]" style={{ color: "#64748B" }}>PROJECT</span>
            <Badge label="AKTIF" color="#4ADE80" bg="rgba(34,197,94,.12)" border="rgba(34,197,94,.4)" />
          </div>
          <div className="text-xl font-extrabold tracking-tight mt-1.5" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Lomba Kreasi Biru &mdash; Demokrat Creative Challenge
          </div>
          <div className="text-xs mt-1 leading-relaxed max-w-[720px]" style={{ color: "#94A3B8" }}>
            Memantau performa dua kanal resmi Creative Demokrat &mdash; Instagram dan TikTok <span className="font-bold" style={{ color: "#CBD5E1" }}>@creativedemokrat</span> &mdash; mulai dari 26 Agustus 2026.
          </div>
        </div>
      </div>

      {/* Flow tabs */}
      <div className="flex items-end gap-0.5 flex-wrap relative z-10 border-b pb-1.5" style={{ borderColor: "rgba(37,99,235,.32)" }}>
        {TABS.map((t, i) => (
          <TabButton key={t.key} label={t.label} active={flow === i} onClick={() => setFlow(i)} icon={t.icon} />
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-b-lg rounded-tr-lg p-4 relative z-0"
        style={{ background: "rgba(37,99,235,.035)", border: "1px solid rgba(37,99,235,.32)", borderTopColor: "#2563EB" }}>
        {flow === 0 && <RingkasanTab />}
        {flow === 1 && <ContentHubTab />}
        {flow === 2 && <CampaignMonitoringTab />}
        {flow === 3 && <DigitalAmplificationTab />}
        {flow === 4 && <ExecutiveReportsTab />}
      </div>
    </div>
  );
}
