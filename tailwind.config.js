/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5722",       // основной акцент
        secondary: "#FFAD7A",     // вторичный акцент
        block: "#FFEAD2",         // фон блоков
        background: "#F1F1F1",    // общий фон
        white: "#FFFFFF",         // белый
      },
    },
  },
  plugins: [],
}
