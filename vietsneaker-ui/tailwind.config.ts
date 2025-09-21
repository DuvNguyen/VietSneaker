import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        colorPrimary: "var(--color-primary)", // Custom primary color (Indigo)
      },
    },
  },
  plugins: [require("daisyui")], // Add DaisyUI here
  daisyui: {
    themes: ['nord', 'light', 'dark', 'wireframe', 'corporate'],
  },
} satisfies Config;
