/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // 粗氣丸東京 品牌色（向後相容）
                sausage: {
                    50: '#FFF0F5',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                // 夜櫻深色
                night: {
                    bg: '#1a1016',
                    card: '#2d1f26',
                    text: '#fce7f3',
                },
                // 功能色
                sync: {
                    online: '#86efac',
                    syncing: '#f472b6',
                    offline: '#d6d3d1',
                },
            },
            fontFamily: {
                sans: ['Noto Sans TC', 'Noto Sans JP', 'sans-serif'],
                jp: ['Noto Sans JP', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                bold: '700',
                black: '900',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'pink': '0 4px 16px rgba(236, 72, 153, 0.2)',
                'pink-md': '0 8px 24px rgba(236, 72, 153, 0.25)',
                'pink-lg': '0 16px 40px rgba(236, 72, 153, 0.3)',
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(15px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'contract-in': {
                    from: { opacity: '0', transform: 'scale(0.85) translateY(20px)' },
                    to: { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-100%)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'pulse-pink': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 114, 182, 0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(244, 114, 182, 0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'contract': 'contract-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'pulse-pink': 'pulse-pink 1.5s ease-in-out infinite',
            },
        }
    },
    plugins: [],
}
