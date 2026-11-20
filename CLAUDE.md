# Theme "showcase" (Next.js): developer guide

The showcase homepage design (`app/src/pages/HomeShowcase.tsx`, original route `/home-showcase`) and every inner
page rebuilt to match it. Copied from `themes/everyone` on 20 November 2026: content, routes, data, i18n and the
router adapter are the same; only the look changes. Read `../../CLAUDE.md` and `../../docs/HANDOFF.md` first.

## Look

The showcase design is cinematic and dark-accented: big photography, heavy type, motion that follows the pointer.

- **Section titles** (`views/homeshowcase/Title.tsx`): no numbers. A giant outlined "ghost" word (uppercase,
  `font-black`, transparent fill with a 1.5px stroke at 13% dark green, 18% light gold on dark bands) sits behind the
  title and drifts sideways as the section scrolls (still under reduced motion). Above the title, a pill tag with an
  icon (dark green `#0A4A13` with light gold text; gold with dark text on dark bands). The title is very heavy
  (`font-black`, 2.1rem → 3.6rem) and its key phrase (`mark`) is filled with a green→gold gradient
  (`from-#117F21 via-#2E913D to-#CB9615`; light gold gradient on dark). Intro and actions sit in a right column (lg: 8/4 split).
- **Backgrounds:** white page (`bg-white`, text `#0B1F10`) with alternating pale green bands `#F2F6F0`. One near-black
  green band `#04140A` for figures, with gold and green radial glows and a faint 64px grid masked to the centre.
  Photo overlays use `#04140A` gradients. The banner is full-bleed photography with a green-to-dark left gradient.
- **Cards:** large radius (`rounded-3xl` / `rounded-[1.75rem]`), `ring-1 ring-black/10` on white, hover lifts by
  4px with a long soft shadow. Dark cards are `#0B1F10`→`#0A4A13` gradients. Pills and buttons are fully rounded;
  primary dark button `#0B1F10` turning `#117F21` on hover; gold CTA `#F4D27A` with a dark circular arrow chip.
- **Motion:** pointer spotlight (radial gradient following `--x/--y`) on alert, figure and portal cards; 3D tilt on
  portal cards; expanding "I am a…" cards (flex-grow on desktop, accordion on phones); curtain-wipe slides with
  word-by-word headline rise; `Rise` (fade + 26px up) on reveal; reading-progress line fixed at the very top of the
  window (above the header). Everything respects reduced motion.
- **Type and spacing:** sections `py-20 sm:py-28`, `max-w-7xl`, titles `tracking-tight`, eyebrows uppercase with
  wide tracking (`0.16em`–`0.2em`). Mono tabular numbers for slide and FAQ counters ("01").
- **Colour weight:** mostly white and pale green; dark green/near-black in the banner, the dock, portal cards and
  one figures band; gold is the accent (CTA, highlights, counters, active states), never a large fill except the CTA.

## Page sessions

The inner pages are restyled session by session: the list and status are in `SESSIONS.md`; run the next one with
`/session` (or `/session S3`, `/session status`).

## Run

```bash
npm install
npm run dev            # http://localhost:3011   (PORT=3021 npm run dev to change)
npm run typecheck      # tsc --noEmit
npm run build && npm start
```

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind 3, framer-motion 12, lucide-react. No UI library.
`next.config.ts`: `reactStrictMode`, `images.unoptimized`, `devIndicators: false` (the badge covered the quick-links button).

## Layout of the code

```
src/app/                 routes only: each page.tsx exports metadata and renders a view
  page.tsx               home  → views/HomeShowcase
  [...slug]/page.tsx     "being redesigned" placeholder for pages not built yet (sections map; now only mobile, admin)
  news/[slug], regulations/doc/[id]   generateStaticParams + generateMetadata (Next 16: params is a Promise)
  resources/chronicles   redirect("/chronicles")
src/views/<page>/        everything for one page: <Name>Page.tsx (client), sections, data
src/views/theme/         the theme's look, shared by every inner page: ui.tsx, Headline.tsx, heading.tsx, Ghost.tsx
src/views/homeshowcase/  the home page: Banner, Sections (dock, search, alerts, circulars, portals, news, figures, help), Title
src/views/docs/kit.tsx   document pages (Act, regulation docs, Q1 report, forms): DocHero, Toc, ReadingBar, PdfCard…
src/views/about/primitives.tsx   scrollToId + sectionAliases (old anchors), CountUp, Spotlight, Tilt, reveal
src/components/          site chrome: layout/Layout, Header, Footer, NoticesBell, PromoPopup, CookieConsent,
                         chat/Chatbot, QuickLinks, AccessibilityWidget, LanguageSwitcher, LanguageNotice
src/lib/router.tsx       react-router-style API on top of next/navigation (see below)
src/lib/data.ts          navigation (mega menus), news list, operators summary
src/i18n/                language engine + Hausa/Yoruba/Igbo dictionaries
public/                  images, documents/text/*.json (web versions of PDFs), magazine PDF, videos
```

`src/pages` is reserved by Next.js, which is why page code lives in `src/views`.

### Routes built

`/`, `/about`, `/about/service-charter`, `/services`, `/operators`, `/resources`, `/resources/faq`,
`/resources/forms-and-checklists`, `/resources/reports/q1-2026`, `/regulations`, `/regulations/pension-reform-act`,
`/regulations/doc/[id]` (197 pages), `/connect`, `/news`, `/news/[slug]`, `/performance`, `/media`, `/chronicles`.
Still placeholders: `/mobile`, `/admin` (see HANDOFF).

## The router adapter (`src/lib/router.tsx`)

Ported pages keep react-router code. Import from `@/lib/router`, never `react-router` or raw `next/link` in views:

- `<Link to="/x#y">` (string or `{pathname, search, hash}`), `preventScrollReset` maps to `scroll={false}`.
- `useLocation()` → `{ pathname, search, hash }` (hash is tracked; `history.pushState` is patched to emit `pencom:locationchange` via `queueMicrotask`).
- `useNavigate()(to, { replace, preventScrollReset })`.
- `useSearchParams()` → `[params, set]`; `set(next, { replace: true, preventScrollReset: true })` for filters kept in the URL.

## The theme kit (what makes a page look like this theme)

`src/views/theme/ui.tsx`
- `PageHero({ id, crumbs, pill: {icon,label}, title, mark, intro, actions?, aside? })`: dark cinematic hero
  (`#04140A`, `DarkBackdrop` glows + grid), gold pill tag, `font-black` title with the `mark` phrase in the light-gold
  gradient, and the pill label as a drifting ghost word along the bottom. It translates the whole title and then finds
  the translated mark in it (case-insensitive). `actions` and `aside` default to dark ink (`text-[#0B1F10]`), so white
  cards in them read correctly; loose text in `actions` must set its own light colour (`text-white/70`).
- `FramedPanel`: white `rounded-[1.75rem]` card floating on the hero, thin gold-to-green edge, pointer spotlight.
- `DarkBackdrop`, `spot`: the near-black band background and the pointer-spotlight handler.
- `SectionNav({ sections, pillId })`: sticky rounded pill bar; active pill `#0B1F10` with gold text. About uses it too.
- `Modal`, `Drawer`: accessible dialogs (focus in and back, Escape, scroll lock).
- `Rise` (26px), `ease`, `focus` (yellow focus ring), `sectionCls` (`py-20 sm:py-28`, `overflow-x-clip`).

`src/views/theme/Headline.tsx` + `heading.tsx` + `Ghost.tsx`
- `SectionHeading({ id, eyebrow, title, highlight?, intro?, action?, dark?, stacked?, n? })` → `theme/Headline`:
  ghost word, pill tag, heavy title, green→gold gradient highlight (light gold on `dark`). **No numbers**: `n` is
  accepted and ignored. Put a section's controls in `action`. Use `stacked` in narrow columns.
- `Ghost({ word, dark?, clip? })`: the outlined drifting word. Clipped to its own box by default so it can't widen the
  page; the home page passes `clip={false}` (its sections clip). `ghostWord(kicker)` maps long kickers to one word
  (`ghostFor` table); short kickers are used as they are. Ghost words go through `t()`.

`src/views/docs/kit.tsx`: `DocHero` is the dark hero for documents (print stays white), meta in a floating white
grid; `PrimaryBtn` gold pill, `GhostBtn` white pill; `ReadingBar` at the very top of the window.

Colours: near-black `#04140A` (heroes, dark bands), ink `#0B1F10`, dark green `#0A4A13`, green `#117F21`,
gold `#CB9615`, light gold `#F4D27A`, page white, soft band `#F2F6F0`, mint `#E8F5E9`, focus `#FFD84D`.

Page pattern: `<MotionConfig reducedMotion="user"><div className="bg-white text-[#0B1F10]"> dark Hero → SectionNav →
ghost-word sections (alternating white and #F2F6F0, one near-black #04140A band per page at most, with the glow and
grid layers) </div></MotionConfig>`.
Exceptions on purpose: news stories keep a dark photo header; Chronicles has a hand-built serif masthead.

## Conventions and pitfalls (each one bit us once)

- **Server rendering:** no `window`/`localStorage`/`navigator`/`innerHeight` during render or in `useState(() => …)`.
  Initialise with a constant, read in `useEffect`, and gate saving with a `ready` flag so you don't overwrite storage.
- **Mobile overflow:** never animate cards in from the side (`initial={{ x: 20 }}` on `whileInView`): offscreen cards
  keep the offset and widen the page on phones. Use `y`.
- **Highlight phrases:** must be a substring of the title in every language (check after a translation pass).
- **Old links:** hash anchors and `sectionAliases` keep working; pages handle `#id` with two `scrollToId` calls
  (80 ms smooth, 900 ms instant) because sections render late.
- **Data honesty:** placeholders are labelled on the page (PFA returns are sample figures; news items are drafts until
  the CMS). Don't invent office hours, figures or names.
- **External libraries at run time** (pdf.js was): load with `new Function("u","return import(u)")(url)` so the bundler
  ignores them. The flip-book reader was removed at the user's request.
- **Content headings that are split into animated words/letters** (story titles, Chronicles masthead) carry
  `data-no-translate`, or the translator will translate single words.
- **Dev server goes stale:** when several files change at once (or a file is written by another tool), Turbopack can
  keep an old module: hydration errors that name an old line, `X is not a function`, or headings numbered "—".
  Fix: restart `npm run dev`, or make a real edit to the stale file. Check server HTML with
  `curl -s localhost:3011/<page>` before blaming the code.
- After changing a shared kit file, re-check two other pages that use it.

## Languages (`src/i18n`)

- English is the official version. Hausa, Yoruba and Igbo are **drafts** for review by PenCom staff
  (questionnaire DES-39). The site starts in English on the server and applies the saved language after mount.
  `?lang=ha|yo|ig|en` in the address switches and saves the choice (`localStorage pencom:lang`).
- `dom.ts` (DomTranslator) swaps whole text nodes and `aria-label/placeholder/title/alt` by exact English key
  (whitespace collapsed, curly quotes straightened), watches the DOM, and marks leftovers `lang="en"`.
  Keys may contain placeholders: `"Showing {shown} of {total} items"`, `"Call {name}"` (`{n}`,`{shown}`,`{total}`,`{count}`
  match digits; `{name}` must start with a capital; others match any text; a captured value is itself translated if
  the dictionary has it).
- Components can call `t("English", vars)` from `useI18n()`; Headline/PageHero/About hero do this for whole titles.
- `/regulations/*` is always English (`isLegalPath`). Content stays English by policy: names, addresses, dates,
  figures, document titles, news story text, the Q1 report text, the signed charter text, media captions.
- Dictionaries: `dict/ha.ts`, `yo.ts`, `ig.ts` have identical keys (1,651 each). New entries go in a marked section at
  the end. Tools and the full procedure: `tools/i18n/README.md` and `/i18n-pass`.

## Verify before you report

`npm run typecheck` → `npm run build` → open the page in a browser at desktop width and at 390 px:
every section renders, highlights and numbers are right, no horizontal scroll
(`document.documentElement.scrollWidth === clientWidth`), interactive bits work (filters update the URL, dialogs
open/close with Escape and return focus), console has no errors on a clean reload, and in one other language
(`?lang=yo`) the headings and highlights look right. Then set the browser back to English (`?lang=en`).
