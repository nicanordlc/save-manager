/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // color pallete (generated)
      // https://mycolor.space/?hex=%23FF9A50&sub=1
      colors: {
        // shades
        main: {
          100: "#FF9A50",
          200: "#D2742B",
          300: "#A54F00",
          400: "#7A2C00",
          500: "#540400",
        },
      },
    },
  },
  plugins: [],
});
