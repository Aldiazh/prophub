import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Header, 
  Footer, 
  BottomNav, 
  PropertyCard, 
  MaterialIcon, 
  useSavedProperties,
  supabase
} from '@prophub/shared';

export default function SavedPage() {
  const { savedIds } = useSavedProperties();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (savedIds.length === 0) {
        setSavedProperties([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .in('id', savedIds);
          
        if (error) throw error;
        setSavedProperties(data || []);
      } catch (err) {
        console.error('Error fetching saved properties:', err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedProperties();
  }, [savedIds]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
              Tersimpan
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Properti favorit yang Anda simpan ({savedProperties.length})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <MaterialIcon icon="favorite_border" className="text-5xl text-on-surface-variant" />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Belum ada yang disimpan</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8">
              Jelajahi listing dan klik ikon hati (❤️) pada properti yang Anda sukai untuk menyimpannya di sini.
            </p>
            <Link
              to="/browse"
              className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <MaterialIcon icon="search" />
              Mulai Cari Properti
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
