/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        ink: '#0d0d0d',
        surface: '#141414',
        card: '#1c1c1c',
        border: '#2a2a2a',
        gold: '#c8a96e',
        'gold-light': '#e8c98e',
        muted: '#666666',
        soft: '#aaaaaa'
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        shimmer: 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      }
    }
  },
  plugins: []
}
