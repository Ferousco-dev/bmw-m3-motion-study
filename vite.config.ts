import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages serves this from /bmw-m3-motion-study/, so every asset path has
 * to survive a subpath. Vite rewrites root-relative URLs it can see (index.html
 * links, CSS url()); the frame sequence is built at runtime in timeline.ts and
 * therefore reads import.meta.env.BASE_URL itself.
 */
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/bmw-m3-motion-study/' : '/',
  plugins: [react()],
})
