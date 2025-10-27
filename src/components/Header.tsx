import { useState, useEffect } from 'react';
import { Menu, X, Clock, Facebook, Instagram, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSidebarToggle?: (isOpen: boolean) => void;
};

export default function Header({ currentPage, onNavigate, onSidebarToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isSidebarOpen);
    }
  }, [isSidebarOpen, onSidebarToggle]);

  const navItems = [
    { id: 'home', label: 'TRANG CHỦ' },
    { id: 'history', label: 'LỊCH SỬ' },
    { id: 'shop', label: 'SHOP' },
    { id: 'forum', label: 'DIỄN ĐÀN' },
    { id: 'services', label: 'DỊCH VỤ' },
    { id: 'contact', label: 'LIÊN HỆ' },
  ];

  return (
    <>
      <aside className={`hidden lg:flex fixed top-0 h-screen z-50 transition-all duration-300 ${
        isSidebarOpen ? 'left-0 w-[320px]' : 'left-[-320px] w-[320px]'
      }`}>
        <div className="w-[80px] bg-[#B78B3B] h-full flex flex-col items-center py-8">
        </div>

        <div className="w-[240px] bg-[#0D0D0D] h-full flex flex-col">
          <div
            className="px-6 py-10 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 mr-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg className="w-full h-full text-[#CBA26A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-serif font-light tracking-[0.2em] text-[#2B2B2B] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ECHOES OF
                </h1>
                <p className="text-xs font-serif text-[#CBA26A] tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  VIỆT NAM
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-2 flex flex-col justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative w-full text-left text-sm font-sans tracking-wide transition-all duration-300 py-4 px-4 rounded-lg ${
                  currentPage === item.id
                    ? 'text-[#CBA26A] font-semibold bg-[#CBA26A]/5 border-l-4 border-[#CBA26A]'
                    : 'text-[#2B2B2B] hover:text-[#CBA26A] hover:bg-[#CBA26A]/5 hover:translate-x-1'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: currentPage === item.id ? 600 : 400 }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-6 py-8 space-y-6">
            <div>
              <div className="flex items-center text-[#2B2B2B] mb-2">
                <Clock size={16} className="mr-2 text-[#CBA26A]" />
                <span className="text-xs font-sans tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>GIỜ LÀM VIỆC</span>
              </div>
              <p className="text-xs text-[#5A5A5A] leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                T2 - T6: 9:00 - 18:00<br />
                T7 - CN: 10:00 - 16:00
              </p>
            </div>

            <div>
              <p className="text-xs font-sans tracking-wide text-[#2B2B2B] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>KẾT NỐI VỚI CHÚNG TÔI</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#CBA26A]/10 flex items-center justify-center text-[#CBA26A] hover:bg-[#CBA26A] hover:text-white transition-all duration-300"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#CBA26A]/10 flex items-center justify-center text-[#CBA26A] hover:bg-[#CBA26A] hover:text-white transition-all duration-300"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#CBA26A]/10 flex items-center justify-center text-[#CBA26A] hover:bg-[#CBA26A] hover:text-white transition-all duration-300"
                >
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 w-16 h-12 bg-[#B78B3B] items-center justify-center transition-all duration-300 hover:bg-[#CBA26A] ${
          isSidebarOpen ? 'left-[20px]' : 'left-[-64px]'
        }`}
        style={{ borderRadius: '8px' }}
      >
        {isSidebarOpen ? (
          <ChevronLeft size={24} className="text-white" />
        ) : (
          <ChevronRight size={24} className="text-white" />
        )}
      </button>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#FAF9F7] h-[70px] border-b border-[#CBA26A]/10" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage: 'url(/image copy copy.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'auto 80%',
          }}
        ></div>
        <div className="px-4 sm:px-6 relative z-10 h-full">
          <div className="flex items-center justify-between h-full">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 mr-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg className="w-full h-full text-[#CBA26A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-serif font-light tracking-[0.2em] text-[#2B2B2B] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ECHOES OF
                </h1>
                <p className="text-xs font-serif text-[#CBA26A] tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  VIỆT NAM
                </p>
              </div>
            </div>

            <button
              className="text-[#2B2B2B] hover:text-[#CBA26A] transition-all duration-300 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-[#FAF9F7] backdrop-blur-lg animate-slide-in border-t border-[#CBA26A]/20">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
              style={{
                backgroundImage: 'url(/image copy copy.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'auto 70%',
              }}
            ></div>
            <nav className="px-6 py-8 space-y-3 relative z-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base font-sans tracking-wide py-3 transition-all duration-300 rounded-lg px-4 ${
                    currentPage === item.id
                      ? 'text-[#CBA26A] bg-[#CBA26A]/10 font-semibold border-l-4 border-[#CBA26A]'
                      : 'text-[#2B2B2B] hover:text-[#CBA26A] hover:bg-[#CBA26A]/5 hover:translate-x-1'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
