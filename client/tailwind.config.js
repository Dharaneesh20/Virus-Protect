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
                'float': 'float 20s ease-in-out infinite',
                'float-delayed': 'float 20s ease-in-out 10s infinite',
                'drift': 'drift 40s linear infinite',
                'drift-slow': 'drift 60s linear infinite reverse',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-20px) scale(1.05)' },
                },
                drift: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                }
            }
        },
    },
    plugins: [],
}
