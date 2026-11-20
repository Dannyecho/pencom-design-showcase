"""Measure how much of each page's visible text is translated, per language.

Usage: python3 tools/i18n/coverage.py yo  [/page /page ...]   (BASE env as in find-missing.py)
Prints per page: % of wordy text translated, number of highlighted title phrases found, first headings.
Text the translator could not match is marked lang="en"; those strings are saved to
tools/i18n/.out/coverage_<lang>.json ("left"), with a screenshot of the last page.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3010")
OUT = "tools/i18n/.out"
PAGES = ["/", "/about", "/about/service-charter", "/services", "/operators", "/resources", "/resources/faq",
         "/resources/forms-and-checklists", "/connect", "/news", "/performance", "/resources/reports/q1-2026",
         "/media", "/chronicles"]
MEASURE = r"""() => {
 const main=document.getElementById('main-content')||document.body; const wordy=s=>/\p{L}{2,}[\s,]+\p{L}{2,}/u.test(s);
 let tot=0,en=0; const left=new Map();
 const w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
 for(let n=w.nextNode();n;n=w.nextNode()){const p=n.parentElement;const s=(n.nodeValue||'').replace(/\s+/g,' ').trim();
   if(!p||!wordy(s)||p.closest('script,style,svg,[data-no-translate],[data-i18n-notice]'))continue; tot+=s.length;
   if(p.closest('[lang=en]')){en+=s.length; left.set(s,(left.get(s)||0)+1)}}
 const marks=[...document.querySelectorAll('h1 span.text-\\[\\#117F21\\], h2 span[class*=bg-no-repeat]')].map(e=>e.textContent.trim()).filter(Boolean);
 const h=[...document.querySelectorAll('h1,h2')].map(e=>e.textContent.trim()).slice(0,6);
 return {pct: tot? Math.round(100*(tot-en)/tot):0, marks:marks.length, heads:h, left:[...left.keys()]};
}"""
lang = sys.argv[1]; pages = sys.argv[2:] or PAGES; out = {}; errs = []
with sync_playwright() as p:
    kw = {"args": ["--no-sandbox"]}
    if os.environ.get("CHROME"): kw["executable_path"] = os.environ["CHROME"]
    b = p.chromium.launch(**kw)
    ctx = b.new_context(viewport={"width": 1400, "height": 900})
    ctx.add_init_script(f"try{{localStorage.setItem('pencom:lang','{lang}');localStorage.setItem('pencom:lang-offer-dismissed','1')}}catch(e){{}}")
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)[:150]))
    pg.on("console", lambda m: errs.append(m.text[:150]) if m.type == "error" else None)
    for u in pages:
        pg.goto(BASE + u, wait_until="load", timeout=60000); time.sleep(3.5)
        pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); time.sleep(1.5)
        pg.evaluate("window.scrollTo(0,0)"); time.sleep(1.2)
        out[u] = pg.evaluate(MEASURE)
        print(u, out[u]["pct"], "%", "marks", out[u]["marks"], "|", " / ".join(out[u]["heads"][:2])[:110], flush=True)
    os.makedirs(OUT, exist_ok=True)
    pg.screenshot(path=f"{OUT}/shot_{lang}.png")
    b.close()
json.dump(out, open(f"{OUT}/coverage_{lang}.json", "w"), ensure_ascii=False, indent=1)
print("console errors", len(errs), errs[:5])
