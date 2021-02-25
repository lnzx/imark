const { resolve } = require('path')

module.exports = {
    base: "",
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist/imark',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'background': 'background.js'
        },
        output: {
          entryFileNames: 'assets/[name].js'
        }
      }
    }
}