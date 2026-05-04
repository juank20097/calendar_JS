/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        script: ['"Dancing Script"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
