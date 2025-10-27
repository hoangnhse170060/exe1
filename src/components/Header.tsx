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
      <aside className={`hidden lg:flex fixed top-0 h-screen z-50 transition-all duration-500 ease-in-out overflow-hidden ${
        isSidebarOpen ? 'left-0 w-[240px]' : 'left-[-240px] w-[240px]'
      }`}>
        <div className="w-[60px] h-full relative" style={{
          background: '#B78B3B'
        }}>
        </div>

        <div className="w-[180px] h-full flex flex-col relative bg-black">

          <div
            className="px-4 pt-8 pb-6 cursor-pointer group relative"
            onClick={() => onNavigate('home')}
          >
            <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <svg className="w-full h-full text-[#CBA26A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-xs font-serif tracking-[0.15em] text-white/70 uppercase leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ECHOES OF
                </h1>
                <p className="text-xs font-serif text-[#CBA26A] tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  VIỆT NAM
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-8 flex flex-col justify-center space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative w-full text-center text-[11px] font-sans tracking-[0.05em] transition-all duration-200 py-3.5 ${
                  currentPage === item.id
                    ? 'text-[#CBA26A]'
                    : 'text-[#5A5A5A] hover:text-white/80'
                }`}
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <span className="relative z-10 block">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="px-3 pb-8 space-y-5 relative z-10">
            <div className="relative">
              <div className="flex flex-col items-center group cursor-default">
                <Clock size={16} className="text-[#CBA26A] mb-2" />
                <span className="text-[9px] font-sans tracking-[0.08em] text-[#5A5A5A] uppercase block mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  GIỜ LÀM VIỆC
                </span>
                <p className="text-[10px] text-white/60 leading-relaxed text-center" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.6' }}>
                  T2 - T6: 9:00 - 18:00<br />
                  T7 - CN: 10:00 - 16:00
                </p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-sans tracking-[0.08em] text-[#5A5A5A] uppercase mb-3 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                KẾT NỐI VỚI CHÚNG TÔI
              </p>
              <div className="flex justify-center space-x-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 hover:text-[#CBA26A] transition-colors duration-300"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 hover:text-[#CBA26A] transition-colors duration-300"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 hover:text-[#CBA26A] transition-colors duration-300"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 w-10 h-16 items-center justify-center transition-all duration-500 bg-[#B78B3B] hover:bg-[#CBA26A] ${
          isSidebarOpen ? 'left-[240px]' : 'left-0'
        }`}
        style={{
          borderRadius: '0 8px 8px 0'
        }}
      >
        {isSidebarOpen ? (
          <ChevronLeft size={20} className="text-white" />
        ) : (
          <ChevronRight size={20} className="text-white" />
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
