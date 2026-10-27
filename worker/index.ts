// Cloudflare Worker voor de SignCoach-site.
// - /api/aanvraag: ontvangt het formulier, slaat het op in Supabase en mailt een melding (als Resend is ingesteld).
// - Al het andere: de statische site uit dist/.
//
// Instellingen (Cloudflare › Workers & Pages › signcoachweb › Settings › Variables and secrets):
//   SUPABASE_URL              staat in wrangler.jsonc
//   SUPABASE_PUBLISHABLE_KEY  de publishable (anon) key van Supabase. Openbaar, maar alleen geldig voor submit_website_request.
//   RESEND_API_KEY            (geheim, later) API-sleutel van Resend. Zonder deze sleutel wordt er niet gemaild.
//   NOTIFY_EMAIL              waar de meldingen heen gaan, bijvoorbeeld rafi@rhymehelper.store
//   MAIL_FROM                 (optioneel) afzender, standaard "SignCoach <onboarding@resend.dev>"

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  MAIL_FROM?: string;
}

interface Ctx { waitUntil: (p: Promise<unknown>) => void }

const KINDS = ['pilot', 'vakman', 'vraag'] as const;
type Kind = (typeof KINDS)[number];
const KIND_LABEL: Record<Kind, string> = { pilot: 'Pilotaanvraag', vakman: 'Aanmelding vakman', vraag: 'Vraag via de site' };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default {
  async fetch(req: Request, env: Env, ctx: Ctx): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === '/api/aanvraag' || url.pathname === '/api/aanvraag/') {
      if (req.method !== 'POST') {
        return new Response('Alleen POST', { status: 405, headers: { Allow: 'POST' } });
      }
      return handleRequest(req, env, ctx, url);
    }
    if (url.pathname === '/api/status') return status(env);
    return env.ASSETS.fetch(req);
  },
};

// Laat zien welke instellingen de Worker ziet (alleen ja/nee, nooit de waarden),
// en of Supabase de functie submit_website_request kent.
async function status(env: Env): Promise<Response> {
  const result: Record<string, unknown> = {
    SUPABASE_URL: !!env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: !!env.SUPABASE_PUBLISHABLE_KEY,
    NOTIFY_EMAIL: !!env.NOTIFY_EMAIL,
    RESEND_API_KEY: !!env.RESEND_API_KEY,
  };
  if (env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY) {
    // Ongeldige aanvraag (soort 'test' bestaat niet): wordt nooit opgeslagen, maar laat zien of de functie bereikbaar is.
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/submit_website_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        ...(env.SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}` } : {}),
      },
      body: JSON.stringify({ p_kind: 'test', p_name: 'status', p_email: 'status@example.com', p_role: null, p_school: null, p_classes: null, p_grade: null, p_message: null }),
    });
    const body = await res.text();
    result.supabase = { status: res.status, ok: res.status === 400 && body.includes('website_requests_kind_check'), message: body.slice(0, 200) };
  }
  return new Response(JSON.stringify(result, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

function redirect(url: URL, path: string): Response {
  return Response.redirect(new URL(path, url.origin).toString(), 303);
}

function text(form: FormData, key: string, max: number): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function handleRequest(req: Request, env: Env, ctx: Ctx, url: URL): Promise<Response> {
  // Alleen formulieren van deze site zelf.
  const origin = req.headers.get('Origin');
  if (origin && origin !== url.origin) return new Response('Verboden', { status: 403 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return redirect(url, '/aanvraag-mislukt/');
  }

  // Spamval: dit veld is onzichtbaar voor mensen. Is het ingevuld, dan doen we alsof het gelukt is.
  if (text(form, 'website', 200)) return redirect(url, '/bedankt/');

  const kind = text(form, 'soort', 20) as Kind;
  const data = {
    p_kind: kind,
    p_name: text(form, 'naam', 100),
    p_email: text(form, 'email', 200).toLowerCase(),
    p_role: text(form, 'functie', 100) || null,
    p_school: text(form, 'school', 150) || null,
    p_classes: null as number | null,
    p_grade: text(form, 'groep', 100) || null,
    p_message: text(form, 'bericht', 2000) || null,
  };
  const classes = Number.parseInt(text(form, 'klassen', 3), 10);
  if (Number.isFinite(classes) && classes >= 1 && classes <= 50) data.p_classes = classes;

  const valid =
    KINDS.includes(kind) &&
    data.p_name.length > 0 &&
    EMAIL_RE.test(data.p_email) &&
    (kind !== 'pilot' || !!data.p_school) &&
    (kind !== 'vraag' || !!data.p_message);
  if (!valid || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) return redirect(url, '/aanvraag-mislukt/');

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/submit_website_request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      ...(env.SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.log('submit_website_request mislukt', res.status, await res.text());
    return redirect(url, '/aanvraag-mislukt/');
  }

  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) ctx.waitUntil(notify(env, kind, data));
  return redirect(url, '/bedankt/');
}

async function notify(env: Env, kind: Kind, d: Record<string, unknown>): Promise<void> {
  const rows: [string, unknown][] = [
    ['Naam', d.p_name], ['E-mail', d.p_email], ['Functie', d.p_role], ['School', d.p_school],
    ['Klassen', d.p_classes], ['Groep of leerjaar', d.p_grade], ['Bericht', d.p_message],
  ];
  const body = rows.filter(([, v]) => v !== null && v !== '').map(([k, v]) => `${k}: ${v}`).join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'SignCoach <onboarding@resend.dev>',
      to: [env.NOTIFY_EMAIL],
      reply_to: d.p_email,
      subject: `${KIND_LABEL[kind]}: ${d.p_school || d.p_name}`,
      text: `${body}\n\nOpgeslagen in Supabase, tabel website_requests.`,
    }),
  });
  if (!res.ok) console.log('Resend mislukt', res.status, await res.text());
}
