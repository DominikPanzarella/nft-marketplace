import { heroui } from "@heroui/theme";
import animate from "tailwindcss-animate";

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
        "5xl": "3200px",
        "6xl": "3840px",
      },
      fontFamily: {
        articulat: ["var(--articulat-cf-regular)"],
        articulatDemiBold: ["var(--articulat-cf-demi-bold)"],
        panelSansBold: ["var(--panel-sans-bold)"],
        panelSansMedium: ["var(--panel-sans-medium)"],
        archivo: ["var(--font-archivo)"],
        workSans: ["var(--font-work-sans)"],
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
      },
      colors: {
        gradient: "var(--text-gradient)",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    heroui({
      addCommonColors: true,
      defaultTheme: "light",
      layout: {
        disabledOpacity: 0.5,
        radius: {
          small: "5px",
          medium: "10px",
          large: "15px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        light: {
          extend: "light",
          colors: {
            primary: {
              DEFAULT: "#3545B9",
              foreground: "#fff",
            },
            secondary: {
              foreground: "#fff",
              DEFAULT: "#1E1E1E",
            },
            tertiary: {
              DEFAULT: "#3B3B3B",
              foreground: "#1E1E1E",
            },
            quaternary: {
              DEFAULT: "#858584",
              foreground: "#1E1E1E",
            },
            positive: {
              DEFAULT: "#2CB95C",
            },
            negative: {
              DEFAULT: "#E02020",
            },
            background: {
              primary: "#fff",
              secondary: "#f7f7f7",
            },
          },
        },
        dark: {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#3545B9",
              foreground: "#fff",
            },
            secondary: {
              DEFAULT: "#fff",
              foreground: "#fff",
            },
            tertiary: {
              DEFAULT: "#C4C4C4", // Lighter version of #3B3B3B
              foreground: "#1E1E1E",
            },
            quaternary: {
              DEFAULT: "#A9A9A9", // Lighter version of #858584
              foreground: "#1E1E1E",
            },
            positive: {
              DEFAULT: "#2CB95C",
            },
            negative: {
              DEFAULT: "#E02020",
            },
            background: {
              primary: "#000",
              secondary: "#1E1E1E",
            },
          },
        },
      },
    }),
    animate,
  ],
};
