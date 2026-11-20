"""List English strings on the given pages that have no dictionary entry.

Usage (dev or production server running, dictionaries dumped first):
  node tools/i18n/dump-dicts.mjs
  python3 tools/i18n/find-missing.py /forms /connect            # pages to scan
  BASE=http://localhost:3010 python3 tools/i18n/find-missing.py /about

It opens each page in English, clicks every accordion, tab, radio and in-page button so hidden
text shows, collects text nodes and aria-label/placeholder/title/alt values, and prints those that
are neither a dictionary key nor matched by a {placeholder} key. Output: tools/i18n/.out/missing.json
({ "string": ["/page", ...] }). Then decide per string: translate it, or leave it English on purpose
(names, figures, dates, document titles, legal text) and add data-no-translate where needed.
Needs: pip install playwright && python3 -m playwright install chromium (or set CHROME=/path/to/chrome).
"""
import json, os, re, sys, time
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3010")
OUT = "tools/i18n/.out"
COLLECT = r"""() => {
  const SKIP="script,style,noscript,code,pre,textarea,svg,[data-no-translate],[contenteditable='true']";
  const norm=s=>s.replace(/\s+/g," ").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').trim();
  const out=new Set();
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n; while((n=w.nextNode())){const p=n.parentElement; if(!p||p.closest(SKIP)) continue; const t=norm(n.nodeValue||""); if(/\p{L}{2,}/u.test(t)) out.add(t);}
  for(const el of document.body.querySelectorAll("[aria-label],[placeholder],[title],[alt]")){ if(el.closest(SKIP)) continue;
    for(const a of ["aria-label","placeholder","title","alt"]){const v=el.getAttribute(a); if(v){const t=norm(v); if(/\p{L}{2,}/u.test(t)) out.add(t);}}}
  return [...out];
}"""

def norm(s): return re.sub(r"\s+", " ", s).replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"').strip()

def compile_key(k):
    parts = re.split(r"(\{[a-z]+\})", k); rx = ""
    for p in parts:
        if re.fullmatch(r"\{[a-z]+\}", p):
            name = p[1:-1]
            rx += r"(\d[\d,.]*)" if name in ("n", "shown", "total", "count") else (r"([A-Z].*?)" if name == "name" else r"(.+?)")
        else: rx += re.escape(p)
    return re.compile("^" + rx + "$")

def main(pages):
    d = json.load(open(f"{OUT}/dicts.json"))["ha"]
    keys = {norm(k) for k in d}
    pats = [compile_key(norm(k)) for k in d if "{" in k]
    found = {}
    with sync_playwright() as p:
        kw = {"args": ["--no-sandbox"]}
        if os.environ.get("CHROME"): kw["executable_path"] = os.environ["CHROME"]
        b = p.chromium.launch(**kw)
        ctx = b.new_context(viewport={"width": 1400, "height": 900})
        ctx.add_init_script("try{localStorage.setItem('pencom:lang','en')}catch(e){}")
        pg = ctx.new_page(); pg.on("dialog", lambda dlg: dlg.dismiss())
        def add(u):
            for t in pg.evaluate(COLLECT): found.setdefault(t, set()).add(u)
        for u in pages:
            pg.goto(BASE + u, wait_until="load", timeout=60000); time.sleep(2.5); add(u)
            for sel in ['main [aria-expanded="false"]', 'main [role="tab"]', 'main [role="radio"]', "main button"]:
                n = pg.evaluate("s=>document.querySelectorAll(s).length", sel)
                for i in range(min(n, 160)):
                    try:
                        loc = pg.locator(sel).nth(i)
                        if not loc.is_visible(): continue
                        if pg.url.split("?")[0].split("#")[0] != BASE + u.split("?")[0]:
                            pg.goto(BASE + u, wait_until="load"); time.sleep(0.5)
                        loc.click(timeout=1500, no_wait_after=True); time.sleep(0.25); add(u)
                        if pg.locator("[role=dialog]").count(): pg.keyboard.press("Escape"); time.sleep(0.2)
                    except Exception: pass
            print(u, len(found), file=sys.stderr, flush=True)
        b.close()
    missing = {t: sorted(us) for t, us in found.items() if t not in keys and not any(r.match(t) for r in pats)}
    os.makedirs(OUT, exist_ok=True)
    json.dump(missing, open(f"{OUT}/missing.json", "w"), ensure_ascii=False, indent=1)
    print(f"{len(missing)} of {len(found)} strings have no entry -> {OUT}/missing.json")

if __name__ == "__main__":
    main(sys.argv[1:] or ["/"])
