import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/

const manifest = {
  registerType: "prompt" as const,
  includeAssests: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "My-Chiosco",
    short_name: "My-Chiosco",
    description: "react web app for food",
    icons: [
      {
        src: "src/assets/favicon.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "favicon",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait" as const,
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifest as any)],
});
