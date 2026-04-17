import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        "surface-hover": "var(--color-surface-hover)",
        trust: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        safe: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          700: "#15803d",
        },
        warn: {
          50: "#fefce8",
          100: "#fef9c3",
          500: "#eab308",
          700: "#a16207",
        },
        scam: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          700: "#b91c1c",
        },
        calm: {
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#a855f7",
        },
      },
      fontFamily: {
        display: ["var(--font-lora)", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        body: ["20px", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        "senior-sm": ["1.125rem", { lineHeight: "1.75rem" }],
        "senior-base": ["1.25rem", { lineHeight: "2rem" }],
        "senior-lg": ["1.5rem", { lineHeight: "2.25rem" }],
        "senior-xl": ["1.875rem", { lineHeight: "2.5rem" }],
        "senior-2xl": ["2.25rem", { lineHeight: "2.75rem" }],
      },
      maxWidth: {
        content: "800px",
      },
      spacing: {
        touch: "48px",
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        senior: "12px",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      ringWidth: {
        focus: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
