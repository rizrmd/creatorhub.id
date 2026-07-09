import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
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

interface PodcastFacility {
  province: string;
  name: string;
  location: string;
  ketua: string;
  lat: number;
  lng: number;
  avatarUrl: string;
  cardX: number;
  cardY: number;
}

const PODCAST_FACILITIES: PodcastFacility[] = [
  { province: "Sumatera Utara", name: "Suara Sumut Studio", location: "Medan", ketua: "Andi Pratama Nasution", lat: 3.5952, lng: 98.6722, avatarUrl: "https://i.pravatar.cc/150?img=11", cardX: 50, cardY: 10 },
  { province: "Riau", name: "Riau Podcast Hub", location: "Pekanbaru", ketua: "Rafiq Alfarizi", lat: 0.5071, lng: 101.4478, avatarUrl: "https://i.pravatar.cc/150?img=12", cardX: 30, cardY: 80 },
  { province: "Sumatera Selatan", name: "Palembang Voice Lab", location: "Palembang", ketua: "Diah Ayu Lestari", lat: -2.9761, lng: 104.7754, avatarUrl: "https://i.pravatar.cc/150?img=5", cardX: 45, cardY: 155 },
  { province: "Lampung", name: "Lampung Podcast Center", location: "Bandar Lampung", ketua: "M. Rizky Kurniawan", lat: -5.3971, lng: 105.2668, avatarUrl: "https://i.pravatar.cc/150?img=8", cardX: 35, cardY: 225 },
  { province: "Banten", name: "Banten Creative Cast", location: "Serang", ketua: "Irfan Maulana", lat: -6.1153, lng: 106.1487, avatarUrl: "https://i.pravatar.cc/150?img=14", cardX: 20, cardY: 300 },
  { province: "DKI Jakarta", name: "Jakarta Podcast Network", location: "Jakarta", ketua: "Reza Aditya Pratama", lat: -6.2088, lng: 106.8456, avatarUrl: "https://i.pravatar.cc/150?img=33", cardX: 25, cardY: 375 },
  { province: "Jawa Barat", name: "Sunda Podcast Lab", location: "Bandung", ketua: "Tania Putri Maharani", lat: -6.9175, lng: 107.6191, avatarUrl: "https://i.pravatar.cc/150?img=23", cardX: 30, cardY: 450 },
  { province: "DI Yogyakarta", name: "Jogja Podcast House", location: "Yogyakarta", ketua: "Arum Sekar Wulandari", lat: -7.7956, lng: 110.3695, avatarUrl: "https://i.pravatar.cc/150?img=25", cardX: 50, cardY: 530 },
  { province: "Jawa Tengah", name: "Central Java Podcast Studio", location: "Semarang", ketua: "Bagas Wicaksono", lat: -6.9666, lng: 110.4196, avatarUrl: "https://i.pravatar.cc/150?img=15", cardX: 380, cardY: 480 },
  { province: "Jawa Timur", name: "Jatim Podcast Space", location: "Surabaya", ketua: "Dimas Prasetyo", lat: -7.2575, lng: 112.7521, avatarUrl: "https://i.pravatar.cc/150?img=52", cardX: 530, cardY: 490 },
  { province: "Bali", name: "Bali Audio Studio", location: "Denpasar", ketua: "Putu Gede Arimbawa", lat: -8.6500, lng: 115.2167, avatarUrl: "https://i.pravatar.cc/150?img=60", cardX: 520, cardY: 560 },
  { province: "Nusa Tenggara Barat", name: "Lombok Podcast Hub", location: "Mataram", ketua: "Lalu Hamzanwadi", lat: -8.5833, lng: 116.1167, avatarUrl: "https://i.pravatar.cc/150?img=53", cardX: 560, cardY: 635 },
  { province: "Kalimantan Barat", name: "PontiCast Studio", location: "Pontianak", ketua: "Yohana Sari Dewi", lat: -0.0263, lng: 109.3425, avatarUrl: "https://i.pravatar.cc/150?img=44", cardX: 280, cardY: 10 },
  { province: "Kalimantan Tengah", name: "Kalteng Podcast Corner", location: "Palangka Raya", ketua: "Irwan Prasetya", lat: -2.2071, lng: 113.9213, avatarUrl: "https://i.pravatar.cc/150?img=47", cardX: 430, cardY: 15 },
  { province: "Kalimantan Timur", name: "Samarinda Voice Lab", location: "Samarinda", ketua: "Angga Maulana", lat: -0.4948, lng: 117.1436, avatarUrl: "https://i.pravatar.cc/150?img=51", cardX: 600, cardY: 10 },
  { province: "Sulawesi Utara", name: "Manado Podcast Hub", location: "Manado", ketua: "Vcky Christian Lumentut", lat: 1.4748, lng: 124.8421, avatarUrl: "https://i.pravatar.cc/150?img=59", cardX: 780, cardY: 10 },
  { province: "Sulawesi Selatan", name: "Makassar Podcast Studio", location: "Makassar", ketua: "Andi Nurul Hikmah", lat: -5.1477, lng: 119.4327, avatarUrl: "https://i.pravatar.cc/150?img=45", cardX: 920, cardY: 155 },
  { province: "Papua", name: "Jayapura Voice Studio", location: "Jayapura", ketua: "Septianora Waribrav", lat: -2.5916, lng: 140.6690, avatarUrl: "https://i.pravatar.cc/150?img=57", cardX: 1020, cardY: 15 },
];

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
  useEffect(() => {
    map.setView([-2.5, 118.0], 5);
  }, [map, geoJsonData]);

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      data={geoJsonData}
      ref={layerRef}
      style={() => {
        return {
          fillColor: "transparent",
          weight: 1.5,
          opacity: 0.7,
          color: "rgba(100,116,139,0.5)",
          fillOpacity: 0,
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
        weight: 0.7,
        opacity: 0.45,
        color: "rgba(71,85,105,0.6)",
        fillOpacity: 0,
      })}
    />
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

/* ---------- Podcast Facilities Layer ---------- */
function PodcastFacilityConnections() {
  const map = useMap();
  useEffect(() => {
    const labels = PODCAST_FACILITIES.map((f) => {
      const icon = L.divIcon({
        className: 'podcast-city-label',
        html: `<span style="font-size:10px;color:rgba(255,255,255,0.75);font-family:'Inter',sans-serif;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.8);">${f.location}</span>`,
        iconSize: [0, 0],
        iconAnchor: [-12, 8],
      });
      return L.marker([f.lat, f.lng], { icon, interactive: false }).addTo(map);
    });
    return () => { labels.forEach((l) => map.removeLayer(l)); };
  }, [map]);
  return null;
}

function PodcastFacilityDots() {
  const map = useMap();
  useEffect(() => {
    const dots = PODCAST_FACILITIES.map((f) =>
      L.circleMarker([f.lat, f.lng], {
        radius: 5,
        fillColor: "#3B82F6",
        fillOpacity: 1,
        color: "#3B82F6",
        weight: 0,
        className: "podcast-glow-dot",
      }).addTo(map)
    );
    return () => { dots.forEach((d) => map.removeLayer(d)); };
  }, [map]);
  return null;
}

function PodcastFacilityMapLayer({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return (
    <>
      <PodcastFacilityConnections />
      <PodcastFacilityDots />
    </>
  );
}

function PodcastFacilityCards({ mapInstance, containerRef, provinceCounts }: { mapInstance: L.Map | null; containerRef: React.RefObject<HTMLDivElement | null>; provinceCounts: Map<string, number> }) {
  const [dots, setDots] = useState<{ f: PodcastFacility; dotX: number; dotY: number }[]>([]);

  useEffect(() => {
    if (!mapInstance || !containerRef.current) return;
    const recalc = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pts = PODCAST_FACILITIES.map((f) => {
        const pt = mapInstance.latLngToContainerPoint([f.lat, f.lng]);
        return { f, dotX: pt.x, dotY: pt.y };
      }).filter((p) => p.dotX > -100 && p.dotX < rect.width + 100 && p.dotY > -100 && p.dotY < rect.height + 100);
      setDots(pts);
    };
    recalc();
    mapInstance.on("moveend zoomend", recalc);
    return () => { mapInstance.off("moveend zoomend", recalc); };
  }, [mapInstance, containerRef]);

  if (!mapInstance) return null;

  const CARD_W = 150;
  const CARD_H = 48;

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 400, overflow: "visible", width: "100%", height: "100%" }}>
        {dots.map((p) => {
          const cx = p.f.cardX + CARD_W;
          const cy = p.f.cardY + CARD_H / 2;
          const midX = (cx + p.dotX) / 2;
          const midY = (cy + p.dotY) / 2;
          return (
            <path
              key={p.f.province}
              d={`M ${cx} ${cy} Q ${midX} ${midY} ${p.dotX} ${p.dotY}`}
              stroke="#3B82F6"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="6 4"
              opacity={0.5}
            />
          );
        })}
      </svg>
      {PODCAST_FACILITIES.map((f) => {
        const anggota = provinceCounts.get(f.province) ?? 0;
        const displayName = f.province === "DI Yogyakarta" ? "DPD DI YOGYAKARTA" : f.province.toUpperCase();
        return (
          <div
            key={f.province}
            className="absolute pointer-events-none"
            style={{
              left: `${f.cardX}px`,
              top: `${f.cardY}px`,
              width: `${CARD_W}px`,
              zIndex: 500,
            }}
          >
            <div style={{
              borderRadius: "8px",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
              border: "1px solid rgba(59,130,246,0.5)",
              boxShadow: "0 0 20px rgba(59,130,246,0.3), 0 0 40px rgba(59,130,246,0.1)",
              fontFamily: "'Inter', sans-serif",
            }}>
              <div className="p-1.5">
                <div className="text-[8px] font-bold tracking-wider" style={{ color: "#60A5FA" }}>{displayName}</div>
                <div className="text-[8px] mt-0.5" style={{ color: "#F1F5F9" }}>Nama: {f.name}</div>
                <div className="text-[8px] mt-0.5 font-semibold" style={{ color: "#60A5FA" }}>Anggota: {anggota}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
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

/* ---------- Main Component ---------- */
export default function ServiceHub() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>("DKI Jakarta");
  const [provinceGeoJson, setProvinceGeoJson] = useState<FeatureCollection | null>(null);
  const [kabupatenGeoJson, setKabupatenGeoJson] = useState<FeatureCollection | null>(null);
  const [jakartaGeoJson, setJakartaGeoJson] = useState<FeatureCollection | null>(null);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);

  const [filterProvince] = useState<string>("all");
  const [filterPlatform] = useState<string>("all");
  const [filterCategory] = useState<string>("all");
  const [filterTier] = useState<string>("all");
  const [filterGender] = useState<string>("all");
  const [showPodcastFacilities] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [podcastMapInstance, setPodcastMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const res = await creatorsApi.list({ page: 1, pageSize: 50000, verified: true });
        if (!cancelled) setAllCreators(res.data);
      } catch {}
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

      {/* Single unified card: Map + Analytics */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        {/* Map - full width */}
        <div ref={mapContainerRef} className="relative" style={{ height: "700px", background: "#080E1A", borderRadius: "12px" }}>
            <MapContainer
              center={[-2.5, 118.0]}
              zoom={5}
              zoomControl={false}
              className="w-full h-full"
              scrollWheelZoom={true}
              style={{ background: "#080E1A" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {selectedProvince ? (
                <>
                  <MapViewController center={[-2.5, 118.0]} zoom={5} province={selectedProvince} />
                  {selectedProvince === "DKI Jakarta" && jakartaGeoJson ? (
                    <JakartaRegions jakartaGeoJson={jakartaGeoJson} creators={filteredCreators} />
                  ) : (
                    provinceGeoJson && (
                      <>
                        <ProvinceChoropleth
                          geoJsonData={provinceGeoJson}
                          provinceCounts={provinceCounts}
                          onProvinceClick={setSelectedProvince}
                        />
                        {kabupatenGeoJson && <KabupatenGeoJson geoJsonData={kabupatenGeoJson} />}
                      </>
                    )
                  )}
                </>
              ) : (
                provinceGeoJson && (
                  <>
                    <ProvinceChoropleth
                      geoJsonData={provinceGeoJson}
                      provinceCounts={provinceCounts}
                      onProvinceClick={setSelectedProvince}
                    />
                    {kabupatenGeoJson && <KabupatenGeoJson geoJsonData={kabupatenGeoJson} />}
                  </>
                )
              )}
              {showPodcastFacilities && <PodcastFacilityMapLayer onMapReady={setPodcastMapInstance} />}
            </MapContainer>
            {showPodcastFacilities && <PodcastFacilityCards mapInstance={podcastMapInstance} containerRef={mapContainerRef} provinceCounts={provinceCounts} />}
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
