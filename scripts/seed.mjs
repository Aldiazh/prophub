import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Harus pakai service_role key untuk bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Anda harus menambahkan SUPABASE_SERVICE_ROLE_KEY di apps/web/.env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Data Properties (dari mockData.js)
const properties = [
  {
    title: 'Kos Mojoroto Residence',
    price_per_month: 800000,
    location: 'Mojoroto, Kediri',
    type: 'Kos',
    room_type: 'Single',
    status: 'Available',
    service_fee: 50000,
    maintenance_fee: 25000,
    facilities: ['WiFi', 'AC'],
    description: 'Kos Mojoroto Residence terletak di kawasan Mojoroto yang strategis, dekat dengan kampus dan pusat kota Kediri. Kamar dilengkapi kasur, lemari, dan kamar mandi dalam. WiFi 24 jam tersedia di seluruh area kos.',
    amenities: [ { icon: 'bed', label: '1 Kamar' }, { icon: 'bathtub', label: '1 KM Dalam' }, { icon: 'wifi', label: 'WiFi' } ]
  },
  {
    title: 'Kontrakan Pesantren Asri',
    price_per_month: 2500000,
    location: 'Pesantren, Kediri',
    type: 'Kontrakan',
    room_type: 'Double',
    status: 'Available',
    service_fee: 150000,
    maintenance_fee: 100000,
    facilities: ['Parking'],
    description: 'Kontrakan Pesantren Asri adalah rumah kontrakan 3 kamar tidur di kawasan Pesantren, Kediri. Dilengkapi garasi untuk 1 mobil, halaman depan, dan dapur yang luas.',
    amenities: [ { icon: 'bed', label: '3 Kamar' }, { icon: 'bathtub', label: '1 KM' }, { icon: 'garage', label: 'Garasi' } ]
  },
  {
    title: 'Rumah Mewah Bandar Kidul',
    price_per_month: 5000000,
    location: 'Bandar Kidul, Kediri',
    type: 'Rumah',
    room_type: 'Double',
    status: 'Under Contract',
    service_fee: 500000,
    maintenance_fee: 300000,
    facilities: ['WiFi', 'AC', 'Parking', 'Bathroom inside'],
    description: 'Rumah Mewah Bandar Kidul merupakan hunian premium di kawasan elite Bandar Kidul, Kediri. Dibangun dengan konsep modern tropis, rumah ini memiliki 4 kamar tidur luas, 2 kamar mandi, dan garasi untuk 2 kendaraan.',
    amenities: [ { icon: 'bed', label: '4 Kamar' }, { icon: 'bathtub', label: '2 KM' }, { icon: 'garage', label: '2 Mobil' } ]
  },
  {
    title: 'Kos Dhoho Premium',
    price_per_month: 900000,
    location: 'Kota, Kediri',
    type: 'Kos',
    room_type: 'Single',
    status: 'Available',
    service_fee: 75000,
    maintenance_fee: 30000,
    facilities: ['WiFi', 'AC', 'Bathroom inside'],
    description: 'Kos Dhoho Premium berada di pusat Kota Kediri, dekat dengan area Dhoho yang ramai. Kamar luas dengan AC dan kamar mandi dalam. WiFi kencang 24 jam.',
    amenities: [ { icon: 'wifi', label: 'WiFi' }, { icon: 'ac_unit', label: 'AC' }, { icon: 'bathtub', label: 'KM Dalam' } ]
  },
  {
    title: 'Kos Ngronggo Sejahtera',
    price_per_month: 650000,
    location: 'Ngronggo, Kediri',
    type: 'Kos',
    room_type: 'Single',
    status: 'Available',
    service_fee: 50000,
    maintenance_fee: 25000,
    facilities: ['WiFi', 'AC', 'Parking'],
    description: 'Kos Ngronggo Sejahtera menawarkan hunian terjangkau di kawasan Ngronggo. Meski harga ekonomis, fasilitas lengkap termasuk AC, WiFi, dan parkir motor.',
    amenities: [ { icon: 'local_parking', label: 'Parkir' }, { icon: 'wifi', label: 'WiFi' }, { icon: 'ac_unit', label: 'AC' } ]
  }
];

async function seed() {
  const ownerId = process.argv[2];
  if (!ownerId) {
    console.error('\n❌ Error: Anda harus memasukkan Owner ID (UUID) dari Supabase sebagai argumen.');
    console.error('Contoh: node scripts/seed.js "123e4567-e89b-12d3-a456-426614174000"\n');
    console.log('Untuk mendapatkan Owner ID:');
    console.log('1. Buka Supabase Dashboard > Authentication > Users');
    console.log('2. Copy nilai "User UID" dari akun Anda.\n');
    process.exit(1);
  }

  console.log(`Memulai seeding database untuk Owner ID: ${ownerId}...`);

  for (const property of properties) {
    const { data, error } = await supabase
      .from('properties')
      .insert([{ ...property, owner_id: ownerId }])
      .select();

    if (error) {
      console.error(`❌ Gagal menambahkan: ${property.title}`);
      console.error(error.message);
    } else {
      console.log(`✅ Berhasil menambahkan: ${property.title} (ID: ${data[0].id})`);
    }
  }

  console.log('\nSeeding selesai!');
}

seed();
