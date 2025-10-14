/** @type {import('tailwindcss').Config} */
const { platformSelect } = require("nativewind/theme");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
<<<<<<< HEAD
        inter: ["Inter_400Regular"],
=======
        interRegular: ["Inter_400Regular"],
>>>>>>> a083fd422cff033bdbb2fe3b3796a6c850288f39
        interMedium: ["Inter_500Medium"],
        interSemiBold: ["Inter_600SemiBold"],
        interBold: ["Inter_700Bold"],
      },
      colors: {
        // Primary
        primary: "#E39400",
        primary2nd: "#FCBC03",
        primary3rd: "#FFD661",
        primary4th: "#F5F2E7",

        // Tersier
        tersier: "#4C13A2",
        tersier2nd: "#01C1D6",

        // Neutral
        neutral50: "#F8FAFC",
        neutral100: "#F1F5F9",
        neutral300: "#CBD5E1",
        neutral500: "#64748B",
        neutral700: "#334155",
        neutral900: "#0F172A",

        // Alert Colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",

        // Other
        white: "#FFFFFF",
        black: "#181818",
      },
    },
  },
  plugins: [],
};
