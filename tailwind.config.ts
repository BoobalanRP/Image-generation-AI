import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#0f0f12",
          elevated: "#18181c",
          muted: "#27272a",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#a78bfa",
          muted: "#6d28d9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
