import { useEffect } from 'react';
import { ArrowRight, Award, Users, Globe2, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type HomeProps = {
  onNavigate: (page: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-screen parallax overlay-gradient" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg)',
      }}>
        <div className="relative z-10 h-full flex items-center justify-center px-8">
          <div className="max-w-5xl text-center animate-fade-up">
            <div className="inline-block px-6 py-2 border border-white/30 text-white/90 text-xs tracking-[0.2em] uppercase mb-8">
              Được thành lập từ 1995
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-8 text-shadow-premium leading-tight">
              Echoes of Việt Nam
            </h1>

            <div className="w-24 h-[2px] bg-bronze mx-auto mb-8"></div>

            <p className="text-xl md:text-2xl text-white/95 mb-16 leading-relaxed max-w-3xl mx-auto">
              Gần ba thập kỷ bảo tồn và lan tỏa di sản lịch sử văn hóa quý báu của dân tộc Việt Nam
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => onNavigate('history')}
                className="btn-primary group flex items-center gap-3"
              >
                <span>Khám Phá Di Sản</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary">
                Về Chúng Tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16">
            {[
              { icon: Award, value: '29+', label: 'Năm Kinh Nghiệm' },
              { icon: Users, value: '50K+', label: 'Thành Viên' },
              { icon: Globe2, value: '40+', label: 'Quốc Gia' },
              { icon: TrendingUp, value: '500+', label: 'Dự Án' },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-on-scroll group">
                <stat.icon className="w-12 h-12 mx-auto mb-6 text-bronze group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <div className="text-5xl font-serif text-charcoal-900 mb-3">{stat.value}</div>
                <div className="text-sm text-charcoal-600 tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-sand-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-block px-6 py-2 border border-bronze text-bronze text-xs tracking-[0.2em] uppercase mb-6">
              Chuyên Môn
            </div>
            <h2 className="section-heading mb-6">
              Di Sản Được Bảo Tồn
            </h2>
            <div className="w-20 h-[2px] bg-bronze mx-auto mb-8"></div>
            <p className="section-subheading max-w-3xl mx-auto">
              Với gần ba thập kỷ kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc
              bảo tồn và phát triển di sản lịch sử văn hóa Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="relative group">
                <div className="absolute -inset-4 bg-bronze/10 group-hover:bg-bronze/20 transition-colors duration-500"></div>
                <img
                  src="https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg"
                  alt="Di sản văn hóa"
                  className="relative w-full h-[600px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-12 animate-on-scroll">
              {[
                {
                  title: 'Nghiên Cứu Chuyên Sâu',
                  desc: 'Đội ngũ chuyên gia hàng đầu với hơn 25 năm kinh nghiệm nghiên cứu lịch sử và văn hóa',
                },
                {
                  title: 'Bảo Tồn Chuyên Nghiệp',
                  desc: 'Áp dụng công nghệ hiện đại kết hợp phương pháp truyền thống để bảo tồn di sản',
                },
                {
                  title: 'Giáo Dục Cộng Đồng',
                  desc: 'Hơn 500 chương trình giáo dục và hội thảo đã được tổ chức trên toàn quốc',
                },
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-bronze flex items-center justify-center text-white font-serif text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-charcoal-900 mb-3">{item.title}</h3>
                      <p className="text-charcoal-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-block px-6 py-2 border border-bronze text-bronze text-xs tracking-[0.2em] uppercase mb-6">
              Dịch Vụ
            </div>
            <h2 className="section-heading mb-6">
              Những Gì Chúng Tôi Cung Cấp
            </h2>
            <div className="w-20 h-[2px] bg-bronze mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Nghiên Cứu Lịch Sử',
                image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg',
                desc: 'Dịch vụ nghiên cứu chuyên sâu về lịch sử, văn hóa với đội ngũ chuyên gia giàu kinh nghiệm',
              },
              {
                title: 'Tư Vấn Bảo Tồn',
                image: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg',
                desc: 'Tư vấn và thực hiện các dự án bảo tồn di sản văn hóa theo tiêu chuẩn quốc tế',
              },
              {
                title: 'Giáo Dục & Đào Tạo',
                image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg',
                desc: 'Chương trình đào tạo chuyên nghiệp về lịch sử, văn hóa và bảo tồn di sản',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="card-premium group overflow-hidden cursor-pointer animate-on-scroll"
                onClick={() => onNavigate('services')}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-charcoal-900 mb-4 group-hover:text-bronze transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-charcoal-600 leading-relaxed mb-6">{service.desc}</p>
                  <button className="flex items-center gap-2 text-bronze text-sm tracking-wider uppercase font-medium group-hover:gap-4 transition-all">
                    <span>Tìm Hiểu Thêm</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-gradient-bronze text-white">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
            Cùng Nhau Bảo Tồn Di Sản
          </h2>
          <p className="text-xl mb-12 leading-relaxed text-white/90">
            Tham gia cùng chúng tôi trong hành trình bảo tồn và phát triển di sản văn hóa quý báu
            của dân tộc Việt Nam
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => onNavigate('contact')}
              className="px-12 py-5 bg-white text-bronze text-sm tracking-[0.1em] uppercase font-medium hover:bg-sand-50 transition-all duration-400"
            >
              Liên Hệ Ngay
            </button>
            <button className="px-12 py-5 border-2 border-white text-white text-sm tracking-[0.1em] uppercase font-medium hover:bg-white hover:text-bronze transition-all duration-400">
              Xem Dự Án
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                quote: 'Đội ngũ chuyên môn cao, tận tâm và có tầm nhìn xa. Dự án bảo tồn di tích của chúng tôi đã thành công rực rỡ nhờ sự hỗ trợ của Echoes of Việt Nam.',
                author: 'Nguyễn Văn A',
                title: 'Giám Đốc Bảo Tàng',
              },
              {
                quote: 'Gần 30 năm kinh nghiệm thực sự tạo nên sự khác biệt. Echoes of Việt Nam là đối tác đáng tin cậy nhất trong lĩnh vực bảo tồn di sản.',
                author: 'Trần Thị B',
                title: 'Chuyên Gia Văn Hóa',
              },
              {
                quote: 'Phương pháp tiếp cận chuyên nghiệp, hiện đại nhưng vẫn giữ được giá trị truyền thống. Một đơn vị xuất sắc trong ngành.',
                author: 'Lê Văn C',
                title: 'Nhà Nghiên Cứu',
              },
            ].map((testimonial, index) => (
              <div key={index} className="animate-on-scroll">
                <div className="text-5xl text-bronze/20 font-serif mb-4">"</div>
                <p className="text-charcoal-700 leading-relaxed mb-6 italic">{testimonial.quote}</p>
                <div>
                  <div className="font-medium text-charcoal-900">{testimonial.author}</div>
                  <div className="text-sm text-charcoal-500">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
