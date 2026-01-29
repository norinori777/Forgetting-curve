/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      height: {
        '87vh': '87vh',
        '80vh': '80vh',
      },
      maxWidth: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "3/4": "75%",
      },
      screens: {
        'max-sm': {max: '640'},
        'max-md': {max: '768px'},
        'max-lg': {max: '1024px'},
        'max-xl': {max: '1280x'},
        'max-2xl': {max: '1536px'},
        'max-3xl': {max: '1920px'},
        'max-4xl': {max: '2560px'},
        'max-5xl': {max: '3840px'},
        'max-6xl': {max: '4096px'},
        'max-7xl': {max: '5120px'},
      },
      width:{
        "container-sm": "400px",
        "container-md": "540px",
        "container-lg": "720px",
        "container-xl": "960px",
        "container-2xl": "1140px",
        "container-3xl": "1320px",
        "container-4xl": "1500px",
        "container-5xl": "1680px",
        "container-6xl": "1860px",
        "container-7xl": "2040px",
      },
      colors: {
        primary: {
          light: "#51bcff",
          default: "#1ea7fd",
          dark: "#1a93dd",
        },
        secondary: {
          light: "#f9a8d4",
          default: "#ec4899",
          dark: "#be185d",
        },
        success: {
          light: "#86efac",
          default: "#22c55e",
          dark: "#15803d",
        },
        danger: {
          light: "#fca5a5",
          default: "#ef4444",
          dark: "#b91c1c",
        },
        warning: {
          light: "#fde047",
          default: "#eab308",
          dark: "#a16207",
        },
        normal: {
          light: "#f8fafc",
          default: "#e2e8f0",
          dark: "#94a3b8",
        },
        lightPrimary: {
          light: "#d9eefc",
          default: "#c7e6f9",
          dark: "#b0dffc",
        },
        lightSecondary: {
          light: "#fff2f9",
          default: "#fce3f0",
          dark: "#fcd9eb",
        },
        lightSuccess: {
          light: "#d9fce5",
          default: "c5f7d7",
          dark: "#b5e2c6",
        },
        lightDanger: {
          light: "#f9e8e8",
          default: "#f9e0e0",
          dark: "#fce0e0",
        },
        lightWarning: {
          light: "#fcf8e3",
          default: "#fcf5d4",
          dark: "#fff7d1",
        },
        lightNormal: {
          light: "#eff5fc",
          default: "#e5effc",
          dark: "#deebfc",
        },
      },
    },
  },
  purge: {
    options: {
      safelist: ['z-10', 'z-20', 'z-30', 'z-40', 'z-50'],
    },
  },
  plugins: [],
};
