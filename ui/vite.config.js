import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 빌드 최적화
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  // 프리뷰 서버 설정 (배포용)
  preview: {
    port: process.env.PORT || 3000,
    host: true,
  },
})
