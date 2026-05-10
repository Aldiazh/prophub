import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Header, Footer, BottomNav, MaterialIcon, useAuth, supabase } from '@prophub/shared';

const paymentMethods = [
  {
    id: 'bank',
    title: 'Transfer Bank',
    icon: 'account_balance',
    options: [
      { id: 'bca', name: 'BCA', logo: 'BCA', color: 'bg-blue-600' },
      { id: 'bni', name: 'BNI', logo: 'BNI', color: 'bg-orange-500' },
      { id: 'bri', name: 'BRI', logo: 'BRI', color: 'bg-blue-800' },
      { id: 'mandiri', name: 'Mandiri', logo: 'MDR', color: 'bg-blue-900' },
    ],
  },
  {
    id: 'ewallet',
    title: 'E-Wallet',
    icon: 'account_balance_wallet',
    options: [
      { id: 'gopay', name: 'GoPay', logo: 'GP', color: 'bg-green-600' },
      { id: 'ovo', name: 'OVO', logo: 'OVO', color: 'bg-purple-600' },
      { id: 'dana', name: 'DANA', logo: 'DNA', color: 'bg-blue-500' },
      { id: 'shopeepay', name: 'ShopeePay', logo: 'SP', color: 'bg-orange-600' },
    ],
  },
  {
    id: 'qris',
    title: 'QRIS',
    icon: 'qr_code_2',
    options: [
      { id: 'qris', name: 'Scan QRIS', logo: 'QR', color: 'bg-red-600' },
    ],
  },
  {
    id: 'cod',
    title: 'Bayar di Tempat',
    icon: 'payments',
    options: [
      { id: 'cash', name: 'Tunai saat Survey', logo: 'Rp', color: 'bg-emerald-600' },
    ],
  },
];

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('bank');
  const [selectedMethod, setSelectedMethod] = useState('bca');
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [duration, setDuration] = useState('1');
  const [paymentScheme, setPaymentScheme] = useState('full');

  // COD scheduling state
  const [surveyDate, setSurveyDate] = useState('');
  const [surveyTime, setSurveyTime] = useState('');
  const [surveyNotes, setSurveyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCod = selectedCategory === 'cod';

  // Fetch property data
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
        console.error('Error fetching property for payment:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Generate next 14 days for date picker
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      dates.push({
        value: d.toISOString().split('T')[0],
        day: dayNames[d.getDay()],
        date: d.getDate(),
        month: monthNames[d.getMonth()],
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
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
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Properti yang ingin Anda sewa tidak tersedia.</p>
          <Link to="/browse" className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
            Kembali ke Jelajahi
          </Link>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <MaterialIcon icon="lock" className="text-7xl text-on-surface-variant mb-4" />
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Harap Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Anda harus login terlebih dahulu untuk melakukan transaksi sewa atau survey.</p>
          <Link to="/login" className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
            Masuk ke Akun
          </Link>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  const monthlyPrice = property.price_per_month;
  const totalMonths = parseInt(duration);
  const serviceFee = property.service_fee || 0;
  const baseTotal = (monthlyPrice * totalMonths) + serviceFee;
  const totalPrice = duration === '12' ? baseTotal - 500000 : baseTotal;
  
  // Provide fallback image
  const displayImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800';

  // DP calculations
  const dpPercent = paymentScheme === 'dp30' ? 0.3 : paymentScheme === 'dp50' ? 0.5 : 1;
  const dpAmount = Math.round(totalPrice * dpPercent);
  const remainingAmount = totalPrice - dpAmount;
  const amountToPay = paymentScheme === 'full' ? totalPrice : dpAmount;

  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const dpSchemes = [
    { id: 'full', label: 'Bayar Penuh', desc: 'Langsung lunas, tanpa sisa tagihan', icon: 'paid', percent: '100%' },
    { id: 'dp30', label: 'DP 30%', desc: 'Bayar 30% sekarang, sisa saat masuk', icon: 'savings', percent: '30%' },
    { id: 'dp50', label: 'DP 50%', desc: 'Bayar 50% sekarang, sisa saat masuk', icon: 'account_balance_wallet', percent: '50%' },
  ];

  const currentCategory = paymentMethods.find((c) => c.id === selectedCategory);
  const currentMethod = paymentMethods
    .flatMap((c) => c.options)
    .find((o) => o.id === selectedMethod);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!agreed || !tenantName.trim() || !tenantPhone.trim() || !user) return;
    if (isCod && (!surveyDate || !surveyTime)) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('transactions').insert([{
        property_id: property.id,
        tenant_id: user.id,
        duration_months: parseInt(duration),
        payment_method: selectedMethod,
        payment_scheme: paymentScheme,
        total_amount: totalPrice,
        paid_amount: isCod ? 0 : amountToPay,
        status: isCod ? 'survey_scheduled' : 'pending',
        survey_date: isCod ? surveyDate : null,
        survey_time: isCod ? `${surveyTime}:00` : null
      }]);

      if (error) throw error;
      
      setShowSuccess(true);
    } catch (err) {
      console.error('Error creating transaction:', err.message);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedDateLabel = () => {
    const d = availableDates.find((x) => x.value === surveyDate);
    return d ? `${d.day}, ${d.date} ${d.month}` : '';
  };

  // ── Success Screen ──
  if (showSuccess) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
          <div className="max-w-md w-full text-center">
            {/* Success Animation */}
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <MaterialIcon icon={isCod ? 'event_available' : 'check'} className="text-on-secondary text-3xl" />
              </div>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-3">
              {isCod ? 'Jadwal Survey Dikonfirmasi!' : 'Pembayaran Berhasil!'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              {isCod
                ? <>Jadwal survey Anda untuk <strong className="text-on-surface">{property.title}</strong> telah dijadwalkan. Pemilik akan menghubungi Anda untuk konfirmasi.</>
                : <>Pesanan Anda untuk <strong className="text-on-surface">{property.title}</strong> telah dikonfirmasi.</>
              }
            </p>

            {/* Order / Schedule Summary Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-left mb-8">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant">
                <img src={displayImage} alt={property.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-label-md text-label-md text-on-surface truncate">{property.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">{property.location}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Penyewa</span>
                  <span className="font-label-md text-on-surface">{tenantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Durasi</span>
                  <span className="font-label-md text-on-surface">{duration} bulan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Metode Pembayaran</span>
                  <span className="font-label-md text-on-surface">{currentMethod?.name}</span>
                </div>

                {/* COD-specific schedule info */}
                {isCod && (
                  <>
                    <hr className="border-outline-variant" />
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Tanggal Survey</span>
                      <span className="font-label-md text-on-surface">{getSelectedDateLabel()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Waktu</span>
                      <span className="font-label-md text-on-surface">{surveyTime} WIB</span>
                    </div>
                    {surveyNotes && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Catatan</span>
                        <span className="font-label-md text-on-surface text-right max-w-[60%]">{surveyNotes}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Skema</span>
                  <span className="font-label-md text-on-surface">
                    {paymentScheme === 'full' ? 'Bayar Penuh' : paymentScheme === 'dp30' ? 'DP 30%' : 'DP 50%'}
                  </span>
                </div>

                <hr className="border-outline-variant" />
                {paymentScheme !== 'full' && !isCod && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Total Keseluruhan</span>
                      <span className="font-label-md text-on-surface">{formatRupiah(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-headline-md text-on-surface">Dibayar (DP)</span>
                      <span className="font-headline-md text-secondary">{formatRupiah(dpAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Sisa saat check-in</span>
                      <span className="font-label-md text-on-surface-variant">{formatRupiah(remainingAmount)}</span>
                    </div>
                  </>
                )}
                {(paymentScheme === 'full' && !isCod) && (
                  <div className="flex justify-between">
                    <span className="font-headline-md text-on-surface">Total Dibayar</span>
                    <span className="font-headline-md text-secondary">{formatRupiah(totalPrice)}</span>
                  </div>
                )}
                {isCod && (
                  <div className="flex justify-between">
                    <span className="font-headline-md text-on-surface">Estimasi Bayar</span>
                    <span className="font-headline-md text-secondary">{formatRupiah(paymentScheme === 'full' ? totalPrice : dpAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* COD next steps */}
            {isCod && (
              <div className="bg-surface-container rounded-xl p-5 text-left mb-6">
                <h3 className="font-label-md text-label-md text-on-surface mb-3 flex items-center gap-2">
                  <MaterialIcon icon="checklist" className="text-secondary" />
                  Langkah Selanjutnya
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', icon: 'notifications_active', text: 'Pemilik akan mengkonfirmasi jadwal via WhatsApp/Chat' },
                    { step: '2', icon: 'directions_walk', text: `Datang ke lokasi pada ${getSelectedDateLabel()}, pukul ${surveyTime} WIB` },
                    { step: '3', icon: 'visibility', text: 'Lakukan survey dan cek kondisi properti' },
                    { step: '4', icon: 'handshake', text: 'Tanda tangan kontrak dan bayar di tempat' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-secondary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-secondary font-bold text-xs">{item.step}</span>
                      </div>
                      <div className="flex items-start gap-2 flex-1">
                        <MaterialIcon icon={item.icon} className="text-on-surface-variant text-lg shrink-0 mt-0.5" />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {isCod ? (
                <>
                  <Link to={`/chat/${property.id}`} className="flex-1 bg-secondary text-on-secondary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <MaterialIcon icon="chat" className="text-lg" />
                    Chat Pemilik
                  </Link>
                  <Link to="/dashboard" className="flex-1 border border-outline-variant text-on-surface py-3 rounded-xl font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                    <MaterialIcon icon="dashboard" className="text-lg" />
                    Lihat Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="flex-1 bg-secondary text-on-secondary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <MaterialIcon icon="dashboard" className="text-lg" />
                    Lihat Dashboard
                  </Link>
                  <Link to="/" className="flex-1 border border-outline-variant text-on-surface py-3 rounded-xl font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                    <MaterialIcon icon="home" className="text-lg" />
                    Kembali ke Beranda
                  </Link>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  // ── Payment Form ──
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 font-body-sm text-body-sm text-on-surface-variant">
          <Link to={`/property/${property.id}`} className="hover:text-secondary transition-colors">
            {property.title}
          </Link>
          <MaterialIcon icon="chevron_right" className="text-sm" />
          <span className="text-on-surface">Pembayaran</span>
        </div>

        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Pembayaran</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Lengkapi data dan pilih metode pembayaran untuk melanjutkan sewa.
        </p>

        <form onSubmit={handlePay}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form + Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tenant Info */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <MaterialIcon icon="person" className="text-secondary" />
                  Data Penyewa
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tenant-name" className="font-label-md text-label-md text-on-surface mb-1 block">Nama Lengkap *</label>
                    <input
                      id="tenant-name"
                      type="text"
                      required
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label htmlFor="tenant-phone" className="font-label-md text-label-md text-on-surface mb-1 block">Nomor HP *</label>
                    <input
                      id="tenant-phone"
                      type="tel"
                      required
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      placeholder="+62 812 3456 7890"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <MaterialIcon icon="calendar_month" className="text-secondary" />
                  Durasi Sewa
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {['1', '3', '6', '12'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDuration(m)}
                      className={`py-3 rounded-xl font-label-md text-label-md transition-all ${
                        duration === m
                          ? 'bg-secondary text-on-secondary shadow-md scale-[1.02]'
                          : 'bg-surface-container border border-outline-variant text-on-surface hover:border-secondary'
                      }`}
                    >
                      {m} Bulan
                    </button>
                  ))}
                </div>
                {duration === '12' && (
                  <div className="mt-3 bg-secondary-container/30 border border-secondary/20 rounded-lg px-4 py-2 flex items-center gap-2">
                    <MaterialIcon icon="local_offer" className="text-secondary text-lg" />
                    <span className="font-body-sm text-body-sm text-on-surface">
                      Hemat <strong className="text-secondary">Rp 500.000</strong> untuk kontrak 1 tahun!
                    </span>
                  </div>
                )}
              </div>

              {/* DP / Payment Scheme */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-2">
                  <MaterialIcon icon="receipt_long" className="text-secondary" />
                  Skema Pembayaran
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  Pilih metode pembayaran penuh atau uang muka (DP).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dpSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => setPaymentScheme(scheme.id)}
                      className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all text-center ${
                        paymentScheme === scheme.id
                          ? 'border-secondary bg-secondary-container/20 shadow-md scale-[1.02]'
                          : 'border-outline-variant hover:border-outline bg-surface-container-lowest'
                      }`}
                    >
                      {paymentScheme === scheme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                          <MaterialIcon icon="check" className="text-on-secondary text-xs" />
                        </div>
                      )}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        paymentScheme === scheme.id ? 'bg-secondary' : 'bg-surface-container-high'
                      }`}>
                        <MaterialIcon icon={scheme.icon} className={`text-xl ${
                          paymentScheme === scheme.id ? 'text-on-secondary' : 'text-on-surface-variant'
                        }`} />
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">{scheme.label}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{scheme.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {paymentScheme !== 'full' && (
                  <div className="mt-4 bg-surface-container rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MaterialIcon icon="info" className="text-secondary text-xl shrink-0 mt-0.5" />
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        <p className="mb-2">Anda membayar <strong className="text-secondary">{formatRupiah(dpAmount)}</strong> sekarang ({paymentScheme === 'dp30' ? '30%' : '50%'}).</p>
                        <p>Sisa <strong className="text-on-surface">{formatRupiah(remainingAmount)}</strong> dibayarkan saat check-in atau tanda tangan kontrak.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <MaterialIcon icon="credit_card" className="text-secondary" />
                  Metode Pembayaran
                </h2>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {paymentMethods.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedMethod(cat.options[0].id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-secondary text-on-secondary shadow-md'
                          : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      <MaterialIcon icon={cat.icon} className="text-lg" />
                      {cat.title}
                    </button>
                  ))}
                </div>

                {/* Payment Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentCategory?.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedMethod(option.id)}
                      className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                        selectedMethod === option.id
                          ? 'border-secondary bg-secondary-container/20 shadow-md scale-[1.02]'
                          : 'border-outline-variant hover:border-outline bg-surface-container-lowest'
                      }`}
                    >
                      {/* Selected checkmark */}
                      {selectedMethod === option.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                          <MaterialIcon icon="check" className="text-on-secondary text-xs" />
                        </div>
                      )}
                      {/* Logo */}
                      <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{option.logo}</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface">{option.name}</span>
                    </button>
                  ))}
                </div>

                {/* Payment info */}
                {selectedCategory === 'bank' && (
                  <div className="mt-4 bg-surface-container rounded-xl p-4 flex items-start gap-3">
                    <MaterialIcon icon="info" className="text-secondary text-xl shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Anda akan menerima nomor Virtual Account untuk melakukan transfer. Pembayaran akan dikonfirmasi otomatis dalam 1-5 menit.
                    </p>
                  </div>
                )}
                {selectedCategory === 'ewallet' && (
                  <div className="mt-4 bg-surface-container rounded-xl p-4 flex items-start gap-3">
                    <MaterialIcon icon="info" className="text-secondary text-xl shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Anda akan diarahkan ke aplikasi {currentMethod?.name} untuk menyelesaikan pembayaran. Pastikan saldo mencukupi.
                    </p>
                  </div>
                )}
                {selectedCategory === 'qris' && (
                  <div className="mt-4 bg-surface-container rounded-xl p-4 flex items-start gap-3">
                    <MaterialIcon icon="info" className="text-secondary text-xl shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Kode QR akan ditampilkan setelah konfirmasi. Scan menggunakan aplikasi e-wallet atau mobile banking yang mendukung QRIS.
                    </p>
                  </div>
                )}
                {selectedCategory === 'cod' && (
                  <div className="mt-4 bg-surface-container rounded-xl p-4 flex items-start gap-3">
                    <MaterialIcon icon="info" className="text-secondary text-xl shrink-0 mt-0.5" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Pembayaran dilakukan langsung saat survey atau tanda tangan kontrak di lokasi properti. Silakan pilih jadwal survey di bawah.
                    </p>
                  </div>
                )}
              </div>

              {/* COD Schedule Section */}
              {isCod && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-2">
                    <MaterialIcon icon="event" className="text-secondary" />
                    Jadwalkan Survey
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    Pilih tanggal dan waktu untuk survey lokasi dan tanda tangan kontrak.
                  </p>

                  {/* Date Picker */}
                  <div className="mb-6">
                    <label className="font-label-md text-label-md text-on-surface mb-3 block">Pilih Tanggal *</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {availableDates.slice(0, 10).map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setSurveyDate(d.value)}
                          className={`flex flex-col items-center px-3 py-3 rounded-xl min-w-[72px] transition-all shrink-0 ${
                            surveyDate === d.value
                              ? 'bg-secondary text-on-secondary shadow-md scale-[1.02]'
                              : d.isWeekend
                                ? 'bg-surface-container border border-outline-variant text-on-surface-variant'
                                : 'bg-surface-container border border-outline-variant text-on-surface hover:border-secondary'
                          }`}
                        >
                          <span className="font-label-sm text-[11px] uppercase opacity-70">{d.day.slice(0, 3)}</span>
                          <span className="font-headline-md text-headline-md">{d.date}</span>
                          <span className="font-label-sm text-[11px]">{d.month}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div className="mb-6">
                    <label className="font-label-md text-label-md text-on-surface mb-3 block">Pilih Waktu *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSurveyTime(time)}
                          className={`py-2.5 rounded-xl font-label-md text-label-md transition-all ${
                            surveyTime === time
                              ? 'bg-secondary text-on-secondary shadow-md'
                              : 'bg-surface-container border border-outline-variant text-on-surface hover:border-secondary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="survey-notes" className="font-label-md text-label-md text-on-surface mb-1 block">Catatan untuk Pemilik (opsional)</label>
                    <textarea
                      id="survey-notes"
                      value={surveyNotes}
                      onChange={(e) => setSurveyNotes(e.target.value)}
                      placeholder="Contoh: Saya datang berdua, tolong siapkan kontrak..."
                      rows={3}
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary resize-none"
                    />
                  </div>

                  {/* Schedule Preview */}
                  {surveyDate && surveyTime && (
                    <div className="mt-4 bg-secondary-container/30 border border-secondary/20 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                          <MaterialIcon icon="calendar_today" className="text-secondary text-2xl" />
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface">{getSelectedDateLabel()}, pukul {surveyTime} WIB</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">{property.location}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sticky top-24">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Ringkasan Pesanan</h2>

                {/* Property Card */}
                <div className="flex items-start gap-3 mb-6 pb-4 border-b border-outline-variant">
                  <img src={displayImage} alt={property.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-label-md text-label-md text-on-surface mb-1 line-clamp-2">{property.title}</h3>
                    <div className="flex items-center text-on-surface-variant font-body-sm text-body-sm">
                      <MaterialIcon icon="location_on" className="text-xs mr-1" />
                      {property.location}
                    </div>
                    <div className="font-label-md text-label-md text-secondary mt-1">{formatRupiah(property.price_per_month)}/bln</div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Sewa {duration} bulan × {formatRupiah(monthlyPrice)}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">
                      {formatRupiah(monthlyPrice * totalMonths)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Biaya layanan</span>
                    <span className="font-label-md text-label-md text-on-surface">{formatRupiah(serviceFee)}</span>
                  </div>
                  {duration === '12' && (
                    <div className="flex justify-between text-secondary">
                      <span className="font-body-sm text-body-sm">Diskon kontrak tahunan</span>
                      <span className="font-label-md text-label-md">-Rp 500.000</span>
                    </div>
                  )}
                  <hr className="border-outline-variant" />
                  <div className="flex justify-between">
                    <span className={`font-body-sm text-body-sm ${paymentScheme === 'full' ? 'font-headline-md text-headline-md' : ''} text-on-surface`}>Total Keseluruhan</span>
                    <span className={`font-label-md text-label-md ${paymentScheme === 'full' ? 'font-headline-md text-headline-md text-secondary' : 'text-on-surface'}`}>
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                  {paymentScheme !== 'full' && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Uang Muka ({paymentScheme === 'dp30' ? '30%' : '50%'})
                        </span>
                        <span className="font-headline-md text-headline-md text-secondary">
                          {formatRupiah(dpAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Sisa saat check-in</span>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          {formatRupiah(remainingAmount)}
                        </span>
                      </div>
                      <hr className="border-outline-variant" />
                      <div className="flex justify-between">
                        <span className="font-headline-md text-headline-md text-on-surface">Bayar Sekarang</span>
                        <span className="font-headline-md text-headline-md text-secondary">
                          {formatRupiah(dpAmount)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment method display */}
                <div className="bg-surface-container rounded-xl p-3 flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${currentMethod?.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-xs">{currentMethod?.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-label-md text-label-md text-on-surface">{currentMethod?.name}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">{currentCategory?.title}</div>
                  </div>
                  <MaterialIcon icon="check_circle" className="text-secondary text-xl" />
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary mt-0.5"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Saya menyetujui <a href="#" className="text-secondary hover:underline">Syarat & Ketentuan</a> serta{' '}
                    <a href="#" className="text-secondary hover:underline">Kebijakan Privasi</a> PropHub.
                  </span>
                </label>

                {/* Pay / Schedule Button */}
                <button
                  type="submit"
                  disabled={!agreed || !tenantName.trim() || !tenantPhone.trim() || (isCod && (!surveyDate || !surveyTime)) || isSubmitting}
                  className={`w-full py-4 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 transition-all ${
                    agreed && tenantName.trim() && tenantPhone.trim() && (!isCod || (surveyDate && surveyTime)) && !isSubmitting
                      ? 'bg-secondary text-on-secondary hover:opacity-90 shadow-lg hover:shadow-xl active:scale-[0.98]'
                      : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <><div className="w-5 h-5 rounded-full border-2 border-on-secondary border-t-transparent animate-spin"></div> Memproses...</>
                  ) : (
                    <>
                      <MaterialIcon icon={isCod ? 'event_available' : 'lock'} className="text-xl" />
                      {isCod ? 'Jadwalkan Survey' : 'Bayar Sekarang'}
                    </>
                  )}
                </button>

                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-on-surface-variant">
                  <MaterialIcon icon={isCod ? 'shield' : 'verified_user'} className="text-lg text-secondary" />
                  <span className="font-label-sm text-label-sm">{isCod ? 'Data Anda aman & terlindungi' : 'Pembayaran aman & terenkripsi'}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <div className="mt-12">
        <Footer variant="minimal" />
      </div>
      <BottomNav />
    </div>
  );
}
