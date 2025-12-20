import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    proxy: {
      '/api/craft': {
        target: 'https://connect.craft.do',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/craft/, ''),
        secure: false,
      }
    }
  }
})
