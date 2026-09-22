import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060b14",
          900: "#0a1120",
          800: "#101a2c",
          700: "#172439",
          600: "#233451",
        },
        cream: {
          DEFAULT: "#faf6ec",
          dim: "#f0ead9",
        },
        lime: {
          DEFAULT: "#c3ff4d",
          dim: "#9fe23a",
        },
        status: {
          good: "#3ddc84",
          watch: "#ffc94d",
          bad: "#ff6b6b",
          neutral: "#8fa1b8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        card: "0 20px 60px -20px rgba(0,0,0,0.45)",
        soft: "0 10px 30px -12px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "navy-radial":
          "radial-gradient(circle at 85% -10%, rgba(195,255,77,0.14), transparent 45%), radial-gradient(circle at -10% 30%, rgba(105,167,255,0.10), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
