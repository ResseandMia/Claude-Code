/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-bg': '#ffffff',
        'notion-hover': '#f7f6f3',
        'notion-border': '#e9e9e7',
        'notion-text': '#37352f',
        'notion-secondary': '#787774',
      }
    },
  },
  plugins: [],
}
