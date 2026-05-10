# PropHub

PropHub adalah platform sewa properti modern yang difokuskan untuk pasar lokal Kediri, Indonesia. Platform ini menghubungkan pencari properti (pencari kos, kontrakan, rumah sewa) dengan pemilik properti secara langsung, transparan, dan efisien.

## 🌟 Fitur Utama

- **Autentikasi Berbasis Peran**: Login dan Pendaftaran aman dengan Supabase Auth, memisahkan fungsionalitas antara **Pencari (Tenant)** dan **Pemilik (Owner)**.
- **Dashboard Pemilik (Owner)**: Pemilik dapat mengelola listing properti mereka (Tambah, Edit, Hapus), melihat statistik properti, dan memantau status penyewaan.
- **Dashboard Pencari (Tenant)**: Pencari dapat mencari properti berdasarkan lokasi, jadwal survey, melihat riwayat transaksi, dan melakukan pemesanan.
- **Sistem Pembayaran Terintegrasi**: Simulasi fitur pembayaran uang muka (DP), pembayaran penuh, atau *Cash on Delivery* (Bayar di tempat saat survey).
- **Fitur Chat & Pesan**: Memungkinkan penyewa dan pemilik berinteraksi secara real-time untuk diskusi lebih lanjut mengenai properti.
- **Pencarian & Filter**: Pencarian properti responsif dan informatif dengan detail lengkap (Harga, Fasilitas, Lokasi).

## 🛠️ Tech Stack

Project ini dikembangkan menggunakan arsitektur monorepo modern dengan stack berikut:

- **Frontend**: React.js (Vite), React Router v6
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Komponen Shared**: Paket komponen UI yang dapat digunakan kembali antar aplikasi di dalam monorepo (mis. `Header`, `Footer`, `MaterialIcon`).

## 📁 Struktur Monorepo

Project ini menggunakan arsitektur monorepo untuk modularitas yang lebih baik:

```text
prophub/
├── apps/
│   └── web/                 # Aplikasi Utama React (Vite)
│       ├── src/
│       │   ├── pages/       # Semua halaman (Home, Dashboard, Login, dll)
│       │   └── main.jsx     # Entry point aplikasi web
├── packages/
│   └── shared/              # Komponen dan context yang bisa digunakan ulang
│       └── src/
│           ├── components/  # Header, Footer, PropertyCard, dll
│           └── context/     # AuthContext, Supabase Client
└── supabase/                # File skema database (SQL) dan migrasi
```

## 🚀 Cara Menjalankan Secara Lokal

1. **Persyaratan**: Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 16+ disarankan) dan pengelola paket seperti `npm` atau `yarn`.
2. **Kloning Repositori**:
   ```bash
   git clone https://github.com/your-username/prophub.git
   cd prophub
   ```
3. **Instalasi Dependensi**:
   ```bash
   npm install
   # Jika menggunakan monorepo tools (mis. pnpm / npm workspaces)
   ```
4. **Konfigurasi Environment**:
   Buat file `.env.local` di folder `apps/web/` dan tambahkan kunci Supabase Anda:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

## 🗄️ Database Schema (Supabase)

Aplikasi ini menggunakan beberapa tabel utama:
- `profiles`: Data pengguna tambahan (nama, nomor HP, role).
- `properties`: Data listing properti kos/rumah.
- `transactions`: Log transaksi pemesanan dan jadwal survey.
- `messages`: Data percakapan antar user.

*Lihat folder `supabase/` untuk skema dan trigger SQL yang lebih lengkap.*

## 🎨 UI & UX

Desain antarmuka difokuskan pada konsep estetika *vibrant*, *clean*, dan profesional dengan elemen *glassmorphism* serta animasi mikro transisi menggunakan Material Icons (Google) untuk memberikan nuansa "Premium" saat bernavigasi.

---
*Dibuat untuk mempermudah ekosistem sewa menyewa properti di Kediri Raya.*
