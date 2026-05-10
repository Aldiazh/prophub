import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialIcon, Footer, useAuth } from '@prophub/shared';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await signIn({ email, password });
    
    setLoading(false);
    
    if (error) {
      setError('Email atau kata sandi salah.');
    } else {
      navigate('/dashboard');
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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyb_Vbw5Y6S9oWprppBD2FeRGgkKAm6si7xcDZVx3QZOC4byGklcOiR7in27jEBSQ8BRgULI1bWPa_kgIsPCXiBYBez4JMtv_QlIUa6e2CqB8iml_KdeBZIoxTT9K-E8UOn8-pDTEgnJ48nZzHkQpg9g2JFtDFYMLQVuSVVNCOIwjoImsAuUCT1zWVinuQKjZThVoNSP97uCR8dYSZAGZboC0eH83uVPMWmyPuP2IBBZJkByj8WgFZoZm1kiaf4IVe1Po-_PGAo9w"
            alt="Hunian modern"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute bottom-16 left-8 right-8 z-10 text-white">
            <h2 className="font-headline-xl text-headline-xl mb-4">Selamat datang kembali.</h2>
            <p className="font-body-lg text-body-lg text-white/80 max-w-md">
              Masuk ke akun PropHub Anda dan lanjutkan pencarian hunian impian.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">PropHub</Link>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Masuk ke akun Anda</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Selamat datang kembali! Silakan masukkan detail akun Anda.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="font-label-md text-label-md text-on-surface mb-1 block">Alamat Email</label>
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary" />
              </div>
              <div>
                <label htmlFor="login-password" className="font-label-md text-label-md text-on-surface mb-1 block">Kata Sandi</label>
                <div className="relative">
                  <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest text-on-surface font-body-md focus:ring-secondary focus:border-secondary pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                    <MaterialIcon icon={showPassword ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" />
                  <span className="font-body-sm text-body-sm text-on-surface">Ingat saya</span>
                </label>
                <a href="#" className="text-secondary font-label-md text-label-md hover:underline">Lupa kata sandi?</a>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-secondary text-on-secondary py-3.5 rounded-xl font-headline-md text-headline-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Atau masuk dengan</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button className="w-full border border-outline-variant rounded-xl py-3 font-label-md text-label-md text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Masuk dengan Google
            </button>

            <p className="text-center mt-6 font-body-sm text-body-sm text-on-surface-variant">
              Belum punya akun?{' '}
              <Link to="/register" className="text-secondary font-label-md text-label-md hover:underline">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}
