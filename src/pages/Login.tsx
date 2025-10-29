import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginState = (location.state as { from?: string } | undefined) || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured) {
        // Use Supabase authentication
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Use local authentication
        const { user, error } = await localAuth.login(email, password);
        if (error || !user) {
          throw new Error(error || 'Đăng nhập thất bại');
        }
      }

      setSuccessMessage('Đăng nhập thành công.');

      // Resolve redirect target hierarchy: action payload -> origin path -> home
      let redirectPath = '/';
      const after = sessionStorage.getItem('afterLogin');
      if (after) {
        try {
          const payload = JSON.parse(after) as { page?: string };
          sessionStorage.removeItem('afterLogin');
          if (payload?.page && payload.page !== 'home') {
            redirectPath = `/${payload.page}`;
          } else {
            redirectPath = '/';
          }
        } catch (err) {
          redirectPath = loginState.from && loginState.from !== '/login'
            ? loginState.from
            : sessionStorage.getItem('lastVisitedPath') || '/';
        }
      } else {
        const fallbackPath = loginState.from && loginState.from !== '/login'
          ? loginState.from
          : sessionStorage.getItem('lastVisitedPath');
        if (fallbackPath && fallbackPath !== '/login') {
          redirectPath = fallbackPath;
        }
      }

      setTimeout(() => navigate(redirectPath), 800);
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/?page=home'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message || `Không thể đăng nhập bằng ${provider}.`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white border border-brand-blue/20 p-10 shadow-medium">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-brand-blue hover:text-brand-muted transition-colors"
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Quay lại Trang chủ</span>
          </button>
          <LogIn className="text-brand-blue" size={28} />
        </div>

        <h1 className="text-4xl font-serif text-brand-text mb-2">Đăng Nhập</h1>
        <p className="text-brand-muted mb-8">
          Truy cập vào cộng đồng Echoes of Việt Nam để trao đổi và khám phá kho tàng lịch sử.
        </p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-sans flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Đăng nhập bằng Google</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full py-3 bg-blue-600 text-white font-sans flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Đăng nhập bằng Facebook</span>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">hoặc</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-text mb-2 font-sans">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-brand-text mb-2 font-sans">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-blue transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-100 border border-rose-300 text-rose-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-brand-blue/10 border border-brand-blue text-brand-blue">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-blue text-white font-sans tracking-wider uppercase transition-all duration-300 hover:bg-brand-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => navigate('/register', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
            className="text-brand-blue hover:text-brand-blue-600 transition-colors"
          >
            Chưa có tài khoản? Đăng ký ngay
          </button>
          <br />
          <button
            onClick={() => navigate('/forgot-password', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
            className="text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
}
