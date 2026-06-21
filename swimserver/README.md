# Westview Swim Team — Live Server

A full team dashboard with a real backend, so every device (coaches, swimmers, parents) sees the same live data — events, times, roster, announcements, and the practice calendar all sync automatically.

## What's inside
- `server.js` — Express backend that stores everything in `db.json` on the server
- `public/index.html` — the full frontend (dashboard, times, roster, analytics, calendar, videos, dryland workouts, coach portal)
- `package.json` — dependencies (just Express)

## How it works
- Every browser that opens the site loads data from `/api/all`
- Every add/edit/delete calls the server immediately and saves to `db.json`
- Every device polls for updates every 15 seconds, so changes made on one phone/laptop show up everywhere else automatically
- No localStorage, no API keys, nothing client-side-only — it's a real shared database

## Run it locally
```
npm install
npm start
```
Then open `http://localhost:3000` in your browser.

## Deploy it for free (so it's a real website anyone can visit)

### Option A — Railway (easiest)
1. Go to railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo" (or "Empty Project" → drag these files in)
3. Railway auto-detects Node.js and runs `npm start`
4. You'll get a live URL like `westview-swim.up.railway.app` — share that with the team

### Option B — Render
1. Go to render.com and sign in
2. New → Web Service → connect this folder/repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Deploy — you'll get a free `.onrender.com` URL

### Option C — Glitch (no GitHub needed)
1. Go to glitch.com → New Project → "Import from GitHub" or upload these files directly
2. It auto-runs `npm start`
3. Click "Share" to get your live link

## Coach login
- Username: `westviewCoach`
- Password: `swim26west`

## Notes
- `db.json` is created automatically the first time the server runs — it's your team's live database
- Back it up occasionally by downloading `db.json` from your host's file browser
- The PDF parser runs entirely in the browser (no AI/API calls) and saves extracted results straight to the server
