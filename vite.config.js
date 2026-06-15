import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: isDevelopment ? {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        }
      }
    } : undefined,
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            ui: ['@radix-ui/react-label', '@radix-ui/react-tabs', 'lucide-react']
          }
        }
      }
    },
    define: {
      global: 'globalThis',
    },
    // Vercel specific optimizations
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  }
})
