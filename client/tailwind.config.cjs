/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebarcolor: "#1e0059",
        selectedicon: "#734ae3",
        dark: "#2C3539",
        logoyellow: "#e0a72f",
        logoblue: "#316bb4",
        logopink: "#ba7aae"
      },
      fontFamily: {
        'alkatra': ['Alkatra', 'cursive'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'josefin': ['Josefin Sans', 'sans-serif'],
      },
      backgroundImage: {
        'main': "url('/src/assets/backgroundImage.png')",
      },
    },
    screens: {
      xs: "480px",
      rs: "550px",
      ss: "620px",
      sm: "768px",
      nm: "700px",
      nnm: "850px",
      mm: "950px",
      md: "1060px",
      mdd: "1150px",
      lg: "1200px",
      xl: "1300px",
      xxml: "1380px",
      damnit: "1500px",
      damnitx2: "1600px",
      xxl: "1700px",
      xxxl: "2000px"
    },
  },
  plugins: [],
}