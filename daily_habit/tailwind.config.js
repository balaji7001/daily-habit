/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0B0D11",
        card: "#12151C",
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}