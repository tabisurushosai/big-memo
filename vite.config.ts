import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

const outDir = "dist";
const requiredExtensionFiles = [
  "manifest.json",
  "icons/icon16.png",
  "icons/icon48.png",
  "icons/icon128.png",
];

function requireExtensionAssets(): Plugin {
  return {
    name: "require-extension-assets",
    apply: "build",
    closeBundle() {
      const missingFiles = requiredExtensionFiles.filter(
        (filePath) => !existsSync(resolve(outDir, filePath)),
      );

      if (missingFiles.length > 0) {
        throw new Error(
          `Missing required Chrome extension assets in ${outDir}: ${missingFiles.join(", ")}`,
        );
      }
    },
  };
}

export default defineConfig({
  publicDir: "public",
  plugins: [requireExtensionAssets()],
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: "index.html",
    },
  },
});
