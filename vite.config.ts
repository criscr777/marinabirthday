import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const copyProjectImages = (): Plugin => ({
  name: "copy-project-images",
  closeBundle() {
    const source = resolve(process.cwd(), "src/img");
    const destination = resolve(process.cwd(), "dist/src/img");

    if (existsSync(source)) {
      cpSync(source, destination, { recursive: true });
    }
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), copyProjectImages()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
