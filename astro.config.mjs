// @ts-check
import { defineConfig } from 'astro/config';

// Het eigen domein. SITE_URL in Cloudflare overschrijft dit (alleen nodig voor een ander adres).
export default defineConfig({
  site: process.env.SITE_URL || 'https://signcoach.nl',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Scripts als los bestand, zodat de Content-Security-Policy (public/_headers) geen inline scripts hoeft toe te staan.
  vite: { build: { assetsInlineLimit: 0 } },
});
