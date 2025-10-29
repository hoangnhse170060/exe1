import { Eye, Archive, Users, FileText, Shield } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Services() {
  useScrollAnimation();

  const services = [
    {
      icon: Eye,
      title: 'Virtual Reality History Tours',
      description:
        'Trải nghiệm lịch sử Việt Nam qua công nghệ thực tế ảo. Khám phá các di tích lịch sử, chiến trường nổi tiếng và những khoảnh khắc quan trọng như thể bạn đang sống trong thời khắc đó.',
    },
    {
      icon: Archive,
      title: 'Digital Archives for Students',
      description:
        'Kho lưu trữ số hoá các tài liệu lịch sử, hình ảnh, video và bài nghiên cứu. Phục vụ học sinh, sinh viên và nhà nghiên cứu với nguồn tài liệu chính xác và đầy đủ.',
    },
    {
      icon: Users,
      title: 'Cultural Workshops',
      description:
        'Tổ chức các buổi hội thảo, workshop về văn hóa và lịch sử Việt Nam. Kết nối các nhà nghiên cứu, giáo viên và người yêu lịch sử để chia sẻ kiến thức và trải nghiệm.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(47, 58, 69, 0.6), rgba(47, 58, 69, 0.75)), url(https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
              DỊCH VỤ & ĐIỀU KHOẢN
            </h1>
            <p className="text-xl text-brand-sand font-serif italic">
              Phục vụ cộng đồng yêu lịch sử
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="mb-20">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-4xl font-serif text-brand-text mb-4 parallax-text">Dịch Vụ Của Chúng Tôi</h2>
            <div className="w-24 h-1 bg-brand-blue mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white border-2 border-brand-blue/20 hover:border-brand-blue p-8 transition-all duration-300 fade-scroll shadow-soft hover:shadow-medium"
              >
                <div className="absolute top-0 left-8 transform -translate-y-1/2 w-16 h-16 bg-brand-blue flex items-center justify-center group-hover:bg-brand-sand transition-colors duration-300">
                  <service.icon size={32} className="text-white group-hover:text-brand-text transition-colors duration-300" />
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-serif text-brand-text mb-4 group-hover:text-brand-blue transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-brand-muted leading-relaxed">{service.description}</p>
                </div>

                <div className="mt-6">
                  <button className="text-brand-blue hover:text-brand-muted transition-colors">
                    Tìm hiểu thêm →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-1 bg-brand-blue/20 my-16" />

        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-brand-text mb-4">Điều Khoản Sử Dụng</h2>
            <div className="w-24 h-1 bg-brand-blue mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-brand-blue/20 p-8 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="text-brand-blue" size={32} />
                <h3 className="text-2xl font-serif text-brand-text">Chính Sách Bảo Mật</h3>
              </div>

              <div className="space-y-4 text-brand-muted">
                <div>
                  <h4 className="text-brand-blue font-sans mb-2">1. Thu Thập Thông Tin</h4>
                  <p className="text-sm leading-relaxed">
                    Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, tham gia diễn đàn,
                    hoặc mua sắm trên website. Thông tin bao gồm tên, email, và thông tin thanh toán.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">2. Sử Dụng Thông Tin</h4>
                  <p className="text-sm leading-relaxed">
                    Thông tin của bạn được sử dụng để cải thiện trải nghiệm người dùng, xử lý đơn hàng,
                    và gửi thông báo về các hoạt động liên quan đến tài khoản của bạn.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">3. Bảo Vệ Thông Tin</h4>
                  <p className="text-sm leading-relaxed">
                    Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn
                    khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">4. Chia Sẻ Thông Tin</h4>
                  <p className="text-sm leading-relaxed">
                    Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba
                    mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-blue/20 p-8 shadow-soft">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="text-brand-blue" size={32} />
                <h3 className="text-2xl font-serif text-brand-text">Bản Quyền & Nội Dung</h3>
              </div>

              <div className="space-y-4 text-brand-muted">
                <div>
                  <h4 className="text-brand-blue font-sans mb-2">1. Quyền Sở Hữu Trí Tuệ</h4>
                  <p className="text-sm leading-relaxed">
                    Tất cả nội dung trên website này, bao gồm văn bản, hình ảnh, video, logo và thiết kế
                    đều thuộc quyền sở hữu của Echoes of Việt Nam hoặc được cấp phép sử dụng hợp pháp.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">2. Sử Dụng Nội Dung</h4>
                  <p className="text-sm leading-relaxed">
                    Bạn có thể xem, tải xuống và in nội dung cho mục đích cá nhân, phi thương mại.
                    Việc sao chép, phân phối hoặc sử dụng nội dung cho mục đích thương mại phải có
                    sự đồng ý bằng văn bản từ chúng tôi.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">3. Nội Dung Người Dùng</h4>
                  <p className="text-sm leading-relaxed">
                    Khi đăng nội dung lên diễn đàn, bạn giữ quyền sở hữu nhưng cấp cho chúng tôi
                    quyền sử dụng, sửa đổi và hiển thị nội dung đó trên website.
                  </p>
                </div>

                <div>
                  <h4 className="text-brand-blue font-sans mb-2">4. Trách Nhiệm Người Dùng</h4>
                  <p className="text-sm leading-relaxed">
                    Người dùng chịu trách nhiệm về nội dung mình đăng tải. Nghiêm cấm đăng nội dung
                    vi phạm pháp luật, xúc phạm, hoặc xâm phạm quyền của người khác.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-brand-blue/10 border border-brand-blue/20 p-8">
            <h3 className="text-2xl font-serif text-brand-text mb-4">Điều Khoản Chung</h3>
            <div className="space-y-3 text-brand-muted text-sm">
              <p>
                <span className="text-brand-blue">• </span>
                Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực
                ngay khi được đăng tải trên website.
              </p>
              <p>
                <span className="text-brand-blue">• </span>
                Việc tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận
                các điều khoản mới.
              </p>
              <p>
                <span className="text-brand-blue">• </span>
                Nếu có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua
                trang Liên Hệ.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-brand-muted text-sm">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
