import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 👈 обязательно для корректной маршрутизации на Render
  plugins: [react()],
})
