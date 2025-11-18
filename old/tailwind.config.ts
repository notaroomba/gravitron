import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/tsx/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#264653",
        "light-cyan": "#2A9D8F",
        "yellow-orange": "#F4A261",
        salmon: "#E76F51",
        "medium-blue": "#277da1",
        teal: "#43aa8b",
        "darkish-yellow": "#E9C46A",
        "orange-orange": "#f8961e",
        "really-red": "#f94144",
      },
      keyframes: {
        colorpulse: {
          //red
          "0%": { "text-shadow": "0 0 #f94144" },
          "6.25%": { "text-shadow": "#f94144" },
          "12.5%": { "text-shadow": ".10em .10em #f94144" },
          //orange
          "18.75%": { "text-shadow": "#f8961e" },
          "25%": { "text-shadow": "0 0 #f8961e" },
          "31.25%": { "text-shadow": "#f8961e" },
          "37.5%": { "text-shadow": ".10em .10em #f8961e" },
          //yellow
          "43.75%": { "text-shadow": "#43aa8b" },
          "50%": { "text-shadow": "0 0 #43aa8b" },
          "56.25%": { "text-shadow": "#43aa8b" },
          "62.5%": { "text-shadow": ".10em .10em #43aa8b" },
          //green
          "68.75%": { "text-shadow": "#2A9D8F" },
          "75%": { "text-shadow": "0 0 #2A9D8F" },
          "81.25%": { "text-shadow": "#2A9D8F" },
          "87.5%": { "text-shadow": ".10em .10em #2A9D8F" },
          //blue
          "93.75%": { "text-shadow": "#264653" },
          "100%": { "text-shadow": "0 0 #264653" },
        },
      },
      animation: {
        colorpulse: "colorpulse 10s ease-in-out infinite alternate",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
} satisfies Config;
