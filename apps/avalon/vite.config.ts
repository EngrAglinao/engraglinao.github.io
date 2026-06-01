import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";



// https://vite.dev/config/
export default defineConfig({
  base: 'engraglinao.github.io/apps/avalon/',
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
