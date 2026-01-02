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
        border: "var(--border-default)",
        input: "var(--border-default)",
        ring: "var(--accent-green)",
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-green)",
          foreground: "var(--bg-base)",
        },
        secondary: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--bg-elevated)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--bg-overlay)",
          foreground: "var(--text-primary)",
          green: "var(--accent-green)",
          blue: "var(--accent-blue)",
          purple: "var(--accent-purple)",
          amber: "var(--accent-amber)",
          rose: "var(--accent-rose)",
          orange: "var(--accent-orange)",
        },
        popover: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        // Legacy/Custom structure (keeping for compatibility)
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          overlay: "var(--bg-overlay)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        // Functional
        status: {
          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
          info: "var(--info)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "glow-green": "var(--shadow-glow-green)",
        "glow-blue": "var(--shadow-glow-blue)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
    },
  },
  plugins: [],
};
export default config;
