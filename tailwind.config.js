/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        charcoal: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#BDBDBD',
          400: '#919191',
          500: '#6B6B6B',
          600: '#4F4F4F',
          700: '#3A3A3A',
          800: '#2A2A2A',
          900: '#1C1C1C',
        },
        sand: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F1EA',
          300: '#EDE5D8',
          400: '#E0D3C0',
          500: '#CFBDA6',
          600: '#B8A389',
        },
        bronze: {
          50: '#FBF7F2',
          100: '#F7EDE0',
          200: '#EDD9C2',
          300: '#DABF9A',
          400: '#C29D6B',
          500: '#A67C52',
          600: '#8B6742',
          700: '#6E5236',
          DEFAULT: '#A67C52',
        },
        slate: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'elegant-xl': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'bronze': '0 8px 25px rgba(166, 124, 82, 0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'fade-up': 'fadeUp 1s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      backgroundImage: {
        'gradient-bronze': 'linear-gradient(135deg, #A67C52 0%, #C29D6B 100%)',
        'gradient-slate': 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
