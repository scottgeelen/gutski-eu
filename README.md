# GUTSKI.EU — Merksite & Store Locator

Next.js 15 (App Router) · Supabase · Vercel · Cloudflare
Drietalig: **NL op de root**, `/de` en `/en` als subfolders (incl. hreflang, sitemap, robots).

## Structuur

- `app/(site)/[locale]/` — publieke site (hero, merkverhaal, Livigno-shoot, collectie, configurator-teaser, store locator, groepen)
- `app/(admin)/admin/` — dealerbeheer (Supabase Auth, e-mail + wachtwoord)
- `supabase/migrations/0001_dealers.sql` — dealers-tabel + RLS + seed (Sport 2000 Parkstad, Ski & Outdoor)
- `dictionaries/{nl,de,en}.json` — alle teksten per taal
- Store locator: landenfilter wordt **dynamisch** opgebouwd uit de dealers in de database

## Setup

### 1. Supabase
1. Maak een project aan op supabase.com (regio: eu-central)
2. Draai `supabase/migrations/0001_dealers.sql` in de SQL Editor
3. Authentication → Users → "Add user": maak jouw admin-account aan (e-mail + wachtwoord, "Auto confirm" aan)
4. Kopieer Project URL + anon key naar `.env.local` (zie `.env.example`)

### 2. Afbeeldingen
Zet geoptimaliseerde beelden (WebP/JPG, max ~2000px breed) in `public/images/`:
- `hero.jpg` — hero-achtergrond (Confortola-shot)
- `story.jpg` — merkverhaal (pully centraal in beeld!)
- `shoot-1.jpg` t/m `shoot-8.jpg` — Livigno-filmstrip
- `og.jpg` — social share (1200×630)

Export vanuit Drive-map "Gutski foto's Livigno - LOW RES", eventueel comprimeren met bijv. Squoosh.

### 3. Lokaal draaien
```bash
npm install
cp .env.example .env.local   # vul in
npm run dev
```

### 4. Deploy
1. Push naar GitHub → importeer in Vercel
2. Environment variables instellen (zelfde drie als `.env.local`)
3. Cloudflare DNS voor gutski.eu:
   - `A @ 76.76.21.21` (DNS only, grijze wolk — Vercel doet zelf edge/SSL)
   - `CNAME www cname.vercel-dns.com`
4. In Vercel: domain `gutski.eu` toevoegen + `www` redirect naar apex

## Admin
`gutski.eu/admin` — inloggen met het Supabase-account. Verkooppunten toevoegen, bewerken,
(de)activeren en verwijderen. Lat/lng: rechtsklik op de locatie in Google Maps.
Wijzigingen zijn binnen 5 minuten live (ISR, `revalidate = 300`) of direct na een admin-actie.

## Nog te doen
- [ ] Echte retailprijzen in `components/Collection.tsx` (nu € 79,95 placeholder)
- [ ] Packshots per stijl i.p.v. gestileerde pully's
- [ ] Privacy- & voorwaardenpagina's (footer-links)
- [ ] Social-links invullen in `components/Footer.tsx`
- [ ] Configurator-CTA naar de juiste skipullies.com-URL
