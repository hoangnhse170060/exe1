import { Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
  ];

  return (
  <footer className="bg-brand-blue text-white border-t border-brand-blue/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="text-white hover:text-brand-sand transition-colors duration-300"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>

          <div className="text-center">
            <p className="text-brand-sand font-serif text-sm mb-2">
              Nơi quá khứ ngân vang trong từng hơi thở hiện đại
            </p>
            <p className="text-white/70 text-xs">
              © 2025 Try Your Best – Echoes of Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
