import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/harbor-and-hollow/",
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL("../dist/harbor-and-hollow", import.meta.url)),
    emptyOutDir: true,
  },
});
