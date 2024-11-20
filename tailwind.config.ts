import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'; // Import the plugin function
import { PluginAPI } from 'tailwindcss/types/config'; //

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // enables dark mode using the "dark" class
  theme: {
    extend: {
      colors: {
        // Organizational Colors
        primary: {
          light: '#77C471', // vibrant green for light mode
          DEFAULT: '#77C471', // primary green
          dark: '#2E5C3D', // deep green for dark mode
        },
        accent: {
          sand: '#EDE6D5', // warm sand for backgrounds
          clay: '#D9BCA4', // muted clay for accents
        },
        neutral: {
          black: '#222222', // charcoal black for primary text
          gray: '#CCCCCC', // light gray for borders/dividers
          taupe: '#C2BEB5', // warm taupe for cards and accents
        },
        // Light Mode Backgrounds
        lightBackground: '#F5F5F3',
        // Dark Mode Backgrounds
        darkBackground: '#1E1E1E',
        darkSlate: '#3A3A3A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // main font for readability
      },
      fontSize: {
        h1: '48px',
        h2: '36px',
        h3: '28px',
        h4: '22px',
        base: '16px',
        small: '14px',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)', // for buttons and cards
      },
      transitionDuration: {
        DEFAULT: '250ms', // smooth hover animations
      },
      animation: {
        marquee: 'marquee 20s linear infinite', // 10s is the scroll speed
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.25)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.3)',
        light: '1px 1px 2px rgba(255, 255, 255, 0.5)', // For light shadows
      },
      scrollbar: {
        hide: {
          '&::-webkit-scrollbar': { display: 'none' },
          '&': { '-ms-overflow-style': 'none', 'scrollbar-width': 'none' },
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus', 'dark'],
      textColor: ['hover', 'focus', 'dark'],
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.text-shadow-sm': { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' },
        '.text-shadow': { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)' },
        '.text-shadow-lg': { textShadow: '5px 5px 7px rgba(0, 0, 0, 0.6)' },
        '.text-shadow-light': { textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' },
      });
    },
  ],
};
export default config;
