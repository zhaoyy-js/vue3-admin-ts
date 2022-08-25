import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
  mode: "development",
  server: {
    port: 3000,
    host: "0.0.0.0",
    fs: {
      strict: true,
    },
    proxy: {
      "/": {
        target: "https://fsl.fintify.cn/",
        ws: false,
        changeOrigin: true,
      },
      // "/api": {
      //   target: "http://jsonplaceholder.typicode.com",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    },
  },
});
