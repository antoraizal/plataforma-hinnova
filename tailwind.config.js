/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plomo: {
          50: "#f6f6f7",
          100: "#eceef0",
          200: "#d7dbdf",
          300: "#b7bec5",
          400: "#8f99a3",
          500: "#707c88",
          600: "#59636d",
          700: "#49515a",
          800: "#3d434a",
          900: "#2b2f34",
        },
        azul: {
          50: "#eef5ff",
          100: "#d9e8ff",
          400: "#4a90e2",
          500: "#2f6fce",
          600: "#2158a8",
          700: "#1c477f",
        },
        amarillo: {
          100: "#fff8e1",
          200: "#ffedb3",
          300: "#ffe085",
          400: "#ffd35c",
        },
      },
    },
  },
  plugins: [],
};
