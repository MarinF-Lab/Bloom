/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

/**
 * Al terminar: pone una versión nueva en el caché del service worker y copia la página a
 * dist/gestion/index.html, la dirección propia de la app de gestión (/gestion/, sin depender del "#").
 */
const postBuild = () => ({
  name: "bloom-post-build",
  closeBundle() {
    const sw = "dist/sw.js";
    if (existsSync(sw)) writeFileSync(sw, readFileSync(sw, "utf8").replace("__BUILD__", String(Date.now())));
    const page = "dist/index.html";
    if (existsSync(page)) {
      mkdirSync("dist/gestion", { recursive: true });
      // Manifest e íconos quedan en la raíz: desde /gestion/ se piden con "../".
      const html = readFileSync(page, "utf8")
        .replace(/(href|src)="\.\/(manifest\.webmanifest|icons\/)/g, '$1="../$2')
        // Se instala como su propia app ("Bloom Gestión"), que abre directo la gestión.
        .replace('href="../manifest.webmanifest"', 'href="../manifest-gestion.webmanifest"')
        .replace('content="Bloom" />', 'content="Bloom Gestión" />')
        .replace(/<title>[^<]*<\/title>/, "<title>Bloom · Gestión</title>")
        // La gestión es privada: que los buscadores no la muestren.
        .replace("<head>", '<head>\n    <meta name="robots" content="noindex, nofollow" />');
      writeFileSync("dist/gestion/index.html", html);
    }
  },
});

// Un solo HTML con JS y CSS en línea: así se publica como artefacto.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile(), postBuild()],
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
