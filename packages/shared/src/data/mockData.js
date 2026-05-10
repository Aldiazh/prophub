// ── Image pool ──
const IMG_A = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh_R0ZwaJaz8QNCHjfhRIUpWQTFizMATtreVys-2EIbuyklEimLqA95hlXuILbcXP00fNFPWuH0keQppRvWmwVE2hfdOGO6GQgGXWekZH6hDZ-ci9qWtS5a9U1qqECiy2HPnj7_K4yqS72i01gOIJC89tGhKINIm0jzU6GMim-GP6atRTWdY0W1zjJdvnB12BlcoQtCeyVXFxfmnihpA1qnh0VBdZnYQJz1qXy0Rm8MNqHuEPBzYDIwOUVwJVItpvjepMNBZiZX20';
const IMG_B = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyb_Vbw5Y6S9oWprppBD2FeRGgkKAm6si7xcDZVx3QZOC4byGklcOiR7in27jEBSQ8BRgULI1bWPa_kgIsPCXiBYBez4JMtv_QlIUa6e2CqB8iml_KdeBZIoxTT9K-E8UOn8-pDTEgnJ48nZzHkQpg9g2JFtDFYMLQVuSVVNCOIwjoImsAuUCT1zWVinuQKjZThVoNSP97uCR8dYSZAGZboC0eH83uVPMWmyPuP2IBBZJkByj8WgFZoZm1kiaf4IVe1Po-_PGAo9w';
const IMG_C = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkdcQp8Kn-Cf8FRxkgOOW0e4jhN7G30Cd6_iVgq6iffhzzr18xZJhKFY8QbDQkUrJdmb_rcY7Gx3L2OCf7WD7ItA9CMWemDvqJsbWeIv5A2wicacz0YG8t7ZZ6Y74LnKh5wJTdN0FzgbngFll9XxruIPop7RhqBybHjatYKM1cYKw5XKhWvZrBfiLUOXLFs1lOUzyOn-_kA_ODmwNIrgsjigrtlyuHg70KKgyvQnQVqtDW5q6h64e4eO1QQ3EKGKtS2O2Ol5TC9tE';

// ── Helper to build detail for each property ──
function buildDetail(overrides) {
  const defaults = {
    images: [IMG_A, IMG_B, IMG_C, IMG_A],
    specs: [
      { icon: 'bed', label: '1 Kamar' },
      { icon: 'bathtub', label: '1 KM Dalam' },
      { icon: 'square_foot', label: '20 m²' },
    ],
    about: 'Properti ini terletak di lokasi strategis di Kota Kediri dengan akses mudah ke fasilitas umum, pusat perbelanjaan, dan transportasi. Cocok untuk mahasiswa maupun pekerja yang mencari hunian nyaman dan terjangkau.',
    features: [
      { icon: 'wifi', label: 'WiFi 24 Jam' },
      { icon: 'local_parking', label: 'Parkir Motor' },
      { icon: 'kitchen', label: 'Dapur Bersama' },
      { icon: 'local_laundry_service', label: 'Laundry' },
    ],
    agent: {
      name: 'Pak Hendra Wijaya',
      role: 'Agen Properti Kediri • 12 thn',
      rating: 4.9,
      reviews: 136,
      responsiveness: 85,
      knowledge: 92,
    },
    costs: {
      serviceFee: 'Rp 100.000',
      maintenance: 'Rp 50.000/bln',
      totalPrice: 'Rp 950.000',
    },
    rules: [
      { icon: 'smoke_free', label: 'Dilarang merokok di dalam kamar' },
      { icon: 'pets', label: 'Tidak boleh membawa hewan peliharaan' },
      { icon: 'schedule', label: 'Jam malam pukul 23.00' },
      { icon: 'volume_off', label: 'Harap jaga ketenangan' },
    ],
  };
  return { ...defaults, ...overrides };
}

// ── Price helper (extract numeric value for sorting/filtering) ──
function extractPrice(priceStr) {
  const num = priceStr.replace(/[^0-9]/g, '');
  return parseInt(num) || 0;
}

// ── Featured Listings (Home Page) ──
export const featuredListings = [
  {
    id: 1,
    title: 'Kos Mojoroto Residence',
    price: 'Rp 800.000 /bln',
    priceNum: 800000,
    location: 'Mojoroto, Kediri',
    type: 'Kos',
    roomType: 'Single',
    facilities: ['WiFi', 'AC'],
    status: 'Available',
    image: IMG_A,
    amenities: [
      { icon: 'bed', label: '1 Kamar' },
      { icon: 'bathtub', label: '1 KM Dalam' },
      { icon: 'wifi', label: 'WiFi' },
    ],
    detail: buildDetail({
      images: [IMG_A, IMG_B, IMG_C, IMG_A],
      specs: [
        { icon: 'bed', label: '1 Kamar' },
        { icon: 'bathtub', label: '1 KM Dalam' },
        { icon: 'square_foot', label: '18 m²' },
        { icon: 'wifi', label: 'WiFi' },
      ],
      about: 'Kos Mojoroto Residence terletak di kawasan Mojoroto yang strategis, dekat dengan kampus dan pusat kota Kediri. Kamar dilengkapi kasur, lemari, dan kamar mandi dalam. WiFi 24 jam tersedia di seluruh area kos.\n\nLingkungan aman dan tenang, cocok untuk mahasiswa dan pekerja. Tersedia dapur bersama dan area parkir motor.',
      agent: { name: 'Pak Hendra Wijaya', role: 'Pemilik Kos • 8 thn', rating: 4.9, reviews: 136, responsiveness: 85, knowledge: 92 },
      costs: { serviceFee: 'Rp 50.000', maintenance: 'Rp 25.000/bln', totalPrice: 'Rp 875.000' },
    }),
  },
  {
    id: 2,
    title: 'Kontrakan Pesantren Asri',
    price: 'Rp 2.500.000 /bln',
    priceNum: 2500000,
    location: 'Pesantren, Kediri',
    type: 'Kontrakan',
    roomType: 'Double',
    facilities: ['Parking'],
    status: 'New Listing',
    image: IMG_B,
    amenities: [
      { icon: 'bed', label: '3 Kamar' },
      { icon: 'bathtub', label: '1 KM' },
      { icon: 'garage', label: 'Garasi' },
    ],
    detail: buildDetail({
      images: [IMG_B, IMG_C, IMG_A, IMG_B],
      specs: [
        { icon: 'bed', label: '3 Kamar' },
        { icon: 'bathtub', label: '1 KM' },
        { icon: 'square_foot', label: '80 m²' },
        { icon: 'garage', label: 'Garasi' },
      ],
      about: 'Kontrakan Pesantren Asri adalah rumah kontrakan 3 kamar tidur di kawasan Pesantren, Kediri. Dilengkapi garasi untuk 1 mobil, halaman depan, dan dapur yang luas.\n\nLokasi dekat dengan pasar tradisional dan sekolah. Cocok untuk keluarga kecil yang mencari hunian nyaman dengan harga terjangkau.',
      agent: { name: 'Bu Sari Rahayu', role: 'Pemilik Kontrakan • 5 thn', rating: 4.7, reviews: 89, responsiveness: 90, knowledge: 88 },
      costs: { serviceFee: 'Rp 150.000', maintenance: 'Rp 100.000/bln', totalPrice: 'Rp 2.750.000' },
    }),
  },
  {
    id: 3,
    title: 'Rumah Mewah Bandar Kidul',
    price: 'Rp 5.000.000 /bln',
    priceNum: 5000000,
    location: 'Bandar Kidul, Kediri',
    type: 'Rumah',
    roomType: 'Double',
    facilities: ['WiFi', 'AC', 'Parking', 'Bathroom inside'],
    status: 'Under Contract',
    image: IMG_C,
    amenities: [
      { icon: 'bed', label: '4 Kamar' },
      { icon: 'bathtub', label: '2 KM' },
      { icon: 'garage', label: '2 Mobil' },
    ],
    detail: buildDetail({
      images: [IMG_C, IMG_A, IMG_B, IMG_C],
      specs: [
        { icon: 'bed', label: '4 Kamar' },
        { icon: 'bathtub', label: '2 KM' },
        { icon: 'square_foot', label: '200 m²' },
        { icon: 'garage', label: '2 Mobil' },
      ],
      about: 'Rumah Mewah Bandar Kidul merupakan hunian premium di kawasan elite Bandar Kidul, Kediri. Dibangun dengan konsep modern tropis, rumah ini memiliki 4 kamar tidur luas, 2 kamar mandi, dan garasi untuk 2 kendaraan.\n\nDilengkapi taman belakang, dapur modern, dan ruang keluarga yang lega. Lokasi strategis dekat Simpang Lima Gumul dan akses tol Kediri.',
      features: [
        { icon: 'smart_toy', label: 'Smart Home' },
        { icon: 'pool', label: 'Kolam Renang' },
        { icon: 'outdoor_grill', label: 'Area BBQ' },
        { icon: 'ev_station', label: 'Charger Mobil Listrik' },
      ],
      agent: { name: 'Pak Bambang Susanto', role: 'Agen Premium • 15 thn', rating: 4.8, reviews: 204, responsiveness: 92, knowledge: 95 },
      costs: { serviceFee: 'Rp 500.000', maintenance: 'Rp 300.000/bln', totalPrice: 'Rp 5.800.000' },
    }),
  },
];

// ── Browse Listings ──
export const browseListings = [
  {
    id: 4,
    title: 'Kos Dhoho Premium',
    price: 'Rp 900.000 /bln',
    priceNum: 900000,
    location: 'Kota, Kediri',
    type: 'Kos',
    roomType: 'Single',
    facilities: ['WiFi', 'AC', 'Bathroom inside'],
    status: 'Available',
    image: IMG_A,
    amenities: [
      { icon: 'wifi', label: 'WiFi' },
      { icon: 'ac_unit', label: 'AC' },
      { icon: 'bathtub', label: 'KM Dalam' },
    ],
    detail: buildDetail({
      images: [IMG_A, IMG_C, IMG_B, IMG_A],
      specs: [
        { icon: 'bed', label: '1 Kamar' },
        { icon: 'bathtub', label: '1 KM Dalam' },
        { icon: 'square_foot', label: '22 m²' },
        { icon: 'ac_unit', label: 'AC' },
      ],
      about: 'Kos Dhoho Premium berada di pusat Kota Kediri, dekat dengan area Dhoho yang ramai. Kamar luas dengan AC dan kamar mandi dalam. WiFi kencang 24 jam.\n\nCocok untuk profesional muda yang bekerja di pusat kota.',
      costs: { serviceFee: 'Rp 75.000', maintenance: 'Rp 30.000/bln', totalPrice: 'Rp 1.005.000' },
    }),
  },
  {
    id: 5,
    title: 'Kos Ngronggo Sejahtera',
    price: 'Rp 650.000 /bln',
    priceNum: 650000,
    location: 'Ngronggo, Kediri',
    type: 'Kos',
    roomType: 'Single',
    facilities: ['WiFi', 'AC', 'Parking'],
    status: 'Available',
    image: IMG_B,
    amenities: [
      { icon: 'local_parking', label: 'Parkir' },
      { icon: 'wifi', label: 'WiFi' },
      { icon: 'ac_unit', label: 'AC' },
    ],
    detail: buildDetail({
      images: [IMG_B, IMG_A, IMG_C, IMG_B],
      specs: [
        { icon: 'bed', label: '1 Kamar' },
        { icon: 'local_parking', label: 'Parkir Motor' },
        { icon: 'square_foot', label: '16 m²' },
        { icon: 'ac_unit', label: 'AC' },
      ],
      about: 'Kos Ngronggo Sejahtera menawarkan hunian terjangkau di kawasan Ngronggo. Meski harga ekonomis, fasilitas lengkap termasuk AC, WiFi, dan parkir motor.\n\nDekat dengan kampus dan minimarket.',
      costs: { serviceFee: 'Rp 50.000', maintenance: 'Rp 25.000/bln', totalPrice: 'Rp 725.000' },
    }),
  },
  {
    id: 6,
    title: 'Kontrakan Banjaran Indah',
    price: 'Rp 1.800.000 /bln',
    priceNum: 1800000,
    location: 'Banjaran, Kediri',
    type: 'Kontrakan',
    roomType: 'Double',
    facilities: ['AC', 'Parking'],
    status: 'Available',
    image: IMG_C,
    amenities: [
      { icon: 'meeting_room', label: '2 Kamar' },
      { icon: 'local_parking', label: 'Garasi' },
      { icon: 'ac_unit', label: 'AC' },
    ],
    detail: buildDetail({
      images: [IMG_C, IMG_B, IMG_A, IMG_C],
      specs: [
        { icon: 'bed', label: '2 Kamar' },
        { icon: 'bathtub', label: '1 KM' },
        { icon: 'square_foot', label: '65 m²' },
        { icon: 'garage', label: 'Garasi' },
      ],
      about: 'Kontrakan Banjaran Indah adalah rumah kontrakan 2 kamar tidur dengan garasi di kawasan Banjaran, Kediri. Lingkungan asri dan tenang.\n\nCocok untuk pasangan muda atau keluarga kecil.',
      agent: { name: 'Pak Wahyu Pratama', role: 'Pemilik Kontrakan • 6 thn', rating: 4.6, reviews: 52, responsiveness: 88, knowledge: 85 },
      costs: { serviceFee: 'Rp 100.000', maintenance: 'Rp 75.000/bln', totalPrice: 'Rp 1.975.000' },
    }),
  },
  {
    id: 7,
    title: 'Rumah Sukorame Harmoni',
    price: 'Rp 3.500.000 /bln',
    priceNum: 3500000,
    location: 'Sukorame, Kediri',
    type: 'Rumah',
    roomType: 'Double',
    facilities: ['WiFi', 'AC', 'Bathroom inside', 'Parking'],
    status: 'Under Contract',
    image: IMG_A,
    amenities: [
      { icon: 'wifi', label: 'WiFi' },
      { icon: 'ac_unit', label: 'AC' },
      { icon: 'bathtub', label: 'KM Dalam' },
    ],
    detail: buildDetail({
      images: [IMG_A, IMG_B, IMG_C, IMG_A],
      specs: [
        { icon: 'bed', label: '3 Kamar' },
        { icon: 'bathtub', label: '2 KM' },
        { icon: 'square_foot', label: '120 m²' },
        { icon: 'garage', label: '1 Mobil' },
      ],
      about: 'Rumah Sukorame Harmoni adalah hunian keluarga 3 kamar tidur di kawasan Sukorame yang tenang. Desain modern dengan halaman luas dan garasi.\n\nDekat dengan sekolah, rumah sakit, dan pusat perbelanjaan.',
      features: [
        { icon: 'smart_toy', label: 'Smart Home' },
        { icon: 'solar_power', label: 'Panel Surya' },
        { icon: 'outdoor_grill', label: 'Taman Belakang' },
        { icon: 'security', label: 'CCTV 24 Jam' },
      ],
      agent: { name: 'Bu Ratna Dewi', role: 'Agen Properti • 10 thn', rating: 4.8, reviews: 167, responsiveness: 91, knowledge: 93 },
      costs: { serviceFee: 'Rp 250.000', maintenance: 'Rp 150.000/bln', totalPrice: 'Rp 3.900.000' },
    }),
  },
];

// ── Combined list for lookup ──
export const allProperties = [...featuredListings, ...browseListings];

export function getPropertyById(id) {
  return allProperties.find((p) => p.id === parseInt(id));
}

// ── Categories ──
export const categories = [
  {
    icon: 'apartment',
    title: 'Kos',
    description: 'Kamar terjangkau untuk mahasiswa dan pekerja.',
  },
  {
    icon: 'holiday_village',
    title: 'Kontrakan',
    description: 'Rumah kontrakan untuk keluarga atau tinggal jangka panjang.',
  },
  {
    icon: 'house',
    title: 'Rumah',
    description: 'Hunian premium dan residensi keluarga modern.',
  },
];

// ── Dashboard Stats ──
export const dashboardStats = [
  { icon: 'visibility', value: '1.284', label: 'Total Dilihat', change: '+12% minggu ini' },
  { icon: 'group', value: '42', label: 'Lead Aktif', change: '+5 hari ini' },
  { icon: 'home_work', value: '08', label: 'Listing Aktif', change: '8 aktif / 12 total' },
];

// ── My Listings (Dashboard) ──
export const myListings = [
  {
    id: 101,
    title: 'Kos Semen Kediri Blok A',
    location: 'Semen, Kediri',
    status: 'Available',
    price: 'Rp 750.000/bln',
    image: IMG_C,
  },
  {
    id: 102,
    title: 'Kontrakan Manisrenggo',
    location: 'Manisrenggo, Kediri',
    status: 'Occupied',
    price: 'Rp 1.500.000/bln',
    image: IMG_B,
  },
];

// ── New Leads (Dashboard) ──
export const newLeads = [
  { initials: 'AS', name: 'Adi Santoso', property: 'Kos Semen Kediri Blok A', time: '2 mnt lalu', color: 'bg-secondary' },
  { initials: 'DW', name: 'Dewi Wulandari', property: 'Kontrakan Manisrenggo', time: '1 jam lalu', color: 'bg-tertiary-fixed-dim' },
  { initials: 'BR', name: 'Budi Raharjo', property: 'Kos Mojoroto Residence', time: '4 jam lalu', color: 'bg-surface-container-high' },
];

// ── Chat Conversations ──
export const chatConversations = [
  {
    id: 1,
    name: 'Pak Hendra Wijaya',
    initials: 'HW',
    avatar: null,
    online: true,
    lastActive: '5 menit lalu',
    property: 'Kos Mojoroto Residence',
    propertyId: 1,
    propertyLocation: 'Mojoroto, Kediri',
    propertyPrice: 'Rp 800.000/bln',
    propertyImage: IMG_A,
    lastMessage: 'Silakan survey dulu besok ya',
    lastTime: '10:30',
    unread: 2,
    messages: [
      { id: 1, sender: 'user', text: 'Selamat pagi Pak, saya tertarik dengan Kos Mojoroto Residence. Apakah masih tersedia?', time: '09:15' },
      { id: 2, sender: 'owner', text: 'Pagi mas! Iya masih tersedia, ada 2 kamar kosong saat ini. Mau yang lantai 1 atau lantai 2?', time: '09:18' },
      { id: 3, sender: 'user', text: 'Lantai 1 kalau bisa Pak. Fasilitasnya apa saja ya?', time: '09:20' },
      { id: 4, sender: 'owner', text: 'Lantai 1 masih ada. Fasilitasnya:\n- Kamar mandi dalam\n- WiFi 24 jam\n- Kasur & lemari\n- Parkir motor\n- Dapur bersama\n\nHarga Rp 800.000/bulan, belum termasuk listrik.', time: '09:25' },
      { id: 5, sender: 'user', text: 'Wah lengkap juga ya. Boleh survey dulu Pak?', time: '10:28' },
      { id: 6, sender: 'owner', text: 'Silakan survey dulu besok ya, bisa datang jam 9-12 siang. Saya tunggu di lokasi.', time: '10:30' },
    ],
  },
  {
    id: 2,
    name: 'Bu Sari Rahayu',
    initials: 'SR',
    avatar: null,
    online: false,
    lastActive: '1 jam lalu',
    property: 'Kontrakan Pesantren Asri',
    propertyId: 2,
    propertyLocation: 'Pesantren, Kediri',
    propertyPrice: 'Rp 2.500.000/bln',
    propertyImage: IMG_B,
    lastMessage: 'Boleh nego sedikit kalau kontrak 1 tahun',
    lastTime: 'Kemarin',
    unread: 0,
    messages: [
      { id: 1, sender: 'user', text: 'Assalamualaikum Bu, saya mau tanya kontrakan di Pesantren yang harga 2,5 juta. Masih ada?', time: '14:00' },
      { id: 2, sender: 'owner', text: 'Waalaikumsalam, masih ada mas. Rumahnya 3 kamar tidur, 1 kamar mandi, ada garasi juga.', time: '14:05' },
      { id: 3, sender: 'user', text: 'Kalau untuk keluarga kecil cukup ya Bu? Dan harganya bisa nego tidak?', time: '14:10' },
      { id: 4, sender: 'owner', text: 'Cukup mas, banyak keluarga muda juga yang kontrak di sini. Boleh nego sedikit kalau kontrak 1 tahun, bisa Rp 2.300.000/bulan.', time: '14:15' },
    ],
  },
  {
    id: 3,
    name: 'Pak Bambang Susanto',
    initials: 'BS',
    avatar: null,
    online: true,
    lastActive: 'Sekarang',
    property: 'Rumah Mewah Bandar Kidul',
    propertyId: 3,
    propertyLocation: 'Bandar Kidul, Kediri',
    propertyPrice: 'Rp 5.000.000/bln',
    propertyImage: IMG_C,
    lastMessage: 'Baik mas, saya kirim draft kontraknya',
    lastTime: '08:45',
    unread: 1,
    messages: [
      { id: 1, sender: 'owner', text: 'Selamat pagi mas, terima kasih sudah survey kemarin. Bagaimana, jadi ambil rumahnya?', time: '08:00' },
      { id: 2, sender: 'user', text: 'Pagi Pak Bambang. Iya Pak, saya dan istri sudah cocok. Mau lanjut ke proses sewa.', time: '08:10' },
      { id: 3, sender: 'owner', text: 'Alhamdulillah, senang mendengarnya. Untuk kontrak minimal 6 bulan ya. DP 1 bulan + sewa bulan pertama.', time: '08:15' },
      { id: 4, sender: 'user', text: 'Siap Pak. Berarti total Rp 10 juta di awal ya? Kapan bisa tanda tangan kontrak?', time: '08:30' },
      { id: 5, sender: 'owner', text: 'Betul mas, Rp 10 juta. Baik mas, saya kirim draft kontraknya via chat ini. Bisa tanda tangan hari Sabtu kalau mas berkenan.', time: '08:45' },
    ],
  },
];
