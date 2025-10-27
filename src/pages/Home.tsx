import { useEffect, useState } from 'react';
import { ChevronDown, Globe, Heart, BookOpen, ArrowRight, Star } from 'lucide-react';
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
    <div className="relative min-h-screen bg-cream-200 lg:pt-0 pt-[70px]">
      <section className="relative h-screen bg-cover bg-center bg-no-repeat gradient-overlay" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg)',
      }}>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center max-w-5xl animate-fade-in-up">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-white mb-8 text-shadow-lg">
              Echoes of Viet Nam
            </h1>

            <div className="flex items-center justify-center space-x-2.5 mb-10">
              <div className="w-2.5 h-2.5 rounded-full bg-vietnam-gold-400 animate-pulse"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-vietnam-gold-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-vietnam-gold-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-5 font-serif text-shadow-md">
              Chào mừng bạn đến với
            </p>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-vietnam-gold-300 mb-10 text-shadow-md">
              Thế Giới Lịch Sử Việt Nam
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-14 max-w-3xl mx-auto leading-loose text-balance">
              Hành trình khám phá những dấu ấn lịch sử hào hùng, từ những ngày đầu tranh giành
              độc lập đến thời đại xây dựng và phát triển đất nước
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <button
                onClick={() => onNavigate('history')}
                className="group px-10 py-5 bg-vietnam-gold text-white font-sans text-sm tracking-[0.15em] uppercase hover:bg-vietnam-gold-600 transition-all duration-300 flex items-center space-x-3 shadow-strong hover:shadow-gold"
              >
                <span>Bắt Đầu Khám Phá</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
              <button
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-sans text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-charcoal-900 transition-all duration-300"
              >
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>

        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-cream-50">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-1 bg-vietnam-gold shadow-gold"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center mb-20 scroll-animate">
          <h2 className="section-title text-charcoal-900">
            Sứ Mệnh Của Chúng Tôi
          </h2>
          <div className="w-16 h-1 bg-vietnam-gold mx-auto mb-8"></div>
          <p className="section-subtitle max-w-4xl mx-auto text-balance">
            Echoes of Việt Nam được thành lập với sứ mệnh lưu giữ và lan tỏa những giá trị lịch sử quý báu của dân
            tộc Việt Nam. Chúng tôi tin rằng, thông qua việc tìm hiểu quá khứ, thế hệ trẻ sẽ hiểu rõ hơn về nguồn
            gốc, truyền thống và tự hào về bản sắc văn hóa của mình.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-vietnam-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vietnam-gold transition-colors duration-300">
              <BookOpen className="text-vietnam-gold group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Giáo Dục</h3>
            <p className="text-charcoal-600 leading-relaxed">
              Cung cấp kiến thức lịch sử chính xác và sinh động qua các nội dung được nghiên cứu kỹ lưỡng
            </p>
          </div>

          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-vietnam-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vietnam-gold transition-colors duration-300">
              <Globe className="text-vietnam-gold group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Lan Tỏa</h3>
            <p className="text-charcoal-600 leading-relaxed">
              Kết nối và xây dựng cộng đồng yêu lịch sử, văn hóa Việt Nam trên khắp thế giới
            </p>
          </div>

          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-vietnam-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vietnam-gold transition-colors duration-300">
              <Heart className="text-vietnam-gold group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Lưu Giữ</h3>
            <p className="text-charcoal-600 leading-relaxed">
              Bảo tồn và gìn giữ di sản văn hóa quý báu cho thế hệ tương lai
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-1 bg-vietnam-gold shadow-gold"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="section-title">
              Dòng Chảy Lịch Sử
            </h2>
            <div className="w-16 h-1 bg-vietnam-gold mx-auto mb-6"></div>
            <p className="section-subtitle">
              Hành trình đấu tranh giành độc lập và bảo vệ Tổ quốc của dân tộc Việt Nam
            </p>
          </div>

          <div className="flex items-center justify-center mb-16 scroll-animate">
            <button className="w-14 h-14 rounded-full border-2 border-vietnam-gold text-vietnam-gold flex items-center justify-center hover:bg-vietnam-gold hover:text-white transition-all duration-300 shadow-soft hover:shadow-gold">
              <ChevronDown className="rotate-90" size={24} />
            </button>

            <div className="flex items-center mx-12">
              <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold shadow-gold text-lg">
                1
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-vietnam-gold to-charcoal-200 mx-6"></div>
              <div className="w-14 h-14 rounded-full border-2 border-charcoal-200 flex items-center justify-center text-charcoal-400 font-bold text-lg">
                2
              </div>
            </div>

            <button className="w-14 h-14 rounded-full border-2 border-vietnam-gold text-vietnam-gold flex items-center justify-center hover:bg-vietnam-gold hover:text-white transition-all duration-300 shadow-soft hover:shadow-gold">
              <ChevronDown className="rotate-[-90deg]" size={24} />
            </button>
          </div>

          <p className="text-center text-charcoal-700 mb-16 font-serif text-xl tracking-wide">1945 - 1954</p>

          <div className="grid lg:grid-cols-2 gap-16 items-center fade-scroll">
            <div className="space-y-8">
              <div className="inline-block px-5 py-2 bg-vietnam-gold-100 text-vietnam-gold-800 text-sm font-semibold tracking-wide">
                1945 - 1954
              </div>
              <h3 className="text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
                Kháng Chiến Chống Pháp
              </h3>
              <p className="text-charcoal-600 text-lg leading-loose">
                Cuộc kháng chiến vĩ đại của nhân dân Việt Nam chống lại thực dân
                Pháp, khẳng định quyết tự do và độc lập của dân tộc.
              </p>

              <div className="space-y-4 pl-4 border-l-2 border-vietnam-gold-300">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-vietnam-gold mt-2 flex-shrink-0 shadow-gold"></div>
                  <p className="text-charcoal-700 text-lg">Tổng khởi nghĩa tháng 8/1945</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-vietnam-gold mt-2 flex-shrink-0 shadow-gold"></div>
                  <p className="text-charcoal-700 text-lg">Tuyên ngôn độc lập 2/9/1945</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-vietnam-gold mt-2 flex-shrink-0 shadow-gold"></div>
                  <p className="text-charcoal-700 text-lg">Chiến thắng Điện Biên Phủ 1954</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('history')}
                className="group btn-primary flex items-center space-x-3 mt-8"
              >
                <span>Tìm Hiểu Chi Tiết</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <img
                src="https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg"
                alt="Kháng Chiến Chống Pháp"
                className="relative w-full h-[500px] object-cover shadow-strong group-hover:shadow-gold transition-all duration-500"
              />
              <div className="absolute bottom-6 right-6 bg-charcoal-900/90 backdrop-blur-sm text-white px-6 py-3 font-serif text-lg">
                1945 - 1954
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-cream-50">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-1 bg-vietnam-gold shadow-gold"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="section-title">
              Cửa Hàng Lưu Niệm
            </h2>
            <div className="w-16 h-1 bg-vietnam-gold mx-auto mb-6"></div>
            <p className="section-subtitle">
              Sản phẩm lưu niệm lịch sử độc đáo từ các đối tác uy tín
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16 scroll-animate">
            <button className="px-7 py-3 bg-vietnam-gold text-white font-sans text-sm tracking-wide shadow-soft hover:shadow-gold transition-all duration-300">
              Tất Cả
            </button>
            <button className="btn-outline">
              Đồ Trang Trí
            </button>
            <button className="btn-outline">
              Thời Trang
            </button>
            <button className="btn-outline">
              Phụ Kiện
            </button>
            <button className="btn-outline">
              Sách
            </button>
            <button className="btn-outline">
              Nghệ Thuật
            </button>
            <button className="btn-outline">
              Đồ Dùng
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { category: 'Đồ Trang Trí', tag: 'Bán Chạy' },
              { category: 'Thời Trang', tag: 'Mới' },
              { category: 'Phụ Kiện', tag: 'Độc Quyền' }
            ].map((item, index) => (
              <div
                key={index}
                className="card group cursor-pointer overflow-hidden fade-scroll"
                onClick={() => onNavigate('shop')}
              >
                <div className="relative h-96 overflow-hidden bg-charcoal-100">
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"
                    alt="Sản phẩm lưu niệm"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-5 left-5">
                    <span className="bg-vietnam-red text-white px-4 py-1.5 text-xs font-sans tracking-wide shadow-soft">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5">
                    <span className="bg-vietnam-gold text-white px-4 py-1.5 text-xs font-sans tracking-wide shadow-soft">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-all duration-300">
                      <ArrowRight className="text-charcoal-900" size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-vietnam-gold-700 text-xs font-sans mb-3 uppercase tracking-[0.15em] font-semibold">
                    {item.category}
                  </p>
                  <h3 className="text-2xl font-serif text-charcoal-900 mb-4 group-hover:text-vietnam-gold transition-colors duration-300">
                    Tranh Nghệ Thuật Cách Mạng
                  </h3>
                  <p className="text-charcoal-600 mb-5 leading-relaxed">
                    Tranh tái hiện những khoảnh khắc lịch sử hào hùng của dân tộc
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-serif text-vietnam-gold-700">500.000₫</p>
                    <div className="flex items-center space-x-1 text-vietnam-gold">
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => onNavigate('shop')}
              className="btn-secondary"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-gradient-gold">
        <div className="max-w-5xl mx-auto text-center text-white fade-scroll">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <BookOpen className="text-white" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-8">
            Bạn Là Người Bán?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-loose text-white/95">
            Đăng ký ngay để bán sản phẩm lưu niệm lịch sử của bạn trên nền tảng Echoes of
            Việt Nam. Tiếp cận hàng nghìn khách hàng yêu thích lịch sử và văn hóa Việt Nam.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button className="group px-10 py-5 bg-white text-vietnam-gold-700 font-sans text-sm tracking-[0.15em] uppercase hover:bg-cream-50 transition-all duration-300 shadow-strong flex items-center space-x-3">
              <span>Đăng Ký Bán Hàng</span>
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </button>
            <button className="px-10 py-5 border-2 border-white text-white font-sans text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-vietnam-gold-700 transition-all duration-300">
              Tìm Hiểu Thêm
            </button>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 scroll-animate">
            {[
              { value: '1000+', label: 'Sản Phẩm' },
              { value: '50+', label: 'Đối Tác' },
              { value: '5000+', label: 'Khách Hàng' },
              { value: '4.8★', label: 'Đánh Giá' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-scroll group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <p className="text-5xl lg:text-6xl font-serif text-vietnam-gold-600 mb-2">{stat.value}</p>
                  <div className="w-12 h-1 bg-vietnam-gold mx-auto"></div>
                </div>
                <p className="text-charcoal-600 text-lg font-sans tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
