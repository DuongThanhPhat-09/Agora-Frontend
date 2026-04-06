import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode, command }) => ({
  plugins: [react()],
  base: mode === "zalo" && command === "build" ? "./" : "/",
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/pages/Admin") ||
            id.includes("/pages/TutorPortal") ||
            id.includes("/pages/TutorFinance") ||
            id.includes("/layouts/AdminLayout") ||
            id.includes("/layouts/TutorPortalLayout")
          ) {
            return "portal-staff";
          }
        },
      },
    },
  },
  server:
    mode !== "zalo"
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:5166",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
}));
