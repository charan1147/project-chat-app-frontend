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
                target: "http://127.0.0.1:5016", // Explicit IPv4
                changeOrigin: true,
                secure: false,
              },
              "/socket.io": {
                target: "http://127.0.0.1:5016", // Explicit IPv4
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
