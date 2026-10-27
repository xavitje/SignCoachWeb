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
| `src/pages/` | De pagina's: `index.astro` (home), `privacy/index.astro`, `404.astro`. |
| `src/components/` | Header, footer, *Spel je naam* en de schermen van een les. |
| `src/content/documenten/` | De privacydocumenten als Markdown. Pas de tekst hier aan; de privacypagina toont ze als documenten. Zet `status: definitief` als de jurist ze heeft goedgekeurd, dan verdwijnt de conceptmelding. |
| `public/handen/` | De 26 handvormen van het vingeralfabet (WebP). |
| `public/_headers` | Beveiligingsheaders voor Cloudflare Pages, waaronder een Content-Security-Policy zonder inline scripts. |

## Cloudflare Pages

Koppel de repository in Cloudflare (Workers & Pages › Create › Pages › Connect to Git) met:

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `NODE_VERSION` = `22`, en zodra het domein er is `SITE_URL` = `https://signcoach.nl`

Elke push naar `main` gaat live; elke andere branch krijgt een eigen preview-link.

## Afspraken

- **Wat er niet is, komt niet op de site.** Geen voorbeeldnamen, nep-logo's, verzonnen uitspraken of cijfers. De partnerschool, uitspraken van docenten en pilotcijfers komen erbij zodra ze echt bestaan.
- Volg de SignCoach Brand: witte grond, plum-velden, coral alleen op de pilotknop, tekst op coral altijd donker (`--on-accent`).
- Toegankelijk volgens WCAG 2.2 AA. Controleer nieuwe pagina's met axe op desktop- en telefoonbreedte.
- Geen tracking en geen cookies, dus geen cookiebanner nodig.

## Nog te doen

- [ ] Pilotformulier (stap 4): opslaan in Supabase (Frankfurt), mail naar het pilotadres. Tot die tijd opent de knop een e-mail.
- [ ] Pagina's *Voor scholen*, *Voor docenten*, *Over*, *Pilot aanvragen*, *Voor vakmensen*, *Privacyverklaring* en *Voorwaarden*. Het menu linkt nu naar de delen op de homepage.
- [ ] Domeinnaam en `SITE_URL`.
- [ ] Privacydocumenten na controle door de jurist. Nog niet op de site omdat ze ontbreken: KvK-nummer en contactadres van de leverancier, de bewaartermijn van de Supabase-inloglogs, de back-uptermijn, en de grondslag (die bepaalt de school).
- [ ] Laat een vakman de 26 handvormen controleren. Volgens het handalfabet van Het Gebarenhuis wijken C, E, H, P, Q, W, X en Y af.
