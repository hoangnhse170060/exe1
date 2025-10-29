import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Mail, Phone, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { verificationService } from '../lib/verificationService';

type FormState = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
};

const initialForm: FormState = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  dateOfBirth: ''
};

export default function EnhancedRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Verification states
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrorMessage('');
  };

  const validateForm = (): string | null => {
    if (!form.displayName.trim()) return 'Vui lòng nhập tên hiển thị';
    if (!form.email.trim()) return 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ';
    if (!form.phone.trim()) return 'Vui lòng nhập số điện thoại';
    if (!/^0\d{9}$/.test(form.phone)) return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!form.dateOfBirth) return 'Vui lòng chọn ngày sinh';
    if (form.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    if (!emailVerified) return 'Vui lòng xác thực email';
    if (!phoneVerified) return 'Vui lòng xác thực số điện thoại';
    return null;
  };

  const handleSendEmailCode = async () => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMessage('Vui lòng nhập email hợp lệ trước');
      return;
    }

    setSendingEmailCode(true);
    const result = await verificationService.sendEmailVerification(form.email);
    setSendingEmailCode(false);

    if (result.success) {
      setEmailCodeSent(true);
      setSuccessMessage('Mã xác thực đã được gửi đến email của bạn! (Kiểm tra console)');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(result.error || 'Không thể gửi mã xác thực');
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode.trim()) {
      setErrorMessage('Vui lòng nhập mã xác thực');
      return;
    }

    setVerifyingEmail(true);
    const result = await verificationService.verifyEmail(form.email, emailCode);
    setVerifyingEmail(false);

    if (result.success) {
      setEmailVerified(true);
      setSuccessMessage('✓ Email đã được xác thực!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error || 'Mã xác thực không đúng');
    }
  };

  const handleSendPhoneCode = async () => {
    if (!form.phone.trim() || !/^0\d{9}$/.test(form.phone)) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ trước');
      return;
    }

    setSendingPhoneCode(true);
    const result = await verificationService.sendPhoneVerification(form.phone);
    setSendingPhoneCode(false);

    if (result.success) {
      setPhoneCodeSent(true);
      setSuccessMessage('Mã xác thực đã được gửi đến số điện thoại của bạn! (Kiểm tra console)');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(result.error || 'Không thể gửi mã xác thực');
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneCode.trim()) {
      setErrorMessage('Vui lòng nhập mã xác thực');
      return;
    }

    setVerifyingPhone(true);
    const result = await verificationService.verifyPhone(form.phone, phoneCode);
    setVerifyingPhone(false);

    if (result.success) {
      setPhoneVerified(true);
      setSuccessMessage('✓ Số điện thoại đã được xác thực!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error || 'Mã xác thực không đúng');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            display_name: form.displayName,
            phone: form.phone,
            date_of_birth: form.dateOfBirth
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update user profile with additional info
        await supabase.from('user_profiles').upsert({
          user_id: data.user.id,
          metadata: {
            displayName: form.displayName,
            phone: form.phone,
            dateOfBirth: form.dateOfBirth
          },
          phone: form.phone,
          date_of_birth: form.dateOfBirth,
          is_email_verified: true,
          is_phone_verified: true,
          role: 'user',
          stars: 0
        });
      }

      setSuccessMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Panel - Info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 mb-8 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>

              <UserPlus size={48} className="mb-6" />
              <h1 className="text-3xl font-bold mb-4">Tạo tài khoản mới</h1>
              <p className="text-blue-100 mb-6">
                Tham gia cộng đồng Echoes of Việt Nam để khám phá lịch sử, học hỏi và mua sắm.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Xác thực đầy đủ</h3>
                    <p className="text-sm text-blue-100">Email và số điện thoại được xác minh</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Tích luỹ sao</h3>
                    <p className="text-sm text-blue-100">Làm quiz và học tập để nhận sao</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Mở shop</h3>
                    <p className="text-sm text-blue-100">Đạt 200 sao để đăng ký mở shop</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hiển thị *
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={handleChange('displayName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                {/* Email with Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email * {emailVerified && <CheckCircle className="inline w-4 h-4 text-green-600" />}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                      required
                      disabled={emailVerified}
                    />
                    {!emailVerified && (
                      <button
                        type="button"
                        onClick={handleSendEmailCode}
                        disabled={sendingEmailCode || !form.email}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                      >
                        {sendingEmailCode ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        <span>Gửi mã</span>
                      </button>
                    )}
                  </div>

                  {emailCodeSent && !emailVerified && (
                    <div className="mt-2 flex space-x-2">
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nhập mã 6 số"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={verifyingEmail}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {verifyingEmail ? 'Đang xác thực...' : 'Xác thực'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone with Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại * {phoneVerified && <CheckCircle className="inline w-4 h-4 text-green-600" />}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                      required
                      disabled={phoneVerified}
                    />
                    {!phoneVerified && (
                      <button
                        type="button"
                        onClick={handleSendPhoneCode}
                        disabled={sendingPhoneCode || !form.phone}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                      >
                        {sendingPhoneCode ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                        <span>Gửi mã</span>
                      </button>
                    )}
                  </div>

                  {phoneCodeSent && !phoneVerified && (
                    <div className="mt-2 flex space-x-2">
                      <input
                        type="text"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nhập mã 6 số"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhone}
                        disabled={verifyingPhone}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {verifyingPhone ? 'Đang xác thực...' : 'Xác thực'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange('dateOfBirth')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>

                {/* Error/Success Messages */}
                {errorMessage && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !emailVerified || !phoneVerified}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Đang đăng ký...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Đăng ký</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Đã có tài khoản? Đăng nhập ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          📧 Mã xác thực sẽ được hiển thị trong console (chế độ phát triển)
        </p>
      </div>
    </div>
  );
}
