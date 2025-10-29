import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  useScrollAnimation();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ full_name: '', email: '', message: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(47, 58, 69, 0.6), rgba(47, 58, 69, 0.75)), url(https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
              LIÊN HỆ
            </h1>
            <p className="text-xl text-brand-sand font-serif italic">
              Kết nối cùng chúng tôi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="scroll-animate">
            <h2 className="text-3xl font-serif text-brand-text mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <p className="text-brand-muted mb-8 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp, câu hỏi và phản hồi từ bạn.
              Hãy điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-brand-text mb-2 font-sans">
                  Họ Tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-text mb-2 font-sans">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-text mb-2 font-sans">
                  Nội Dung <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-brand-blue/30 text-brand-text focus:border-brand-blue outline-none transition-colors duration-300 resize-none"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-4 bg-brand-blue text-white font-sans tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Send size={20} />
                  <span>{isSubmitting ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}</span>
                </span>
                <div className="absolute inset-0 bg-brand-sand/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-700 animate-fade-in">
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-300 text-rose-700 animate-fade-in">
                  Có lỗi xảy ra. Vui lòng thử lại sau.
                </div>
              )}
            </form>
          </div>

          <div className="space-y-8 fade-scroll">
            <div>
              <h2 className="text-3xl font-serif text-brand-text mb-6">
                Thông Tin Liên Hệ
              </h2>
              <p className="text-brand-muted mb-8 leading-relaxed">
                Hãy kết nối với chúng tôi qua các kênh thông tin dưới đây để cập nhật những
                nội dung mới nhất về lịch sử và văn hóa Việt Nam.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white border border-brand-blue/20 hover:border-brand-blue transition-colors duration-300 scroll-animate shadow-soft">
                <div className="w-12 h-12 bg-brand-blue flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-brand-text font-serif text-lg mb-1">Email</h3>
                  <p className="text-brand-blue">contact@echoesvietnam.vn</p>
                  <p className="text-brand-muted text-sm mt-1">
                    Phản hồi trong vòng 24 giờ
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white border border-brand-blue/20 hover:border-brand-blue transition-colors duration-300 shadow-soft">
                <div className="w-12 h-12 bg-brand-blue flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-brand-text font-serif text-lg mb-1">Điện Thoại</h3>
                  <p className="text-brand-blue">+84 123 456 789</p>
                  <p className="text-brand-muted text-sm mt-1">
                    Thứ 2 - Thứ 6: 8:00 - 17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white border border-brand-blue/20 hover:border-brand-blue transition-colors duration-300 shadow-soft">
                <div className="w-12 h-12 bg-brand-blue flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-brand-text font-serif text-lg mb-1">Địa Chỉ</h3>
                  <p className="text-brand-blue">Hà Nội, Việt Nam</p>
                  <p className="text-brand-muted text-sm mt-1">
                    Trung tâm văn hóa lịch sử
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-blue/10 border border-brand-blue/20 p-8 shadow-soft">
              <h3 className="text-2xl font-serif text-brand-text mb-4">
                Giờ Làm Việc
              </h3>
              <div className="space-y-2 text-brand-muted">
                <div className="flex justify-between">
                  <span>Thứ Hai - Thứ Sáu</span>
                  <span className="text-brand-blue">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ Bảy</span>
                  <span className="text-brand-blue">9:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ Nhật</span>
                  <span className="text-rose-500">Nghỉ</span>
                </div>
              </div>
            </div>

            <div className="text-center p-8 border border-brand-blue/30 bg-white shadow-soft">
              <p className="text-brand-blue font-serif italic text-lg">
                "Nơi quá khứ ngân vang trong từng hơi thở hiện đại"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
