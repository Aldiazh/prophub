import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header, Footer, BottomNav, PropertyCard, MaterialIcon, supabase } from '@prophub/shared';

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  const initialMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 10000000;

  const [viewMode, setViewMode] = useState('list');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedTypes, setSelectedTypes] = useState(initialType ? [initialType] : []);
  const [roomType, setRoomType] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [sortBy, setSortBy] = useState('cheapest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedArea, setSelectedArea] = useState('');
  
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from('properties').select('*');
        if (error) throw error;
        setAllProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Extract unique areas from fetched data for the dropdown
  const availableAreas = useMemo(() => {
    const areas = new Set(allProperties.map(p => p.location.split(',')[0].trim()));
    return Array.from(areas).sort();
  }, [allProperties]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleFacility = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setRoomType('');
    setFacilities([]);
    setMaxPrice(10000000);
    setSearchQuery('');
    setSelectedArea('');
  };

  const filteredProperties = useMemo(() => {
    let results = [...allProperties];

    // Search query (Title only)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Area / Location
    if (selectedArea) {
      results = results.filter((p) => p.location.toLowerCase().includes(selectedArea.toLowerCase()));
    }

    // Price Max
    results = results.filter((p) => p.price_per_month <= maxPrice);

    // Property type
    if (selectedTypes.length > 0) {
      results = results.filter((p) => selectedTypes.includes(p.type));
    }

    // Room type
    if (roomType) {
      results = results.filter((p) => p.room_type === roomType);
    }

    // Facilities
    if (facilities.length > 0) {
      results = results.filter((p) =>
        facilities.every((f) => p.facilities?.includes(f))
      );
    }

    // Sort
    if (sortBy === 'cheapest') {
      results.sort((a, b) => a.price_per_month - b.price_per_month);
    } else if (sortBy === 'expensive') {
      results.sort((a, b) => b.price_per_month - a.price_per_month);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return results;
  }, [allProperties, searchQuery, selectedArea, maxPrice, selectedTypes, roomType, facilities, sortBy]);

  const formatPrice = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1) + ' Jt';
    return (val / 1000).toFixed(0) + 'rb';
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-md text-headline-md">Filter</h3>
                <button onClick={clearFilters} className="text-secondary font-label-md text-label-md hover:underline">
                  Hapus semua
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Nama Properti</h4>
                <div className="relative">
                  <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama properti..."
                    className="w-full bg-surface-container rounded-lg pl-10 pr-3 py-2 border border-outline-variant font-body-sm text-body-sm text-on-surface focus:ring-secondary focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <hr className="border-outline-variant mb-6" />

              {/* Area / Location */}
              <div className="mb-6">
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Area / Kecamatan</h4>
                <div className="relative">
                  <MaterialIcon icon="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-surface-container rounded-lg pl-10 pr-3 py-2 border border-outline-variant font-body-sm text-body-sm text-on-surface focus:ring-secondary focus:border-secondary focus:outline-none appearance-none"
                  >
                    <option value="">Semua Area (Kediri)</option>
                    {availableAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="border-outline-variant mb-6" />

              {/* Price Max */}
              <div className="mb-6">
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Harga Maksimum</h4>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span>Rp 0</span>
                  <span className="text-secondary font-label-sm">{formatPrice(maxPrice)}</span>
                </div>
              </div>

              <hr className="border-outline-variant mb-6" />

              {/* Property Type */}
              <div className="mb-6">
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Tipe Properti</h4>
                {['Kos', 'Rumah', 'Kontrakan'].map((type) => (
                  <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">{type}</span>
                  </label>
                ))}
              </div>

              <hr className="border-outline-variant mb-6" />

              {/* Room Type */}
              <div className="mb-6">
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Tipe Kamar</h4>
                <div className="flex gap-2">
                  {['Single', 'Double'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRoomType(roomType === type ? '' : type)}
                      className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-colors ${
                        roomType === type
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container border border-outline-variant text-on-surface'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-outline-variant mb-6" />

              {/* Facilities */}
              <div>
                <h4 className="font-label-md text-label-md text-on-surface mb-3">Fasilitas</h4>
                {['WiFi', 'AC', 'Bathroom inside', 'Parking'].map((facility) => (
                  <label key={facility} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">
                      {facility === 'Bathroom inside' ? 'KM Dalam' : facility === 'Parking' ? 'Parkir' : facility}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">
                  Ditemukan {filteredProperties.length} Properti
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {searchQuery ? `Menampilkan hasil untuk "${searchQuery}"` : 'Menampilkan hasil untuk "Kediri"'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-surface-container rounded-lg border border-outline-variant overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-3 py-2 font-label-sm text-label-sm transition-colors ${
                      viewMode === 'list'
                        ? 'bg-surface-container-lowest text-on-surface'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <MaterialIcon icon="view_list" className="text-lg" />
                    Daftar
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1 px-3 py-2 font-label-sm text-label-sm transition-colors ${
                      viewMode === 'map'
                        ? 'bg-surface-container-lowest text-on-surface'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <MaterialIcon icon="map" className="text-lg" />
                    Peta
                  </button>
                </div>
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-label-sm text-label-sm text-on-surface focus:ring-secondary focus:border-secondary"
                >
                  <option value="cheapest">Urutkan: Termurah</option>
                  <option value="expensive">Urutkan: Termahal</option>
                  <option value="newest">Urutkan: Terbaru</option>
                </select>
              </div>
            </div>

            {/* Property Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MaterialIcon icon="search_off" className="text-6xl text-on-surface-variant mb-4" />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Tidak ada properti ditemukan</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-sm">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
                <button onClick={clearFilters} className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
                  Hapus Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer variant="extended" />
      </div>
      <BottomNav />
    </div>
  );
}
