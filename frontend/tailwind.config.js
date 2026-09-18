/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Page backgrounds
        'pg-canvas':  '#F7F6F3',
        'pg-surface': '#FFFFFF',

        // Border shades
        'ui-border':        '#E5E3DF',
        'ui-border-strong': '#C9C6C0',

        // Text hierarchy
        ink: {
          DEFAULT:   '#1A1917',
          secondary: '#6B6860',
          muted:     '#9C9890',
          inverse:   '#F7F6F3',
        },

        // Primary accent — institutional blue
        accent: {
          DEFAULT: '#0F4C81',
          light:   '#E8F0F8',
          hover:   '#0A3D6B',
          muted:   '#6899C4',
        },

        // App header
        header: {
          bg:     '#1A1917',
          text:   '#F0EEE9',
          muted:  '#8A877F',
          hover:  '#2C2A27',
          active: '#0F4C81',
        },

        // Status colors
        st: {
          success:    '#1A7A4A',
          'success-b':'#EDF7F2',
          warning:    '#A05A00',
          'warning-b':'#FEF6E8',
          danger:     '#C0392B',
          'danger-b': '#FDECEA',
          info:       '#0F4C81',
          'info-b':   '#E8F0F8',
        },
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
        xs:    ['12px', { lineHeight: '18px' }],
        sm:    ['13px', { lineHeight: '20px' }],
        base:  ['14px', { lineHeight: '22px' }],
        md:    ['15px', { lineHeight: '24px' }],
        lg:    ['16px', { lineHeight: '26px' }],
        xl:    ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '30px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['30px', { lineHeight: '38px' }],
      },
      spacing: {
        header: '56px',
      },
      boxShadow: {
        surface:  '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        elevated: '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        modal:    '0 20px 60px 0 rgba(0,0,0,0.18), 0 8px 20px -4px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      animation: {
        'fade-in':   'fadeIn 0.18s ease-out',
        'slide-down':'slideDown 0.2s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(8px)'  }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
