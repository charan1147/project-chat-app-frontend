import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      nodePolyfills({
        globals: { global: true },
        crypto: true,
      }),
    ],
    server:
      mode === "development"
        ? {
            proxy: {
              "/api": {
                target: process.env.VITE_BACKEND_URL || "http://localhost:5016",
                changeOrigin: true,
                secure: false,
              },
              "/socket.io": {
                target: process.env.VITE_BACKEND_URL || "http://localhost:5016",
                ws: true,
              },
            },
          }
        : {},
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
});
