import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://github.com/expertcare/AstroThemeUpload.git',
  base: 'AstroThemeUpload',
  buildOptions: {
    // Output the built files into the docs folder
    out: 'docs',
  },
})