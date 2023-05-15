/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DE345E",
        secondary: "#3eb98e",
        secondaryBlack: "#030E17",
        secondaryLightDark: "#071521",
        secondaryGray: "#979797",
        secondaryLightGray: "#CFDBD526",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
