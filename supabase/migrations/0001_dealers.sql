-- GUTSKI.EU — dealers (verkooppunten) voor de store locator
create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  postal_code text,
  country char(2) not null default 'NL',  -- ISO-3166 alpha-2
  lat double precision not null,
  lng double precision not null,
  phone text,
  website text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists dealers_country_idx on public.dealers (country);
create index if not exists dealers_active_idx on public.dealers (active);

alter table public.dealers enable row level security;

-- Publiek: alleen actieve dealers lezen
create policy "Public read active dealers"
  on public.dealers for select
  using (active = true);

-- Ingelogde beheerders: volledige toegang
create policy "Authenticated full access"
  on public.dealers for all
  to authenticated
  using (true)
  with check (true);

-- Seed: eigen winkels
insert into public.dealers (name, address, city, postal_code, country, lat, lng, website) values
  ('Sport 2000 Parkstad', 'Roda J.C. Ring 2B', 'Kerkrade', '6466 NH', 'NL', 50.8663, 6.0570, 'https://sportdiscountshop.com'),
  ('Ski & Outdoor Discountstore', 'Roda J.C. Ring 2B', 'Kerkrade', '6466 NH', 'NL', 50.8666, 6.0574, null);
