import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Footer, BottomNav, MaterialIcon, useAuth, supabase } from '@prophub/shared';

const ownerSidebarItems = [
  { icon: 'dashboard', label: 'Listing Saya', id: 'listings' },
  { icon: 'group', label: 'Lead', id: 'leads' },
  { icon: 'settings', label: 'Pengaturan', id: 'settings' },
];

const tenantSidebarItems = [
  { icon: 'event', label: 'Jadwal Survey', id: 'surveys' },
  { icon: 'receipt_long', label: 'Transaksi Saya', id: 'transactions' },
  { icon: 'settings', label: 'Pengaturan', id: 'settings' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [myProperties, setMyProperties] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Settings State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Add Listing State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    type: 'Kos',
    location: '',
    price_per_month: '',
    description: ''
  });

  // Edit Listing State
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const sidebarItems = profile?.role === 'owner' ? ownerSidebarItems : tenantSidebarItems;

  useEffect(() => {
    // Default active tab based on role
    if (profile?.role === 'owner') setActiveTab('listings');
    else if (profile?.role === 'tenant') setActiveTab('surveys');

    // Initialize edit state
    if (profile) {
      setEditFullName(profile.full_name || '');
      setEditPhone(profile.phone_number || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (profile?.role !== 'owner' || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
          
        if (error) throw error;
        setMyProperties(data || []);
      } catch (err) {
        console.error('Error fetching my properties:', err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyProperties();
  }, [user, profile]);

  const refreshMyProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);
      if (error) throw error;
      setMyProperties(data || []);
    } catch (err) {
      console.error('Error fetching my properties:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (profile?.role !== 'tenant' || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*, properties(*)')
          .eq('tenant_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setMyTransactions(data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
      }
    };
    
    fetchTransactions();
  }, [user, profile]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setUpdateMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editFullName,
          phone_number: editPhone
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setUpdateMessage('Profil berhasil diperbarui!');
      refreshProfile();
      
      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      setUpdateMessage('Gagal memperbarui profil.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsAddingProperty(true);

    try {
      const { error } = await supabase.from('properties').insert({
        owner_id: user.id,
        title: newProperty.title,
        type: newProperty.type,
        location: newProperty.location,
        price_per_month: parseInt(newProperty.price_per_month),
        description: newProperty.description,
        status: 'Available'
      });

      if (error) throw error;
      
      setShowAddModal(false);
      setNewProperty({ title: '', type: 'Kos', location: '', price_per_month: '', description: '' });
      refreshMyProperties();
    } catch (err) {
      console.error('Error adding property:', err.message);
      alert('Gagal menambah properti: ' + err.message);
    } finally {
      setIsAddingProperty(false);
    }
  };

  const handleEditPropertySubmit = async (e) => {
    e.preventDefault();
    if (!user || !editingProperty) return;
    setIsEditingProperty(true);

    try {
      const { error } = await supabase.from('properties').update({
        title: editingProperty.title,
        type: editingProperty.type,
        location: editingProperty.location,
        price_per_month: parseInt(editingProperty.price_per_month),
        description: editingProperty.description,
        status: editingProperty.status
      }).eq('id', editingProperty.id);

      if (error) throw error;
      
      setShowEditModal(false);
      setEditingProperty(null);
      refreshMyProperties();
    } catch (err) {
      console.error('Error updating property:', err.message);
      alert('Gagal memperbarui properti: ' + err.message);
    } finally {
      setIsEditingProperty(false);
    }
  };

  const openEditModal = (property) => {
    setEditingProperty({ ...property });
    setShowEditModal(true);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  const surveys = myTransactions.filter(t => t.status === 'survey_scheduled');

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Mobile Tab Bar */}
        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <MaterialIcon icon={item.icon} className="text-lg" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-48 shrink-0">
            <div className="space-y-1 mb-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-secondary text-on-secondary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <MaterialIcon icon={item.icon} className="text-xl" />
                  {item.label}
                </button>
              ))}
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-error font-label-md text-label-md hover:bg-error-container rounded-xl transition-colors mt-8">
              <MaterialIcon icon="logout" className="text-xl" />
              Keluar
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="font-headline-xl text-headline-xl text-on-surface">Halo, {profile?.full_name || 'Pengguna'}!</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {profile?.role === 'owner' 
                  ? 'Selamat datang kembali, kelola properti dan lead Anda di sini.' 
                  : 'Selamat datang kembali, pantau jadwal survey dan transaksi Anda di sini.'}
              </p>
            </div>

            {/* Stats (Hanya untuk Owner sementara ini) */}
            {profile?.role === 'owner' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <MaterialIcon icon="home" className="text-secondary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-xl text-headline-xl text-on-surface">{myProperties.length}</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Total Listing Aktif</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <MaterialIcon icon="visibility" className="text-secondary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-xl text-headline-xl text-on-surface">N/A</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Total Dilihat (Segera Hadir)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'listings' && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Listing Saya</h2>
                  <button onClick={() => setShowAddModal(true)} className="bg-secondary text-on-secondary px-4 py-2 rounded-xl font-label-md hover:opacity-90 flex items-center justify-center gap-2">
                    <MaterialIcon icon="add" className="text-lg" /> Tambah Listing
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="text-left px-6 py-3 font-label-md text-label-md text-on-surface-variant">Properti</th>
                        <th className="text-left px-4 py-3 font-label-md text-label-md text-on-surface-variant">Status</th>
                        <th className="text-left px-4 py-3 font-label-md text-label-md text-on-surface-variant">Harga</th>
                        <th className="text-left px-4 py-3 font-label-md text-label-md text-on-surface-variant">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div></td></tr>
                      ) : myProperties.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-12 text-on-surface-variant font-body-md">Belum ada properti yang ditambahkan. <br/>Klik <strong>Tambah Listing</strong> untuk mulai.</td></tr>
                      ) : myProperties.map((listing) => (
                        <tr key={listing.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center shrink-0">
                                <MaterialIcon icon="home" className="text-on-surface-variant" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-label-md text-label-md text-on-surface line-clamp-1">{listing.title}</div>
                                <div className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{listing.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`font-label-sm text-label-sm px-3 py-1 rounded-full ${
                              listing.status === 'Available' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                              {listing.status === 'Available' ? 'Tersedia' : 'Terisi'}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-label-md text-label-md text-on-surface">{formatRupiah(listing.price_per_month)}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => openEditModal(listing)} aria-label="Edit properti" className="text-on-surface-variant hover:text-secondary transition-colors">
                              <MaterialIcon icon="edit" className="text-xl" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'surveys' && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Jadwal Survey Saya</h2>
                {surveys.length > 0 ? (
                  <div className="space-y-4">
                    {surveys.map((survey) => (
                      <div key={survey.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-outline-variant rounded-xl">
                        <div className="w-16 h-16 bg-secondary/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                          <span className="font-headline-md text-secondary">{new Date(survey.survey_date).getDate()}</span>
                          <span className="font-label-sm text-secondary uppercase">{new Date(survey.survey_date).toLocaleString('id-ID', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-label-md text-label-md text-on-surface mb-1">{survey.properties?.title || 'Properti tidak diketahui'}</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                            <MaterialIcon icon="schedule" className="text-[14px]" />
                            {new Date(survey.survey_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Link to={`/property/${survey.property_id}`} className="flex-1 sm:flex-none text-center bg-surface-container text-on-surface px-4 py-2 rounded-lg font-label-sm hover:bg-surface-container-high transition-colors">
                            Lihat Listing
                          </Link>
                          <Link to={`/chat/${survey.property_id}`} className="flex-1 sm:flex-none text-center bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-sm hover:opacity-90 transition-opacity">
                            Chat Pemilik
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MaterialIcon icon="event_available" className="text-6xl text-on-surface-variant mb-4" />
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Tidak Ada Jadwal Survey</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                      Anda belum memiliki jadwal survey. Cari properti dan ajukan jadwal survey sekarang!
                    </p>
                    <Link to="/browse" className="inline-block mt-6 bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90">
                      Cari Properti
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Riwayat Transaksi</h2>
                {myTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-outline-variant">
                          <th className="text-left px-4 py-3 font-label-md text-on-surface-variant">Tanggal</th>
                          <th className="text-left px-4 py-3 font-label-md text-on-surface-variant">Properti</th>
                          <th className="text-left px-4 py-3 font-label-md text-on-surface-variant">Total Bayar</th>
                          <th className="text-left px-4 py-3 font-label-md text-on-surface-variant">Metode</th>
                          <th className="text-left px-4 py-3 font-label-md text-on-surface-variant">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTransactions.map((trx) => (
                          <tr key={trx.id} className="border-b border-outline-variant last:border-0">
                            <td className="px-4 py-4 font-body-sm text-on-surface">
                              {new Date(trx.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-label-md text-on-surface line-clamp-1">{trx.properties?.title}</div>
                            </td>
                            <td className="px-4 py-4 font-label-md text-on-surface">
                              {trx.amount > 0 ? formatRupiah(trx.amount) : 'Bayar di Tempat'}
                            </td>
                            <td className="px-4 py-4 font-body-sm text-on-surface uppercase">
                              {trx.payment_method}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`font-label-sm px-3 py-1 rounded-full ${
                                trx.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                trx.status === 'survey_scheduled' ? 'bg-blue-100 text-blue-800' :
                                trx.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {trx.status === 'paid' ? 'Lunas' : 
                                 trx.status === 'survey_scheduled' ? 'Jadwal Survey' : 
                                 trx.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MaterialIcon icon="receipt_long" className="text-6xl text-on-surface-variant mb-4" />
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Riwayat Transaksi Kosong</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                      Anda belum pernah melakukan transaksi sewa properti di sistem ini.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Pengaturan Akun</h2>
                
                {updateMessage && (
                  <div className={`mb-6 p-4 rounded-xl font-label-md text-label-md ${updateMessage.includes('Gagal') ? 'bg-error-container text-error' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {updateMessage}
                  </div>
                )}

                <div className="space-y-6 max-w-lg">
                  <div>
                    <label htmlFor="settings-name" className="font-label-md text-label-md text-on-surface mb-1 block">Nama Lengkap</label>
                    <input id="settings-name" type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary outline-none" />
                  </div>
                  <div>
                    <label htmlFor="settings-email" className="font-label-md text-label-md text-on-surface mb-1 block">Email</label>
                    <input id="settings-email" type="email" disabled value={user?.email || ''} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container text-on-surface-variant font-body-md cursor-not-allowed opacity-70" />
                    <p className="text-xs text-on-surface-variant mt-1">Email tidak dapat diubah karena terhubung dengan autentikasi Anda.</p>
                  </div>
                  <div>
                    <label htmlFor="settings-phone" className="font-label-md text-label-md text-on-surface mb-1 block">Nomor HP</label>
                    <input id="settings-phone" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary outline-none" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
                    <div>
                      <div className="font-label-md text-label-md text-on-surface">Notifikasi Email</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Terima update lead & listing via email</div>
                    </div>
                    <div className="w-12 h-7 bg-secondary rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateProfile} 
                    disabled={isUpdating}
                    className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-on-secondary border-t-transparent animate-spin"></div> Menyimpan...</>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer variant="minimal" />
      </div>
      <BottomNav />

      {/* Modal Tambah Listing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">Tambah Listing Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <MaterialIcon icon="close" className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Judul Properti *</label>
                <input required type="text" value={newProperty.title} onChange={e => setNewProperty({...newProperty, title: e.target.value})} placeholder="Contoh: Kos Putri Sejahtera" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Tipe Properti *</label>
                  <select required value={newProperty.type} onChange={e => setNewProperty({...newProperty, type: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none appearance-none">
                    <option value="Kos">Kos</option>
                    <option value="Kontrakan">Kontrakan</option>
                    <option value="Rumah">Rumah</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Harga per Bulan (Rp) *</label>
                  <input required type="number" value={newProperty.price_per_month} onChange={e => setNewProperty({...newProperty, price_per_month: e.target.value})} placeholder="1500000" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Lokasi (Alamat Singkat) *</label>
                <input required type="text" value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} placeholder="Kec. Mojoroto, Kota Kediri" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Deskripsi Singkat</label>
                <textarea rows="3" value={newProperty.description} onChange={e => setNewProperty({...newProperty, description: e.target.value})} placeholder="Jelaskan keunggulan properti Anda..." className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none resize-none"></textarea>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-colors">Batal</button>
                <button type="submit" disabled={isAddingProperty} className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary font-label-md hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isAddingProperty ? 'Menyimpan...' : 'Simpan Properti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Listing */}
      {showEditModal && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">Edit Listing</h2>
              <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <MaterialIcon icon="close" className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleEditPropertySubmit} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Judul Properti *</label>
                <input required type="text" value={editingProperty.title} onChange={e => setEditingProperty({...editingProperty, title: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Tipe Properti *</label>
                  <select required value={editingProperty.type} onChange={e => setEditingProperty({...editingProperty, type: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none appearance-none">
                    <option value="Kos">Kos</option>
                    <option value="Kontrakan">Kontrakan</option>
                    <option value="Rumah">Rumah</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Status Ketersediaan *</label>
                  <select required value={editingProperty.status} onChange={e => setEditingProperty({...editingProperty, status: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none appearance-none">
                    <option value="Available">Tersedia</option>
                    <option value="Occupied">Terisi</option>
                    <option value="Under Contract">Disewa</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Harga per Bulan (Rp) *</label>
                  <input required type="number" value={editingProperty.price_per_month} onChange={e => setEditingProperty({...editingProperty, price_per_month: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Lokasi (Alamat Singkat) *</label>
                  <input required type="text" value={editingProperty.location} onChange={e => setEditingProperty({...editingProperty, location: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Deskripsi Singkat</label>
                <textarea rows="3" value={editingProperty.description || ''} onChange={e => setEditingProperty({...editingProperty, description: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:ring-secondary focus:border-secondary outline-none resize-none"></textarea>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-colors">Batal</button>
                <button type="submit" disabled={isEditingProperty} className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary font-label-md hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isEditingProperty ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
