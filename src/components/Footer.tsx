import { Facebook, Youtube, Instagram } from 'lucide-react';

type FooterProps = {
  isSidebarOpen?: boolean;
};

export default function Footer({ isSidebarOpen = true }: FooterProps) {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
  ];

  return (
    <footer className={`bg-vietnam-black border-t border-vietnam-red/20 py-8 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="text-vietnam-white hover:text-vietnam-red transition-colors duration-300"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>

          <div className="text-center">
            <p className="text-vietnam-gold font-serif text-sm mb-2">
              Nơi quá khứ ngân vang trong từng hơi thở hiện đại
            </p>
            <p className="text-vietnam-white/60 text-xs">
              © 2025 Try Your Best – Echoes of Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
