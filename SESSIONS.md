# Showcase theme: page-styling sessions

Run them in order with `/session` (next pending), `/session S3` (a specific one) or `/session status`.
The command is in `.claude/commands/session.md`. Each session restyles one page (or one part of a long page) so it
matches the showcase homepage, verifies it, and updates its row here.

Status values: `pending`, `partial` (notes say what is left), `done (date)`.

**Grep check** for every session, run on the files in scope (should print nothing):

```bash
grep -nE '#FBFCF9|#F6F8F3|#0E2414|ring-black/5|scroll-mt-\[160px\]' <files>
```

Paths below are relative to `src/views/`.

| ID | Page / route | Files in scope | Status |
| --- | --- | --- | --- |
| S0 | Baseline audit, all routes | none edited | done (2026-11-20): all 18 routes clean at 1400/390 px (no sideways scroll, one h1); two console errors fixed; findings in each session's notes |
| S1a | About part 1 `/about` | `about/AboutPage.tsx`, `about/sections.tsx` (overview, mission, structure) | done (2026-11-20): hero stats count up, gold badge; overview cards unnumbered with spotlight; mission dark gradient card, vision white with gold edge; org chart with green-to-gold connectors; `sections.tsx` now uses the theme kit `Rise`/`sectionCls`/`focus` |
| S1b | About part 2 `/about` | `about/sections.tsx` (executive, history, charter), `about/primitives.tsx` | done (2026-11-20): history timeline with ink year nodes, spotlight cards and dark figure chips; leadership cards with spotlight and rotating arrow chips; profile dialog in theme tokens; charter is now the page's `#04140A` band with count-up figures, gold CTA and the visit-us `FramedPanel`; primitives `SectionHeading` now renders the theme `Headline` |
| S2 | Service Charter `/about/service-charter` | `charter/CharterPage.tsx` | done (2026-11-20): reading bar moved to the window top (kit `ReadingBar`); hero stat tiles dark gradient with spotlight; standards cards with spotlight, lift and dark time badges, dark pill department picker; complaints is now the page's `#04140A` band (steps 1–4 kept, glass cards, gold CTA); value cards unnumbered with icons and a growing top line; foreword on `#F2F6F0` with a gold edge; charter contents highlight the section being read; "PCC" search now finds the clearance certificate |
| S3 | Services `/services` | `services/ServicesPage.tsx`, `services/Calculator.tsx` | done (2026-11-20): journey panel has a dark gradient header with spotlight and swaps on `y`; ink step nodes, gold-edged "where to go next"; calculator is the page's `#04140A` band (white slider panel with gold edge, glass results card with a pointer-following gold edge, gold-gradient total); portals are the home page's dark tilt cards; help cards with spotlight, lift and arrow chips; handoff dialog in theme tokens |
| S4 | Operators `/operators` | `operators/OperatorsPage.tsx` | done (2026-11-20): hero counts are glass tiles that count up with spotlight; directory toolbar is a rounded-full pill bar with ink/gold active states; operator cards with spotlight, lift, a growing green→gold top line and ink arrow chips; related bodies with ink icon tiles; drawer header on `#04140A` with `DarkBackdrop`; "how" is a dark gradient card with spotlight; RSA funds is the page's `#04140A` band (selector in `FramedPanel`, your fund a white card with a gold glow, Fund I option gold-outlined); performance card dark gradient + gold CTA, complaint card with dark button |
| S5a | Resources part 1 `/resources` | `resources/ResourcesPage.tsx`, `resources/Guides.tsx` | done (2026-11-20): hero search is a rounded-full pill with a gold-to-green edge, ink search chip, pointer glow and a solid `#FFD84D` focus ring; results in a `rounded-3xl` card with kind labels in `#7F5A04` and rotating arrow chips; "What’s here" tiles rise on `y` and turn ink with a gold edge on hover; guide cards keep the tilt, add spotlight, lift, ink icon tiles and a rising watermark icon; guide dialog header on `#04140A` with `DarkBackdrop`, pill controls, checklist progress bar, steps swap on `y` |
| S5b | Resources part 2 `/resources`, `/resources/faq` | `resources/Library.tsx`, `resources/FaqGlossary.tsx`, `resources/compat.tsx` | pending |
| S6 | Forms + Q1 report `/resources/forms-and-checklists`, `/resources/reports/q1-2026` | `forms/FormsPage.tsx`, `report/ReportPage.tsx`, `docs/kit.tsx` | pending |
| S7a | Regulations library `/regulations` | `regulations/RegulationsPage.tsx`, `regulations/Sections.tsx`, `regulations/Library.tsx`, `regulations/DocDrawer.tsx` | pending |
| S7b | Act + regulation docs `/regulations/pension-reform-act`, `/regulations/doc/[id]` | `regulations/PensionAct.tsx`, `regulations/RegDocPage.tsx` | pending |
| S8a | Connect part 1 `/connect` | `connect/ConnectPage.tsx`, `connect/Sections.tsx` | pending |
| S8b | Connect part 2 `/connect` | `connect/CaseForm.tsx` | pending |
| S9a | News catalogue `/news` | `newsroom/NewsCatalog.tsx`, `newsroom/parts.tsx` | pending |
| S9b | News story `/news/[slug]` | `news/Article.tsx` | pending |
| S10a | Performance part 1 `/performance` | `performance/PerformancePage.tsx`, `performance/Sections.tsx` | pending |
| S10b | Performance part 2 `/performance` | `performance/charts.tsx` | pending |
| S11 | Media `/media` | `media/MediaPage.tsx` | pending |
| S12 | Chronicles `/chronicles` | `chronicles/ChroniclesPage.tsx`, `chronicles/PreviewPages.tsx` | pending |
| S13 | Site-wide sweep and close-out | any | pending |

## Session notes

**S0 Baseline audit.** No restyling. Start the dev server (port 3011), open every route at 1400 px and 390 px, and
under each session below add a short list of what clashes with the showcase look (old colours, numbered or framed
leftovers, cramped spacing, overflow, console errors). Also run the grep check over all of `src/views` and note the
counts per file. Fix only trivial breakage (a crash, a console error). This makes later sessions faster.
Result: no route overflows at 390 px; every route has one h1 and at most one dark band besides its hero. Fixed: `/services`
SVG `d` error (`services/Calculator.tsx`), `/regulations/doc/*` 404 for missing web text (`docs/kit.tsx` `useDocJson`,
`regulations/RegDocPage.tsx`). Side animations (`x`) are listed per session because the rule is `y` only.

**S1a About part 1.** Sections: overview (hero), mission, structure. The About hero is hand-built in `AboutPage.tsx`;
bring it in line with `PageHero`'s dark cinematic hero (or switch to `PageHero` if content allows). Keep the
`CountUp` figures.
Audit: grep `about/sections.tsx` 12 (shared with S1b), `AboutPage.tsx` 0. Hero already dark with framed photo. Overview cards still show faint "01–04" numbers; the vision card is a large `#FFF8E1` gold fill (gold should be accent only).

**S1b About part 2.** Sections: executive, history, charter teaser. After S1a, `sections.tsx` imports `Rise`, `focus`, `sectionCls`, `spot` from `theme/ui` (local copies removed; `sectionCls` is now `py-20 sm:py-28` with `scroll-mt-[170px]`, so Charter’s `pb-24` only affects phones). A `glowLight` class string (green spotlight for white cards) is defined at the top. Remaining grep hits, all S1b: History track (`#0E2414/10`), Leadership DG card and names, ProfileDialog, zonal pills (`ring-black/5`). `about/primitives.tsx` holds `Spotlight`,
`Tilt`, `CountUp` and `scrollToId`/`sectionAliases`, shared by other pages: restyle effects without changing exports,
then re-check `/services` or `/operators`. Executive team: no invented names or titles.
Result: `/about` grep clean in both files. Charter is the About page's one `#04140A` band (the mission card stays a dark card, not a band). Old `SectionHeading`/`GridBackdrop` in primitives were unused; kept as exports. Browser checks used a Playwright venv in the scratchpad with `executable_path=/usr/bin/google-chrome` (the pip Playwright wanted a newer headless shell than the cached one).
Audit: history timeline is framed cards with gold years ("everyone" look); leadership grid is fine; the charter teaser is a big green gradient band (keep it, but it is not `#04140A`).

**S2 Service Charter.** Sections: promise, standards, complaints, full-text. Charter text stays English. Keep the
signed PDF link.
Audit: grep 3. Promise value cards numbered 01–06; foreword is a `#FFF8E1` box; complaint steps 1–4 are real steps (keep the numbers).
Result: grep clean. Gold labels on white/pale green use `#7F5A04` (`#9A6F06` is 4.1:1 on `#F2F6F0`). The search has a small `aliases` map (`pcc` → "pension clearance certificate"); add others there if people search by short forms. No new UI strings.

**S3 Services.** Sections: journeys, calculator, portals, help. Portal cards can borrow the homepage portal tilt and
spotlight. Calculator results must stay readable at 390 px.
Audit: grep `ServicesPage` 8. S0 fixed a console error in `Calculator.tsx` (`motion.path` animating `d` from undefined; now `initial={false}`). Journey panel uses `#FFF2CC`/`#FFF8E1` fills; journey swap animates `x` ±24 (switch to `y`).
Result: grep clean in both files. Calculator breakdown colours changed for the dark band (voluntary is teal `#5EC4C4`, not purple). `ServicesPage.tsx` has local `glowLight`, `lift`, `darkBtn`, `Chip` and `TiltButton` (a `<button>` version of the home page tilt card); reuse them if Operators needs the same. No new UI strings.

**S4 Operators.** Sections: how, directory, funds, performance; details drawer (`Drawer`). PFA returns are sample
figures and must stay labelled.
Audit: grep 6. Directory cards plain white; Fund I card has a gold fill; the "how" panel is a green block with 01–03 steps (fine).
Result: grep clean. Pitfall: a Tailwind `bg-gradient-to-*` plus an arbitrary `[background-image:…]` spotlight on the same element loses the gradient (the card renders pale). `OperatorsPage.tsx` has `darkCard`, which puts the spotlight and the gradient in one `background-image`; reuse it for dark spotlight cards. The 01–03 counters on white use `#7F5A04`. No new UI strings.

**S5a Resources part 1.** Hero (knowledge search), guides (`?guide=` links must still open the guide).
Audit: grep `ResourcesPage` 1, `Guides` 1. Hero aside list animates `x: 12` (ResourcesPage:238); guide steps animate `x` ±24 (Guides:164).
Result: grep clean in both files, no `x` animations. `Guides.tsx` now uses `sectionCls` and has local `glowLight`, `darkBtn`, `goldBtn` and `chip`; reuse them in S5b. `canSpeak` (Listen button) moved from render to an effect (was a `window` read during render). The global `:focus-visible` ring drew a box inside the search pill: the input sets `focus-visible:ring-0` and the pill shows the focus ring instead; do the same for other pill inputs. `compat.tsx` `DialogContent` keeps only `max-w`/`max-h` classes, so dialog styling goes inside the content. The Modal close button still uses `#0E2414` (`theme/ui.tsx`, S13). Guide ids are `transfer-rsa` etc. (`?guide=transfer-rsa` opens it). No new UI strings.

**S5b Resources part 2.** Sections: publications, downloads, learning, faq, glossary; `/resources/faq` route. Keep
`#annual-reports` and `?doc=` working (`compat.tsx`).
Audit: grep `Library` 3, `FaqGlossary` 2. `Library.tsx:239` reveals with `whileInView x:-16` (overflow risk: use `y`). `learning` is the page's one `#04140A` band.

**S6 Forms + Q1 report.** Document pages on `docs/kit.tsx` (`DocHero`, `Toc`, `PdfCard`, `ReadingBar`). Checklist
ticks persist in `pencom:checklists` (SSR-safe, `ready` flag). Report sections: glance, dg, environment, domains,
priorities, outlook; report text stays English. Print styles stay white.
Audit: grep `FormsPage` 4, `ReportPage` 5, `kit.tsx` 1. Side animations: FormsPage:141 `x:-12`, ReportPage:139 `whileInView x:-10`. S0 changed `useDocJson(url)` to accept `null` (no request). On first load the Notices panel covers the right half of `DocHero` titles (site chrome, see S13).

**S7a Regulations library.** Sections: latest, act, library, policies, compliance; facets and document drawer.
Always English. Check filters in the URL and the drawer focus trap.
Audit: grep `RegulationsPage` 2, `Sections` 4, `Library` 1. Side animations: Sections:58 `whileInView x:40` (overflow risk), Sections:250, RegulationsPage:201, DocDrawer:62. `act` is the page's dark band.

**S7b Act + regulation docs.** 197 generated pages: spot-check three (short, long, one with tables). Build time
matters: no heavy per-page work.
Audit: S0 fixed a 404 for `/documents/text/__none__.json` on docs without a web version (`RegDocPage` passes `null`). In headless Chrome the doc page never reached network idle (`load` is fine): find what keeps loading.

**S8a Connect part 1.** Sections: contact, zonal-offices (map), news, track. No invented office hours.
Audit: grep `ConnectPage` 2, `Sections` 4. `track` is the page's `#04140A` band. Layout OK at both widths.

**S8b Connect part 2.** Complaint form with case reference and tracker. Labels, errors and focus order (WCAG 2.2 AA).
Audit: grep 2. Form steps slide with `x` ±30 (CaseForm:201/220/275): switch to `y`.

**S9a News catalogue.** `newsroom/parts.tsx` has the most leftovers (about 20). News items are drafts until the CMS;
keep that label.
Audit: biggest clash. Hero is a light, pale-green "everyone" hero, not the dark `PageHero`; `parts.tsx` has the drawn gold underline (line 98) and 20 grep hits; `NewsCatalog.tsx` header comment still describes the everyone look.

**S9b News story.** Dark photo header is a deliberate exception; restyle the body, related stories and share bar.
Animated title keeps `data-no-translate`. Check two stories.
Audit: grep 0. Key-points list reveals with `whileInView x:-12` (Article:139). Related stories and the next/previous bar look fine.

**S10a Performance part 1.** Sections: coverage, assets, allocation, funds, fees, compare, method. Good candidate
for the page's one `#04140A` figures band. Sample figures stay labelled.
Audit: grep `Sections.tsx` 19 (the most after `parts.tsx`). `funds` is already the `#04140A` band. Compare list animates `x` ±20 (Sections:393). Sample-figures label is present.

**S10b Performance part 2.** Chart colours, gridlines, tooltips and legends in theme tokens; check contrast and
that charts don't overflow at 390 px.
Audit: charts render and fit at 390 px; check colours and tooltips in this session.

**S11 Media.** Sections: photos, videos, follow; lightbox (`Modal`). Captions stay English.
Audit: grep 6. The `videos` band is `#020F04`, not `#04140A`. Grid items animate `x:20` (MediaPage:197). Lightbox slide on `x` is inside a fixed dialog (OK).

**S12 Chronicles.** Serif masthead is a deliberate exception. Sections: launch, inside, issues, subscribe. "Read the
issue" opens the PDF; no flip-book.
Audit: grep 9. `launch` dark band has `scroll-mt-[160px]`; awards list reveals with `whileInView x:30` (ChroniclesPage:203, overflow risk).

**S13 Site-wide sweep.** Grep check over all of `src/views` and `src/components` (should be clean, including
`theme/ui.tsx`, `docs/kit.tsx`, `homeshowcase/Sections.tsx`). The `[...slug]` placeholder page, header/footer
consistency, `/i18n-pass` for any new strings across the pages, a 390 px pass over every route, then update
`themes/showcase/CLAUDE.md` and `docs/HANDOFF.md` with the theme's status.

Audit: footer and newsletter still use numbered labels 01–07 (everyone leftover). Grep hits in shared files: `theme/ui.tsx` 1, `docs/kit.tsx` 1, `homeshowcase/Sections.tsx` 1. The Notices panel opens on a visit's first load (`NoticesBell.tsx:61`) and covers the hero's right column; decide whether that is wanted.