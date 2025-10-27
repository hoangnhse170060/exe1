import { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type LoginProps = {
  onNavigate: (page: string) => void;
};

export default function Login({ onNavigate }: LoginProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-white lg:pt-0 pt-[70px] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
            <LogIn className="text-primary-600" size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-secondary-900 mb-2">Đăng Nhập</h1>
          <p className="text-secondary-600">Chào mừng bạn trở lại Echoes of Việt Nam</p>
        </div>

        <div className="bg-white border-2 border-secondary-100 rounded-2xl p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-primary-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-secondary-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-secondary-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
