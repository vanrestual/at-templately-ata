const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./*.html', './**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '320px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        content: colors.gray,
        primary: colors.indigo,
        secondary: colors.blue,
        success: colors.green,
        info: colors.cyan,
        warning: colors.amber,
        danger: colors.red
      },
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans]
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    float: false
  }
};
