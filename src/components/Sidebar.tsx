import { useState } from 'react';
import { Menu, X, Facebook, Youtube, Instagram, Clock } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'history', label: 'HISTORY', subItems: ['French Era', 'American Era'] },
    { id: 'shop', label: 'SHOP' },
    { id: 'forum', label: 'FORUM' },
    { id: 'services', label: 'SERVICES' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: MessageSquare, label: 'TikTok', url: '#' },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 w-14 h-14 flex items-center justify-center bg-[#f5f1e8]/95 hover:bg-vietnam-gold-200 transition-colors duration-300 group shadow-soft"
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <X className="text-charcoal-900 transition-colors" size={24} />
        ) : (
          <Menu className="text-charcoal-900 transition-colors" size={24} />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-[30%] min-w-[320px] max-w-[400px] z-40 transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sidebar-elegant`}
      >
        <div className="flex h-full">
          <div className="flex-1 flex flex-col px-10 py-12 relative">
            <div className="mb-12">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-all duration-300 hover:scale-110 z-10"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>

              <div
                className="cursor-pointer group pt-8"
                onClick={() => handleNavigation('home')}
              >
                <div className="w-10 h-10 mb-4 flex items-center justify-center">
                  <Clock className="text-[#c4a676]" size={32} />
                </div>
                <h1 className="text-xl font-display text-charcoal-900 tracking-wider leading-snug uppercase">
                  ECHOES OF<br />VIỆT NAM
                </h1>
              </div>
            </div>

            <nav className="flex-1 flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`group relative text-left py-1.5 font-serif text-base tracking-wide uppercase transition-all duration-300 ${
                      currentPage === item.id
                        ? 'text-charcoal-900 menu-item-active-elegant'
                        : 'text-charcoal-800 hover:text-[#c4a676] menu-item-elegant'
                    }`}
                  >
                    {item.label}
                  </button>
                  {'subItems' in item && (
                    <div className="ml-4 mt-1.5 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem}
                          className="block text-left text-charcoal-600 text-sm py-0.5 hover:text-[#c4a676] transition-colors duration-300"
                        >
                          - {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="space-y-6">
              <div className="text-charcoal-600 text-xs space-y-2">
                <div>
                  <p className="mb-0.5">Mon–Thu: <span className="text-charcoal-900 font-medium">8:00–17:00</span></p>
                </div>
                <div>
                  <p className="mb-0.5">Fri–Sun: <span className="text-charcoal-900 font-medium">8:00–18:00</span></p>
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                {socialLinks.slice(0, 3).map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="text-charcoal-500 hover:text-[#c4a676] transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#c4a676]/30 to-transparent"></div>

          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-vietnam-black/80 backdrop-blur-sm z-30 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
