import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://creatorhub.id",
        changeOrigin: true,
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGNyZWF0b3JodWIuaWQiLCJleHAiOjE3ODE5NTAyMTIsImlhdCI6MTc4MTg2MzgxMiwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJyb2xlIjoiYWRtaW4iLCJzdWIiOiIzOTZkNTM2MC03Y2IwLTRlNWMtYWE3OC1lNTJhZGJhODBjODEifQ.6jlXVxY16HCCUj3xmcNWcbTjVpuReLzGxLemu6vX4KM",
        },
      },
    },
  },
});
