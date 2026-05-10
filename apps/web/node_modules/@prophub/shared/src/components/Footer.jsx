import React from 'react';
import { Link } from 'react-router-dom';

export function Footer({ variant = 'default' }) {
  if (variant === 'minimal') {
    return (
      <footer className="bg-surface-container-highest w-full py-8 px-4 md:px-margin-desktop border-t border-outline-variant">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-headline-md text-headline-md text-primary font-bold">PropHub</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              © 2026 PropHub Marketplace. Hak cipta dilindungi.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Syarat Layanan</a>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Bantuan</a>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Tentang Kami</a>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'extended') {
    return (
      <footer className="bg-surface-container-highest w-full py-stack-lg px-4 md:px-margin-desktop border-t border-outline-variant">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
            <div className="space-y-stack-md">
              <div className="font-headline-md text-headline-md text-primary font-bold">PropHub</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Marketplace properti premium yang menghubungkan pemilik dengan pencari hunian melalui desain modern dan teknologi transparan.
              </p>
              <div className="flex gap-3 text-on-surface-variant">
                <button aria-label="Website" className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">language</span></button>
                <button aria-label="Bagikan" className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">share</span></button>
                <button aria-label="Email" className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">mail</span></button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface mb-2">Perusahaan</span>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Tentang Kami</a>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Syarat Layanan</a>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Kebijakan Privasi</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface mb-2">Dukungan</span>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Hubungi Bantuan</a>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Pusat Bantuan</a>
              <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-colors">Panduan Keamanan</a>
            </div>
          </div>
          <div className="border-t border-outline-variant pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2026 PropHub Marketplace. Hak cipta dilindungi.
            </p>
            <div className="flex gap-4 text-on-surface-variant font-body-sm text-body-sm">
              <span>Bahasa Indonesia</span>
              <span>IDR (Rp)</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default footer
  return (
    <footer className="bg-surface-container-highest w-full py-stack-lg px-4 md:px-margin-desktop border-t border-outline-variant">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="space-y-stack-md">
          <div className="font-headline-md text-headline-md text-primary font-bold">PropHub</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            Menjadikan properti sederhana, transparan, dan mudah diakses untuk semua orang. Hunian sempurna Anda hanya selangkah lagi.
          </p>
          <div className="text-on-surface-variant font-body-sm text-body-sm">
            © 2026 PropHub Marketplace. Hak cipta dilindungi.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-stack-lg">
          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface mb-2">Perusahaan</span>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-opacity duration-300">Tentang Kami</a>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-opacity duration-300">Hubungi Bantuan</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface mb-2">Legal</span>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-opacity duration-300">Syarat Layanan</a>
            <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:underline hover:text-secondary transition-opacity duration-300">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
