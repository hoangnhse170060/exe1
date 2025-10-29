import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, Heart, BookOpen, ArrowRight, Star } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase, type Product } from '../lib/supabase';
import { mockProducts } from '../data/mockShop';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  useScrollAnimation();

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        if (!active) return;
        const typed = (data as Product[]) || [];
        if (!typed.length) {
          setFeaturedProducts(mockProducts.slice(0, 6));
          setProductsError('Hiển thị dữ liệu minh hoạ.');
        } else {
          setFeaturedProducts(typed);
          setProductsError(null);
        }
      } catch (error: any) {
        if (!active) return;
        setFeaturedProducts(mockProducts.slice(0, 6));
        setProductsError('Hiển thị dữ liệu minh hoạ.');
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const handleOpenProduct = (productId: string) => {
    sessionStorage.setItem('highlightProduct', productId);
    navigate('/shop');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="relative min-h-screen bg-brand-base">
      <section className="relative h-screen bg-cover bg-center bg-no-repeat gradient-overlay" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg)',
      }}>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center max-w-5xl animate-fade-in-up">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-white mb-8 text-shadow-lg">
              Echoes of Viet Nam
            </h1>

            <div className="flex items-center justify-center space-x-2.5 mb-10">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-5 font-serif text-shadow-md">
              Chào mừng bạn đến với
            </p>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-brand-sand mb-10 text-shadow-md">
              Thế Giới Lịch Sử Việt Nam
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-14 max-w-3xl mx-auto leading-loose text-balance">
              Hành trình khám phá những dấu ấn lịch sử hào hùng, từ những ngày đầu tranh giành
              độc lập đến thời đại xây dựng và phát triển đất nước
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <button
                onClick={() => navigate('/history')}
                className="group px-10 py-5 bg-brand-blue text-white font-sans text-sm tracking-[0.15em] uppercase hover:bg-brand-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-strong hover:shadow-brand"
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

      <section className="relative py-24 lg:py-32 px-4 bg-brand-sand">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-1 bg-brand-blue shadow-brand"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center mb-20 scroll-animate">
          <h2 className="section-title text-charcoal-900">
            Sứ Mệnh Của Chúng Tôi
          </h2>
          <div className="w-16 h-1 bg-brand-blue mx-auto mb-8"></div>
          <p className="section-subtitle max-w-4xl mx-auto text-balance">
            Echoes of Việt Nam được thành lập với sứ mệnh lưu giữ và lan tỏa những giá trị lịch sử quý báu của dân
            tộc Việt Nam. Chúng tôi tin rằng, thông qua việc tìm hiểu quá khứ, thế hệ trẻ sẽ hiểu rõ hơn về nguồn
            gốc, truyền thống và tự hào về bản sắc văn hóa của mình.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-sky rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue transition-colors duration-300">
              <BookOpen className="text-brand-blue group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Giáo Dục</h3>
            <p className="text-charcoal-600 leading-relaxed">
              Cung cấp kiến thức lịch sử chính xác và sinh động qua các nội dung được nghiên cứu kỹ lưỡng
            </p>
          </div>

          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-sky rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue transition-colors duration-300">
              <Globe className="text-brand-blue group-hover:text-white transition-colors duration-300" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Lan Tỏa</h3>
            <p className="text-charcoal-600 leading-relaxed">
              Kết nối và xây dựng cộng đồng yêu lịch sử, văn hóa Việt Nam trên khắp thế giới
            </p>
          </div>

          <div className="card p-10 fade-scroll group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-sky rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue transition-colors duration-300">
              <Heart className="text-brand-blue group-hover:text-white transition-colors duration-300" size={32} />
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
          <div className="w-20 h-1 bg-brand-blue shadow-brand"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="section-title">
              Dòng Chảy Lịch Sử
            </h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto mb-6"></div>
            <p className="section-subtitle">
              Hành trình đấu tranh giành độc lập và bảo vệ Tổ quốc của dân tộc Việt Nam
            </p>
          </div>

          <div className="flex items-center justify-center mb-16 scroll-animate">
            <button className="w-14 h-14 rounded-full border-2 border-brand-blue text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-soft hover:shadow-brand">
              <ChevronDown className="rotate-90" size={24} />
            </button>

            <div className="flex items-center mx-12">
              <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold shadow-brand text-lg">
                1
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-brand-blue to-brand-sky mx-6"></div>
              <div className="w-14 h-14 rounded-full border-2 border-charcoal-200 flex items-center justify-center text-charcoal-400 font-bold text-lg">
                2
              </div>
            </div>

            <button className="w-14 h-14 rounded-full border-2 border-brand-blue text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-soft hover:shadow-brand">
              <ChevronDown className="rotate-[-90deg]" size={24} />
            </button>
          </div>

          <p className="text-center text-charcoal-700 mb-16 font-serif text-xl tracking-wide">1945 - 1954</p>

          <div className="grid lg:grid-cols-2 gap-16 items-center fade-scroll">
            <div className="space-y-8">
              <div className="inline-block px-5 py-2 bg-brand-sand text-brand-blue text-sm font-semibold tracking-wide">
                1945 - 1954
              </div>
              <h3 className="text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
                Kháng Chiến Chống Pháp
              </h3>
              <p className="text-charcoal-600 text-lg leading-loose">
                Cuộc kháng chiến vĩ đại của nhân dân Việt Nam chống lại thực dân
                Pháp, khẳng định quyết tự do và độc lập của dân tộc.
              </p>

              <div className="space-y-4 pl-4 border-l-2 border-brand-blue/40">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue mt-2 flex-shrink-0 shadow-brand"></div>
                  <p className="text-charcoal-700 text-lg">Tổng khởi nghĩa tháng 8/1945</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue mt-2 flex-shrink-0 shadow-brand"></div>
                  <p className="text-charcoal-700 text-lg">Tuyên ngôn độc lập 2/9/1945</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-brand-blue mt-2 flex-shrink-0 shadow-brand"></div>
                  <p className="text-charcoal-700 text-lg">Chiến thắng Điện Biên Phủ 1954</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/history')}
                className="group btn-primary flex items-center space-x-3 mt-8"
              >
                <span>Tìm Hiểu Chi Tiết</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <img
                src="https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg"
                alt="Kháng Chiến Chống Pháp"
                className="relative w-full h-[500px] object-cover shadow-strong group-hover:shadow-gold transition-all duration-500"
              />
              <div className="absolute bottom-6 right-6 bg-brand-blue/90 backdrop-blur-sm text-white px-6 py-3 font-serif text-lg">
                1945 - 1954
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-brand-sand">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-1 bg-brand-blue shadow-brand"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="section-title">
              Cửa Hàng Lưu Niệm
            </h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto mb-6"></div>
            <p className="section-subtitle">
              Sản phẩm lưu niệm lịch sử độc đáo từ các đối tác uy tín
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16 scroll-animate">
            <button className="px-7 py-3 bg-brand-blue text-white font-sans text-sm tracking-wide shadow-soft hover:shadow-brand transition-all duration-300">
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
            {productsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {productsError && (
                  <div className="col-span-full text-center text-brand-muted text-sm">
                    {productsError}
                  </div>
                )}

                {featuredProducts.length === 0 ? (
                  <div className="col-span-full text-center text-brand-muted">
                    Chưa có sản phẩm nổi bật để hiển thị. Vui lòng truy cập cửa hàng để khám phá thêm.
                  </div>
                ) : (
                  featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="card group cursor-pointer overflow-hidden fade-scroll"
                      onClick={() => handleOpenProduct(product.id)}
                    >
                      <div className="relative h-96 overflow-hidden bg-brand-sky">
                        <img
                          src={product.image_url || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-5 left-5">
                          <span className="bg-brand-blue text-white px-4 py-1.5 text-xs font-sans tracking-wide shadow-soft">
                            {product.category}
                          </span>
                        </div>
                        <div className="absolute top-5 right-5">
                          <span className="bg-brand-sand text-brand-text px-4 py-1.5 text-xs font-sans tracking-wide shadow-soft">
                            Sản phẩm mới
                          </span>
                        </div>
                        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-all duration-300">
                            <ArrowRight className="text-charcoal-900" size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="text-brand-blue text-xs font-sans mb-3 uppercase tracking-[0.15em] font-semibold">
                          {product.category}
                        </p>
                        <h3 className="text-2xl font-serif text-charcoal-900 mb-4 group-hover:text-brand-blue transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-charcoal-600 mb-5 leading-relaxed line-clamp-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-3xl font-serif text-brand-blue">{formatPrice(product.price)}</p>
                          <div className="flex items-center space-x-1 text-brand-blue">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/shop')}
              className="btn-secondary"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 px-4 bg-gradient-brand">
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
            <button className="group px-10 py-5 bg-white text-brand-blue font-sans text-sm tracking-[0.15em] uppercase hover:bg-brand-sand transition-all duration-300 shadow-strong flex items-center space-x-3">
              <span>Đăng Ký Bán Hàng</span>
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </button>
            <button className="px-10 py-5 border-2 border-white text-white font-sans text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-brand-blue transition-all duration-300">
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
                  <p className="text-5xl lg:text-6xl font-serif text-brand-blue mb-2">{stat.value}</p>
                  <div className="w-12 h-1 bg-brand-blue mx-auto"></div>
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
