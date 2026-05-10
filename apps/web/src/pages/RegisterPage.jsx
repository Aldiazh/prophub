import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialIcon, Footer, useAuth } from '@prophub/shared';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [role, setRole] = useState('tenant'); // Supabase role is 'tenant', not 'seeker'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await signUp({
      email,
      password,
      fullName,
      phone,
      role
    });
    
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      // Check email for verification message ideally, but for now we'll just alert and redirect
      alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan) atau langsung login.');
      navigate('/login');
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary-container">
          <div className="absolute top-8 left-8 z-10">
            <Link to="/" className="font-headline-lg text-headline-lg font-bold text-white">PropHub</Link>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh_R0ZwaJaz8QNCHjfhRIUpWQTFizMATtreVys-2EIbuyklEimLqA95hlXuILbcXP00fNFPWuH0keQppRvWmwVE2hfdOGO6GQgGXWekZH6hDZ-ci9qWtS5a9U1qqECiy2HPnj7_K4yqS72i01gOIJC89tGhKINIm0jzU6GMim-GP6atRTWdY0W1zjJdvnB12BlcoQtCeyVXFxfmnihpA1qnh0VBdZnYQJz1qXy0Rm8MNqHuEPBzYDIwOUVwJVItpvjepMNBZiZX20"
            alt="Hunian mewah modern"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute bottom-16 left-8 right-8 z-10 text-white">
            <h2 className="font-headline-xl text-headline-xl mb-4">Temukan tempat Anda.</h2>
            <p className="font-body-lg text-body-lg text-white/80 max-w-md">
              Bergabunglah dengan ekosistem terpercaya untuk pencari hunian dan pemilik properti profesional.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">PropHub</Link>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Buat akun baru</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Selamat datang! Silakan isi data Anda untuk memulai di PropHub.
            </p>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setRole('tenant')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                  role === 'tenant'
                    ? 'border-secondary bg-secondary-container/30'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <MaterialIcon icon="group" className={`text-3xl ${role === 'tenant' ? 'text-secondary' : 'text-on-surface-variant'}`} />
                <span className={`font-label-md text-label-md ${role === 'tenant' ? 'text-secondary' : 'text-on-surface'}`}>Saya Pencari</span>
              </button>
              <button
                onClick={() => setRole('owner')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                  role === 'owner'
                    ? 'border-secondary bg-secondary-container/30'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <MaterialIcon icon="real_estate_agent" className={`text-3xl ${role === 'owner' ? 'text-secondary' : 'text-on-surface-variant'}`} />
                <span className={`font-label-md text-label-md ${role === 'owner' ? 'text-secondary' : 'text-on-surface'}`}>Saya Pemilik</span>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="font-label-md text-label-md text-on-surface mb-1 block">Nama Lengkap</label>
                <input id="reg-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Masukkan nama lengkap" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary" />
              </div>
              <div>
                <label htmlFor="reg-email" className="font-label-md text-label-md text-on-surface mb-1 block">Alamat Email</label>
                <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-phone" className="font-label-md text-label-md text-on-surface mb-1 block">Nomor HP</label>
                  <input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="081234567890" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary" />
                </div>
                <div>
                  <label htmlFor="reg-password" className="font-label-md text-label-md text-on-surface mb-1 block">Kata Sandi</label>
                  <div className="relative">
                    <input id="reg-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                      <MaterialIcon icon={showPassword ? "visibility_off" : "visibility"} />
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-secondary text-on-secondary py-3.5 rounded-xl font-headline-md text-headline-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Mendaftarkan...' : 'Buat Akun'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Atau daftar dengan</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button className="w-full border border-outline-variant rounded-xl py-3 font-label-md text-label-md text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Daftar dengan Google
            </button>

            <p className="text-center mt-6 font-body-sm text-body-sm text-on-surface-variant">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-secondary font-label-md text-label-md hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}
