import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Sparkles, User, KeyRound } from 'lucide-react';
import { getStoredUsers, saveStoredUsers } from '../utils/storage';

interface AuthScreenProps {
  onSuccess: (username: string) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, showToast }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      showToast('warning', 'Harap masukkan nama pengguna / username.');
      return;
    }
    if (!password) {
      showToast('warning', 'Harap masukkan kata sandi / password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getStoredUsers();

      if (isLoginMode) {
        // Mode Login
        const user = users[cleanUsername];
        if (!user || user.password !== password) {
          setLoading(false);
          showToast('error', 'Nama pengguna atau kata sandi tidak cocok. Silakan periksa kembali.', 'Gagal Masuk');
          return;
        }

        setLoading(false);
        showToast('success', `Selamat datang kembali, ${cleanUsername}!`, 'Berhasil Masuk');
        onSuccess(cleanUsername);
      } else {
        // Mode Register
        if (users[cleanUsername]) {
          setLoading(false);
          showToast('warning', 'Nama pengguna ini sudah terdaftar. Silakan gunakan nama lain atau masuk.', 'Sudah Terdaftar');
          return;
        }

        users[cleanUsername] = {
          password: password,
          createdAt: new Date().toISOString(),
        };
        saveStoredUsers(users);

        setLoading(false);
        showToast('success', 'Akun berhasil dibuat! Silakan masuk dengan akun barumu.', 'Pendaftaran Berhasil');
        setIsLoginMode(true);
      }
    }, 250);
  };

  const handleDemoLogin = () => {
    const demoUser = 'nurhidayat';
    const users = getStoredUsers();
    if (!users[demoUser]) {
      users[demoUser] = {
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      saveStoredUsers(users);
    }
    showToast('info', 'Masuk menggunakan profil percontohan.');
    onSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto my-auto pt-6 pb-8">
        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Penyimpanan Finansial Aman & Privat</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Budgeting<span className="text-indigo-600">KU</span></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Aplikasi pencatatan keuangan pribadi, tagihan bulanan, dan pelacak cicilan.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h2 className="text-lg font-black text-slate-800">
              {isLoginMode ? 'Selamat Datang di BudgetingKU' : 'Daftar Akun BudgetingKU'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLoginMode
                ? 'Silakan masuk untuk mengakses data keuangan dan tagihanmu.'
                : 'Daftar akun baru untuk mulai mencatat keuanganmu secara rapi.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                isLoginMode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                !isLoginMode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nama Pengguna / Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: nurhidayat"
                required
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Kata Sandi / Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-3 rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLoginMode ? (
                'Masuk ke Aplikasi'
              ) : (
                'Daftar Akun Baru'
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 py-1 px-3 rounded-lg hover:bg-slate-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Gunakan Akun Contoh (Demo Pengguna)</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 py-4">
        BudgetingKU &copy; {new Date().getFullYear()} • Data tersimpan di peramban Anda
      </footer>
    </div>
  );
};
