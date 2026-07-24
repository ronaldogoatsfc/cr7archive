# The Archive — Ronaldo Career Ledger

An unofficial, fan-made stats site: a filterable match ledger + data
visualizations, built with Next.js (App Router), Tailwind CSS, and Recharts.

## Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/
  page.js                     -> Home page (hero + progress bar + section links)
  match-logs/page.js          -> Filterable match ledger (client component)
  match-logs/footage/page.js  -> Match footage (placeholder)
  visualizations/page.js      -> Charts (recharts)
  trophies/page.js            -> Trophy cabinet
  honors/page.js              -> Individual honors & awards (placeholder)
  records/page.js              -> Records (placeholder)
  about/page.js                -> About / fan-made disclaimer / contact
data/
  matches.json             -> ALL your match data lives here
lib/
  stats.js                 -> Pure helper functions (filtering, aggregates)
components/
  NavBar.js, Footer.js, MatchTicker.js, StatCard.js
```

## Updating the data

Everything is driven by `data/matches.json`. It ships with a small set of
placeholder matches so you can see the layout — replace them with your own
real match-by-match records. Each entry looks like:

```json
{
  "id": "2024-25-cl-08",
  "date": "2024-11-05",
  "season": "2024/25",
  "team": "Al Nassr",
  "competition": "AFC Champions League",
  "stage": "Group Stage",
  "opponent": "Al Ain",
  "venue": "Home",
  "result": "W",
  "scoreFor": 3,
  "scoreAgainst": 1,
  "minutesPlayed": 90,
  "goals": 2,
  "assists": 1,
  "position": "ST",
  "yellowCard": false,
  "redCard": false,
  "footageUrl": ""
}
```

Notes:
- `id` just needs to be unique — use whatever convention you like.
- `footageUrl` — paste a link to match highlights/footage here (YouTube,
  etc). Leave it as `""` if you don't have one yet; the ledger shows a dash
  instead of a broken link.
- The filters, stat cards, and every chart on the Visualizations page are
  all derived automatically from this file via `lib/stats.js` — you don't
  need to touch any component code when you add matches.
- If you'd rather manage data in a spreadsheet and export to JSON, or move
  to Supabase later, only `data/matches.json` (and how it's imported in
  `app/page.js`, `app/match-logs/page.js`, `app/visualizations/page.js`) would
  need to change — the rest of the app is unaffected.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import
   the repo.
3. Framework preset auto-detects as Next.js — no config needed.
4. Deploy. Every push to `main` after that redeploys automatically.
5. To use a custom domain: **Project → Settings → Domains** → add your
   domain → update the DNS records at your registrar as instructed.

No environment variables are required for this setup since all data is
static and bundled at build time.
