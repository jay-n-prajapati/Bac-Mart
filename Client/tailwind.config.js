/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}","node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {},
    screens : {
      'md': '760px',
      'lg': '1440px',
    }
  },
  plugins: [import("flowbite/plugin")],
};
