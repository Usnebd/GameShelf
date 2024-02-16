import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

// https://vitejs.dev/config/

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon.ico",
    "apple-touch-icon.png",
    "masked-icon.svg",
    "assets/data.json",
    "assets/not-available.png",
    "assets/google-icon.svg",
  ],
  strategies: "injectManifest",
  srcDir: "public",
  filename: "sw.ts",
  devOptions: {
    enabled: true,
    type: "module",
  },
  mode: "development",
  manifest: {
    name: "My Chiosco",
    short_name: "My Chiosco",
    icons: [
      {
        src: "/assets/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/assets/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    description: "React web app for ordering food",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  build: {
    emptyOutDir: true,
  },
});
