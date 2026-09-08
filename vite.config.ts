import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // As imagens do projeto são usadas por caminhos "src/img/..." no JSX.
  // O publicDir faz o Vite copiá-las para o build de produção.
  publicDir: "src/img",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
