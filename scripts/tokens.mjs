// Maakt src/styles/tokens.css uit de tokens van de SignCoach Brand (tokens/signcoach.tokens.json).
// De website gebruikt het lichte thema. Pas kleuren aan in de Brand, kopieer tokens.json opnieuw en draai `npm run tokens`.
import { readFileSync, writeFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('../tokens/signcoach.tokens.json', import.meta.url)));
const lines = [];
const color = Object.fromEntries(t.color.tokens.map((c) => [c.name, c.value.light]));
const resolve = (v) => (typeof v === 'string' && v.startsWith('{') ? `var(--${v.slice(1, -1)})` : v);
for (const [name, v] of Object.entries(color)) lines.push(`  --${name}: ${resolve(v)};`);
for (const [name, v] of Object.entries(t.type.families)) lines.push(`  --font-${name}: ${v};`);
for (const s of t.spacing.tokens) lines.push(`  --${s.name}: ${s.value};`);
for (const r of t.radius.tokens) lines.push(`  --${r.name}: ${r.value};`);
for (const s of t.shadow.tokens) lines.push(`  --${s.name}: ${s.value.light};`);
for (const g of t.type.groups) for (const s of g.styles) {
  lines.push(`  --${s.name}-size: ${s.fontSize};`);
  lines.push(`  --${s.name}-leading: ${s.lineHeight};`);
  lines.push(`  --${s.name}-weight: ${s.fontWeight};`);
}
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url),
  `/* Gegenereerd door scripts/tokens.mjs uit tokens/signcoach.tokens.json. Niet met de hand bewerken. */\n:root {\n${lines.join('\n')}\n}\n`);
console.log(`tokens.css: ${lines.length} variabelen`);
