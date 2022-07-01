module.exports = {
  purge: {
    enabled: false,
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
  },
  darkMode: false,
  theme: {
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      'xl':'500px'
    },
    extend: {
      fontFamily: {
        'sans': ['Source Sans Pro'],
        'serif': ['Source Serif Pro'],
      },
      colors: {
        emmaus: "#2a6266",
        'emmaus-sec':"#FF8A44",
        inzersdorf: "#139b91",
        neustift: "#f4ac11",
        gray: {
          back: "#fbfbfb",
          100: "#f8f8f8",
          200: "#f4f4f4",
          300: "#dddddd",
        },
      },
      height: {
        "xl": "200px",
        "2xl": "400px",
        "3xl": "500px",
      },},
  },
  variants: {
    extend: {
      ringWidth: ['hover']
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}