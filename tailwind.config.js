/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}', // Include lib directory for styles.ts
  ],
  safelist: [
    // Ensure gradient classes from styles.ts are never purged
    'bg-gradient-to-br',
    'from-orange-50', 'from-orange-100', 'from-orange-200', 'from-orange-300', 'from-orange-400', 'from-orange-500',
    'to-red-50', 'to-red-100', 'to-red-200', 'to-red-300', 'to-red-400', 'to-red-500',
    'to-amber-50', 'to-amber-100', 'to-amber-200', 'to-amber-300', 'to-amber-400', 'to-amber-500',
    'via-amber-50', 'via-amber-100', 'via-amber-200', 'via-amber-300', 'via-amber-400', 'via-amber-500',
    'to-yellow-50', 'to-yellow-100', 'to-yellow-200', 'to-yellow-300', 'to-yellow-400', 'to-yellow-500',
    // Solid background classes
    'bg-orange-50', 'bg-orange-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500',
  ],
  theme: {
    extend: {
      colors: {
        service: {
          bg: 'var(--service-bg)',
          'bg-elevated': 'var(--service-bg-elevated)',
          'bg-strong': 'var(--service-bg-strong)',
          border: 'var(--service-border)',
          'border-strong': 'var(--service-border-strong)',
          'text-primary': 'var(--service-text-primary)',
          'text-secondary': 'var(--service-text-secondary)',
          'text-tertiary': 'var(--service-text-tertiary)',
          accent: 'var(--service-accent)',
          'accent-hover': 'var(--service-accent-hover)',
          success: 'var(--service-success)',
          warning: 'var(--service-warning)',
          error: 'var(--service-error)',
        },
        // Hand-drawn, playful color palette inspired by "Baba Is You"
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        accent: {
          50: '#fdf2f8',
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
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        // Custom fonts for hand-drawn aesthetic (will be added later)
        'crayon': ['Comic Sans MS', 'cursive'], // Placeholder until custom fonts are added
        'playful': ['Comic Sans MS', 'Marker Felt', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'puff': 'puff 0.5s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        puff: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'crayon': '15px 25px 20px 30px', // Irregular, hand-drawn style borders
      },
    },
  },
  plugins: [],
}

