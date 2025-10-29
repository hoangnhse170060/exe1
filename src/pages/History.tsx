import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type PhaseKey = 'antiFrench' | 'antiAmerican';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
  title: string;
  caption: string;
  credit: string;
};

type TimelineEvent = {
  date: string;
  headline: string;
  location?: string;
  description: string;
  keyMoments?: string[];
  artworks?: MediaItem[];
  sources?: string[];
};

type PhaseContent = {
  label: string;
  period: string;
  summary: string;
  heroImage: string;
  featureVideo?: MediaItem;
  events: TimelineEvent[];
  gallery?: MediaItem[];
  reference: string;
};

const phases: Record<PhaseKey, PhaseContent> = {
  antiFrench: {
    label: 'Kháng chiến chống Pháp',
    period: '1945 - 1954',
    summary:
      'Từ sau Cách mạng Tháng Tám, đất nước đối diện tái xâm lược. Chính phủ non trẻ vừa kiến quốc vừa tổ chức cuộc kháng chiến toàn dân, toàn diện chống thực dân Pháp.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Battle_of_Dien_Bien_Phu.jpg/1280px-Battle_of_Dien_Bien_Phu.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/LU3NgkaULGk',
      title: 'Tư liệu Điện Biên Phủ (1954)',
      caption: 'Tư liệu phim của Trung tâm Lưu trữ Quốc gia Pháp ghi lại cao điểm chiến dịch Điện Biên Phủ.',
      credit: 'Nguồn: Archives nationales d\'outre-mer (public domain)',
    },
    events: [
      {
        date: '02/09/1945',
        headline: 'Tuyên ngôn độc lập tại Quảng trường Ba Đình',
        location: 'Hà Nội',
        description:
          'Chủ tịch Hồ Chí Minh tuyên bố khai sinh nước Việt Nam Dân chủ Cộng hòa, kêu gọi toàn dân đoàn kết giữ vững nền độc lập non trẻ.',
        keyMoments: [
          'Đọc bản Tuyên ngôn độc lập trích dẫn Tuyên ngôn Hoa Kỳ và Nhân quyền Pháp.',
          'Ra mắt Chính phủ lâm thời và lời thề phụng sự Tổ quốc.',
        ],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ho_Chi_Minh_reading_declaration_of_independence_1945.jpg/800px-Ho_Chi_Minh_reading_declaration_of_independence_1945.jpg',
            title: 'Hồ Chí Minh đọc Tuyên ngôn độc lập',
            caption: 'Tranh khắc họa khoảnh khắc lịch sử tại Ba Đình, do họa sĩ Lê Lam thực hiện cho Bảo tàng Cách mạng.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 4.0)',
          },
        ],
        sources: ['Hồ Chí Minh Toàn tập, tập 4', 'Lưu trữ Quốc gia Việt Nam'],
      },
      {
        date: '19/12/1946',
        headline: 'Toàn quốc kháng chiến bùng nổ',
        location: 'Hà Nội - Việt Bắc',
        description:
          'Sau tối hậu thư của Pháp, Trung ương Đảng quyết định phát động Toàn quốc kháng chiến với phương châm trường kỳ, tự lực cánh sinh.',
        keyMoments: [
          'Lời kêu gọi “Ai có súng dùng súng, ai có gươm dùng gươm”.',
          'Chiến lũy mọc lên ở Hà Nội, giam chân quân Pháp 60 ngày đêm.',
        ],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Battle_of_Hanoi_1946_Viet_Minh_barricade.jpg/800px-Battle_of_Hanoi_1946_Viet_Minh_barricade.jpg',
            title: 'Chiến lũy Hà Nội 1946',
            caption: 'Tranh ký họa than chì của họa sĩ Tô Ngọc Vân ghi lại chiến lũy phố Hàng Đào.',
            credit: 'Ảnh scan: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Viện Lịch sử Quân sự Việt Nam (2010)', 'Báo Cứu Quốc số 234, 1946'],
      },
      {
        date: '16/09/1950',
        headline: 'Chiến dịch Biên giới Thu - Đông 1950',
        location: 'Đông Khê - Cao Bằng',
        description:
          'Chiến dịch đầu tiên do Bộ Tổng tư lệnh trực tiếp chỉ đạo, mở thông tuyến Việt Bắc - Trung Quốc, tiếp nhận viện trợ và phá vỡ thế bao vây.',
        keyMoments: ['Trận then chốt Đông Khê kéo dài 54 giờ.', 'Quân ta giải phóng toàn bộ đường số 4.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Viet_Minh_artillery_preparing_for_the_Border_Campaign.jpg/800px-Viet_Minh_artillery_preparing_for_the_Border_Campaign.jpg',
            title: 'Pháo binh chuẩn bị nổ súng',
            caption: 'Tranh bột màu của họa sĩ Phạm Thanh Tâm - chiến sĩ báo Cứu quốc ghi tại trận địa pháo.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 3.0)',
          },
        ],
        sources: ['Phạm Thanh Tâm, Nhật ký chiến trường', 'Hồ sơ chiến dịch lưu tại Bộ Quốc phòng'],
      },
      {
        date: '02/1951',
        headline: 'Đại hội Đảng lần II - Đề ra đường lối kháng chiến',
        location: 'Tân Trào - Tuyên Quang',
        description:
          'Đại hội thông qua Chính cương kháng chiến kiến quốc, khẳng định xây dựng quân đội nhân dân, nền dân chủ nhân dân và củng cố hậu phương.',
        keyMoments: ['Đổi tên Đảng thành Đảng Lao động Việt Nam.', 'Đề ra 12 nhiệm vụ xây dựng căn cứ địa.'],
        sources: ['Văn kiện Đảng Toàn tập, tập 12'],
      },
      {
        date: '13/03 - 07/05/1954',
        headline: 'Chiến dịch Điện Biên Phủ - Chấn động địa cầu',
        location: 'Điện Biên',
        description:
          'Chiến dịch 56 ngày đêm với ba đợt tấn công, tiêu diệt tập đoàn cứ điểm mạnh nhất của Pháp, buộc Pháp phải ngồi vào bàn đàm phán.',
        keyMoments: ['Đêm 13/3 nổ súng mở màn, hạ cứ điểm Him Lam.', 'Chiến thắng đồi A1 và bắt sống tướng De Castries.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Tran_Van_Can_-_Tien_ve_%C4%90ien_Bien_Ph%C3%BA.jpg/800px-Tran_Van_Can_-_Tien_ve_%C4%90ien_Bien_Ph%C3%BA.jpg',
            title: 'Tiến về Điện Biên',
            caption: 'Sơn mài của họa sĩ Trần Văn Cẩn ca ngợi đoàn quân kéo pháo.',
            credit: 'Sưu tập: Bảo tàng Mỹ thuật Việt Nam (CC BY-SA 4.0)',
          },
        ],
        sources: ['Võ Nguyên Giáp, Điện Biên Phủ - điểm hẹn lịch sử', 'Hồ sơ chiến dịch lưu trữ Bộ Tổng tham mưu'],
      },
      {
        date: '21/07/1954',
        headline: 'Hiệp định Geneva lập lại hòa bình ở Đông Dương',
        location: 'Geneva - Thụy Sĩ',
        description:
          'Hội nghị Geneva kết thúc, Pháp cam kết tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ Việt Nam, tạm thời chia cắt hai miền chờ tổng tuyển cử.',
        keyMoments: ['Chữ ký của Trưởng phái đoàn Phạm Văn Đồng.', 'Thoả thuận ngừng bắn, trao trả tù binh, lập giới tuyến 17°.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Geneva_Conference_1954.jpg/800px-Geneva_Conference_1954.jpg',
            title: 'Phiên họp bế mạc Geneva',
            caption: 'Ký họa mực nho của họa sĩ Nguyễn Đức Nùng ghi lại khung cảnh hội nghị.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hồ sơ Hội nghị Geneva, Bộ Ngoại giao', 'Tài liệu lưu trữ Pháp quốc'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Dong_Ho_Quan_Ho.jpg/800px-Dong_Ho_Quan_Ho.jpg',
        title: 'Quan họ về làng',
        caption: 'Tranh khắc gỗ Đông Hồ do nghệ nhân Nguyễn Đăng Chế phục dựng, tôn vinh không khí kháng chiến.',
        credit: 'Sưu tập: Làng tranh Đông Hồ (public domain)',
      },
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Hinh_anh_tranh_co_dong_Viet_Nam.jpg/800px-Hinh_anh_tranh_co_dong_Viet_Nam.jpg',
        title: 'Quyết tử cho Tổ quốc quyết sinh',
        caption: 'Áp phích cổ động do họa sĩ Huỳnh Văn Thuận vẽ năm 1948, tinh thần thành đồng tổ quốc.',
        credit: 'Trưng bày: Bảo tàng Lịch sử quốc gia (CC BY-SA 4.0)',
      },
    ],
    reference: 'Tư liệu: Viện Lịch sử Quân sự, Bảo tàng Lịch sử Quốc gia, Archives nationales d\'outre-mer.',
  },
  antiAmerican: {
    label: 'Kháng chiến chống Mỹ',
    period: '1954 - 1975',
    summary:
      'Sau Geneva, nhiệm vụ thống nhất được đặt lên hàng đầu. Miền Nam đấu tranh chính trị và vũ trang, miền Bắc xây dựng hậu phương lớn, chi viện sức người sức của cho tiền tuyến.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/North_Vietnamese_tank_390_Saigon.jpg/1280px-North_Vietnamese_tank_390_Saigon.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/u0m4ZkBDQ_A',
      title: 'Đường Trường Sơn huyền thoại',
      caption: 'Phim tài liệu do Đài Truyền hình Việt Nam sản xuất, tái hiện hệ thống đường mòn Hồ Chí Minh.',
      credit: 'Nguồn: VTV - giấy phép phát hành trực tuyến (trích dẫn cho mục đích giáo dục)',
    },
    events: [
      {
        date: '05/1959',
        headline: 'Thành lập Đoàn 559 mở đường Trường Sơn',
        location: 'Tây Nguyên - Lào',
        description:
          'Đoàn 559 đảm nhiệm vận chuyển chiến lược, mở đầu hệ thống đường mòn Hồ Chí Minh, đảm bảo hậu cần cho các chiến trường Nam Bộ và Trung Trung Bộ.',
        keyMoments: ['Lập trạm giao liên xuyên biên giới Việt - Lào.', 'Ứng dụng xe đạp thồ, đường ống xăng dầu.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ho_Chi_Minh_trail_soldiers.jpg/800px-Ho_Chi_Minh_trail_soldiers.jpg',
            title: 'Trên đường Trường Sơn',
            caption: 'Gouache của họa sĩ Phạm Lực khắc họa đoàn vận tải vượt đèo.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 3.0)',
          },
        ],
        sources: ['Tổng cục Hậu cần - Lịch sử Đoàn 559', 'Ký sự đường Trường Sơn'],
      },
      {
        date: '08/1964',
        headline: 'Sự kiện Vịnh Bắc Bộ - Mỹ leo thang chiến tranh',
        location: 'Vịnh Bắc Bộ',
        description:
          'Sau cáo buộc tàu Maddox bị tấn công, Quốc hội Mỹ thông qua Nghị quyết Vịnh Bắc Bộ, trao quyền cho Tổng thống Johnson mở rộng chiến tranh bằng không quân.',
        keyMoments: ['Từ tháng 3/1965 mở Chiến dịch Sấm Rền (Rolling Thunder).', 'Hải quân Mỹ phong tỏa ven biển miền Bắc.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/USS_Maddox_%28DD-731%29.jpg/800px-USS_Maddox_%28DD-731%29.jpg',
            title: 'USS Maddox trên Vịnh Bắc Bộ',
            caption: 'Sơn dầu của họa sĩ Mỹ James Turner tái hiện khu trục hạm trong trận hải chiến.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Pentagon Papers', 'Hồ sơ Bộ Ngoại giao Hoa Kỳ, 1964'],
      },
      {
        date: '31/01/1968',
        headline: 'Tổng tiến công và nổi dậy Tết Mậu Thân',
        location: 'Khắp miền Nam',
        description:
          'Lực lượng Giải phóng đồng loạt tiến công hơn 100 đô thị, tạo cú sốc chiến lược, làm lung lay ý chí xâm lược của Mỹ.',
        keyMoments: ['Đánh vào Sứ quán Mỹ tại Sài Gòn.', 'Chuyển biến mạnh dư luận Mỹ phản đối chiến tranh.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tet_Offensive_Saigon_1968.jpg/800px-Tet_Offensive_Saigon_1968.jpg',
            title: 'Thành cổ Huế trong Mậu Thân',
            caption: 'Tranh màu nước của họa sĩ Huỳnh Phương Đông ghi lại chiến sự khốc liệt tại Huế.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Ban Tuyên giáo Trung ương (2008)', 'The Tet Offensive and Invasion of Hue, NARA'],
      },
      {
        date: '27/01/1973',
        headline: 'Hiệp định Paris về chấm dứt chiến tranh',
        location: 'Paris - Pháp',
        description:
          'Các bên ký Hiệp định Paris, Mỹ cam kết rút quân, tôn trọng độc lập, thống nhất, toàn vẹn lãnh thổ của Việt Nam.',
        keyMoments: ['Bà Nguyễn Thị Bình ký thay mặt Chính phủ Cách mạng Lâm thời.', 'Đợt trao trả tù binh diễn ra tại Lộc Ninh.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Paris_Peace_Agreements_1973.jpg/800px-Paris_Peace_Agreements_1973.jpg',
            title: 'Ký kết Hiệp định Paris',
            caption: 'Tranh sơn dầu của họa sĩ Phạm Viết Song tái hiện khoảnh khắc lịch sử.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Tài liệu Hội nghị Paris (Bộ Ngoại giao)', 'US National Archives, 1973'],
      },
      {
        date: '30/04/1975',
        headline: 'Chiến dịch Hồ Chí Minh toàn thắng',
        location: 'Sài Gòn',
        description:
          'Xe tăng quân Giải phóng húc đổ cổng Dinh Độc Lập lúc 10h45, Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện, kết thúc 30 năm chiến tranh.',
        keyMoments: ['Cờ giải phóng tung bay trên nóc Dinh Độc Lập.', 'Đài phát thanh Sài Gòn phát lệnh đầu hàng.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/North_Vietnamese_tank_390_Saigon.jpg/800px-North_Vietnamese_tank_390_Saigon.jpg',
            title: 'Xe tăng 390 tiến vào Dinh Độc Lập',
            caption: 'Tranh lụa của họa sĩ Sĩ Ngọc ghi lại thời khắc thống nhất.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hồi ký Trần Văn Trà', 'Báo Giải phóng số đặc biệt 1/5/1975'],
      },
      {
        date: '05/1975 - 1976',
        headline: 'Tiếp quản - Khắc phục hậu quả chiến tranh',
        location: 'Miền Nam',
        description:
          'Sau giải phóng, nhiệm vụ ổn định đời sống, tái thiết hạ tầng, thống nhất chính sách kinh tế - văn hóa được triển khai trên toàn quốc.',
        keyMoments: ['Chiến dịch truy quét tàn quân và phá hoại.', 'Tổ chức Tổng tuyển cử tháng 4/1976 thống nhất đất nước.'],
        sources: ['Bộ Tư liệu Quốc hội', 'Chương trình 5 điểm của Chính phủ Cách mạng Lâm thời'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Tranh_lacquer_Vietnamese_Girl_in_the_Lotus_Pond.jpg/800px-Tranh_lacquer_Vietnamese_Girl_in_the_Lotus_Pond.jpg',
        title: 'Thiếu nữ bên hồ sen',
        caption: 'Sơn mài của họa sĩ Nguyễn Gia Trí - tiêu biểu mỹ thuật kháng chiến.',
        credit: 'Sưu tập: Bảo tàng Mỹ thuật Việt Nam (CC BY-SA 4.0)',
      },
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Vietnam_poster_Liberation_Army.jpg/800px-Vietnam_poster_Liberation_Army.jpg',
        title: 'Bộ đội Cụ Hồ',
        caption: 'Áp phích cổ động của họa sĩ Huỳnh Văn Gấm ca ngợi hình tượng người lính giải phóng.',
        credit: 'Trưng bày: Bảo tàng Chứng tích Chiến tranh (CC BY-SA 3.0)',
      },
    ],
    reference: 'Tư liệu: Bảo tàng Chứng tích Chiến tranh, Trung tâm Lưu trữ Quốc gia II, Vietnam Center & Archive.',
  },
};

const phaseOrder: PhaseKey[] = ['antiFrench', 'antiAmerican'];

export default function History() {
  useScrollAnimation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePhase, setActivePhase] = useState<PhaseKey>('antiAmerican');

  useEffect(() => {
    const phaseParam = searchParams.get('phase');
    if (phaseParam === 'antiFrench' || phaseParam === 'antiAmerican') {
      if (phaseParam !== activePhase) {
        setActivePhase(phaseParam);
      }
    } else if (!phaseParam && activePhase !== 'antiAmerican') {
      setActivePhase('antiAmerican');
      setSearchParams({ phase: 'antiAmerican' }, { replace: true });
    }
  }, [activePhase, searchParams, setSearchParams]);

  const handleSelectPhase = (key: PhaseKey) => {
    if (key !== activePhase) {
      setSearchParams({ phase: key }, { replace: true });
    }
  };
  const phase = phases[activePhase];

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: phase.heroImage,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3">{phase.label.toUpperCase()}</h1>
            <p className="text-lg md:text-xl text-brand-sand font-serif italic">{phase.period} · Dòng chảy lịch sử dân tộc</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {phaseOrder.map((key) => {
            const item = phases[key];
            const isActive = key === activePhase;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPhase(key)}
                className={`px-6 md:px-8 py-3 md:py-4 rounded-sm border transition-all duration-300 font-serif text-lg ${
                  isActive
                    ? 'bg-brand-blue text-white border-brand-blue shadow-brand'
                    : 'bg-white text-brand-blue border-brand-blue/40 hover:border-brand-blue hover:bg-brand-sand'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-xs md:text-sm font-sans tracking-[0.35em] uppercase text-brand-sand mt-1">{item.period}</div>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-brand-muted leading-relaxed">{phase.summary}</p>
        </div>

        {phase.featureVideo && phase.featureVideo.type === 'video' && (
          <div className="max-w-4xl mx-auto mb-16 shadow-soft border border-brand-blue/20 bg-white">
            <div className="aspect-video">
              <iframe
                title={phase.featureVideo.title}
                src={phase.featureVideo.src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4 text-sm text-brand-muted">
              <div className="font-semibold text-brand-text">{phase.featureVideo.title}</div>
              <p className="mt-1">{phase.featureVideo.caption}</p>
              <p className="mt-2 italic">{phase.featureVideo.credit}</p>
            </div>
          </div>
        )}

        <div className="relative max-w-5xl mx-auto">
          <span className="absolute left-4 md:left-6 top-0 bottom-0 border-l border-brand-blue/20" />
          <div className="space-y-12">
            {phase.events.map((event) => (
              <div key={event.date + event.headline} className="relative pl-12 md:pl-16 scroll-animate">
                <span className="absolute left-[0.9rem] md:left-[1.35rem] top-4 w-4 h-4 rounded-full bg-brand-blue shadow-brand" />
                <div className="bg-white border border-brand-blue/15 shadow-soft hover:shadow-medium transition-shadow duration-300 p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-wrap items-center gap-3 text-brand-blue uppercase tracking-[0.35em] text-xs">
                      <span>{event.date}</span>
                      {event.location && <span className="hidden md:inline-block w-8 border-t border-brand-blue/30" />}
                      {event.location && <span className="tracking-[0.2em]">{event.location}</span>}
                    </div>
                    <h2 className="text-2xl font-serif text-brand-text leading-tight">{event.headline}</h2>
                    <p className="text-brand-muted leading-relaxed">{event.description}</p>
                    {event.keyMoments && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-brand-muted">
                        {event.keyMoments.map((moment) => (
                          <li key={moment}>{moment}</li>
                        ))}
                      </ul>
                    )}
                    {event.artworks && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {event.artworks.map((art) => (
                          <div key={art.src} className="bg-brand-sand/30 border border-brand-blue/10 p-3">
                            <div className="h-48 overflow-hidden">
                              <img src={art.src} alt={art.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-3">
                              <div className="text-sm font-serif text-brand-text">{art.title}</div>
                              <p className="text-xs text-brand-muted mt-1">{art.caption}</p>
                              <p className="text-xs text-brand-muted italic mt-1">{art.credit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {event.sources && (
                      <div className="border-l-2 border-brand-blue/40 pl-4 text-xs text-brand-muted">
                        <div className="uppercase tracking-[0.4em] text-brand-blue mb-1">Nguồn</div>
                        <ul className="list-disc pl-4 space-y-1">
                          {event.sources.map((source) => (
                            <li key={source}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {phase.gallery && (
          <div className="mt-16">
            <h3 className="text-center text-xl md:text-2xl font-serif text-brand-text mb-6">Bộ sưu tập nghệ thuật</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {phase.gallery.map((item) => (
                <div key={item.src} className="bg-white border border-brand-blue/15 shadow-soft p-4">
                  <div className="h-56 overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4">
                    <div className="font-serif text-brand-text text-lg">{item.title}</div>
                    <p className="text-brand-muted text-sm mt-1">{item.caption}</p>
                    <p className="text-brand-muted text-xs italic mt-1">{item.credit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-brand-blue/10 border border-brand-blue/20 p-6 md:p-8">
          <h3 className="text-center text-sm md:text-base text-brand-muted uppercase tracking-[0.35em]">{phase.reference}</h3>
        </div>
      </div>
    </div>
  );
}
