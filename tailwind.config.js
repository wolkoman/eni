module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
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
      animation: {
        colorful: 'colorful 1s ease-out 0s 1 normal both running',
      },
      keyframes: {
        colorful: {
          '0%': { transform: 'scale(300%)', filter: 'saturate(80%)' },
          '100%': { transform: 'scale(100%)', filter: 'saturate(125%)' },
        }
      },
      backgroundImage: {
        'gradient': "url('/bg-grad.svg')",
        'gradient-mobile': "url('/bg-grad-mobile.svg')",
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
  }
}