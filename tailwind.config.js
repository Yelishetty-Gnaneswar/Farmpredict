/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Blue
        secondary: "#10B981", // Green
        darkSlate: "#1F2937",
        lightGray: "#F9FAFB",
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)',
      },
    },
  },
  plugins: [],
}
