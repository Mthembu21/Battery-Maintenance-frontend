export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        epiroc: {
          yellow: '#FFCC00',
          dark: '#333333',
          light: '#F5F5F5',
          white: '#FFFFFF'
        }
      },
      boxShadow: {
        card: '0 8px 20px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
};
