import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer, BottomNav, MaterialIcon } from '@prophub/shared';

export default function NotFoundPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop text-center py-20">
        <div className="w-32 h-32 bg-surface-container rounded-full flex items-center justify-center mb-8">
          <MaterialIcon icon="explore_off" className="text-6xl text-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-8">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <MaterialIcon icon="home" className="text-lg" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/browse"
            className="border border-outline-variant text-on-surface px-8 py-3 rounded-xl font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            <MaterialIcon icon="search" className="text-lg" />
            Cari Properti
          </Link>
        </div>
      </main>
      <Footer variant="minimal" />
      <BottomNav />
    </div>
  );
}
