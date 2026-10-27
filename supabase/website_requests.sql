-- SignCoach website: aanvragen via de formulieren op de site (pilot, vakman, vraag).
-- Eenmalig uitvoeren in Supabase › SQL Editor (project zjedxlvdeedpkbxzqkpo).
--
-- De website schrijft alleen via submit_website_request (met de publishable key).
-- Niemand kan aanvragen lezen via de API; bekijk ze in Supabase › Table Editor › website_requests.
-- Aanvragen worden na 12 maanden automatisch gewist (pg_cron).

create table if not exists public.website_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        text not null check (kind in ('pilot', 'vakman', 'vraag')),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role        text check (char_length(role) <= 100),
  school      text check (char_length(school) <= 150),
  classes     int  check (classes between 1 and 50),
  grade       text check (char_length(grade) <= 100),
  message     text check (char_length(message) <= 2000),
  handled_at  timestamptz,
  notes       text
);

create index if not exists website_requests_email_created on public.website_requests (email, created_at);

alter table public.website_requests enable row level security;
revoke all on public.website_requests from anon, authenticated;

create or replace function public.submit_website_request(
  p_kind text, p_name text, p_email text, p_role text, p_school text,
  p_classes int, p_grade text, p_message text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Tegen spam: maximaal 3 aanvragen per e-mailadres per uur, en 30 per minuut in totaal.
  if (select count(*) from website_requests
      where email = lower(trim(p_email)) and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Te veel aanvragen van dit e-mailadres' using errcode = 'P0001';
  end if;
  if (select count(*) from website_requests where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Te veel aanvragen' using errcode = 'P0001';
  end if;
  if p_kind = 'pilot' and coalesce(trim(p_school), '') = '' then
    raise exception 'School ontbreekt' using errcode = 'P0001';
  end if;
  if p_kind = 'vraag' and coalesce(trim(p_message), '') = '' then
    raise exception 'Vraag ontbreekt' using errcode = 'P0001';
  end if;

  insert into website_requests (kind, name, email, role, school, classes, grade, message)
  values (
    p_kind, trim(p_name), lower(trim(p_email)), nullif(trim(p_role), ''), nullif(trim(p_school), ''),
    p_classes, nullif(trim(p_grade), ''), nullif(trim(p_message), '')
  );
end;
$$;

revoke all on function public.submit_website_request(text, text, text, text, text, int, text, text) from public;
grant execute on function public.submit_website_request(text, text, text, text, text, int, text, text) to anon;

-- Na 12 maanden automatisch wissen (dagelijks om 03:17).
select cron.unschedule('purge_website_requests')
where exists (select 1 from cron.job where jobname = 'purge_website_requests');
select cron.schedule(
  'purge_website_requests',
  '17 3 * * *',
  $$delete from public.website_requests where created_at < now() - interval '12 months'$$
);
