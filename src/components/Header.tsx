import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSidebarToggle: (isOpen: boolean) => void;
};

export default function Header({ currentPage, onNavigate, onSidebarToggle }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    onSidebarToggle(newState);
  };

  const navItems = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'history', label: 'Lịch Sử' },
    { id: 'services', label: 'Dịch Vụ' },
    { id: 'shop', label: 'Cửa Hàng' },
    { id: 'forum', label: 'Cộng Đồng' },
    { id: 'contact', label: 'Liên Hệ' },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-sand-100 to-sand-200 border-r border-bronze-200/30 z-50 transition-all duration-500 ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-16">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-serif text-charcoal-900 tracking-tight hover:text-bronze transition-colors"
            >
              Echoes of Việt Nam
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-6 py-4 text-base tracking-wide transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-bronze text-white font-medium'
                    : 'text-charcoal-700 hover:bg-sand-300/50 hover:text-charcoal-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-bronze-200/30">
            <p className="text-xs text-charcoal-500 tracking-wide leading-relaxed">
              Bảo tồn và lan tỏa giá trị lịch sử văn hóa Việt Nam
            </p>
            <p className="text-xs text-charcoal-400 mt-4">© 2024 Echoes of Việt Nam</p>
          </div>
        </div>
      </aside>

      <button
        onClick={toggleSidebar}
        className={`fixed top-8 z-50 w-12 h-12 bg-charcoal-900 text-white flex items-center justify-center transition-all duration-500 hover:bg-bronze ${
          isSidebarOpen ? 'left-[304px]' : 'left-8'
        }`}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
}
