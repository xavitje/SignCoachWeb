# SignCoach website

De website van SignCoach: Nederlandse Gebarentaal leren in de klas. Gebouwd met [Astro](https://astro.build) als statische site, gehost op Cloudflare Pages.

## Lokaal draaien

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # bouwt naar dist/
```

## Hoe het in elkaar zit

| Map of bestand | Wat |
| --- | --- |
| `tokens/signcoach.tokens.json` | Kopie van de tokens uit de SignCoach Brand. `npm run tokens` maakt er `src/styles/tokens.css` van (gebeurt automatisch bij `dev` en `build`). |
| `src/styles/global.css` | Basisopmaak, knoppen, kleurvelden en lettertypes (zelf gehost via Fontsource, dus geen Google Fonts). |
| `src/pages/` | De pagina's: home, voor-scholen, voor-docenten, over, voor-vakmensen, pilot-aanvragen, privacy, plus bedankt, aanvraag-mislukt en 404. |
| `src/components/` | Header, footer, *Spel je naam*, de schermen van een les en het aanvraagformulier (`RequestForm.astro`). |
| `worker/index.ts` | Cloudflare Worker: `/api/aanvraag` ontvangt de formulieren, slaat ze op in Supabase en mailt een melding via Resend. Alles anders is de statische site. |
| `supabase/website_requests.sql` | De tabel en functie voor de formulieren. Eenmalig uitvoeren in de Supabase SQL Editor. |
| `src/content/documenten/` | De privacydocumenten als Markdown. Pas de tekst hier aan; de privacypagina toont ze als documenten. Zet `status: definitief` als de jurist ze heeft goedgekeurd, dan verdwijnt de conceptmelding. |
| `public/handen/` | De 26 handvormen van het vingeralfabet (WebP). |
| `public/_headers` | Beveiligingsheaders voor Cloudflare Pages, waaronder een Content-Security-Policy zonder inline scripts. |

## Cloudflare

De site draait als Cloudflare Worker met statische bestanden (`wrangler.jsonc`). Instellingen in Workers & Pages › signcoachweb › Settings › Builds:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: **leeg laten**
- Build variable: `NODE_VERSION` = `22`

Elke push naar `main` gaat live. `public/_headers` zet de beveiligingsheaders.

### Formulieren

1. Voer `supabase/website_requests.sql` uit in Supabase › SQL Editor.
2. Zet in Cloudflare › signcoachweb › Settings › Variables and secrets (type *Text*):
   - `SUPABASE_PUBLISHABLE_KEY`: de publishable key uit Supabase › Project Settings › API Keys (begint met `sb_publishable_`).
   - `NOTIFY_EMAIL`: waar meldingen heen gaan, nu `rafi@rhymehelper.store`.
3. Later, voor e-mailmeldingen: maak een Resend-account met het adres van `NOTIFY_EMAIL`, maak een API-sleutel en zet die als `RESEND_API_KEY` (type *Secret*). Zonder sleutel worden aanvragen wel opgeslagen, maar niet gemaild. Met een eigen domein bij Resend zet je ook `MAIL_FROM`, bijvoorbeeld `SignCoach <pilot@signcoach.nl>`.

Aanvragen staan in Supabase › Table Editor › `website_requests` en worden na 12 maanden automatisch gewist.

Lokaal testen: `npm run build` en dan `npx wrangler dev --var SUPABASE_PUBLISHABLE_KEY:<sleutel>`.

## Afspraken

- **Wat er niet is, komt niet op de site.** Geen voorbeeldnamen, nep-logo's, verzonnen uitspraken of cijfers. De partnerschool, uitspraken van docenten en pilotcijfers komen erbij zodra ze echt bestaan.
- Volg de SignCoach Brand: witte grond, plum-velden, coral alleen op de pilotknop, tekst op coral altijd donker (`--on-accent`).
- Toegankelijk volgens WCAG 2.2 AA. Controleer nieuwe pagina's met axe op desktop- en telefoonbreedte.
- Geen tracking en geen cookies, dus geen cookiebanner nodig.

## Nog te doen

- [ ] Formulieren aanzetten: SQL uitvoeren en de sleutels in Cloudflare zetten (zie Formulieren). Resend koppelen.
- [ ] Een korte tekst over de maker voor de pagina *Over*, en bedrijfsgegevens (KvK) zodra die er zijn.
- [ ] *Voorwaarden* en *Thuis leren*: pas als ze er zijn.
- [ ] De onderbouwing bij *Waarom gebarentaal* (Voor scholen) laten nakijken.
- [ ] Domeinnaam en `SITE_URL`.
- [ ] Privacydocumenten na controle door de jurist. Nog niet op de site omdat ze ontbreken: KvK-nummer en contactadres van de leverancier, de bewaartermijn van de Supabase-inloglogs, de back-uptermijn, en de grondslag (die bepaalt de school).
- [ ] Laat een vakman de 26 handvormen controleren. Volgens het handalfabet van Het Gebarenhuis wijken C, E, H, P, Q, W, X en Y af.
