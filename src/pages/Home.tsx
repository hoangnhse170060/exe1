import { useEffect, useState } from 'react';
import { ChevronRight, Globe, Heart, BookOpen, ArrowRight, Star, History, ShoppingBag, MessageSquare } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type HomeProps = {
  onNavigate: (page: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  useScrollAnimation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white lg:pt-0 pt-[70px]">
      <section className="relative min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium tracking-wide">Khám phá lịch sử Việt Nam</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Echoes of <span className="text-primary-200">Việt Nam</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
              Chào mừng bạn đến với thế giới lịch sử hào hùng
            </p>

            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              Hành trình khám phá những dấu ấn lịch sử quý báu, từ những ngày đầu tranh giành độc lập đến thời đại xây dựng và phát triển đất nước
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('history')}
                className="group px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Bắt Đầu Khám Phá</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 shadow-lg"
              >
                Tham Gia Ngay
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="text-white rotate-90" size={32} />
        </div>
      </section>

      <section className="py-20 px-4 bg-secondary-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-serif font-bold text-secondary-900 mb-4">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-lg text-secondary-700 max-w-3xl mx-auto leading-relaxed">
              Echoes of Việt Nam được thành lập với sứ mệnh lưu giữ và lan tỏa những giá trị lịch sử quý báu của dân tộc Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 fade-scroll border border-secondary-100 hover:border-primary-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-primary-600" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-secondary-900 mb-4 text-center">Giáo Dục</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Cung cấp kiến thức lịch sử chính xác và sinh động qua các nội dung được nghiên cứu kỹ lưỡng
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 fade-scroll border border-secondary-100 hover:border-primary-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-primary-600" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-secondary-900 mb-4 text-center">Lan Tỏa</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Kết nối và xây dựng cộng đồng yêu lịch sử, văn hóa Việt Nam trên khắp thế giới
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 fade-scroll border border-secondary-100 hover:border-primary-200 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-primary-600" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-secondary-900 mb-4 text-center">Lưu Giữ</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Bảo tồn và gìn giữ di sản văn hóa quý báu cho thế hệ tương lai
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-serif font-bold text-secondary-900 mb-4">
              Dòng Chảy Lịch Sử
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-lg text-secondary-700">
              Hành trình đấu tranh giành độc lập và bảo vệ Tổ quốc của dân tộc Việt Nam
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center fade-scroll">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                1945 - 1954
              </div>
              <h3 className="text-4xl font-serif font-bold text-secondary-900">
                Kháng Chiến Chống Pháp
              </h3>
              <p className="text-secondary-700 text-lg leading-relaxed">
                Cuộc kháng chiến vĩ đại của nhân dân Việt Nam chống lại thực dân Pháp, khẳng định quyết tự do và độc lập của dân tộc.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                  <p className="text-secondary-700">Tổng khởi nghĩa tháng 8/1945</p>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                  <p className="text-secondary-700">Tuyên ngôn độc lập 2/9/1945</p>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                  <p className="text-secondary-700">Chiến thắng Điện Biên Phủ 1954</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('history')}
                className="group px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 mt-6"
              >
                <span>Tìm Hiểu Chi Tiết</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-600 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-2xl"></div>
              <img
                src="https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg"
                alt="Kháng Chiến Chống Pháp"
                className="relative w-full h-[500px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute bottom-6 right-6 bg-secondary-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-serif">
                1945 - 1954
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-serif font-bold text-secondary-900 mb-4">
              Cửa Hàng Lưu Niệm
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-lg text-secondary-700">
              Sản phẩm lưu niệm lịch sử độc đáo từ các đối tác uy tín
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { category: 'Đồ Trang Trí', tag: 'Bán Chạy' },
              { category: 'Thời Trang', tag: 'Mới' },
              { category: 'Phụ Kiện', tag: 'Độc Quyền' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 fade-scroll group cursor-pointer hover:-translate-y-2"
                onClick={() => onNavigate('shop')}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
                    alt="Sản phẩm lưu niệm"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-4 py-1.5 text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-primary-600 px-4 py-1.5 text-xs font-semibold rounded-full">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                    Tranh Nghệ Thuật Cách Mạng
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    Tranh tái hiện những khoảnh khắc lịch sử hào hùng của dân tộc
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary-600">500.000₫</p>
                    <div className="flex items-center space-x-1 text-primary-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-5xl mx-auto text-center fade-scroll">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-serif font-bold mb-6">
            Bạn Là Người Bán?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
            Đăng ký ngay để bán sản phẩm lưu niệm lịch sử của bạn trên nền tảng Echoes of Việt Nam
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Đăng Ký Bán Hàng
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300">
              Tìm Hiểu Thêm
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 scroll-animate">
            {[
              { icon: ShoppingBag, value: '1000+', label: 'Sản Phẩm' },
              { icon: History, value: '50+', label: 'Đối Tác' },
              { icon: Heart, value: '5000+', label: 'Khách Hàng' },
              { icon: Star, value: '4.8★', label: 'Đánh Giá' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-scroll">
                <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</p>
                <p className="text-secondary-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
