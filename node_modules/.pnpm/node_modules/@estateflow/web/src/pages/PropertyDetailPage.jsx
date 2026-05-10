import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header, Footer, BottomNav, MaterialIcon, supabase } from '@prophub/shared';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, profiles(*)')
          .eq('id', id)
          .single();
        if (error) throw error;
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property detail:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number || 0);
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <MaterialIcon icon="search_off" className="text-7xl text-on-surface-variant mb-4" />
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Properti Tidak Ditemukan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md">
            Maaf, properti yang Anda cari tidak tersedia atau sudah dihapus.
          </p>
          <Link to="/browse" className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
            Lihat Semua Properti
          </Link>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  const title = property.title;
  const price = `${formatRupiah(property.price_per_month)}/bln`;
  const description = property.description || 'Tidak ada deskripsi.';
  
  // Fallbacks for data that might not be in DB yet
  const images = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607687931-cebf10cbdf1e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  ];

  const specs = property.amenities || [];
  const features = (property.facilities || []).map(f => ({ icon: 'check_circle', label: f }));
  const rules = property.rules || [
    { icon: 'schedule', label: 'Akses 24 Jam' },
    { icon: 'no_smoking', label: 'Dilarang merokok di dalam kamar' }
  ];

  const agent = {
    name: property.profiles?.full_name || 'Pemilik Properti',
    role: property.profiles?.role === 'owner' ? 'Pemilik Langsung' : 'Agen Properti',
    rating: 4.8,
    reviews: 24,
    responsiveness: 95,
    knowledge: 90
  };

  const costs = {
    serviceFee: formatRupiah(property.service_fee),
    maintenance: formatRupiah(property.maintenance_fee),
    totalPrice: formatRupiah(property.price_per_month + (property.service_fee || 0) + (property.maintenance_fee || 0))
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2">
            <img src={images[0]} alt="Utama" className="w-full h-full object-cover min-h-[280px] md:min-h-[400px]" />
          </div>
          <div className="hidden md:block"><img src={images[1]} alt="Interior" className="w-full h-48 object-cover" /></div>
          <div className="hidden md:block"><img src={images[2]} alt="Tampilan" className="w-full h-48 object-cover" /></div>
          <div className="col-span-2 relative hidden md:block">
            <img src={images[3]} alt="Lainnya" className="w-full h-48 object-cover" />
            <button aria-label="Lihat semua foto" className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-1">
              <MaterialIcon icon="photo_library" className="text-lg" /> Lihat semua foto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{title}</h1>
                <div className="flex items-center text-on-surface-variant mt-2 font-body-sm text-body-sm">
                  <MaterialIcon icon="location_on" className="text-sm mr-1" />{property.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-secondary font-headline-xl text-headline-xl">{price}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {specs.map((s, i) => (
                <div key={i} className="bg-surface-container px-6 py-4 rounded-xl flex flex-col items-center gap-1">
                  <MaterialIcon icon={s.icon} className="text-secondary text-2xl" />
                  <span className="font-label-sm text-label-sm text-on-surface">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Tentang Properti Ini</h2>
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                {showFull ? description : description.substring(0, 300) + (description.length > 300 ? '...' : '')}
              </p>
              {description.length > 300 && (
                <button onClick={() => setShowFull(!showFull)} className="text-secondary font-label-md text-label-md mt-2 flex items-center gap-1 hover:underline">
                  {showFull ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'} <MaterialIcon icon={showFull ? 'expand_less' : 'chevron_right'} className="text-lg" />
                </button>
              )}
            </div>

            <div className="mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Fasilitas Properti</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <MaterialIcon icon={f.icon} className="text-secondary" />
                    <span className="font-body-md text-body-md text-on-surface">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Lokasi</h2>
              <div className="bg-surface-container-high rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-on-surface-variant">
                  <MaterialIcon icon="map" className="text-5xl mb-2" />
                  <p className="font-body-sm text-body-sm">Peta lokasi interaktif</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h3 className="font-headline-md text-headline-md mb-4">Performa Agen</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-headline-xl text-headline-xl">{agent.rating}</span>
                  <div>
                    <div className="flex text-secondary-fixed-dim">{[1,2,3,4,5].map(s=><MaterialIcon key={s} icon="star" className="text-lg" style={s<=Math.floor(agent.rating)?{fontVariationSettings:"'FILL' 1"}:{}}/>)}</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Berdasarkan {agent.reviews} transaksi</span>
                  </div>
                </div>
                {[{l:'Responsivitas',v:agent.responsiveness},{l:'Pengetahuan',v:agent.knowledge}].map(b=>(
                  <div key={b.l} className="mb-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{b.l}</span>
                    <div className="w-full bg-surface-container-high rounded-full h-2 mt-1"><div className="bg-secondary rounded-full h-2" style={{width:`${b.v}%`}}/></div>
                  </div>
                ))}
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h3 className="font-headline-md text-headline-md mb-4">Peraturan Properti</h3>
                <div className="space-y-4">{rules.map((r,i)=><div key={i} className="flex items-center gap-3"><MaterialIcon icon={r.icon} className="text-on-surface-variant"/><span className="font-body-sm text-body-sm">{r.label}</span></div>)}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center"><MaterialIcon icon="person" className="text-on-surface-variant text-2xl"/></div>
                <div><h3 className="font-headline-md text-headline-md">{agent.name}</h3><p className="font-body-sm text-body-sm text-on-surface-variant">{agent.role}</p></div>
              </div>
              <Link to={`/chat/${property.id}`} className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-label-md text-label-md mb-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><MaterialIcon icon="chat" className="text-lg"/>Chat dengan Pemilik</Link>
              <button className="w-full border border-outline-variant text-on-surface py-3 rounded-xl font-label-md text-label-md mb-6 hover:bg-surface-container transition-colors flex items-center justify-center gap-2"><MaterialIcon icon="call" className="text-lg"/>Hubungi via WhatsApp</button>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="font-body-sm text-body-sm text-on-surface-variant">Biaya Layanan</span><span className="font-label-md text-label-md">{costs.serviceFee}</span></div>
                <div className="flex justify-between"><span className="font-body-sm text-body-sm text-on-surface-variant">Perawatan</span><span className="font-label-md text-label-md">{costs.maintenance}</span></div>
                <hr className="border-outline-variant"/>
                <div className="flex justify-between"><span className="font-headline-md text-headline-md">Total Harga</span><span className="font-headline-md text-headline-md text-secondary">{costs.totalPrice}</span></div>
              </div>
              <Link to={`/payment/${property.id}`} className="w-full bg-secondary text-on-secondary py-3.5 rounded-xl font-headline-md text-headline-md mb-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"><MaterialIcon icon="shopping_cart" className="text-lg"/>Sewa Sekarang</Link>
              <button aria-label="Laporkan listing ini" className="w-full text-on-surface-variant font-body-sm text-body-sm flex items-center justify-center gap-1 hover:text-error transition-colors"><MaterialIcon icon="flag" className="text-lg"/>Laporkan listing ini</button>
              <div className="mt-6 bg-secondary-container rounded-xl p-4 border border-secondary/20">
                <h4 className="font-label-md text-label-md mb-1">Penawaran Spesial</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hubungi hari ini dan dapatkan gratis biaya layanan untuk bulan pertama!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="extended" />
      <BottomNav />
    </div>
  );
}
