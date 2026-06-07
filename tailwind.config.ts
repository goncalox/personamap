import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f4f0e8",
        coal: "#10120f",
        moss: "#6f7f4f",
        brass: "#c6a15b",
        wine: "#8f4256",
        ocean: "#477b8e",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(244,240,232,0.08), 0 24px 80px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
