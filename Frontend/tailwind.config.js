/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#6b7280",
        danger: "#ef4444",
        success: "#10b981",
      },
    },
  },
  plugins: [],
};
