/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      colors:{
        primary: '#48CFCB',
        secondary: '#64748b',
        third: '#F5F5F5',
        teks: '#64748b',
        dark: '#0f172a',
      },
      screens: {
        '2xl': '1320px', 

      }

    },
  },
  plugins: [],
}

