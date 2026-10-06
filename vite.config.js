import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { PAGINI } from './scripts/pagini.mjs';

// multi-page: acasă + câte un index.html pe fiecare pagină de serviciu (generate de scripts/genereaza.mjs)
const input = { acasa: resolve(import.meta.dirname, 'index.html') };
for (const p of PAGINI) input[p.slug] = resolve(import.meta.dirname, p.slug, 'index.html');

export default defineConfig({ base: './', build: { outDir: 'dist', assetsInlineLimit: 0, rollupOptions: { input } } });
