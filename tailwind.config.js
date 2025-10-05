/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: [
          "Inter_400Regular",
          "Inter_500Medium",
          "Inter_600SemiBold",
          "Inter_700Bold",
          "Inter_800ExtraBold",
          "Inter_900Black",
        ],
      },
    },
  },
  plugins: [],
};
