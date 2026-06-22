import { useState } from "react";
import {
  Database, Search,
  ExternalLink, MapPin, Users, Globe,
  Video, Building2, Globe2,
  Instagram,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type MediaEntry = {
  no: number;
  name: string;
  followers: string;
  link: string;
  region: string;
};

const allMedia: MediaEntry[] = [
  // DKI Jakarta
  { no: 1, name: "Jakarta Keras", followers: "5.8M", link: "https://www.instagram.com/jakarta.keras", region: "DKI Jakarta" },
  { no: 2, name: "Jakarta Zone", followers: "3M", link: "https://www.instagram.com/jakartazoone", region: "DKI Jakarta" },
  { no: 3, name: "Jakarta Terkini", followers: "2M", link: "https://www.instagram.com/jakarta.terkini", region: "DKI Jakarta" },
  { no: 4, name: "Mood Jakarta", followers: "1.2M", link: "https://www.instagram.com/mood.jakarta", region: "DKI Jakarta" },
  { no: 5, name: "Jakut Info", followers: "630K+", link: "https://www.instagram.com/jakut.info", region: "DKI Jakarta" },
  { no: 6, name: "Warga Jakbar", followers: "343K+", link: "https://www.instagram.com/warga.jakbar", region: "DKI Jakarta" },
  { no: 7, name: "Info Jakarta Pusat", followers: "197K+", link: "https://www.instagram.com/info_jakartapusat", region: "DKI Jakarta" },
  { no: 8, name: "Jakarta Pusat Info", followers: "256K+", link: "https://www.instagram.com/jakartapusat.info", region: "DKI Jakarta" },
  { no: 9, name: "Info Jakarta Barat", followers: "139K+", link: "https://www.instagram.com/info.jakartabarat", region: "DKI Jakarta" },
  { no: 10, name: "Jakarta Barat 24 Jam", followers: "144K+", link: "https://www.instagram.com/jakartabarat24jam", region: "DKI Jakarta" },
  { no: 11, name: "Info JKT 24", followers: "457K+", link: "https://www.instagram.com/infojkt24", region: "DKI Jakarta" },
  { no: 12, name: "Jakarta Infonesia", followers: "226K+", link: "https://www.instagram.com/jakarta.infonesia", region: "DKI Jakarta" },
  { no: 13, name: "Info Jakarta Timur", followers: "257K+", link: "https://www.instagram.com/info_jakartatimur", region: "DKI Jakarta" },
  { no: 14, name: "Jakartaselatan24jam", followers: "154K+", link: "https://www.instagram.com/jakartaselatan24jam", region: "DKI Jakarta" },
  { no: 15, name: "Warga Jakarta", followers: "137K+", link: "https://www.instagram.com/wargajakarta.id", region: "DKI Jakarta" },
  { no: 16, name: "Kabar Jaktim", followers: "103K+", link: "https://www.instagram.com/kabar.jaktim", region: "DKI Jakarta" },
  { no: 17, name: "Jakarta Siana", followers: "514K+", link: "https://www.instagram.com/jakartasiana", region: "DKI Jakarta" },
  { no: 18, name: "Lensa Berita Jakarta", followers: "160K+", link: "https://www.instagram.com/lbj_jakarta", region: "DKI Jakarta" },
  { no: 19, name: "Jakarta Capture", followers: "132K+", link: "https://www.instagram.com/jakartacapture", region: "DKI Jakarta" },
  { no: 20, name: "Jakut Update", followers: "132K+", link: "https://www.instagram.com/jakut_update", region: "DKI Jakarta" },
  { no: 21, name: "Kabar Ciledug", followers: "167K+", link: "https://www.instagram.com/kabarciledug", region: "DKI Jakarta" },
  { no: 22, name: "Pasar Minggu", followers: "32K+", link: "https://www.instagram.com/pasarminggu24jam", region: "DKI Jakarta" },
  { no: 23, name: "Jakarta Line", followers: "57K+", link: "https://www.instagram.com/jakarta.line", region: "DKI Jakarta" },
  { no: 24, name: "Jakarta24Jam", followers: "38K+", link: "https://www.instagram.com/jakarta24jam.id", region: "DKI Jakarta" },
  { no: 25, name: "Jakarta24Info", followers: "92K+", link: "https://www.instagram.com/jakarta24info", region: "DKI Jakarta" },
  { no: 26, name: "Info Lubang Buaya", followers: "33K+", link: "https://www.instagram.com/info_lubang_buaya", region: "DKI Jakarta" },
  { no: 27, name: "Info Kebon Jeruk", followers: "70K+", link: "https://www.instagram.com/info.kebonjeruk", region: "DKI Jakarta" },
  { no: 28, name: "Ciledug 24 Jam", followers: "74K+", link: "https://www.instagram.com/ciledug24jam", region: "DKI Jakarta" },
  { no: 29, name: "Info Penggilingan", followers: "80K+", link: "https://www.instagram.com/infopenggilingan", region: "DKI Jakarta" },
  { no: 30, name: "Jakbar Viral", followers: "80K+", link: "https://www.instagram.com/jakbarviral", region: "DKI Jakarta" },
  { no: 31, name: "Info Jakbar 24", followers: "27K+", link: "https://www.instagram.com/infojakbar24", region: "DKI Jakarta" },
  { no: 32, name: "Info Sawah Besar", followers: "22K+", link: "https://www.instagram.com/info_sawahbesar", region: "DKI Jakarta" },
  { no: 33, name: "Jkt Info 24 Jam", followers: "108K+", link: "https://www.instagram.com/jktinfo24jam", region: "DKI Jakarta" },
  { no: 34, name: "Jaksel Info", followers: "53K+", link: "https://www.instagram.com/jaksel.info", region: "DKI Jakarta" },
  { no: 35, name: "Seputar Jaksel", followers: "49K+", link: "https://www.instagram.com/seputar_jaksel", region: "DKI Jakarta" },
  { no: 36, name: "Lenteng Agung Terkini", followers: "50K+", link: "https://www.instagram.com/lentengagungterkini", region: "DKI Jakarta" },
  { no: 37, name: "Jakarta Infooo", followers: "66K+", link: "https://www.instagram.com/jakarta.infoo", region: "DKI Jakarta" },
  { no: 38, name: "Folk Jak", followers: "28K+", link: "https://www.instagram.com/folkjak", region: "DKI Jakarta" },
  { no: 39, name: "Folk Cibubur", followers: "66K+", link: "https://www.instagram.com/folk.cibubur", region: "DKI Jakarta" },
  { no: 40, name: "Info Ciracas 24 Jam", followers: "10K+", link: "https://www.instagram.com/infociracas24jam", region: "DKI Jakarta" },
  { no: 41, name: "Info Munjul Jaktim", followers: "45K+", link: "https://www.instagram.com/info.munjul", region: "DKI Jakarta" },
  { no: 42, name: "Cibubur Update", followers: "25K+", link: "https://www.instagram.com/cibubur.update", region: "DKI Jakarta" },
  { no: 43, name: "Jakarta Timur 24Jam", followers: "50K+", link: "https://www.instagram.com/jakartatimur24jam", region: "DKI Jakarta" },
  { no: 44, name: "Jakut Info ID", followers: "51K+", link: "https://www.instagram.com/jakutinfo_id", region: "DKI Jakarta" },
  { no: 45, name: "Viral Ciledug", followers: "55K+", link: "https://www.instagram.com/viralciledug", region: "DKI Jakarta" },
  { no: 46, name: "Jakarta Viral", followers: "45K+", link: "https://www.instagram.com/jakarta.viral", region: "DKI Jakarta" },
  { no: 47, name: "JKT Viral", followers: "20K+", link: "https://www.instagram.com/jktviral", region: "DKI Jakarta" },
  { no: 48, name: "Update Info Jakarta", followers: "19K+", link: "https://www.instagram.com/update_infojakarta", region: "DKI Jakarta" },
  { no: 49, name: "Info Priok", followers: "88K+", link: "https://www.instagram.com/infopriok", region: "DKI Jakarta" },
  { no: 50, name: "Berita Matraman", followers: "60K+", link: "https://www.instagram.com/beritamatraman", region: "DKI Jakarta" },
  { no: 51, name: "Sekilas Info Jakarta", followers: "42K+", link: "https://www.instagram.com/sekilasinfojakarta", region: "DKI Jakarta" },
  { no: 52, name: "Jaksel Kabarku", followers: "23K+", link: "https://www.instagram.com/jaksel.kabarku", region: "DKI Jakarta" },
  { no: 53, name: "Info Jakarta Timur", followers: "30K+", link: "https://www.instagram.com/info.jakartatimur", region: "DKI Jakarta" },
  { no: 54, name: "Cerita Condet", followers: "43K+", link: "https://www.instagram.com/ceritacondet", region: "DKI Jakarta" },
  { no: 55, name: "JKTinfo", followers: "3.9M", link: "https://www.instagram.com/jktinfo", region: "DKI Jakarta" },
  { no: 56, name: "Jkt Trending", followers: "28K+", link: "https://www.instagram.com/jakarta.trending", region: "DKI Jakarta" },
  // Jabodetabek
  { no: 1, name: "Info Depok", followers: "893K+", link: "https://www.instagram.com/infodepok_id", region: "Jabodetabek" },
  { no: 2, name: "Depok 24 Jam", followers: "884K+", link: "https://www.instagram.com/depok24jam", region: "Jabodetabek" },
  { no: 3, name: "Depok Update", followers: "126K+", link: "https://www.instagram.com/depokupdateco", region: "Jabodetabek" },
  { no: 4, name: "Sawangan Info", followers: "142K+", link: "https://www.instagram.com/sawangan_info", region: "Jabodetabek" },
  { no: 5, name: "Depok Feed", followers: "60K+", link: "https://www.instagram.com/depokfeed", region: "Jabodetabek" },
  { no: 6, name: "Jabodetabek 24 Info", followers: "248K+", link: "https://www.instagram.com/jabodetabek24info", region: "Jabodetabek" },
  { no: 7, name: "Warganet Jabodetabek", followers: "179K+", link: "https://www.instagram.com/warganetjabodetabek", region: "Jabodetabek" },
  { no: 8, name: "Info Jabodetabek", followers: "139K+", link: "https://www.instagram.com/info_jabodetabek", region: "Jabodetabek" },
  { no: 9, name: "Depok Hari Ini", followers: "147K+", link: "https://www.instagram.com/depokhariini", region: "Jabodetabek" },
  { no: 10, name: "Depok Terkini", followers: "177K+", link: "https://www.instagram.com/depokterkini", region: "Jabodetabek" },
  { no: 11, name: "Tangsel Update", followers: "104K+", link: "https://www.instagram.com/tangsel_update", region: "Jabodetabek" },
  { no: 12, name: "Tangerang Terkini", followers: "249K+", link: "https://www.instagram.com/tangerang.terkini", region: "Jabodetabek" },
  { no: 13, name: "Tangerang Kabarku", followers: "56K+", link: "https://www.instagram.com/tangerangkabarku", region: "Jabodetabek" },
  { no: 14, name: "Seputar Tangsel", followers: "226K+", link: "https://www.instagram.com/seputartangsel", region: "Jabodetabek" },
  { no: 15, name: "Parung Panjang Viral", followers: "72K+", link: "https://www.instagram.com/parungpanjang.viral", region: "Jabodetabek" },
  { no: 16, name: "Parung Ciseeng", followers: "47K+", link: "https://www.instagram.com/parungciseeng24jam", region: "Jabodetabek" },
  { no: 17, name: "Info Parung", followers: "155K+", link: "https://www.instagram.com/infoparung", region: "Jabodetabek" },
  { no: 18, name: "Bogor Terkini", followers: "290K+", link: "https://www.instagram.com/bogor.terkini", region: "Jabodetabek" },
  { no: 19, name: "Bekasi Terkini", followers: "763K+", link: "https://www.instagram.com/bekasi.terkini", region: "Jabodetabek" },
  { no: 20, name: "Liputan Cikarang", followers: "150K+", link: "https://www.instagram.com/liputancikarang", region: "Jabodetabek" },
  { no: 21, name: "Gue Cikarang", followers: "104K+", link: "https://www.instagram.com/gue_cikarang", region: "Jabodetabek" },
  { no: 22, name: "Info Bekasi Coo", followers: "668K+", link: "https://www.instagram.com/infobekasi.coo", region: "Jabodetabek" },
  { no: 23, name: "Bekasi 24 Jam", followers: "38K+", link: "https://www.instagram.com/bekasi24jamcom_official", region: "Jabodetabek" },
  { no: 24, name: "Bekasi Kita", followers: "105K+", link: "https://www.instagram.com/bekasi.kita", region: "Jabodetabek" },
  { no: 25, name: "Pojok Bekasi", followers: "69K+", link: "https://www.instagram.com/pojokbekasicom", region: "Jabodetabek" },
  { no: 26, name: "Cikarang 24 Jam", followers: "26K+", link: "https://www.instagram.com/cikarang_24_jam", region: "Jabodetabek" },
  { no: 27, name: "Karawaci24Jam", followers: "12K+", link: "https://www.instagram.com/karawaci24jam", region: "Jabodetabek" },
  { no: 28, name: "Tangkot 24 Jam", followers: "25K+", link: "https://www.instagram.com/tangkot24jam", region: "Jabodetabek" },
  { no: 29, name: "Info Ciputat", followers: "82K+", link: "https://www.instagram.com/infociputatcom", region: "Jabodetabek" },
  { no: 30, name: "Ciputat24Jam", followers: "29K+", link: "https://www.instagram.com/ciputat24jam.id", region: "Jabodetabek" },
  { no: 31, name: "Info Tangerang Kota", followers: "47K+", link: "https://www.instagram.com/infotangerangkota.id", region: "Jabodetabek" },
  { no: 32, name: "Depok Seru", followers: "18K+", link: "https://www.instagram.com/depokseru", region: "Jabodetabek" },
  // Regional
  { no: 1, name: "Lambe Turah", followers: "12.8M", link: "https://www.instagram.com/lambe_turah", region: "Regional" },
  { no: 2, name: "Lambe Turah Official", followers: "2.4M", link: "https://www.instagram.com/lambeturah_official", region: "Regional" },
  { no: 3, name: "Indonesia Core", followers: "212K+", link: "https://www.instagram.com/indonesian.core", region: "Regional" },
  { no: 4, name: "Fakta Berita", followers: "250K+", link: "https://www.instagram.com/fakta.beriita", region: "Regional" },
  { no: 5, name: "Folk Fyi", followers: "1M", link: "https://www.instagram.com/folkfyi", region: "Regional" },
  { no: 6, name: "Folk Hype", followers: "3.6M", link: "https://www.instagram.com/folk.hype", region: "Regional" },
  { no: 7, name: "Indo Todays", followers: "1.3M", link: "https://www.instagram.com/indotodays", region: "Regional" },
  { no: 8, name: "Vox Netizen", followers: "278K+", link: "https://www.instagram.com/voxnetizens", region: "Regional" },
  { no: 9, name: "Info Psikologi", followers: "5M", link: "https://www.instagram.com/indo_psikologi", region: "Regional" },
  { no: 10, name: "Warung Jurnalis", followers: "105K+", link: "https://www.instagram.com/warungjurnalis", region: "Regional" },
  { no: 11, name: "Media Jurnal", followers: "45K+", link: "https://www.instagram.com/mjup.official", region: "Regional" },
  { no: 12, name: "Jurnal Warga", followers: "18K+", link: "https://www.instagram.com/jurnalwarga", region: "Regional" },
  { no: 13, name: "Jurnalis 16:9", followers: "19K+", link: "https://www.instagram.com/jurnalis169", region: "Regional" },
  { no: 14, name: "Demen Dolan", followers: "369K+", link: "https://www.instagram.com/demendolan", region: "Regional" },
  { no: 15, name: "Explore Dolan", followers: "608K+", link: "https://www.instagram.com/exploredolan.id", region: "Regional" },
  { no: 16, name: "Sarang Tawa", followers: "189K+", link: "https://www.instagram.com/sarang_tawa", region: "Regional" },
  { no: 17, name: "Volk Info", followers: "223K+", link: "https://www.instagram.com/volkinfo", region: "Regional" },
  // Jawa Barat
  { no: 1, name: "Sukabumi City", followers: "122K+", link: "https://www.instagram.com/sukabumicitycom", region: "Jawa Barat" },
  { no: 2, name: "City Of Bandung", followers: "157K+", link: "https://www.instagram.com/cityofbdg", region: "Jawa Barat" },
  { no: 3, name: "Bandung Kota", followers: "180K+", link: "https://www.instagram.com/seputarbandungkota", region: "Jawa Barat" },
  { no: 4, name: "Bandung Point", followers: "625K+", link: "https://www.instagram.com/bandung.point", region: "Jawa Barat" },
  { no: 5, name: "Indramayu Info", followers: "218K+", link: "https://www.instagram.com/indramayuinfo", region: "Jawa Barat" },
  { no: 6, name: "Info Majalengka", followers: "102K+", link: "https://www.instagram.com/infomajalengka", region: "Jawa Barat" },
  { no: 7, name: "Info Karawang", followers: "635K+", link: "https://www.instagram.com/infokrw", region: "Jawa Barat" },
  { no: 8, name: "Zona Karawang", followers: "123K+", link: "https://www.instagram.com/zonakrw", region: "Jawa Barat" },
  { no: 9, name: "Cirebon Raya", followers: "49K+", link: "https://www.instagram.com/cirebonrayainfo", region: "Jawa Barat" },
  { no: 10, name: "Subang Info", followers: "155K+", link: "https://www.instagram.com/subang.info", region: "Jawa Barat" },
  { no: 11, name: "Info Kuningan", followers: "141K+", link: "https://www.instagram.com/infokuningan", region: "Jawa Barat" },
  { no: 12, name: "InfoBandung.com", followers: "783K+", link: "https://www.instagram.com/infobdgcom", region: "Jawa Barat" },
  // Jawa Tengah
  { no: 1, name: "Magelang", followers: "282K+", link: "https://www.instagram.com/magelang", region: "Jawa Tengah" },
  { no: 2, name: "Wonosobo Zone", followers: "530K+", link: "https://www.instagram.com/wonosobozone", region: "Jawa Tengah" },
  { no: 3, name: "Info Kejadian Demak", followers: "242K+", link: "https://www.instagram.com/infokejadiandemak", region: "Jawa Tengah" },
  { no: 4, name: "Asli Kendal", followers: "68K+", link: "https://www.instagram.com/kendal.ra", region: "Jawa Tengah" },
  { no: 5, name: "Berita Kebumen", followers: "164K+", link: "https://www.instagram.com/beritakebumen", region: "Jawa Tengah" },
  { no: 6, name: "Rembang Update", followers: "47K+", link: "https://www.instagram.com/rembangupdates", region: "Jawa Tengah" },
  { no: 7, name: "Batang Info", followers: "182K+", link: "https://www.instagram.com/batang_info", region: "Jawa Tengah" },
  { no: 8, name: "Batang Update", followers: "124K+", link: "https://www.instagram.com/batang.update", region: "Jawa Tengah" },
  { no: 9, name: "Berita Pekalongan", followers: "127K+", link: "https://www.instagram.com/beritapekalongan1", region: "Jawa Tengah" },
  { no: 10, name: "Seputar Banjarnegara", followers: "85K+", link: "https://www.instagram.com/infoseputarbanjarnegara", region: "Jawa Tengah" },
  { no: 11, name: "Pati News", followers: "81K+", link: "https://www.instagram.com/patinewscom", region: "Jawa Tengah" },
  { no: 12, name: "Update Info Jateng", followers: "84K+", link: "https://www.instagram.com/infoupdatejateng", region: "Jawa Tengah" },
  { no: 13, name: "Temanggung Zone", followers: "137K+", link: "https://www.instagram.com/temanggungzone", region: "Jawa Tengah" },
  { no: 14, name: "Banjarnegara Zone", followers: "136K+", link: "https://www.instagram.com/banjarnegarazone", region: "Jawa Tengah" },
  { no: 15, name: "Kebumen Zone", followers: "42K+", link: "https://www.instagram.com/kebumenzone", region: "Jawa Tengah" },
  { no: 16, name: "Purworejo Zone", followers: "28K+", link: "https://www.instagram.com/purworejozone", region: "Jawa Tengah" },
  { no: 17, name: "Jateng Zone", followers: "22K+", link: "https://www.instagram.com/jatengzone_id", region: "Jawa Tengah" },
  { no: 18, name: "Ini Yogyakarta", followers: "247K+", link: "https://www.instagram.com/iniyogyakarta", region: "Jawa Tengah" },
  { no: 19, name: "Magelang Zone", followers: "120K+", link: "https://www.instagram.com/magelangzone", region: "Jawa Tengah" },
  { no: 20, name: "Pekalongan Info", followers: "784K+", link: "https://www.instagram.com/pekalonganinfo", region: "Jawa Tengah" },
  { no: 21, name: "Cilacap Kekinian", followers: "208K+", link: "https://www.instagram.com/cilacap_kekinian", region: "Jawa Tengah" },
  { no: 22, name: "Kabar Solo", followers: "307K+", link: "https://www.instagram.com/kabarsolo", region: "Jawa Tengah" },
  // Jawa Timur
  { no: 1, name: "Ini Surabaya", followers: "529K+", link: "https://www.instagram.com/ini_surabaya", region: "Jawa Timur" },
  { no: 2, name: "Love Surabaya", followers: "648K+", link: "https://www.instagram.com/lovesuroboyo", region: "Jawa Timur" },
  { no: 3, name: "Info Ponorogo", followers: "293K+", link: "https://www.instagram.com/infoponorogo", region: "Jawa Timur" },
  { no: 4, name: "Ini Gresik", followers: "134K+", link: "https://www.instagram.com/inigresik", region: "Jawa Timur" },
  { no: 5, name: "Asli Nganjuk", followers: "200K+", link: "https://www.instagram.com/asli.nganjuk", region: "Jawa Timur" },
  { no: 6, name: "Disekitar Surabaya", followers: "145K+", link: "https://www.instagram.com/disekitar_surabaya", region: "Jawa Timur" },
  { no: 7, name: "Asli Arek Suroboyo", followers: "110K+", link: "https://www.instagram.com/asliareksuroboyo", region: "Jawa Timur" },
  { no: 8, name: "SurabayaKabarMetro", followers: "259K+", link: "https://www.instagram.com/surabayakabarmetro", region: "Jawa Timur" },
  { no: 9, name: "Surabaya Sosial", followers: "63K+", link: "https://www.instagram.com/surabaya.social", region: "Jawa Timur" },
  { no: 10, name: "Bicara Blitar", followers: "56K+", link: "https://www.instagram.com/bicarablitar", region: "Jawa Timur" },
  { no: 11, name: "Info Tuban", followers: "300K+", link: "https://www.instagram.com/info_tuban", region: "Jawa Timur" },
  { no: 12, name: "Info Probolinggo", followers: "103K+", link: "https://www.instagram.com/infoprobolinggo", region: "Jawa Timur" },
  { no: 13, name: "Ini Jawa Timur", followers: "449K+", link: "https://www.instagram.com/inijawatimur", region: "Jawa Timur" },
  { no: 14, name: "Asli Mojokerto", followers: "283K+", link: "https://www.instagram.com/aslimojokertocom", region: "Jawa Timur" },
  { no: 15, name: "Kediri Raya", followers: "206K+", link: "https://www.instagram.com/kediriraya_info", region: "Jawa Timur" },
  { no: 16, name: "Medsos Kediri", followers: "215K+", link: "https://www.instagram.com/medsoskediri", region: "Jawa Timur" },
  // Sumatra
  { no: 1, name: "Palembang Info", followers: "298K+", link: "https://www.instagram.com/palembanginfo", region: "Sumatra" },
  { no: 2, name: "PKU City", followers: "486K+", link: "https://www.instagram.com/pkufolk", region: "Sumatra" },
  { no: 3, name: "PKU Folk", followers: "282K+", link: "https://www.instagram.com/pkufolk", region: "Sumatra" },
  { no: 4, name: "PKU Kini", followers: "109K+", link: "https://www.instagram.com/pkukini", region: "Sumatra" },
  { no: 5, name: "Aceh Besar", followers: "186K+", link: "https://www.instagram.com/acehbesarnow", region: "Sumatra" },
  { no: 6, name: "TKP Medan", followers: "280K+", link: "https://www.instagram.com/tkpmedan", region: "Sumatra" },
  { no: 7, name: "Berita Sumbar", followers: "178K+", link: "https://www.instagram.com/beritasumbar", region: "Sumatra" },
  { no: 8, name: "Sudut Minangkabau", followers: "83K+", link: "https://www.instagram.com/sudutminang", region: "Sumatra" },
  { no: 9, name: "Curup Kito", followers: "119K+", link: "https://www.instagram.com/curup_kito", region: "Sumatra" },
  { no: 10, name: "Info Lubuk Linggau", followers: "160K+", link: "https://www.instagram.com/infolubuklinggau", region: "Sumatra" },
  { no: 11, name: "Info Dharmasraya", followers: "126K+", link: "https://www.instagram.com/infodharmasraya_", region: "Sumatra" },
  { no: 12, name: "Mandailing Natal", followers: "83K+", link: "https://www.instagram.com/visitmadinacom", region: "Sumatra" },
  { no: 13, name: "Info Andalas", followers: "153K+", link: "https://www.instagram.com/infoandalas", region: "Sumatra" },
  { no: 14, name: "I Love Lampung", followers: "224K+", link: "https://www.instagram.com/ilovelampung", region: "Sumatra" },
  { no: 15, name: "Selampung", followers: "157K+", link: "https://www.instagram.com/selampung", region: "Sumatra" },
  { no: 16, name: "Lampung Insta", followers: "195K+", link: "https://www.instagram.com/lampunginsta", region: "Sumatra" },
  { no: 17, name: "Lampung Geh", followers: "690K+", link: "https://www.instagram.com/lampuung", region: "Sumatra" },
  { no: 18, name: "Lampung Media", followers: "164K+", link: "https://www.instagram.com/infogeh", region: "Sumatra" },
  { no: 19, name: "Sosmed Binjai", followers: "91K+", link: "https://www.instagram.com/sosmed.sinjai", region: "Sumatra" },
  { no: 20, name: "Viral Pekanbaru", followers: "201K+", link: "https://www.instagram.com/viralpekanbaru", region: "Sumatra" },
  { no: 21, name: "Travel Mate Siantar", followers: "175K+", link: "https://www.instagram.com/travelmatesiantar", region: "Sumatra" },
  { no: 22, name: "Riau Folk", followers: "148K+", link: "https://www.instagram.com/riaufolk", region: "Sumatra" },
  { no: 23, name: "Info Bengkalis Riau", followers: "131K+", link: "https://www.instagram.com/bengkalisku", region: "Sumatra" },
  { no: 24, name: "Sumut Nusantara", followers: "70K+", link: "https://www.instagram.com/sumutnusantara", region: "Sumatra" },
  { no: 25, name: "Info Bandar Lampung", followers: "65K+", link: "https://www.instagram.com/info_bandar_lampung", region: "Sumatra" },
  { no: 26, name: "Satu Lampung", followers: "48K+", link: "https://www.instagram.com/satulampung.id", region: "Sumatra" },
  { no: 27, name: "Seputar Lampung", followers: "170K+", link: "https://www.instagram.com/seputar_lampung", region: "Sumatra" },
  // Sulawesi
  { no: 1, name: "Pare Pare Info", followers: "181K+", link: "https://www.instagram.com/parepareinfo", region: "Sulawesi" },
  { no: 2, name: "Makasar Info", followers: "400K+", link: "https://www.instagram.com/omsottamks", region: "Sulawesi" },
  { no: 3, name: "Makasar Infoku", followers: "512K+", link: "https://www.instagram.com/makassarinfoku", region: "Sulawesi" },
  { no: 4, name: "Pangkep Info", followers: "95K+", link: "https://www.instagram.com/pangkep.info", region: "Sulawesi" },
  { no: 5, name: "Info Kejadian Makasar", followers: "693K+", link: "https://www.instagram.com/info_kejadian_makassar", region: "Sulawesi" },
  { no: 6, name: "Maros Informasi", followers: "182K+", link: "https://www.instagram.com/maros.informasi", region: "Sulawesi" },
  { no: 7, name: "Makasar Infoo", followers: "308K+", link: "https://www.instagram.com/makasar.iinfo", region: "Sulawesi" },
  { no: 8, name: "Sosmed Makssar", followers: "275K+", link: "https://www.instagram.com/sosmedmakassar", region: "Sulawesi" },
  { no: 9, name: "Makasar_Info", followers: "210K+", link: "https://www.instagram.com/makasar_iinfo", region: "Sulawesi" },
  { no: 10, name: "Folk Makasar", followers: "209K+", link: "https://www.instagram.com/folkmks", region: "Sulawesi" },
  { no: 11, name: "Info Mamuju", followers: "173K+", link: "https://www.instagram.com/infomamuju_", region: "Sulawesi" },
  { no: 12, name: "Terowong Gowa", followers: "51K+", link: "https://www.instagram.com/teropong_gowaa", region: "Sulawesi" },
  { no: 13, name: "Kabar Makasar", followers: "71K+", link: "https://www.instagram.com/kabarmakassar.id", region: "Sulawesi" },
  // Indonesia Timur
  { no: 1, name: "Info Nabire", followers: "83K+", link: "https://www.instagram.com/infonabire", region: "Indonesia Timur" },
  { no: 2, name: "Info Sentani", followers: "178K+", link: "https://www.instagram.com/info_sentani", region: "Indonesia Timur" },
  { no: 3, name: "Papua Zone", followers: "275K+", link: "https://www.instagram.com/papuazone.id", region: "Indonesia Timur" },
  { no: 4, name: "Info Jayapura", followers: "273K+", link: "https://www.instagram.com/info.jayapura", region: "Indonesia Timur" },
  { no: 5, name: "Jayapura Medsos", followers: "29K+", link: "https://www.instagram.com/jayapura_medsos", region: "Indonesia Timur" },
  { no: 6, name: "Anak Timika", followers: "70K+", link: "https://www.instagram.com/anak_timika", region: "Indonesia Timur" },
  { no: 7, name: "Sorong Info", followers: "164K+", link: "https://www.instagram.com/sorong_info", region: "Indonesia Timur" },
  { no: 8, name: "Manokwari Info", followers: "32K+", link: "https://www.instagram.com/infomkw", region: "Indonesia Timur" },
  { no: 9, name: "Wamena Info", followers: "50K+", link: "https://www.instagram.com/infowamena", region: "Indonesia Timur" },
  // Kalimantan
  { no: 1, name: "Info Banjarmasin", followers: "346K+", link: "https://www.instagram.com/info_kejadian_banjarmasin", region: "Kalimantan" },
  { no: 2, name: "Penajam Terkini", followers: "192K+", link: "https://www.instagram.com/penajam_terkini", region: "Kalimantan" },
  { no: 3, name: "Info Samarinda", followers: "260K+", link: "https://www.instagram.com/info_samarinda_", region: "Kalimantan" },
  { no: 4, name: "Balikpapan Folks", followers: "195K+", link: "https://www.instagram.com/balikpapanfolks", region: "Kalimantan" },
  { no: 5, name: "Balikpapan Timeline", followers: "85K+", link: "https://www.instagram.com/balikpapantl", region: "Kalimantan" },
  { no: 6, name: "Info Palangkaraya", followers: "114K+", link: "https://www.instagram.com/infoplk", region: "Kalimantan" },
  { no: 7, name: "HST Murakata", followers: "20K+", link: "https://www.instagram.com/hstmurakata", region: "Kalimantan" },
  { no: 8, name: "Warga Amuntai", followers: "36K+", link: "https://www.instagram.com/wargaamuntai", region: "Kalimantan" },
  { no: 9, name: "Habar Banua", followers: "52K+", link: "https://www.instagram.com/habarbanua6", region: "Kalimantan" },
  { no: 10, name: "Peristiwa Banua", followers: "127K+", link: "https://www.instagram.com/peristiwabanua", region: "Kalimantan" },
  { no: 11, name: "Kalsel Go", followers: "74K+", link: "https://www.instagram.com/kalselgo", region: "Kalimantan" },
  { no: 12, name: "Banjarbaru Medsos", followers: "26K+", link: "https://www.instagram.com/banjarbarumedsos", region: "Kalimantan" },
  { no: 13, name: "INC Kalsel", followers: "44K+", link: "https://www.instagram.com/inc.kalsel", region: "Kalimantan" },
  { no: 14, name: "Banjarbaru24jam", followers: "43K+", link: "https://www.instagram.com/banjarbaru24jam", region: "Kalimantan" },
  { no: 15, name: "Fakta Banjarmasin", followers: "76K+", link: "https://www.instagram.com/faktabanjarmasin", region: "Kalimantan" },
  { no: 16, name: "Kabar Kutai Timur", followers: "48K+", link: "https://www.instagram.com/kabar.kutim", region: "Kalimantan" },
  { no: 17, name: "Info Penajam", followers: "90K+", link: "https://www.instagram.com/infopenajam", region: "Kalimantan" },
  { no: 18, name: "Kota Mempawah", followers: "87K+", link: "https://www.instagram.com/kotamempawah", region: "Kalimantan" },
  { no: 19, name: "Ketapang Terkini", followers: "153K+", link: "https://www.instagram.com/ketapangterkini", region: "Kalimantan" },
  { no: 20, name: "Bontang ku", followers: "129K+", link: "https://www.instagram.com/bontang_ku", region: "Kalimantan" },
  { no: 21, name: "Bontang Terkini", followers: "135K+", link: "https://www.instagram.com/bontangterkini", region: "Kalimantan" },
  // Bali
  { no: 1, name: "Tabanan Update", followers: "178K+", link: "https://www.instagram.com/tabanan_update", region: "Bali" },
  { no: 2, name: "Info Karang Asem", followers: "191K+", link: "https://www.instagram.com/infokarangasem_id", region: "Bali" },
  { no: 3, name: "Bali Info", followers: "25K+", link: "https://www.instagram.com/bali.infoo", region: "Bali" },
  { no: 4, name: "Denpasar Info", followers: "60K+", link: "https://www.instagram.com/denpasarinfoid", region: "Bali" },
];

const regions = ["Semua", "DKI Jakarta", "Jabodetabek", "Regional", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatra", "Sulawesi", "Indonesia Timur", "Kalimantan", "Bali"];

interface IdnMedia {
  rank: number;
  name: string;
  rate: number;
  url: string;
}

const IDN_MEDIA_DATA: IdnMedia[] = [
  { rank: 1, name: "Detik.com", rate: 6500000000, url: "https://detik.com" },
  { rank: 2, name: "Tribunnews.com", rate: 3500000000, url: "https://tribunnews.com" },
  { rank: 3, name: "Kompas.com", rate: 7000000000, url: "https://kompas.com" },
  { rank: 4, name: "Cnnindonesia.com", rate: 7500000000, url: "https://cnnindonesia.com" },
  { rank: 5, name: "Grid.id", rate: 6500000000, url: "https://grid.id" },
  { rank: 6, name: "Suara.com", rate: 4500000000, url: "https://suara.com" },
  { rank: 7, name: "Liputan6.com", rate: 5000000000, url: "https://liputan6.com" },
  { rank: 8, name: "CNBCIndonesia.com", rate: 7500000000, url: "https://cnbcindonesia.com" },
  { rank: 9, name: "Pikiran-rakyat.com", rate: 3500000000, url: "https://pikiran-rakyat.com" },
  { rank: 10, name: "Merdeka.com", rate: 3500000000, url: "https://merdeka.com" },
  { rank: 11, name: "Kumparan.com", rate: 3500000000, url: "https://kumparan.com" },
  { rank: 12, name: "Liputan6.com", rate: 3500000000, url: "https://liputan6.com" },
  { rank: 13, name: "CNBCIndonesia.com", rate: 7000000000, url: "https://cnbcindonesia.com" },
  { rank: 14, name: "Sindonews.com", rate: 4500000000, url: "https://sindonews.com" },
  { rank: 15, name: "IDNTimes.com", rate: 6000000000, url: "https://idntimes.com" },
  { rank: 16, name: "Okezone.com", rate: 5500000000, url: "https://okezone.com" },
  { rank: 17, name: "Viva.co.id", rate: 5000000000, url: "https://viva.co.id" },
  { rank: 18, name: "Tempo.co", rate: 5000000000, url: "https://tempo.co" },
  { rank: 19, name: "Kontan.co.id", rate: 6000000000, url: "https://kontan.co.id" },
  { rank: 20, name: "Republika.co.id", rate: 3500000000, url: "https://republika.co.id" },
  { rank: 21, name: "Kompas.tv", rate: 5500000000, url: "https://kompas.tv" },
  { rank: 22, name: "Jpnn.com", rate: 3000000000, url: "https://jpnn.com" },
  { rank: 23, name: "Bisnis.com", rate: 6500000000, url: "https://bisnis.com" },
  { rank: 24, name: "Tirto.id", rate: 3500000000, url: "https://tirto.id" },
  { rank: 25, name: "Disway.id", rate: 3000000000, url: "https://disway.id" },
  { rank: 26, name: "Inews.id", rate: 4500000000, url: "https://inews.id" },
  { rank: 27, name: "Jawapos.com", rate: 4000000000, url: "https://jawapos.com" },
  { rank: 28, name: "Katadata.co.id", rate: 3800000000, url: "https://katadata.co.id" },
  { rank: 29, name: "Suaramerdeka.com", rate: 2000000000, url: "https://suaramerdeka.com" },
  { rank: 30, name: "Antaranews.com", rate: 5000000000, url: "https://antaranews.com" },
  { rank: 31, name: "Tvonenews.com", rate: 7000000000, url: "https://tvonenews.com" },
  { rank: 32, name: "Wartaekonomi.co.id", rate: 2500000000, url: "https://wartaekonomi.co.id" },
  { rank: 33, name: "Mediaindonesia.com", rate: 3500000000, url: "https://mediaindonesia.com" },
  { rank: 34, name: "Hops.id", rate: 5000000000, url: "https://hops.id" },
  { rank: 35, name: "Medcom.id", rate: 3500000000, url: "https://medcom.id" },
  { rank: 36, name: "Beritasatu.com", rate: 3500000000, url: "https://beritasatu.com" },
  { rank: 37, name: "RMOL.id", rate: 2000000000, url: "https://rmol.id" },
  { rank: 38, name: "Investor.id", rate: 3500000000, url: "https://investor.id" },
  { rank: 39, name: "VOI.id", rate: 3000000000, url: "https://voi.id" },
  { rank: 40, name: "Akurat.co", rate: 1500000000, url: "https://akurat.co" },
  { rank: 41, name: "IDXChannel.com", rate: 4000000000, url: "https://idxchannel.com" },
  { rank: 42, name: "Antvklik.com", rate: 6000000000, url: "https://antvklik.com" },
  { rank: 43, name: "Poskota.co.id", rate: 2000000000, url: "https://poskota.co.id" },
  { rank: 44, name: "FortuneIDN.com", rate: 7000000000, url: "https://fortuneidn.com" },
  { rank: 45, name: "Tagar.id", rate: 1500000000, url: "https://tagar.id" },
  { rank: 46, name: "Metrotvnews.com", rate: 2500000000, url: "https://metrotvnews.com" },
  { rank: 47, name: "Harianterbit.com", rate: 2000000000, url: "https://harianterbit.com" },
  { rank: 48, name: "Gatra.com", rate: 2500000000, url: "https://gatra.com" },
  { rank: 49, name: "RM.id", rate: 2000000000, url: "https://rm.id" },
  { rank: 50, name: "JakartaDaily.id", rate: 1500000000, url: "https://indonesia.jakartadaily.id" },
];

function formatRate(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function getRateColor(rate: number): { bg: string; text: string } {
  if (rate >= 6_000_000_000) return { bg: "rgba(16,185,129,0.1)", text: "#10B981" };
  if (rate >= 3_500_000_000) return { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" };
  return { bg: "rgba(148,163,184,0.1)", text: "#94A3B8" };
}

function parseFollowers(f: string): number {
  const clean = f.replace(/[+K\s]/g, "").toLowerCase();
  if (clean.includes("juta") || clean.includes("m")) {
    return parseFloat(clean) * 1000000;
  }
  if (clean.endsWith("k")) {
    return parseFloat(clean) * 1000;
  }
  return parseFloat(clean) || 0;
}

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState("creators");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Semua");
  const [idnSearch, setIdnSearch] = useState("");

  const filtered = allMedia.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "Semua" || m.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const totalFollowers = allMedia.reduce((sum, m) => sum + parseFollowers(m.followers), 0);

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Database
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Database content creators, media, dan aset konten di seluruh Indonesia.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="border-b w-full justify-start gap-0 overflow-x-auto">
          <TabsTrigger value="creators" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent whitespace-nowrap data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            <Users className="w-4 h-4 mr-1.5" />
            Content Creators
          </TabsTrigger>
          <TabsTrigger value="homeless" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent whitespace-nowrap data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            <Globe className="w-4 h-4 mr-1.5" />
            Homeless Media
          </TabsTrigger>
          <TabsTrigger value="live-shopping" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent whitespace-nowrap data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            <Video className="w-4 h-4 mr-1.5" />
            Live Shopping &amp; Podcast Providers
          </TabsTrigger>
          <TabsTrigger value="idn-network" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent whitespace-nowrap data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            <Building2 className="w-4 h-4 mr-1.5" />
            Indonesian Media Network
          </TabsTrigger>
          <TabsTrigger value="intl-outlets" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent whitespace-nowrap data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            <Globe2 className="w-4 h-4 mr-1.5" />
            International Media Outlets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creators" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--ch-text-soft)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>Database Content Creators</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Fitur ini akan segera tersedia.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homeless" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
                  <Globe className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{allMedia.length}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Media</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
                  <Users className="w-5 h-5" style={{ color: "#16A34A" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{(totalFollowers / 1000000).toFixed(1)}M</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Followers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DBEAFE" }}>
                  <MapPin className="w-5 h-5" style={{ color: "#2563EB" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>11</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Wilayah</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                  <Database className="w-5 h-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{filtered.length}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{selectedRegion === "Semua" ? "Semua Wilayah" : selectedRegion}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
              <input
                type="text"
                placeholder="Cari media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 text-[13px] font-semibold rounded-lg border cursor-pointer"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Nama Media</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>Wilayah</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, idx) => (
                      <tr key={`${m.region}-${m.name}`} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: "var(--ch-border)" }}>
                        <td className="px-5 py-2.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{idx + 1}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.name}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "#E1306C" }}>
                            <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />
                            Instagram
                          </span>
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{m.region}</span>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] font-semibold text-right" style={{ color: "var(--ch-text)" }}>{m.followers}</td>
                        <td className="px-4 py-2.5 text-right">
                          <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-shopping" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--ch-text-soft)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>Live Shopping &amp; Podcast Providers</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Fitur ini akan segera tersedia.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="idn-network" className="mt-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
                  <Building2 className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{IDN_MEDIA_DATA.length}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Media Nasional</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
                  <Globe className="w-5 h-5" style={{ color: "#16A34A" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                    {formatRate(Math.round(IDN_MEDIA_DATA.reduce((sum, m) => sum + m.rate, 0) / IDN_MEDIA_DATA.length))}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Rate Rata-rata</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                  <Database className="w-5 h-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{IDN_MEDIA_DATA.filter((m) => m.rate >= 6_000_000_000).length}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Premium (6M+)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
              <input
                type="text"
                placeholder="Cari media nasional..."
                value={idnSearch}
                onChange={(e) => setIdnSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
              />
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Rank</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Media Nasional</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Rate Backlink (IDR)</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Tier</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IDN_MEDIA_DATA.filter((m) =>
                      m.name.toLowerCase().includes(idnSearch.toLowerCase())
                    ).map((m, idx) => {
                      const rc = getRateColor(m.rate);
                      return (
                        <tr key={`${m.rank}-${m.name}`} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: "var(--ch-border)" }}>
                          <td className="px-5 py-2.5 text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{idx + 1}</td>
                          <td className="px-4 py-2.5">
                            <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.name}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{formatRate(m.rate)}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.text }}>
                              {m.rate >= 6_000_000_000 ? "Premium" : m.rate >= 3_500_000_000 ? "Standard" : "Basic"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intl-outlets" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Globe2 className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--ch-text-soft)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>International Media Outlets</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Fitur ini akan segera tersedia.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
