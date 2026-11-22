import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        charcoal: "#151515",
        gold: "#D9AA42",
        mutedGold: "#B58B32"
      }
    }
  },
  plugins: []
};

export default config;
