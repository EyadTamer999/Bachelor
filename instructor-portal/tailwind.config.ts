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
        primary: "#2B3A67", // Deep Navy Blue
        secondary: "#56CFE1", // Cool Cyan
        accent: {
          orange: "#FF9F45", // Energetic Orange
          green: "#4CAF50", // Lush Green
        },
        neutral: {
          white: "#F8F9FA", // Soft White
          gray: "#A8B2C3", // Mellow Gray
        },
        error: "#F06543", // Soft Red for error states
        text: "#3A3A3A", // Dark Charcoal for text
      },
    },
  },
  plugins: [],
} satisfies Config;
