/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        etPurple: '#550ECA',
        etBlue: '#1260FE',
        etPink: '#DE0977',
        etLpink: '#F929BB',
        etGray: '#58595B',
        etGray2: '#5C707E',
        etBlack: '#181818',
      },
      fontFamily: {
        kanit: ['"Kanit"', 'sans-serif'],
        kalam: ['"Kalam"', 'cursive'],
        inter: ['"Inter"', 'sans-serif'],
        lato: ['"Lato"', 'sans-serif'],
      },
    },
    screens: {
      'xxxl': { 'max': '1799px' },
      'xxl': { 'max': '1599px' },
      'xl': { 'max': '1399px' },
      'lg': { 'max': '1199px' },
      'md': { 'max': '991px' },
      'sm': { 'max': '767px' },
      'xs': { 'max': '575px' },
      'xxs': { 'max': '479px' },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

// screens: {
//   xs: '480px',
//   sm: '640px',
//   md: '768px',
//   lg: '1024px',
//   xl: '1280px',
//   xxl: '1536px',
// },