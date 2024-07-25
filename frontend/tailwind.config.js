
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        editor:'#282a33',
        hover_editor: '#24262b',
        buttonRed:"#FF7777"
      }
    },
  },
  plugins: [],
}
