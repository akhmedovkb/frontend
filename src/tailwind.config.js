/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF5722",
          secondary: "#FFAD7A",
          background: "#FFEAD2",
          surface: "#F1F1F1",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}
