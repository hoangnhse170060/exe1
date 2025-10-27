type FooterProps = {
  isSidebarOpen: boolean;
};

export default function Footer({ isSidebarOpen }: FooterProps) {
  return (
    <footer
      className={`bg-gradient-slate text-white py-16 transition-all duration-500 ${
        isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-serif mb-6">Echoes of Việt Nam</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bảo tồn và lan tỏa di sản lịch sử văn hóa quý báu của dân tộc Việt Nam
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6 text-bronze-300">
              Khám Phá
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Lịch Sử</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dịch Vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cửa Hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cộng Đồng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6 text-bronze-300">
              Hỗ Trợ
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Liên Hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính Sách</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều Khoản</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6 text-bronze-300">
              Kết Nối
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center">
          <p className="text-sm text-slate-400">
            © 2024 Echoes of Việt Nam. Bản quyền thuộc về công ty.
          </p>
        </div>
      </div>
    </footer>
  );
}
