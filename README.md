# PenCom website: "for everyone" theme (Next.js)

The main homepage design ("Pensions made clear for every Nigerian") as its own Next.js project.
Other pages are being redesigned to match it; until each one is ready, its links land on a
"being redesigned" page.

## Run

```bash
npm install
npm run dev          # http://localhost:3010 (PORT=3005 npm run dev to change)
npm run build && npm start   # production; listens on $PORT
```

## Layout

- `src/app` – routes (Next.js App Router). `page.tsx` is the home page.
- `src/views` – page sections (home: `HomeModern.tsx`, `homemodern/`).
- `src/components` – header, footer, notices bell, assistant, popups, accessibility.
- `src/i18n` – English, Hausa, Yoruba and Igbo (drafts for review).
- `src/lib/router.tsx` – lets the shared components use react-router style links on Next.js.
# pencom-design-showcase
