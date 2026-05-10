import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from './MaterialIcon';

const navItems = [
  { label: 'Jelajahi', icon: 'search', path: '/' },
  { label: 'Tersimpan', icon: 'favorite', path: '/saved' },
  { label: 'Pesan', icon: 'mail', path: '/chat' },
  { label: 'Profil', icon: 'person', path: '/login' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface-bright border-t border-outline-variant shadow-lg rounded-t-xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              isActive ? 'text-secondary' : 'text-on-surface-variant'
            }`}
          >
            <MaterialIcon icon={item.icon} />
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
