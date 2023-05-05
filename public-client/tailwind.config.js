/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#DE345E",
        secondary: "#3eb98e",
        secondaryBlack: "#030E17",
        secondaryGray: "#979797",
        secondaryDarkGray: "#94999D",
        secondaryWhite: "#F5F5F5",
      },
      animation: {
        blob: "blob 7s ease-in-out infinite",
        altblob: "altblob 7s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-30px, 50px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        altblob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(0px, 0px) scale(1.2)",
          },
          "66%": {
            transform: "translate(0px, 0px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      transform: ["hover", "focus"],
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
