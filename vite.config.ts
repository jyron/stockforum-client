import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    open: true,
    port: 3000,
    ...(command === 'serve' && {
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          secure: true,
          target: 'https://stockforum-server.onrender.com',
        },
      },
    }),
  },
})) 