import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

type FormState = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: FormState = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        // Use Supabase
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                display_name: form.displayName,
                email: form.email,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
      } else {
        // Use local auth
        const { user, error } = await localAuth.register({
          email: form.email,
          password: form.password,
          display_name: form.displayName,
        });

        if (error || !user) {
          throw new Error(error || 'Đăng ký thất bại');
        }
      }

      setSuccessMessage('Đăng ký thành công! Chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 bg-white border border-brand-blue/20 shadow-medium">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-blue via-brand-blue-600 to-brand-text/90 text-white p-10">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              type="button"
            >
              <ArrowLeft size={18} />
              <span>Quay lại Trang chủ</span>
            </button>

            <div className="mt-16 space-y-6">
              <Sparkles size={48} className="text-white/70" />
              <h2 className="text-4xl font-serif leading-tight">Gia nhập cộng đồng Echoes of Việt Nam</h2>
              <p className="text-white/80 leading-relaxed">
                Tạo tài khoản để tham gia thảo luận, lưu trữ những ký ức và chia sẻ câu chuyện của bạn cùng cộng đồng đam mê lịch sử.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-white/70 text-sm">
            <p>- Bảo tồn ký ức và giá trị lịch sử Việt Nam</p>
            <p>- Kết nối với các nhà sưu tầm và nhà nghiên cứu</p>
            <p>- Khám phá thư viện tư liệu độc quyền</p>
          </div>
        </div>

        <div className="p-10">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-brand-blue hover:text-brand-muted transition-colors"
              type="button"
            >
              <ArrowLeft size={18} />
              <span>Trang chủ</span>
            </button>
            <UserPlus className="text-brand-blue" size={28} />
          </div>

          <div className="hidden md:flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif text-brand-text">Tạo tài khoản</h1>
            <UserPlus className="text-brand-blue" size={32} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-brand-text mb-2 font-sans">Tên hiển thị</label>
              <input
                type="text"
                value={form.displayName}
                onChange={handleChange('displayName')}
                className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                placeholder="Ví dụ: Tran Minh An"
                required
              />
            </div>

            <div>
              <label className="block text-brand-text mb-2 font-sans">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-brand-text mb-2 font-sans">Mật khẩu</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                placeholder="Tối thiểu 6 ký tự"
                required
              />
            </div>

            <div>
              <label className="block text-brand-text mb-2 font-sans">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-100 border border-rose-300 text-rose-700 text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-brand-blue/10 border border-brand-blue text-brand-blue text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-blue text-white font-sans tracking-wider uppercase transition-all duration-300 hover:bg-brand-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-brand-muted">
            Đã có tài khoản?
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="ml-2 text-brand-blue hover:text-brand-muted transition-colors"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
