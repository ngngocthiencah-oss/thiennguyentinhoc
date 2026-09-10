'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    const savedPassword = localStorage.getItem('saved_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem('saved_email', email);
      localStorage.setItem('saved_password', password);
    } else {
      localStorage.removeItem('saved_email');
      localStorage.removeItem('saved_password');
    }

    localStorage.setItem('member_logged', 'true');
    localStorage.setItem('member_email', email);
    if (name) {
      localStorage.setItem('member_name', name);
    }
    
    router.push('/member');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <main className="min-h-screen bg-slate-900 font-sans flex items-center justify-center p-4 relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard Admin
      </Link>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-600/30 mb-3">
            GP
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {isForgotPassword 
              ? 'Khôi Phục Mật Khẩu' 
              : isRegister 
                ? 'Đăng Ký Tài Khoản Học Viên' 
                : 'Đăng Nhập Kho Tài Liệu'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isForgotPassword 
              ? 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu hệ thống' 
              : 'Hệ thống quản lý học tập và tài nguyên tin học văn phòng'}
          </p>
        </div>

        {isForgotPassword ? (
          <div>
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium border border-emerald-100">
                  Liên kết khôi phục mật khẩu đã được gửi đến email của bạn!
                </div>
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/20"
                >
                  Quay Lại Đăng Nhập
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email đăng ký</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/20"
                >
                  Gửi Yêu Cầu Khôi Phục
                </button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Quay lại đăng nhập
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Họ và tên học viên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email / Tài khoản</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-600 font-medium">Nhớ tài khoản & mật khẩu</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30 mt-2"
            >
              {isRegister ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Ngay'}
            </button>
          </form>
        )}

        {!isForgotPassword && (
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              {isRegister ? 'Đã có tài khoản hệ thống? Đăng nhập ngay' : 'Chưa có tài khoản học viên? Đăng ký mới'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}