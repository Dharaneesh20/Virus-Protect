/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    green: '#39ff14',
                    dark: '#0a0a0a',
                    glass: 'rgba(255, 255, 255, 0.05)',
                }
            },
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'], // Matrix-like font
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'matrix-fade': 'matrixFade 2s ease-in-out infinite',
            },
            keyframes: {
                matrixFade: {
                    '0%, 100%': { opacity: '0.8' },
                    '50%': { opacity: '0.4' },
                }
            }
        },
    },
    plugins: [],
}
