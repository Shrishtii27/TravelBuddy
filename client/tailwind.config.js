/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1e293b', // text-gray-800

        // Primary (rose travel theme)
        primary: {
          DEFAULT: '#f43f5e', // rose-500
          light: '#fb7185', // rose-400
          dark: '#be123c', // rose-700
          foreground: '#ffffff',
        },

        // Secondary accents
        secondary: {
          DEFAULT: '#fde8e8',
          foreground: '#9f1239',
        },

        // Muted, border, input
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#64748b',
        },
        border: '#f1f5f9',
        input: '#f1f5f9',
        ring: '#fb7185',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '16px',
        lg: '12px',
        md: '10px',
        sm: '8px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(244, 63, 94, 0.08)',
        card: '0 4px 20px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
}
