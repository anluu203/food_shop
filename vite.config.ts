import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';

// Load biến môi trường từ tệp .env
dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5000,
    proxy: {
      "/api": {
        target: "https://theodorescsa.id.vn", // BE gốc
        changeOrigin: true,
        secure: false, // bỏ check SSL (fix được ERR_CERT_COMMON_NAME_INVALID khi dev)
        rewrite: (path) => path.replace(/^\/api/, "/api/app-home/api"),
      },
    },

  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; 
          }
        }
      }
    }
  }
})
