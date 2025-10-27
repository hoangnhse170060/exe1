import { useState, useEffect } from 'react';
import { Menu, X, Clock, Facebook, Instagram, Twitter, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSidebarToggle?: (isOpen: boolean) => void;
};

export default function Header({ currentPage, onNavigate, onSidebarToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
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

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <>
      <aside className={`hidden lg:flex fixed top-0 h-screen z-50 transition-all duration-500 ease-in-out overflow-hidden ${
        isSidebarOpen ? 'left-0 w-[340px]' : 'left-[-340px] w-[340px]'
      }`} style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}>
        <div className="w-[90px] h-full flex flex-col items-center py-8 relative overflow-hidden bg-primary-600">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}></div>
          <div className="relative w-full h-full flex flex-col items-center justify-center space-y-8">
            <div className="w-1 h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="w-[250px] h-full flex flex-col relative bg-white border-r border-secondary-100">

          <div
            className="px-7 pt-12 pb-8 cursor-pointer group relative"
            onClick={() => onNavigate('home')}
          >
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative">
                <div className="absolute inset-0 bg-primary-600 opacity-20 rounded-full blur-lg group-hover:opacity-40 transition-opacity duration-500"></div>
                <svg className="w-full h-full text-primary-600 relative z-10 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-serif font-light tracking-[0.25em] text-secondary-900 uppercase leading-tight transition-colors duration-300 group-hover:text-primary-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ECHOES OF
                </h1>
                <p className="text-xs font-serif text-primary-600 tracking-[0.2em] mt-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                  VIỆT NAM
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent"></div>
          </div>

          <nav className="flex-1 px-5 py-10 flex flex-col justify-center space-y-1.5">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative w-full text-left text-[13px] font-sans tracking-[0.08em] transition-all duration-300 py-4 px-5 rounded-xl overflow-hidden ${
                  currentPage === item.id
                    ? 'text-primary-600 font-semibold'
                    : 'text-secondary-600 hover:text-primary-600 font-medium'
                }`}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  transitionDelay: `${index * 30}ms`
                }}
              >
                <div className={`absolute inset-0 transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-primary-100 to-primary-50'
                    : 'bg-transparent group-hover:bg-primary-50'
                }`}></div>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 transition-all duration-300 rounded-r-full ${
                  currentPage === item.id
                    ? 'h-full bg-primary-600'
                    : 'group-hover:h-3/4 bg-primary-400'
                }`}></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative z-10 block transition-transform duration-300 group-hover:translate-x-1.5">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="px-7 pb-10 space-y-7 relative z-10">
            {user && (
              <div className="relative">
                <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent"></div>
                <div className="flex items-start space-x-3 pt-6 group">
                  <div className="mt-0.5">
                    <User size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-sans tracking-[0.1em] text-secondary-600 uppercase block mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Đã đăng nhập
                    </span>
                    <p className="text-xs text-secondary-700 leading-relaxed font-light truncate" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.7' }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-4 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}

            {!user && (
              <div className="relative">
                <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent"></div>
                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all duration-300"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-2.5 px-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 text-xs font-semibold rounded-lg transition-all duration-300"
                  >
                    Đăng Ký
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent"></div>
              <div className="flex items-start space-x-3 pt-6 group cursor-default">
                <div className="mt-0.5">
                  <Clock size={18} className="text-primary-600 group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-sans tracking-[0.1em] text-secondary-600 uppercase block mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Giờ làm việc
                  </span>
                  <p className="text-xs text-secondary-700 leading-relaxed font-light" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.7' }}>
                    <span className="text-primary-600 font-medium">T2 - T6:</span> 9:00 - 18:00<br />
                    <span className="text-primary-600 font-medium">T7 - CN:</span> 10:00 - 16:00
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-sans tracking-[0.1em] text-secondary-600 uppercase mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Kết nối với chúng tôi
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center text-primary-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group overflow-hidden bg-primary-50"
                >
                  <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Facebook size={16} className="relative z-10 group-hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center text-primary-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group overflow-hidden bg-primary-50"
                >
                  <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Instagram size={16} className="relative z-10 group-hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center text-primary-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 group overflow-hidden bg-primary-50"
                >
                  <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Twitter size={16} className="relative z-10 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 w-12 h-20 items-center justify-center transition-all duration-500 group relative overflow-hidden bg-primary-600 hover:bg-primary-700 ${
          isSidebarOpen ? 'left-[340px]' : 'left-0'
        }`}
        style={{
          borderRadius: '0 12px 12px 0',
          boxShadow: '2px 0 16px rgba(220, 38, 38, 0.3)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        {isSidebarOpen ? (
          <ChevronLeft size={22} className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
        ) : (
          <ChevronRight size={22} className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
        )}
      </button>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white h-[70px] border-b border-secondary-200" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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
                <svg className="w-full h-full text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-serif font-light tracking-[0.2em] text-secondary-900 uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ECHOES OF
                </h1>
                <p className="text-xs font-serif text-primary-600 tracking-[0.15em]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  VIỆT NAM
                </p>
              </div>
            </div>

            <button
              className="text-secondary-900 hover:text-primary-600 transition-all duration-300 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-white backdrop-blur-lg animate-slide-in border-t border-secondary-200">
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
                      ? 'text-primary-600 bg-primary-50 font-semibold border-l-4 border-primary-600'
                      : 'text-secondary-900 hover:text-primary-600 hover:bg-primary-50 hover:translate-x-1'
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
