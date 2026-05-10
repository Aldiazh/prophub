import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from './MaterialIcon';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Jelajahi', path: '/browse' },
  { label: 'Chat', path: '/chat' },
  { label: 'Dashboard', path: '/dashboard' },
];

export function Header() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-surface sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-20">
        {/* Logo */}
        <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
          PropHub
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-stack-lg">
          {navLinks.map((link) => {
            // Hide Dashboard and Chat if user is not logged in
            if (!user && (link.path === '/dashboard' || link.path === '/chat')) return null;
            
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`font-label-md text-label-md py-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-stack-md">
          {user ? (
            <>
              <div className="relative group">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container overflow-hidden border border-outline-variant flex items-center justify-center font-bold">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <MaterialIcon icon="person" />}
                  </div>
                </Link>
                {/* Simple dropdown on hover for desktop */}
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button 
                    onClick={signOut}
                    className="w-full text-left px-4 py-3 font-label-md text-error hover:bg-surface-container flex items-center gap-2 rounded-xl"
                  >
                    <MaterialIcon icon="logout" /> Keluar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden lg:block bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-label-md text-label-md active:scale-95 transition-transform duration-100 hover:opacity-90"
              >
                Daftar
              </Link>
              <Link to="/login" className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                <MaterialIcon icon="login" className="text-on-surface-variant text-xl" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
