import type { Config } from "tailwindcss";

/**
 * Token warna dibaca dari CSS variable di globals.css supaya mode gelap
 * (prefers-color-scheme) cukup mengganti nilai variabel, tanpa kelas dark:.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        blue: "var(--blue)",
        bluetext: "var(--blue-text)",
        sky: "var(--sky)",
        bg: "var(--bg)",
        mist: "var(--mist)",
        line: "var(--line)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        onblue: "var(--on-blue)",
      },
      fontFamily: {
        heading: ["var(--font-exo)", "system-ui", "sans-serif"],
        body: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "8px",
        lg: "10px",
      },
      maxWidth: {
        prose: "70ch",
      },
      boxShadow: {
        header: "0 1px 0 0 var(--line)",
      },
    },
  },
  plugins: [],
};

export default config;
