/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        panel: 'rgba(10, 18, 34, 0.72)',
        panelStrong: 'rgba(14, 24, 45, 0.92)',
        line: 'rgba(148, 163, 184, 0.18)',
        accent: '#4de1ff',
        accent2: '#8b5cf6',
        accent3: '#22c55e',
      },
      boxShadow: {
        glow: '0 0 40px rgba(77, 225, 255, 0.16)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at 20% 20%, rgba(77, 225, 255, 0.18), transparent 28%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.18), transparent 24%), radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.12), transparent 22%)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.03)' },
        },
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 5s ease-in-out infinite',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};