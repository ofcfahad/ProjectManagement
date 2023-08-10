import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config()

const { REACT_APP_SERVER_URL } = process.env

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/server': {
        target: REACT_APP_SERVER_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''),
      },
    },
  },
})
