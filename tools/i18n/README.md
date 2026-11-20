# Translation tools

Run from the theme folder (`themes/<name>`), with the site running (`npm run dev`, or `npm run build && npm start`
for steadier timing). `BASE` defaults to http://localhost:3010; set it for other ports.

One-time setup: `pip install playwright && python3 -m playwright install chromium` (or set `CHROME=/usr/bin/google-chrome`).

| Step | Command | Result |
| --- | --- | --- |
| 1. Dump dictionaries | `node tools/i18n/dump-dicts.mjs` | `.out/dicts.json`; warns if ha/yo/ig keys differ |
| 2. Find untranslated strings | `python3 tools/i18n/find-missing.py /page1 /page2` | `.out/missing.json` (string → pages) |
| 3. Add translations | edit `src/i18n/dict/{ha,yo,ig}.ts` | same key in all three files, in a new marked block at the end (`/* <Page> page */`) |
| 4. Measure | `python3 tools/i18n/coverage.py yo /page1` (repeat for ha, ig) | % translated per page, highlight count, leftovers |

Rules
- Keys are the exact English text, whitespace collapsed, curly quotes straightened. Prefer whole sentences;
  avoid single common words as keys (they match inside other UI).
- Use placeholder keys for text with numbers or names: `"Showing {shown} of {total} items"`, `"Call {name}"`.
- Keep in English on purpose: anything under `/regulations`, names, addresses, phone numbers, dates, figures, document
  and report titles, news story bodies, the Q1 report text, the signed Service Charter text, media captions.
- If a title has a highlighted phrase, add a key for the phrase too, and check the translated phrase is a substring of
  the translated title (PageHero/Headline look it up case-insensitively).
- Titles animated word-by-word or letter-by-letter need `data-no-translate` (or translate the whole title in code with `t()`).
- All translations are drafts for review by PenCom staff who understand pension matters (questionnaire DES-39).
- `.out/` is scratch output; don't commit it.
