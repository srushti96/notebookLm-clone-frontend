import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "es2020",
    minify: "esbuild",
    treeshake: true,
    cssCodeSplit: true,
    sourcemap: false,
    esbuild: {
      drop: ["console", "debugger"],
    },
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["react-pdf", "pdfjs-dist"],
          icons: ["react-icons"],
        },
      },
    },
  },
});
