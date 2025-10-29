import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/?page=reset-password'
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white border border-brand-blue/20 p-10 shadow-medium">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-brand-blue hover:text-brand-muted transition-colors"
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Quay lại Đăng nhập</span>
          </button>
          <Mail className="text-brand-blue" size={28} />
        </div>

        <h1 className="text-4xl font-serif text-brand-text mb-2">Quên Mật Khẩu</h1>
        <p className="text-brand-muted mb-8">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

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

          {errorMessage && (
            <div className="p-4 bg-rose-100 border border-rose-300 text-rose-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-100 border border-green-300 text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-blue text-white font-sans tracking-wider uppercase transition-all duration-300 hover:bg-brand-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-brand-blue hover:text-brand-blue-600 transition-colors"
          >
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}