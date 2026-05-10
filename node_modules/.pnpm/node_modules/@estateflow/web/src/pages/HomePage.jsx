import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Header,
  Footer,
  BottomNav,
  PropertyCard,
  CategoryCard,
  MaterialIcon,
  categories,
  supabase
} from '@prophub/shared';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Kos');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .limit(6);
          
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('q', searchLocation.trim());
    if (searchType) params.set('type', searchType);
    if (maxPrice < 10000000) params.set('maxPrice', maxPrice);
    navigate(`/browse?${params.toString()}`);
  };

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/browse?type=${categoryTitle}`);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative hero-gradient pt-stack-lg pb-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto pt-16 text-center">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-stack-md">
              Temukan Hunian Impian Anda dengan Mudah
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
              Cari ribuan listing premium dari pemilik dan agen terverifikasi di seluruh Kediri.
            </p>

            {/* Search Component */}
            <form onSubmit={handleSearch} className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl shadow-lg border border-outline-variant max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
              {/* Location */}
              <div className="w-full flex-1 flex flex-col items-start px-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Lokasi</span>
                <div className="flex items-center w-full">
                  <MaterialIcon icon="location_on" className="text-outline mr-2" />
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-body-md p-0"
                    placeholder="Mau cari di mana?"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-outline-variant"></div>

              {/* Property Type */}
              <div className="w-full flex-1 flex flex-col items-start px-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tipe Properti</span>
                <div className="flex items-center w-full">
                  <MaterialIcon icon="home" className="text-outline mr-2" />
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-body-md p-0 appearance-none cursor-pointer"
                  >
                    <option>Kos</option>
                    <option>Kontrakan</option>
                    <option>Rumah</option>
                  </select>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-outline-variant"></div>

              {/* Max Price */}
              <div className="w-full flex-1 flex flex-col items-start px-2">
                <div className="w-full flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Harga Maks.</span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">
                    {maxPrice >= 10000000 ? 'Semua Harga' : `Rp ${(maxPrice/1000000).toFixed(1)} Jt`}
                  </span>
                </div>
                <div className="flex items-center w-full mt-1">
                  <MaterialIcon icon="payments" className="text-outline mr-2" />
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="500000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full md:w-auto bg-secondary text-on-secondary px-8 py-4 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MaterialIcon icon="search" />
                Cari
              </button>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <div className="flex items-center justify-between mb-stack-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Jelajahi Kategori</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.title}
                  icon={cat.icon}
                  title={cat.title}
                  description={cat.description}
                  onClick={() => handleCategoryClick(cat.title)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">Listing Unggulan</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pilihan properti terbaik yang sesuai dengan gaya hidup Anda.
                </p>
              </div>
              <Link
                to="/browse"
                className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:underline"
              >
                Lihat Semua Listing <MaterialIcon icon="chevron_right" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
                {properties.length === 0 && (
                  <div className="col-span-full text-center py-12 text-on-surface-variant font-body-lg">
                    Belum ada properti yang tersedia.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
