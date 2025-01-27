/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sen: ['Sen', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite"
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)",},
          "33%": {transform: "translate(-30px, -120px) scale(1.1)",},
          "66%": {transform: "translate(30px, -80px) scale(0.9)",},
          "100%": {transform: "tranlate(0px, 0px) scale(1)",}
        }
      },
    },
  },
  plugins: [],
}

