// @ts-check
import { defineConfig } from 'astro/config';

// Zet SITE_URL in Cloudflare Pages zodra het domein er is (bijvoorbeeld https://signcoach.nl).
export default defineConfig({
  site: process.env.SITE_URL || 'https://signcoachweb.pages.dev',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Scripts als los bestand, zodat de Content-Security-Policy (public/_headers) geen inline scripts hoeft toe te staan.
  vite: { build: { assetsInlineLimit: 0 } },
});
