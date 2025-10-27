import { useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function History() {
  const [activePeriod, setActivePeriod] = useState<'french' | 'american'>('french');
  useScrollAnimation();

  const frenchPeriod = {
    title: 'Giai Đoạn Pháp Thuộc',
    years: '1858 - 1945',
    description: 'Thời kỳ đấu tranh giải phóng dân tộc khỏi ách thống trị thực dân Pháp',
    events: [
      {
        year: '1858',
        title: 'Pháp Tấn Công Đà Nẵng',
        description: 'Quân Pháp bắt đầu xâm lược Việt Nam, mở đầu cho 87 năm thống trị thực dân.',
        image: 'https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg',
      },
      {
        year: '1930',
        title: 'Thành Lập Đảng Cộng Sản Việt Nam',
        description: 'Đảng Cộng sản Việt Nam được thành lập, đánh dấu bước ngoặt trong cuộc đấu tranh giải phóng.',
        image: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg',
      },
      {
        year: '1945',
        title: 'Cách Mạng Tháng Tám',
        description: 'Nhân dân Việt Nam giành chính quyền, tuyên bố độc lập và thành lập nước Việt Nam Dân chủ Cộng hòa.',
        image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg',
      },
    ],
  };

  const americanPeriod = {
    title: 'Giai Đoạn Chống Mỹ',
    years: '1945 - 1975',
    description: 'Cuộc kháng chiến chống Mỹ cứu nước và thống nhất đất nước',
    events: [
      {
        year: '1954',
        title: 'Chiến Thắng Điện Biên Phủ',
        description: 'Chiến thắng lịch sử chấm dứt 9 năm kháng chiến chống Pháp, làm rung chuyển thế giới.',
        image: 'https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg',
      },
      {
        year: '1968',
        title: 'Tổng Tiến Công Tết Mậu Thân',
        description: 'Cuộc tổng tiến công mạnh mẽ, đánh dấu bước ngoặt trong cuộc kháng chiến chống Mỹ.',
        image: 'https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg',
      },
      {
        year: '1975',
        title: 'Giải Phóng Miền Nam',
        description: 'Chiến dịch Hồ Chí Minh thắng lợi, thống nhất đất nước, kết thúc 30 năm chiến tranh.',
        image: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg',
      },
    ],
  };

  const currentPeriod = activePeriod === 'french' ? frenchPeriod : americanPeriod;

  return (
    <div className="min-h-screen bg-vietnam-black pt-20">
      <div className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-vietnam-white mb-4">
              LỊCH SỬ VIỆT NAM
            </h1>
            <p className="text-xl text-vietnam-gold font-serif italic">
              Những trang sử vàng của dân tộc
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setActivePeriod('french')}
            className={`px-8 py-4 font-serif text-lg transition-all duration-300 ${
              activePeriod === 'french'
                ? 'bg-vietnam-red text-vietnam-white shadow-lg shadow-vietnam-red/50'
                : 'bg-vietnam-black border-2 border-vietnam-red text-vietnam-red hover:bg-vietnam-red/10'
            }`}
          >
            1858 - 1945
            <div className="text-sm mt-1">Pháp Thuộc</div>
          </button>
          <button
            onClick={() => setActivePeriod('american')}
            className={`px-8 py-4 font-serif text-lg transition-all duration-300 ${
              activePeriod === 'american'
                ? 'bg-vietnam-red text-vietnam-white shadow-lg shadow-vietnam-red/50'
                : 'bg-vietnam-black border-2 border-vietnam-red text-vietnam-red hover:bg-vietnam-red/10'
            }`}
          >
            1945 - 1975
            <div className="text-sm mt-1">Chống Mỹ</div>
          </button>
        </div>

        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-serif text-vietnam-white mb-4 parallax-text">{currentPeriod.title}</h2>
          <p className="text-xl text-vietnam-gold mb-2">{currentPeriod.years}</p>
          <p className="text-vietnam-white/70 max-w-3xl mx-auto">{currentPeriod.description}</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-vietnam-red/30 hidden md:block" />

          {currentPeriod.events.map((event, index) => (
            <div
              key={index}
              className={`mb-16 relative ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
              }`}
            >
              <div className="md:w-1/2 fade-scroll">
                <div className="group relative overflow-hidden bg-vietnam-black border border-vietnam-red/30 hover:border-vietnam-red transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover sepia hover:sepia-0 transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vietnam-black via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-vietnam-gold mb-2">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-2xl font-serif font-bold">{event.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-vietnam-white mb-3">{event.title}</h3>
                    <p className="text-vietnam-white/70 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-vietnam-red rounded-full border-4 border-vietnam-black shadow-lg shadow-vietnam-red/50" />
            </div>
          ))}
        </div>

        <div className="mt-20 bg-vietnam-red/10 border border-vietnam-red/30 p-8 md:p-12">
          <h2 className="text-3xl font-serif text-vietnam-white mb-8 text-center">Bản Đồ Lịch Sử</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-vietnam-black/50 hover:bg-vietnam-black transition-colors duration-300">
              <MapPin className="mx-auto text-vietnam-red mb-4" size={40} />
              <h3 className="text-xl font-serif text-vietnam-gold mb-2">Điện Biên Phủ</h3>
              <p className="text-vietnam-white/70 text-sm">Chiến trường lịch sử năm 1954</p>
            </div>
            <div className="text-center p-6 bg-vietnam-black/50 hover:bg-vietnam-black transition-colors duration-300">
              <MapPin className="mx-auto text-vietnam-red mb-4" size={40} />
              <h3 className="text-xl font-serif text-vietnam-gold mb-2">Huế - Sài Gòn</h3>
              <p className="text-vietnam-white/70 text-sm">Tổng tiến công Tết Mậu Thân 1968</p>
            </div>
            <div className="text-center p-6 bg-vietnam-black/50 hover:bg-vietnam-black transition-colors duration-300">
              <MapPin className="mx-auto text-vietnam-red mb-4" size={40} />
              <h3 className="text-xl font-serif text-vietnam-gold mb-2">Hồ Chí Minh</h3>
              <p className="text-vietnam-white/70 text-sm">Giải phóng hoàn toàn 1975</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <blockquote className="text-2xl font-serif italic text-vietnam-gold max-w-3xl mx-auto">
            "Không có gì quý hơn độc lập tự do"
            <footer className="text-vietnam-white mt-4">— Chủ Tịch Hồ Chí Minh</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
