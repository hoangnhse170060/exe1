/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-base': '#F5EFE6',
        'brand-sand': '#E8DFCA',
        'brand-blue': {
          DEFAULT: '#6D94C5',
          50: '#CBDCEB',
          100: '#B7CAE2',
          200: '#A3BAD9',
          300: '#8FA9D0',
          400: '#7B99C7',
          500: '#6D94C5',
          600: '#557FB4',
          700: '#3F689E',
          800: '#2B5084',
          900: '#1B3A69',
        },
        'brand-sky': '#CBDCEB',
        'brand-text': '#2F3A45',
        'brand-muted': '#5F6C7B',
        white: '#FFFFFF',
        transparent: 'transparent',
        'charcoal': {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#8A8A8A',
          400: '#5C5C5C',
          500: '#2D2D2D',
          600: '#1F1F1F',
          700: '#161616',
          800: '#0D0D0D',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(109, 148, 197, 0.35)' },
          '50%': { boxShadow: '0 0 40px rgba(109, 148, 197, 0.55)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(47, 58, 69, 0.05)',
        'medium': '0 4px 25px 0 rgba(47, 58, 69, 0.1)',
        'strong': '0 10px 40px 0 rgba(47, 58, 69, 0.15)',
        'brand': '0 4px 20px 0 rgba(109, 148, 197, 0.35)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(47, 58, 69, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #6D94C5 0%, #CBDCEB 100%)',
      },
    },
  },
  plugins: [],
};
