import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Used by Storybook. The library itself is built with tsup.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
