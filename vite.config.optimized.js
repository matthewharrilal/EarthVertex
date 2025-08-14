import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base configuration
  base: './',
  
  // Build optimization
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      },
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['three'],
          utils: ['./src/utils/Helpers.js', './src/utils/ErrorHandler.js'],
          qa: ['./src/utils/QualityAssurance.js', './src/test-runner.js']
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096
  },
  
  // Development server optimization
  server: {
    port: 5178,
    host: true,
    open: false,
    // Enable HMR optimization
    hmr: {
      overlay: false
    }
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true
  },
  
  // CSS optimization
  css: {
    // Enable CSS modules if needed
    modules: false,
    // PostCSS optimization
    postcss: {
      plugins: [
        // Add autoprefixer for better browser compatibility
        require('autoprefixer')({
          overrideBrowserslist: [
            '> 1%',
            'last 2 versions',
            'not dead'
          ]
        })
      ]
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['three'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify('1.0.0')
  },
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@config': resolve(__dirname, 'src/config'),
      '@shaders': resolve(__dirname, 'src/shaders')
    }
  }
});
