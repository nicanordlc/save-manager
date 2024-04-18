/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // color pallete (generated)
      // https://mycolor.space/?hex=%23FF9A50&sub=1
      colors: {
        // spot
        "c-sp-100": "#FF9A50",
        "c-sp-200": "#A47353",
        "c-sp-300": "#FFE9D0",
        "c-sp-400": "#005247",
        // shades
        "c-sh-100": "#FF9A50",
        "c-sh-200": "#D2742B",
        "c-sh-300": "#A54F00",
        "c-sh-400": "#7A2C00",
        "c-sh-500": "#540400",
        // highlight
        "c-hl-100": "#FF9A50",
        "c-hl-200": "#663D1F",
        "c-hl-300": "#DFE0DF",
        "c-hl-400": "#402E32",
      },
    },
  },
  plugins: [],
};
