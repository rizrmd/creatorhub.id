import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Users, MapPin, Share2, Tag, BarChart3, UsersRound, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, Marker, ScaleControl, useMap } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import * as topojson from "topojson-client";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { creatorsApi } from "@/lib/api";
import type { Creator } from "@/types";

const PROVINCE_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Provinsi.json";
const KABUPATEN_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Kota%20Kabupaten%20simplified.json";
const JAKARTA_GEOJSON_URL = "/jakarta-detailed.geo.json";

const GADM_NAME_TO_DISPLAY: Record<string, string> = {
  JakartaPusat: "Jakarta Pusat", JakartaSelatan: "Jakarta Selatan", JakartaBarat: "Jakarta Barat",
  JakartaTimur: "Jakarta Timur", JakartaUtara: "Jakarta Utara", KepulauanSeribu: "Kepulauan Seribu",
};

const PROVINCES_38 = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Selatan",
  "Sumatera Barat",
  "Bengkulu",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Lampung",
  "Kep. Bangka Belitung",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Utara",
  "Banten",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Timur",
  "Nusa Tenggara Barat",
  "Gorontalo",
  "Sulawesi Barat",
  "Sulawesi Tengah",
  "Sulawesi Utara",
  "Sulawesi Tenggara",
  "Sulawesi Selatan",
  "Maluku Utara",
  "Maluku",
  "Papua Barat",
  "Papua",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Barat Daya",
];

const CITY_TO_PROVINCE: Record<string, string> = {
  // DKI Jakarta
  "Jakarta Pusat": "DKI Jakarta", "Jakarta Selatan": "DKI Jakarta", "Jakarta Barat": "DKI Jakarta",
  "Jakarta Timur": "DKI Jakarta", "Jakarta Utara": "DKI Jakarta", "Kepulauan Seribu": "DKI Jakarta",
  "Jakarta": "DKI Jakarta", "DKI Jakarta": "DKI Jakarta", "Daerah Khusus Ibukota Jakarta": "DKI Jakarta", "Dk Jakarta": "DKI Jakarta",
  "Special Capital Region of Jakarta": "DKI Jakarta", "Ciputat": "DKI Jakarta", "Bintaro": "DKI Jakarta", "Cempaka putih": "DKI Jakarta",
  // Jawa Barat
  Bandung: "Jawa Barat", "Bandung Barat": "Jawa Barat", Bogor: "Jawa Barat", Depok: "Jawa Barat",
  Bekasi: "Jawa Barat", Cirebon: "Jawa Barat", Tasikmalaya: "Jawa Barat", Sukabumi: "Jawa Barat",
  Garut: "Jawa Barat", Karawang: "Jawa Barat", Subang: "Jawa Barat", Purwakarta: "Jawa Barat",
  Indramayu: "Jawa Barat", Cianjur: "Jawa Barat", Cimahi: "Jawa Barat", Sumedang: "Jawa Barat",
  Majalengka: "Jawa Barat", Kuningan: "Jawa Barat", "Sumatera Utara": "Jawa Barat",
  "Jawa Barat": "Jawa Barat", Pangandaran: "Jawa Barat", "West Java": "Jawa Barat",
  // Jawa Timur
  Surabaya: "Jawa Timur", Malang: "Jawa Timur", "Kediri": "Jawa Timur", "Madiun": "Jawa Timur",
  "Probolinggo": "Jawa Timur", "Lumajang": "Jawa Timur", "Jember": "Jawa Timur",
  "Banyuwangi": "Jawa Timur", "Blitar": "Jawa Timur", "Pasuruan": "Jawa Timur",
  "Sidoarjo": "Jawa Timur", "Gresik": "Jawa Timur", "Tuban": "Jawa Timur",
  "Lamongan": "Jawa Timur", "Mojokerto": "Jawa Timur", "Jawa Timur": "Jawa Timur",
  "East Java": "Jawa Timur", Tulungagung: "Jawa Timur", Ponorogo: "Jawa Timur",
  "Bojonegoro": "Jawa Timur", "Pacitan": "Jawa Timur", Magetan: "Jawa Timur",
  Ngawi: "Jawa Timur", Nganjuk: "Jawa Timur", Blora: "Jawa Timur", "Madura": "Jawa Timur",
  Trenggalek: "Jawa Timur", Situbondo: "Jawa Timur", Bondowoso: "Jawa Timur", Bangkalan: "Jawa Timur",
  Sampang: "Jawa Timur", Sumenep: "Jawa Timur", Pamekasan: "Jawa Timur",
  // Jawa Tengah
  Semarang: "Jawa Tengah", Solo: "Jawa Tengah", "Pekalongan": "Jawa Tengah",
  "Tegal": "Jawa Tengah", "Purwokerto": "Jawa Tengah", "Magelang": "Jawa Tengah",
  "Jawa Tengah": "Jawa Tengah", "Kendal": "Jawa Tengah", "Pemalang": "Jawa Tengah",
  "Purbalingga": "Jawa Tengah", "Banjarnegara": "Jawa Tengah", "Kebumen": "Jawa Tengah",
  "Klaten": "Jawa Tengah", "Sukoharjo": "Jawa Tengah", "Wonogiri": "Jawa Tengah",
  "Karanganyar": "Jawa Tengah", "Sragen": "Jawa Tengah", "Boyolali": "Jawa Tengah",
  "Demak": "Jawa Tengah", "Kudus": "Jawa Tengah", "Jepara": "Jawa Tengah",
  "Rembang": "Jawa Tengah", "Pati": "Jawa Tengah", "Brebes": "Jawa Tengah",
  "Cilacap": "Jawa Tengah", "Banyumas": "Jawa Tengah", "Purworejo": "Jawa Tengah",
  "Wonosobo": "Jawa Tengah", "Temanggung": "Jawa Tengah", "Grobogan": "Jawa Tengah",
  "Batang": "Jawa Tengah", "Salatiga": "Jawa Tengah", "Surakarta": "Jawa Tengah",
  "Kota Pekalongan": "Jawa Tengah",
  // DI Yogyakarta
  Yogyakarta: "DI Yogyakarta", "DI Yogyakarta": "DI Yogyakarta", "Daerah Istimewa Yogyakarta": "DI Yogyakarta",
  Sleman: "DI Yogyakarta", Bantul: "DI Yogyakarta", "Gunung Kidul": "DI Yogyakarta",
  "Kulon Progo": "DI Yogyakarta", "Jogyakarta": "DI Yogyakarta",
  // Banten
  Serang: "Banten", "Tangerang": "Banten", "Tangerang Selatan": "Banten", "Cilegon": "Banten",
  Lebak: "Banten", Pandeglang: "Banten", "Banten": "Banten",
  // Bali
  Bali: "Bali", Denpasar: "Bali", Badung: "Bali", Gianyar: "Bali",
  Buleleng: "Bali", Tabanan: "Bali", "Karang Asem": "Bali", Klungkung: "Bali", Jembrana: "Bali",
  // Nusa Tenggara Barat
  Mataram: "Nusa Tenggara Barat", "Nusa Tenggara Barat": "Nusa Tenggara Barat", Sumbawa: "Nusa Tenggara Barat",
  "Lombok Timur": "Nusa Tenggara Barat", "Lombok Tengah": "Nusa Tenggara Barat",
  "Lombok Barat": "Nusa Tenggara Barat", "Sumbawa Barat": "Nusa Tenggara Barat", "Dompu": "Nusa Tenggara Barat",
  "Bima": "Nusa Tenggara Barat", "Lombok Utara": "Nusa Tenggara Barat",
  // Nusa Tenggara Timur
  Kupang: "Nusa Tenggara Timur", "Nusa Tenggara Timur": "Nusa Tenggara Timur", "Alor": "Nusa Tenggara Timur",
  Ende: "Nusa Tenggara Timur", "Flores Timur": "Nusa Tenggara Timur", Sikka: "Nusa Tenggara Timur",
  Belu: "Nusa Tenggara Timur", "Timor Tengah Selatan": "Nusa Tenggara Timur", "Timor Tengah Utara": "Nusa Tenggara Timur",
  Lembata: "Nusa Tenggara Timur", Manggarai: "Nusa Tenggara Timur", "Manggarai Barat": "Nusa Tenggara Timur",
  "Manggarai Timur": "Nusa Tenggara Timur", "Ngada": "Nusa Tenggara Timur", "Nagekeo": "Nusa Tenggara Timur",
  "Sumba Barat": "Nusa Tenggara Timur", "Sumba Timur": "Nusa Tenggara Timur",
  "Sumba Barat Daya": "Nusa Tenggara Timur", "Rote Ndao": "Nusa Tenggara Timur",
  // Sumatera Utara
  Medan: "Sumatera Utara", "Pematang Siantar": "Sumatera Utara", "Pematangsiantar": "Sumatera Utara",
  Binjai: "Sumatera Utara", "Deli Serdang": "Sumatera Utara", "Simalungun": "Sumatera Utara",
  "Labuhan Batu": "Sumatera Utara", "Labuhan Batu Utara": "Sumatera Utara", "Labuhan Batu Selatan": "Sumatera Utara",
  "Asahan": "Sumatera Utara", "Batubara": "Sumatera Utara", "Tanjung Balai": "Sumatera Utara",
  "Tebing Tinggi": "Sumatera Utara", "Langkat": "Sumatera Utara", "Karo": "Sumatera Utara",
  "Serdang Bedagai": "Sumatera Utara", "Mandailing Natal": "Sumatera Utara",
  "Tapanuli Utara": "Sumatera Utara", "Tapanuli Selatan": "Sumatera Utara", "Tapanuli Tengah": "Sumatera Utara",
  "Nias": "Sumatera Utara", "Nias Selatan": "Sumatera Utara", "Nias Utara": "Sumatera Utara",
  "Samosir": "Sumatera Utara", "Humbang Hasundutan": "Sumatera Utara", "Pakpak Bharat": "Sumatera Utara",
  "Toba Samosir": "Sumatera Utara", "Padangsidimpuan": "Sumatera Utara", "Gunungsitoli": "Sumatera Utara",
  "Batu Bara": "Sumatera Utara", "Dairi": "Sumatera Utara",
  // Sumatera Barat
  "Padang": "Sumatera Barat", "Sumatera Barat": "Sumatera Barat", "Bukittinggi": "Sumatera Barat",
  "Payakumbuh": "Sumatera Barat", "Padang Pariaman": "Sumatera Barat", "Tanah Datar": "Sumatera Barat",
  "Agam": "Sumatera Barat", "Solok": "Sumatera Barat", "Pesisir Selatan": "Sumatera Barat",
  "Sijunjung": "Sumatera Barat", "Pasaman": "Sumatera Barat", "Pasaman Barat": "Sumatera Barat",
  "Lima Puluh Kota": "Sumatera Barat", "Kepulauan Mentawai": "Sumatera Barat",
  "Solok Selatan": "Sumatera Barat", "Padang Panjang": "Sumatera Barat", "Sawah Lunto": "Sumatera Barat",
  "Pariaman": "Sumatera Barat",
  // Sumatera Selatan
  Palembang: "Sumatera Selatan", "Sumatera Selatan": "Sumatera Selatan", "Prabumulih": "Sumatera Selatan",
  "Lubuklinggau": "Sumatera Selatan", "Pagar Alam": "Sumatera Selatan", "Ogan Komering Ulu": "Sumatera Selatan",
  "Ogan Komering Ilir": "Sumatera Selatan", "Muara Enim": "Sumatera Selatan", "Lahat": "Sumatera Selatan",
  "Musi Banyuasin": "Sumatera Selatan", "Banyu Asin": "Sumatera Selatan", "Ogan Ilir": "Sumatera Selatan",
  "Empat Lawang": "Sumatera Selatan", "Penukal Abab Lematang Ilir": "Sumatera Selatan",
  "Musi Rawas": "Sumatera Selatan", "Musi Rawas Utara": "Sumatera Selatan",
  "Ogan Komering Ulu Timur": "Sumatera Selatan",
  // Riau
  "Pekanbaru": "Riau", Riau: "Riau", Dumai: "Riau", "Bengkalis": "Riau",
  "Siak": "Riau", "Kampar": "Riau", "Rokan Hilir": "Riau", "Rokan Hulu": "Riau",
  "Pelalawan": "Riau", "Indragiri Hilir": "Riau", "Indragiri Hulu": "Riau",
  "Kuantan Singingi": "Riau",
  // Jambi
  Jambi: "Jambi", "Muaro Jambi": "Jambi", "Kerinci": "Jambi", "Sarolangun": "Jambi",
  "Batang Hari": "Jambi", "Bungo": "Jambi", "Tebo": "Jambi", "Merangin": "Jambi",
  "Tanjab Barat": "Jambi", "Tanjung Jabung Barat": "Jambi", "Tanjung Jabung Timur": "Jambi",
  "Sungai Penuh": "Jambi",
  // Bengkulu
  Bengkulu: "Bengkulu", "Bengkulu Utara": "Bengkulu", "Bengkulu Selatan": "Bengkulu",
  "Bengkulu Tengah": "Bengkulu", "Rejang Lebong": "Bengkulu", "Kaur": "Bengkulu",
  "Kepahiang": "Bengkulu", "Mukomuko": "Bengkulu", "Seluma": "Bengkulu",
  // Lampung
  "Bandar Lampung": "Lampung", Lampung: "Lampung", Metro: "Lampung",
  "Lampung Tengah": "Lampung", "Lampung Selatan": "Lampung", "Lampung Utara": "Lampung",
  "Lampung Timur": "Lampung", "Lampung Barat": "Lampung", "Tanggamus": "Lampung",
  "Way Kanan": "Lampung", "Pesawaran": "Lampung", "Pringsewu": "Lampung",
  "Tulang Bawang": "Lampung", "Tulang Bawang Barat": "Lampung", "Pesisir Barat": "Lampung",
  "Mesuji": "Lampung",
  // Aceh
  "Banda Aceh": "Aceh", "Aceh Utara": "Aceh", "Aceh Barat": "Aceh",
  "Aceh Tengah": "Aceh", "Aceh Timur": "Aceh", "Aceh Selatan": "Aceh",
  "Aceh Tamiang": "Aceh", "Aceh Besar": "Aceh", "Bireuen": "Aceh",
  "lhokseumawe": "Aceh", "Aceh Jaya": "Aceh", "Aceh Barat Daya": "Aceh",
  "Aceh Singkil": "Aceh", "Simeulue": "Aceh", "Sabang": "Aceh",
  "Gayo Lues": "Aceh", "Bener Meriah": "Aceh", "Nagan Raya": "Aceh",
  "Aceh Tenggara": "Aceh",
  // Kepulauan Riau
  Batam: "Kepulauan Riau", "Tanjung Pinang": "Kepulauan Riau", "Tanjungpinang": "Kepulauan Riau",
  "Karimun": "Kepulauan Riau", Bintan: "Kepulauan Riau", "Natuna": "Kepulauan Riau",
  Lingga: "Kepulauan Riau",
  // Kep. Bangka Belitung
  "Pangkal Pinang": "Kep. Bangka Belitung", "Kep. Bangka Belitung": "Kep. Bangka Belitung",
  "Bangka": "Kep. Bangka Belitung", "Bangka Barat": "Kep. Bangka Belitung",
  "Bangka Selatan": "Kep. Bangka Belitung", "Bangka Tengah": "Kep. Bangka Belitung",
  "Belitung": "Kep. Bangka Belitung", "Belitung Timur": "Kep. Bangka Belitung",
  // Kalimantan Barat
  Pontianak: "Kalimantan Barat", Singkawang: "Kalimantan Barat", "Kalimantan Barat": "Kalimantan Barat",
  Sambas: "Kalimantan Barat", "Bengkayang": "Kalimantan Barat", Sanggau: "Kalimantan Barat",
  Ketapang: "Kalimantan Barat", Sintang: "Kalimantan Barat", "Melawi": "Kalimantan Barat",
  "Kapuas Hulu": "Kalimantan Barat", "Sekadau": "Kalimantan Barat", "Landak": "Kalimantan Barat",
  "Kubu Raya": "Kalimantan Barat", "Kayong Utara": "Kalimantan Barat", "Mempawah": "Kalimantan Barat",
  // Kalimantan Tengah
  "Palangka Raya": "Kalimantan Tengah", "Kalimantan Tengah": "Kalimantan Tengah",
  "Kotawaringin Timur": "Kalimantan Tengah", "Kotawaringin Barat": "Kalimantan Tengah",
  "Barito Utara": "Kalimantan Tengah", "Barito Timur": "Kalimantan Tengah",
  "Barito Selatan": "Kalimantan Tengah", "Barito Kuala": "Kalimantan Tengah",
  Kapuas: "Kalimantan Tengah",
  Seruyan: "Kalimantan Tengah", Katingan: "Kalimantan Tengah",
  "Murung Raya": "Kalimantan Tengah", Lamandau: "Kalimantan Tengah",
  Sukamara: "Kalimantan Tengah", "Gunung Mas": "Kalimantan Tengah",
  "Pulang Pisau": "Kalimantan Tengah",
  // Kalimantan Selatan
  Banjarmasin: "Kalimantan Selatan", "Banjar Baru": "Kalimantan Selatan",
  "Kalimantan Selatan": "Kalimantan Selatan", "Kota Baru": "Kalimantan Selatan",
  "Tanah Bumbu": "Kalimantan Selatan", "Tanah Laut": "Kalimantan Selatan",
  Tapin: "Kalimantan Selatan", "Hulu Sungai Selatan": "Kalimantan Selatan",
  "Hulu Sungai Tengah": "Kalimantan Selatan", "Hulu Sungai Utara": "Kalimantan Selatan",
  Balangan: "Kalimantan Selatan", Tabalong: "Kalimantan Selatan",
  // Kalimantan Timur
  Balikpapan: "Kalimantan Timur", Samarinda: "Kalimantan Timur", "Kalimantan Timur": "Kalimantan Timur",
  Bontang: "Kalimantan Timur", "Kutai Kartanegara": "Kalimantan Timur",
  "Kutai Timur": "Kalimantan Timur", "Kutai Barat": "Kalimantan Timur",
  Paser: "Kalimantan Timur", "Penajam Paser Utara": "Kalimantan Timur", Berau: "Kalimantan Timur",
  // Kalimantan Utara
  "Tanjung Selor": "Kalimantan Utara", "Kalimantan Utara": "Kalimantan Utara",
  Bulungan: "Kalimantan Utara", "Tana Tidung": "Kalimantan Utara",
  Malinau: "Kalimantan Utara", Nunukan: "Kalimantan Utara", Tarakan: "Kalimantan Utara",
  // Sulawesi Utara
  Manado: "Sulawesi Utara", Bitung: "Sulawesi Utara", Tomohon: "Sulawesi Utara",
  "Minahasa Utara": "Sulawesi Utara", "Minahasa": "Sulawesi Utara", "Minahasa Selatan": "Sulawesi Utara",
  "Minahasa Tenggara": "Sulawesi Utara", "Bolaang Mongondow": "Sulawesi Utara",
  "Bolaang Mongondow Timur": "Sulawesi Utara", "Bolaang Mongondow Utara": "Sulawesi Utara",
  "Bolaang Mongondow Selatan": "Sulawesi Utara", "Kepulauan Talaud": "Sulawesi Utara",
  "Kepulauan Sangihe": "Sulawesi Utara", "Kotamobagu": "Sulawesi Utara",
  // Sulawesi Tengah
  Palu: "Sulawesi Tengah", "Sulawesi Tengah": "Sulawesi Tengah", Poso: "Sulawesi Tengah",
  "Banggai": "Sulawesi Tengah", "Donggala": "Sulawesi Tengah", "Toli-toli": "Sulawesi Tengah",
  "Buol": "Sulawesi Tengah", "Morowali": "Sulawesi Tengah", "Parigi Moutong": "Sulawesi Tengah",
  "Banggai Kepulauan": "Sulawesi Tengah", "Banggai Laut": "Sulawesi Tengah",
  "Tojo Una-una": "Sulawesi Tengah", "Sigi": "Sulawesi Tengah",
  // Sulawesi Selatan
  Makassar: "Sulawesi Selatan", "Sulawesi Selatan": "Sulawesi Selatan", Palopo: "Sulawesi Selatan",
  Parepare: "Sulawesi Selatan", Gowa: "Sulawesi Selatan", Takalar: "Sulawesi Selatan",
  Jeneponto: "Sulawesi Selatan", Bulukumba: "Sulawesi Selatan", "Bantaeng": "Sulawesi Selatan",
  Sinjai: "Sulawesi Selatan", Maros: "Sulawesi Selatan", Pangkajene: "Sulawesi Selatan",
  "Pinrang": "Sulawesi Selatan", Sidenreng: "Sulawesi Selatan", "Sidenreng Rappang": "Sulawesi Selatan",
  Barru: "Sulawesi Selatan", Bone: "Sulawesi Selatan", Soppeng: "Sulawesi Selatan",
  Wajo: "Sulawesi Selatan", Selayar: "Sulawesi Selatan", Luwu: "Sulawesi Selatan",
  "Luwu Utara": "Sulawesi Selatan", "Luwu Timur": "Sulawesi Selatan", "Tana Toraja": "Sulawesi Selatan",
  "Toraja Utara": "Sulawesi Selatan", Enrekang: "Sulawesi Selatan",
  // Sulawesi Tenggara
  Kendari: "Sulawesi Tenggara", Baubau: "Sulawesi Tenggara", "Sulawesi Tenggara": "Sulawesi Tenggara",
  Konawe: "Sulawesi Tenggara", "Konawe Selatan": "Sulawesi Tenggara", "Konawe Utara": "Sulawesi Tenggara",
  Kolaka: "Sulawesi Tenggara", "Kolaka Utara": "Sulawesi Tenggara", "Kolaka Timur": "Sulawesi Tenggara",
  Bombana: "Sulawesi Tenggara", "Buton": "Sulawesi Tenggara", "Buton Selatan": "Sulawesi Tenggara",
  "Buton Tengah": "Sulawesi Tenggara", "Buton Utara": "Sulawesi Tenggara", Muna: "Sulawesi Tenggara",
  // Sulawesi Barat
  Mamuju: "Sulawesi Barat", "Sulawesi Barat": "Sulawesi Barat", "Majene": "Sulawesi Barat",
  "Polewali Mandar": "Sulawesi Barat", "Mamuju Tengah": "Sulawesi Barat",
  // Gorontalo
  Gorontalo: "Gorontalo", "Gorontalo Utara": "Gorontalo",
  // Maluku
  Ambon: "Maluku", "Maluku Tengah": "Maluku", "Maluku Tenggara": "Maluku",
  "Maluku Tenggara Barat": "Maluku", "Seram Bagian Barat": "Maluku",
  Buru: "Maluku",
  // Maluku Utara
  "Sofifi": "Maluku Utara", "Maluku Utara": "Maluku Utara", Ternate: "Maluku Utara",
  "Tidore Kepulauan": "Maluku Utara", "Halmahera Utara": "Maluku Utara",
  "Halmahera Selatan": "Maluku Utara", "Halmahera Tengah": "Maluku Utara",
  "Halmahera Timur": "Maluku Utara", "Halmahera Barat": "Maluku Utara",
  "Kepulauan Sula": "Maluku Utara",
  // Papua
  Jayapura: "Papua", Papua: "Papua", Merauke: "Papua", Mimika: "Papua",
  "Nabire": "Papua", "Biak Numfor": "Papua", "Keerom": "Papua",
  "Kepulauan Yapen": "Papua", "Tolikara": "Papua", "Yalimo": "Papua",
  "Teluk Wondama": "Papua", "Jayawijaya": "Papua", "Nduga": "Papua",
  "Puncak Jaya": "Papua", "Puncak": "Papua", "Dogiyai": "Papua",
  "Deiyai": "Papua", "Intan Jaya": "Papua",
  // Papua Barat
  "Manokwari": "Papua Barat", "Papua Barat": "Papua Barat", Sorong: "Papua Barat",
  "Teluk Bintuni": "Papua Barat", "Fakfak": "Papua Barat", "Manokwari Selatan": "Papua Barat",
  "Raja Ampat": "Papua Barat",
  // Papua Tengah
  "Papua Tengah": "Papua Tengah",
  // Papua Pegunungan
  "Papua Pegunungan": "Papua Pegunungan",
  // Papua Selatan
  "Papua Selatan": "Papua Selatan", "Boven Digoel": "Papua Selatan", "Mappi": "Papua Selatan",
  // Papua Barat Daya
  "Papua Barat Daya": "Papua Barat Daya",
};

function normalizeJakartaCity(name: string): string {
  const lower = name.toLowerCase().trim();
  if (lower.includes("pusat")) return "Jakarta Pusat";
  if (lower.includes("selatan")) return "Jakarta Selatan";
  if (lower.includes("barat")) return "Jakarta Barat";
  if (lower.includes("timur")) return "Jakarta Timur";
  if (lower.includes("utara")) return "Jakarta Utara";
  if (lower.includes("kepulauan seribu") || lower.includes("seribu")) return "Kepulauan Seribu";
  return "Jakarta Pusat";
}

function displayGadmName(raw: string): string {
  return GADM_NAME_TO_DISPLAY[raw] || raw;
}

function gadmNameToFilterName(raw: string): string {
  return GADM_NAME_TO_DISPLAY[raw] || raw;
}

function getProvince(name: string): string {
  const direct = CITY_TO_PROVINCE[name];
  if (direct) return direct;
  const lower = name.toLowerCase();
  if (lower.includes("jakarta") || lower === "dki jakarta" || lower === "dk jakarta") return "DKI Jakarta";
  if (lower.includes("bandung")) return "Jawa Barat";
  if (lower.includes("surabaya")) return "Jawa Timur";
  if (lower.includes("semarang")) return "Jawa Tengah";
  if (lower.includes("medan")) return "Sumatera Utara";
  if (lower.includes("makassar")) return "Sulawesi Selatan";
  if (lower.includes("bali") || lower.includes("denpasar")) return "Bali";
  if (lower.includes("yogyakarta") || lower.includes("sleman")) return "DI Yogyakarta";
  if (lower.includes("malang")) return "Jawa Timur";
  // Kalimantan fallback
  if (lower.includes("kalimantan tengah") || lower.includes("palangka") || lower.includes("kotawaringin") ||
      lower.includes("barito") || lower.includes("kapuas") || lower.includes("seruyan") ||
      lower.includes("katingan") || lower.includes("murung") || lower.includes("lamandau") ||
      lower.includes("sukamara") || lower.includes("gunung mas") || lower.includes("pulang pisau")) return "Kalimantan Tengah";
  if (lower.includes("kalimantan barat") || lower.includes("pontianak") || lower.includes("singkawang") ||
      lower.includes("sambas") || lower.includes("bengkayang") || lower.includes("sanggau") ||
      lower.includes("ketapang") || lower.includes("sintang") || lower.includes("melawi") ||
      lower.includes("kubu raya") || lower.includes("landak") || lower.includes("mempawah")) return "Kalimantan Barat";
  if (lower.includes("kalimantan selatan") || lower.includes("banjarmasin") || lower.includes("banjar baru") ||
      lower.includes("tanah bumbu") || lower.includes("tanah laut") || lower.includes("tapin") ||
      lower.includes("hulu sungai") || lower.includes("balangan") || lower.includes("tabalong")) return "Kalimantan Selatan";
  if (lower.includes("kalimantan timur") || lower.includes("balikpapan") || lower.includes("samarinda") ||
      lower.includes("bontang") || lower.includes("kutai") || lower.includes("paser") ||
      lower.includes("berau") || lower.includes("penajam")) return "Kalimantan Timur";
  if (lower.includes("kalimantan utara") || lower.includes("tanjung selor") || lower.includes("bulungan") ||
      lower.includes("tana tidung") || lower.includes("malinau") || lower.includes("nunukan") ||
      lower.includes("tarakan")) return "Kalimantan Utara";
  // Sulawesi fallback
  if (lower.includes("sulawesi selatan") || lower.includes("gowa") || lower.includes("takalar") ||
      lower.includes("jeneponto") || lower.includes("bulukumba") || lower.includes("sinjai") ||
      lower.includes("maros") || lower.includes("bone") || lower.includes("wajo") ||
      lower.includes("luwu") || lower.includes("toraja") || lower.includes("enrekang")) return "Sulawesi Selatan";
  if (lower.includes("sulawesi tenggara") || lower.includes("konawe") || lower.includes("kolaka") ||
      lower.includes("bombana") || lower.includes("buton") || lower.includes("munа")) return "Sulawesi Tenggara";
  if (lower.includes("sulawesi tengah") || lower.includes("poso") || lower.includes("banggai") ||
      lower.includes("donggala") || lower.includes("toli") || lower.includes("buol") ||
      lower.includes("morowali") || lower.includes("parigi") || lower.includes("sigi")) return "Sulawesi Tengah";
  if (lower.includes("sulawesi utara") || lower.includes("manado") || lower.includes("bitung") ||
      lower.includes("tomohon") || lower.includes("minahasa") || lower.includes("bolmong") ||
      lower.includes("kotamobagu")) return "Sulawesi Utara";
  if (lower.includes("sulawesi barat") || lower.includes("mamuju") || lower.includes("majene") ||
      lower.includes("polewali")) return "Sulawesi Barat";
  // Sumatra fallback
  if (lower.includes("sumatera utara") || lower.includes("deli serdang") || lower.includes("simalungun") ||
      lower.includes("labuhan batu") || lower.includes("asahan") || lower.includes("batubara") ||
      lower.includes("tanjung balai") || lower.includes("tebing tinggi") || lower.includes("langkat") ||
      lower.includes("karo") || lower.includes("serdang bedagai") || lower.includes("mandailing") ||
      lower.includes("tapanuli") || lower.includes("nias") || lower.includes("samosir") ||
      lower.includes("humbang") || lower.includes("pakpak") || lower.includes("toba") ||
      lower.includes("padangsidimpuan") || lower.includes("gunungsitoli") || lower.includes("dairi")) return "Sumatera Utara";
  if (lower.includes("sumatera barat") || lower.includes("bukittinggi") || lower.includes("payakumbuh") ||
      lower.includes("padang") || lower.includes("tanah datar") || lower.includes("agam") ||
      lower.includes("solok") || lower.includes("pesisir selatan") || lower.includes("sijunjung") ||
      lower.includes("pasaman") || lower.includes("lima puluh") || lower.includes("mentawai") ||
      lower.includes("pariaman")) return "Sumatera Barat";
  if (lower.includes("sumatera selatan") || lower.includes("prabumulih") || lower.includes("lubuklinggau") ||
      lower.includes("pagar alam") || lower.includes("ogan") || lower.includes("muara enim") ||
      lower.includes("lahat") || lower.includes("musi") || lower.includes("banyuasin") ||
      lower.includes("empat lawang") || lower.includes("penukal")) return "Sumatera Selatan";
  if (lower.includes("riau") || lower.includes("dumai") || lower.includes("bengkalis") ||
      lower.includes("siak") || lower.includes("kampar") || lower.includes("rokan") ||
      lower.includes("pelalawan") || lower.includes("indragiri") || lower.includes("kuantan")) return "Riau";
  if (lower.includes("jambi") || lower.includes("muaro jambi") || lower.includes("kerinci") ||
      lower.includes("sarolangun") || lower.includes("batang hari") || lower.includes("bungo") ||
      lower.includes("tebo") || lower.includes("merangin") || lower.includes("sungai penuh")) return "Jambi";
  if (lower.includes("bengkulu") || lower.includes("rejang") || lower.includes("kaur") ||
      lower.includes("kepahiang") || lower.includes("mukomuko") || lower.includes("seluma")) return "Bengkulu";
  if (lower.includes("lampung") || lower.includes("metro") || lower.includes("tanggamus") ||
      lower.includes("way kanan") || lower.includes("pesawaran") || lower.includes("pringsewu") ||
      lower.includes("tulang bawang") || lower.includes("mesuji")) return "Lampung";
  if (lower.includes("aceh") || lower.includes("banda aceh") || lower.includes("lhokseumawe") ||
      lower.includes("sabang") || lower.includes("bireuen") || lower.includes("simeulue") ||
      lower.includes("gayo lues") || lower.includes("bener meriah") || lower.includes("nagan raya")) return "Aceh";
  // Papua fallback
  if (lower.includes("papua barat") || lower.includes("manokwari") || lower.includes("sorong") ||
      lower.includes("teluk bintuni") || lower.includes("fakfak") || lower.includes("raja ampat")) return "Papua Barat";
  if (lower.includes("papua") || lower.includes("jayapura") || lower.includes("merauke") ||
      lower.includes("mimika") || lower.includes("nabire") || lower.includes("biak") ||
      lower.includes("keerom") || lower.includes("jayawijaya") || lower.includes("nduga") ||
      lower.includes("tolikara") || lower.includes("yalimo")) return "Papua";
  // Maluku fallback
  if (lower.includes("maluku") || lower.includes("ambon") || lower.includes("ternate") ||
      lower.includes("sofifi") || lower.includes("halmahera") || lower.includes("kepulauan sula")) {
    if (lower.includes("utara") || lower.includes("halmahera") || lower.includes("ternate") || lower.includes("sula")) return "Maluku Utara";
    return "Maluku";
  }
  // Nusa Tenggara fallback
  if (lower.includes("nusa tenggara barat") || lower.includes("lombok") || lower.includes("sumbawa") ||
      lower.includes("mataram") || lower.includes("bima") || lower.includes("dompu")) return "Nusa Tenggara Barat";
  if (lower.includes("nusa tenggara timur") || lower.includes("kupang") || lower.includes("alor") ||
      lower.includes("ende") || lower.includes("flores") || lower.includes("sikka") ||
      lower.includes("belu") || lower.includes("manggarai") || lower.includes("sumba") ||
      lower.includes("rote") || lower.includes("lembata") || lower.includes("ngada") ||
      lower.includes("nagekeo") || lower.includes("timor tengah")) return "Nusa Tenggara Timur";
  return name;
}

function computeCentroid(geometry: any): [number, number] | null {
  if (!geometry) return null;
  let allCoords: number[][] = [];
  if (geometry.type === "Polygon") {
    allCoords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      allCoords = allCoords.concat(polygon[0]);
    }
  }
  if (!allCoords || allCoords.length === 0) return null;
  let sumLng = 0, sumLat = 0;
  for (const c of allCoords) { sumLng += c[0]; sumLat += c[1]; }
  return [sumLat / allCoords.length, sumLng / allCoords.length];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MOCK_TRENDS: Record<string, string> = {};
const PROVINCE_LIST = Object.values(CITY_TO_PROVINCE);
const uniqueProvinces = [...new Set(PROVINCE_LIST)];
for (const p of uniqueProvinces) {
  const rng = seededRandom(hashString(p));
  const val = Math.floor(rng() * 25) + 3;
  MOCK_TRENDS[p] = `↑ ${val}%`;
}

const TIER_COLORS = ["#94A3B8", "#7c3aed", "#3B82F6", "#F97316", "#EF4444"];
const PLATFORM_COLORS = ["#E4405F", "#000000", "#FF0000", "#1877F2", "#1DA1F2", "#94A3B8"];
const GENDER_COLORS = ["#EC4899", "#3B82F6", "#94A3B8"];

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  if (followers >= 1000) return "Nano";
  return "Amplifier";
}

/* ---------- Map Components ---------- */
function ProvinceChoropleth({
  geoJsonData,
  provinceCounts,
  onProvinceClick,
}: {
  geoJsonData: FeatureCollection | null;
  provinceCounts: Map<string, number>;
  onProvinceClick: (name: string) => void;
}) {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const maxCount = useMemo(() => Math.max(...Array.from(provinceCounts.values()), 1), [provinceCounts]);

  useEffect(() => {
    map.setView([-2.5, 118.0], 5);
  }, [map, geoJsonData]);

  if (!geoJsonData) return null;

  function getColor(count: number): string {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "#1e40af";
    if (ratio > 0.5) return "#2563eb";
    if (ratio > 0.3) return "#3b82f6";
    if (ratio > 0.1) return "#60a5fa";
    if (ratio > 0) return "#93c5fd";
    return "rgba(30,41,59,0.3)";
  }

  return (
    <GeoJSON
      data={geoJsonData}
      ref={layerRef}
      style={(feature) => {
        if (!feature) return {};
        const name = feature.properties?.NAME_1 || "";
        const count = provinceCounts.get(name) ?? 0;
        return {
          fillColor: getColor(count),
          weight: 1,
          opacity: 0.6,
          color: "rgba(148,163,184,0.3)",
          fillOpacity: count > 0 ? 0.7 : 0.2,
        };
      }}
      onEachFeature={(feature, layer) => {
        const name = feature.properties?.NAME_1 || "Unknown";
        const count = provinceCounts.get(name) ?? 0;
        layer.bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:6px 10px;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:8px;">
            <strong style="font-size:13px;color:#F1F5F9;">${name}</strong><br/>
            <span style="font-size:12px;color:#93C5FD;">${count.toLocaleString()} creators</span>
          </div>`,
          { direction: "top", sticky: true }
        );
        layer.on("click", () => onProvinceClick(name));
      }}
    />
  );
}

/* ---------- Kabupaten GeoJSON Layer ---------- */
function KabupatenGeoJson({ geoJsonData }: { geoJsonData: FeatureCollection | null }) {
  if (!geoJsonData) return null;
  return (
    <GeoJSON
      data={geoJsonData}
      style={() => ({
        fillColor: "transparent",
        weight: 0.5,
        opacity: 0.4,
        color: "rgba(148,163,184,0.35)",
        fillOpacity: 0,
      })}
    />
  );
}

/* ---------- Province Name Labels ---------- */
function ProvinceLabels({ geoJsonData }: { geoJsonData: FeatureCollection | null }) {
  const labels = useMemo(() => {
    if (!geoJsonData) return [];
    return geoJsonData.features.map((f) => {
      const name = f.properties?.NAME_1 || "";
      const centroid = computeCentroid(f.geometry);
      return { name, centroid };
    }).filter((l) => l.centroid && l.name);
  }, [geoJsonData]);

  return (
    <>
      {labels.map((l) => (
        <Marker
          key={l.name}
          position={l.centroid!}
          icon={L.divIcon({
            className: "",
            iconSize: [200, 30],
            iconAnchor: [100, 15],
            html: `<div style="
              color: #F8FAFC;
              font-size: 11px;
              font-weight: 700;
              font-family: 'Plus Jakarta Sans', Inter, sans-serif;
              text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7);
              white-space: nowrap;
              display: block;
              text-align: center;
              pointer-events: none;
              letter-spacing: 0.5px;
              width: 200px;
              opacity: 0.85;
            ">${l.name}</div>`,
          })}
        />
      ))}
    </>
  );
}

/* ---------- Jakarta Region Choropleth ---------- */
function JakartaRegions({
  jakartaGeoJson,
  creators,
}: {
  jakartaGeoJson: FeatureCollection | null;
  creators: Creator[];
}) {
  const map = useMap();
  const [zoomed, setZoomed] = useState(false);

  const cityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of creators) {
      const city = normalizeJakartaCity(c.city);
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    return counts;
  }, [creators]);

  const maxCount = useMemo(() => Math.max(...Array.from(cityCounts.values()), 1), [cityCounts]);

  useEffect(() => {
    if (!zoomed && jakartaGeoJson) {
      map.setView([-6.175, 106.827], 11);
      setZoomed(true);
    }
  }, [jakartaGeoJson, map, zoomed]);

  if (!jakartaGeoJson) return null;

  const REGION_COLORS = [
    "#60A5FA",
    "#4ADE80",
    "#FB923C",
    "#C084FC",
    "#F472B6",
    "#2DD4BF",
  ];

  const jakartaKab = ["JakartaPusat", "JakartaSelatan", "JakartaBarat", "JakartaTimur", "JakartaUtara", "KepulauanSeribu"];

  function getRegionColor(name2: string, count: number): string {
    const idx = jakartaKab.indexOf(name2);
    const base = REGION_COLORS[idx >= 0 ? idx : 0];
    const ratio = count / maxCount;
    const opacity = 0.2 + ratio * 0.55;
    return base + Math.round(opacity * 255).toString(16).padStart(2, "0");
  }

  return (
    <GeoJSON
      data={jakartaGeoJson}
      style={(feature) => {
        const name = feature?.properties?.NAME_2 || "";
        const filterName = gadmNameToFilterName(name);
        const count = cityCounts.get(filterName) ?? 0;
        return {
          weight: 3,
          color: "rgba(255,255,255,0.9)",
          opacity: 1,
          fillColor: getRegionColor(name, count),
          fillOpacity: 0.7,
        };
      }}
      onEachFeature={(feature, layer) => {
        const name = feature.properties?.NAME_2 || "";
        const filterName = gadmNameToFilterName(name);
        const count = cityCounts.get(filterName) ?? 0;
        const displayName = displayGadmName(name);
        layer.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans',Inter,sans-serif;padding:8px 12px;background:rgba(15,23,42,0.95);border:1px solid rgba(255,255,255,0.15);border-radius:10px;backdrop-filter:blur(8px);">
            <div style="font-weight:700;font-size:14px;color:#F1F5F9;">${displayName}</div>
            <div style="font-size:12px;color:#93C5FD;margin-top:2px;">${count.toLocaleString()} creators</div>
          </div>`,
          { direction: "top", sticky: true, opacity: 1 }
        );
      }}
    />
  );
}

/* ---------- Kabupaten Name Labels ---------- */
function KabupatenLabels({ jakartaGeoJson }: { jakartaGeoJson: FeatureCollection | null }) {
  const labels = useMemo(() => {
    if (!jakartaGeoJson) return [];
    return jakartaGeoJson.features.map((f) => {
      const rawName = f.properties?.NAME_2 || "";
      const displayName = displayGadmName(rawName);
      const centroid = computeCentroid(f.geometry);
      const isMultiLine = displayName === "Kepulauan Seribu";
      return { rawName, centroid, displayName, isMultiLine };
    }).filter((l) => l.centroid);
  }, [jakartaGeoJson]);

  return (
    <>
      {labels.map((l) => {
        const displayText = l.isMultiLine ? "Kabupaten\nKepulauan Seribu" : l.displayName;
        const isMultiLine = displayText.includes("\n");
        const lines = displayText.split("\n");
        return (
          <Marker
            key={l.rawName}
            position={l.centroid!}
            icon={L.divIcon({
              className: "",
              iconSize: [200, 40],
              iconAnchor: [100, 20],
              html: `<div style="
                color: white;
                font-size: 15px;
                font-weight: 800;
                font-family: 'Plus Jakarta Sans', Inter, sans-serif;
                text-shadow: 0 0 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1), 2px 2px 6px rgba(0,0,0,0.8), -1px -1px 4px rgba(0,0,0,0.8);
                white-space: ${isMultiLine ? 'pre-line' : 'nowrap'};
                display: block;
                text-align: center;
                line-height: 1.3;
                pointer-events: none;
                letter-spacing: 0.3px;
                width: 200px;
              ">${lines.join('<br/>')}</div>`,
            })}
          />
        );
      })}
    </>
  );
}

/* ---------- Tier Legend Card ---------- */
function TierLegend({ creators, onBack }: { creators: Creator[]; onBack?: () => void }) {
  const tiers: { label: string; color: string; min: number; max: number }[] = [
    { label: "Amplifier", color: "#94A3B8", min: 0, max: 999 },
    { label: "Nano", color: "#7c3aed", min: 1000, max: 9999 },
    { label: "Micro", color: "#3b82f6", min: 10000, max: 99999 },
    { label: "Macro", color: "#f97316", min: 100000, max: 999999 },
    { label: "Mega", color: "#ef4444", min: 1000000, max: Infinity },
  ];

  const counts = useMemo(() => {
    const result: Record<string, number> = { Amplifier: 0, Nano: 0, Micro: 0, Macro: 0, Mega: 0 };
    for (const c of creators) {
      const t = getTier(c.followers);
      result[t] = (result[t] ?? 0) + 1;
    }
    return result;
  }, [creators]);

  const total = creators.length;

  return (
    <div
      className="absolute z-[1000]"
      style={{
        top: 16,
        right: 16,
        background: "rgba(15,23,42,0.92)",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 12, color: "#F1F5F9", marginBottom: 8, textAlign: "center" }}>Legend</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
        {tiers.slice(0, 3).map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: t.color,
              boxShadow: `0 0 5px ${t.color}66`,
            }} />
            <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600, minWidth: 56 }}>{t.label}</span>
            <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{(counts[t.label] ?? 0).toLocaleString()}</span>
          </div>
        ))}
        {tiers.slice(3).map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: t.color,
              boxShadow: `0 0 5px ${t.color}66`,
            }} />
            <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600, minWidth: 56 }}>{t.label}</span>
            <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{(counts[t.label] ?? 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, color: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Total: {total.toLocaleString()}</span>
        {onBack && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }}
            style={{ fontSize: 10, fontWeight: 600, color: "#3B82F6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", position: "relative", zIndex: 1001 }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

function MapViewController({ center, zoom, province }: { center: [number, number]; zoom: number; province?: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (province === "DKI Jakarta") {
      map.setView([-6.175, 106.827], 11);
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, zoom, province]);
  return null;
}

/* ---------- Dashboard Cards ---------- */
function DonutCard({ title, data, colors, total }: {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  total: number;
}) {
  return (
    <div className="rounded-xl border p-4 overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <h4 className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h4>
      <div className="flex flex-col items-center">
        <div className="relative shrink-0">
          <PieChart width={120} height={120}>
            <Pie
              data={data}
              cx={60}
              cy={60}
              innerRadius={34}
              outerRadius={52}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#F1F5F9" }}
              formatter={(value: any, name: any) => [`${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`, String(name)]}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-extrabold" style={{ color: "var(--ch-text)" }}>{total.toLocaleString()}</span>
            <span className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Creators</span>
          </div>
        </div>
        <div className="w-full mt-2 space-y-1">
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div key={item.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
                <span className="flex-1 truncate" style={{ color: "var(--ch-text-muted)" }}>{item.name}</span>
                <span className="font-bold shrink-0" style={{ color: "var(--ch-text)" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BarCard({ title, data, maxVal }: {
  title: string;
  data: { name: string; value: number }[];
  maxVal: number;
}) {
  return (
    <div className="rounded-xl border p-4 overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <h4 className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h4>
      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--ch-border) transparent" }}>
        {data.map((item, i) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] truncate" style={{ color: "var(--ch-text-muted)" }}>{item.name}</span>
              <span className="text-[10px] font-bold shrink-0 ml-1" style={{ color: "var(--ch-text)" }}>{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "var(--ch-border)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${maxVal > 0 ? (item.value / maxVal) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                  animation: `barGrow 0.6s ease-out ${i * 0.05}s both`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsCard({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-xl border p-4 overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}>
          <span className="text-[14px]">💡</span>
        </div>
        <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Insights</h4>
      </div>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-blue-400 mt-0.5 shrink-0 text-[10px]">✓</span>
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Filter Select ---------- */
function FilterSelect({ icon, value, onChange, options }: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium"
        style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: value === "all" ? "var(--ch-text-muted)" : "#3B82F6" }}>
        <span style={{ color: "#3B82F6" }}>{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent outline-none cursor-pointer pr-1"
          style={{ color: "inherit", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--ch-text-muted)" }} />
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function ServiceHub() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("DKI Jakarta");
  const [provinceGeoJson, setProvinceGeoJson] = useState<FeatureCollection | null>(null);
  const [kabupatenGeoJson, setKabupatenGeoJson] = useState<FeatureCollection | null>(null);
  const [jakartaGeoJson, setJakartaGeoJson] = useState<FeatureCollection | null>(null);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);

  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoadingCreators(true);
      try {
        const res = await creatorsApi.list({ page: 1, pageSize: 50000, verified: true });
        if (!cancelled) { setAllCreators(res.data); setLoadingCreators(false); }
      } catch {
        if (!cancelled) setLoadingCreators(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetch(PROVINCE_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setProvinceGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_1) as unknown as FeatureCollection);
      })
      .catch(() => {});
    fetch(KABUPATEN_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        setKabupatenGeoJson(topojson.feature(topo, topo.objects.gadm36_IDN_2) as unknown as FeatureCollection);
      })
      .catch(() => {});
    fetch(JAKARTA_GEOJSON_URL)
      .then((r) => r.json())
      .then((geo: any) => {
        setJakartaGeoJson(geo as FeatureCollection);
      })
      .catch(() => {});
  }, []);

  const provinceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCreators) {
      const prov = getProvince(c.city);
      counts.set(prov, (counts.get(prov) ?? 0) + 1);
    }
    return counts;
  }, [allCreators]);

  const platformOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of allCreators) for (const p of c.platforms) set.add(p.toLowerCase());
    return Array.from(set).sort();
  }, [allCreators]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of allCreators) {
      if (c.category) {
        for (const cat of c.category.split(",")) {
          const trimmed = cat.trim();
          if (trimmed) set.add(trimmed);
        }
      }
    }
    return Array.from(set).sort();
  }, [allCreators]);

  const filteredCreators = useMemo(() => {
    return allCreators.filter((c) => {
      if (filterProvince !== "all" && getProvince(c.city) !== filterProvince) return false;
      if (filterPlatform !== "all" && !c.platforms.map((p) => p.toLowerCase()).includes(filterPlatform)) return false;
      if (filterCategory !== "all") {
        const cats = (c.category || "").split(",").map((s) => s.trim().toLowerCase());
        if (!cats.includes(filterCategory.toLowerCase())) return false;
      }
      if (filterTier !== "all") {
        const tier = getTier(c.followers);
        if (tier.toLowerCase() !== filterTier.toLowerCase()) return false;
      }
      if (filterGender !== "all") {
        const rng = seededRandom(hashString(c.id));
        const r = rng();
        const gender = r < 0.612 ? "female" : r < 0.993 ? "male" : "other";
        if (gender !== filterGender.toLowerCase()) return false;
      }
      return true;
    });
  }, [allCreators, filterProvince, filterPlatform, filterCategory, filterTier, filterGender]);

  useEffect(() => {
    if (filterProvince === "all") {
      setSelectedProvince(null);
    } else {
      setSelectedProvince(filterProvince);
    }
  }, [filterProvince]);

  const totalCreators = allCreators.length;

  const topProvinces = useMemo(() => {
    return Array.from(provinceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [provinceCounts]);

  const platformData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCreators) {
      for (const p of c.platforms) {
        const key = p.toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const known = ["instagram", "tiktok", "youtube", "facebook", "x", "linkedin"];
    const result: { name: string; value: number }[] = [];
    let others = 0;
    for (const [name, val] of arr) {
      if (known.includes(name)) result.push({ name: name.charAt(0).toUpperCase() + name.slice(1), value: val });
      else others += val;
    }
    if (others > 0) result.push({ name: "Others", value: others });
    return result;
  }, [allCreators]);

  const tierData = useMemo(() => {
    let amplifier = 0, nano = 0, micro = 0, macro = 0, mega = 0;
    for (const c of allCreators) {
      if (c.followers >= 1000000) mega++;
      else if (c.followers >= 100000) macro++;
      else if (c.followers >= 10000) micro++;
      else if (c.followers >= 1000) nano++;
      else amplifier++;
    }
    return [
      { name: "Amplifier (<1K)", value: amplifier },
      { name: "Nano (1K-10K)", value: nano },
      { name: "Micro (10K-100K)", value: micro },
      { name: "Macro (100K-1M)", value: macro },
      { name: "Mega (1M+)", value: mega },
    ];
  }, [allCreators]);

  const categoryData = useMemo(() => {
    const TARGET_CATEGORIES = [
      "Lifestyle", "Politik", "Bisnis", "Sosial", "Entertainment",
      "Beauty & Fashion", "Technology", "Travel", "Food", "Sports",
      "Education", "Gaming", "Comedy", "Parenting",
    ];
    const CAT_MAP: Record<string, string> = {
      lifestyle: "Lifestyle", travel: "Travel", beauty: "Beauty & Fashion", fashion: "Beauty & Fashion",
      tech: "Technology", technology: "Technology", food: "Food", sports: "Sports",
      comedy: "Comedy", gaming: "Gaming", family: "Parenting", parenting: "Parenting",
      "social issues": "Sosial", social: "Sosial", education: "Education",
      environment: "Sosial", animals: "Sosial", business: "Bisnis",
      "mental health": "Sosial", entertainment: "Entertainment", politi: "Politik",
      political: "Politik", politics: "Politik",
    };
    const counts = new Map<string, number>();
    for (const t of TARGET_CATEGORIES) counts.set(t, 0);
    for (const c of allCreators) {
      const raw = (c.category || "").toLowerCase();
      const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
      const mapped = new Set<string>();
      for (const p of parts) {
        const m = CAT_MAP[p];
        if (m) mapped.add(m);
      }
      if (mapped.size === 0) mapped.add("Lifestyle");
      for (const m of mapped) {
        counts.set(m, (counts.get(m) ?? 0) + 1);
      }
    }
    return TARGET_CATEGORIES.map((name) => ({ name, value: counts.get(name) ?? 0 })).sort((a, b) => b.value - a.value);
  }, [allCreators]);

  const insights = useMemo(() => {
    if (topProvinces.length === 0) return [];
    const topProv = topProvinces[0];
    const topPct = totalCreators > 0 ? ((topProv[1] / totalCreators) * 100).toFixed(1) : "0";
    const nanoCount = tierData.find(t => t.name.includes("Nano"))?.value ?? 0;
    const microCount = tierData.find(t => t.name.includes("Micro"))?.value ?? 0;
    const nmPct = totalCreators > 0 ? (((nanoCount + microCount) / totalCreators) * 100).toFixed(0) : "0";
    const topCat = categoryData[0];
    return [
      `The largest creator concentration is in ${topProv[0]}, with ${topProv[1].toLocaleString()} creators (${topPct}% of total).`,
      `Over ${nmPct}% of creators are Nano and Micro creators, forming the backbone of the creator ecosystem.`,
      topCat ? `Top category is ${topCat.name} with ${topCat.value.toLocaleString()} creators.` : "",
    ].filter(Boolean);
  }, [topProvinces, tierData, categoryData, totalCreators]);

  const selectedProvCreators = useMemo(() => {
    if (!selectedProvince) return filteredCreators;
    return filteredCreators.filter((c) => getProvince(c.city) === selectedProvince);
  }, [filteredCreators, selectedProvince]);

  const genderData = useMemo(() => {
    const source = selectedProvince ? selectedProvCreators : allCreators;
    let female = 0, male = 0, other = 0;
    for (const c of source) {
      const rng = seededRandom(hashString(c.id));
      const r = rng();
      if (r < 0.612) female++;
      else if (r < 0.993) male++;
      else other++;
    }
    return [
      { name: "Female", value: female },
      { name: "Male", value: male },
      { name: "Other", value: other },
    ];
  }, [selectedProvCreators, selectedProvince, allCreators]);
  const genderTotal = genderData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100%" }}>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ background: "#040e1f", minHeight: 240 }}>
        <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-center">
          <div className="px-8 py-10 lg:px-12 lg:py-12">
            <h2 className="text-2xl lg:text-[2rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Creator <span className="text-blue-400">Distribution</span> Analytics
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Explore how {totalCreators.toLocaleString()} creators are distributed across Indonesia's provinces and cities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/marketplace">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 text-sm px-5 py-2.5 rounded-lg transition-colors">
                  <Users className="w-4 h-4 mr-1.5 inline" /> Find Creators
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center relative px-6 py-5">
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 0%, #040e1f 0%, transparent 50%), linear-gradient(to right, #040e1f 0%, transparent 15%), linear-gradient(to bottom, #040e1f 0%, transparent 12%), linear-gradient(to left, #040e1f 0%, transparent 15%), linear-gradient(to top, #040e1f 0%, transparent 10%)` }} />
            <img src="/hero-banner.jpg?v=9" alt="CreatorHub Platform" className="rounded-xl object-cover w-full max-h-[280px]" />
          </div>
        </div>
      </div>

      {/* Single unified card: Filters + Map + Analytics */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        {/* Filter Bar inside card */}
        <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <FilterSelect icon={<MapPin className="w-4 h-4" />} value={filterProvince} onChange={setFilterProvince}
            options={[
              { value: "all", label: "All Indonesia" },
              ...PROVINCES_38.map((p) => ({ value: p, label: p })),
            ]} />
          <FilterSelect icon={<Share2 className="w-4 h-4" />} value={filterPlatform} onChange={setFilterPlatform}
            options={[{ value: "all", label: "All Platform" }, ...platformOptions.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))]} />
          <FilterSelect icon={<Tag className="w-4 h-4" />} value={filterCategory} onChange={setFilterCategory}
            options={[{ value: "all", label: "All Category" }, ...categoryOptions.map((c) => ({ value: c, label: c }))]} />
          <FilterSelect icon={<BarChart3 className="w-4 h-4" />} value={filterTier} onChange={setFilterTier}
            options={[
              { value: "all", label: "All Tier" },
              { value: "amplifier", label: "Amplifier (<1K)" },
              { value: "nano", label: "Nano (1K-10K)" },
              { value: "micro", label: "Micro (10K-100K)" },
              { value: "macro", label: "Macro (100K-1M)" },
              { value: "mega", label: "Mega (>1M)" },
            ]} />
          <FilterSelect icon={<UsersRound className="w-4 h-4" />} value={filterGender} onChange={setFilterGender}
            options={[
              { value: "all", label: "All Gender" },
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]} />
        </div>

        {/* Map - full width */}
        <div className="relative" style={{ height: "480px" }}>
            <MapContainer
              preferCanvas
              center={[-2.5, 118.0]}
              zoom={5}
              zoomControl={false}
              className="w-full h-full"
              scrollWheelZoom={true}
              style={{ background: "#0F172A" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {selectedProvince ? (
                <>
                  <MapViewController center={[-2.5, 118.0]} zoom={5} province={selectedProvince} />
                  {selectedProvince === "DKI Jakarta" && jakartaGeoJson ? (
                    <>
                      <JakartaRegions jakartaGeoJson={jakartaGeoJson} creators={filteredCreators} />
                      <KabupatenLabels jakartaGeoJson={jakartaGeoJson} />
                    </>
                  ) : (
                    provinceGeoJson && (
                      <>
                        <ProvinceChoropleth
                          geoJsonData={provinceGeoJson}
                          provinceCounts={provinceCounts}
                          onProvinceClick={setSelectedProvince}
                        />
                        <ProvinceLabels geoJsonData={provinceGeoJson} />
                      </>
                    )
                  )}
                  <ScaleControl position="bottomright" />
                </>
              ) : (
                provinceGeoJson && (
                  <>
                    <ProvinceChoropleth
                      geoJsonData={provinceGeoJson}
                      provinceCounts={provinceCounts}
                      onProvinceClick={setSelectedProvince}
                    />
                    <ProvinceLabels geoJsonData={provinceGeoJson} />
                    {kabupatenGeoJson && <KabupatenGeoJson geoJsonData={kabupatenGeoJson} />}
                  </>
                )
              )}
            </MapContainer>

            {/* Loading overlay */}
            {loadingCreators && (
              <div className="absolute inset-0 z-[1001] flex items-center justify-center" style={{ background: "rgba(7,11,20,0.7)" }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Loading creators...
                </div>
              </div>
            )}

            {/* Tier legend */}
            <TierLegend creators={selectedProvince ? selectedProvCreators : filteredCreators} onBack={selectedProvince ? () => setFilterProvince("all") : undefined} />
          </div>

        {/* Bottom analytics inside same card */}
        <div className="border-t p-4" style={{ borderColor: "var(--ch-border)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            <DonutCard title="Platform Distribution" data={platformData} colors={PLATFORM_COLORS} total={totalCreators} />
            <DonutCard title="Creator Tier Distribution" data={tierData} colors={TIER_COLORS} total={totalCreators} />
            <BarCard title="Top Categories" data={categoryData} maxVal={categoryData[0]?.value ?? 1} />
            <DonutCard title="Audience Gender" data={genderData} colors={GENDER_COLORS} total={genderTotal} />
            <InsightsCard insights={insights} />
          </div>
        </div>
      </div>
    </div>
  );
}
