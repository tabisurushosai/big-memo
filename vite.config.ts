import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

const outDir = "dist";
const publicDir = "public";
const requiredExtensionFiles = [
  "manifest.json",
  "icons/icon16.png",
  "icons/icon48.png",
  "icons/icon128.png",
];

function requireExtensionAssets(): Plugin {
  let resolvedOutDir = resolve(outDir);

  return {
    name: "require-extension-assets",
    apply: "build",
    configResolved(config) {
      resolvedOutDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const missingFiles = requiredExtensionFiles.filter(
        (filePath) => !existsSync(resolve(resolvedOutDir, filePath)),
      );

      if (missingFiles.length > 0) {
        throw new Error(
          `Missing required Chrome extension assets in ${resolvedOutDir}: ${missingFiles.join(", ")}`,
        );
      }
    },
  };
}

export default defineConfig({
  publicDir,
  plugins: [requireExtensionAssets()],
  build: {
    outDir,
    copyPublicDir: true,
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: "index.html",
    },
  },
});
