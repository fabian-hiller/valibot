/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        lexend: ['"Lexend"', ...fontFamily.sans],
        'lexend-exa': ['"Lexend Exa"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
