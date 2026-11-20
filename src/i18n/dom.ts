import { norm } from "./languages";

/**
 * Applies a phrase dictionary (English → language) to the rendered page.
 *
 * Text nodes and a few attributes (aria-label, placeholder, title, alt) are swapped in
 * place and watched with a MutationObserver, so text React renders later (menus, tabs,
 * dialogs, the chatbot) is translated too. The English original is kept for every node,
 * so switching back to English restores the page exactly. Anything with no dictionary
 * entry stays in English and its element is marked lang="en" for screen readers
 * (WCAG 3.1.2, language of parts).
 *
 * Opt out with data-no-translate. Components can also translate directly with t() and
 * flag the result with data-i18n-done so it counts towards the page's coverage.
 */

type Dict = Map<string, string>;

/**
 * Dictionary keys with placeholders ("Showing {shown} of {total} items", "Call {name}") also match text
 * built from live values. Number placeholders match digits only; {name} must start with a capital letter;
 * anything else matches any text. A captured value is itself translated when the dictionary has it.
 */
type Pattern = { re: RegExp; keys: string[]; out: string };
const NUMERIC = new Set(["n", "shown", "total", "count"]);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function compile(key: string, out: string): Pattern | null {
  const parts = key.split(/(\{\w+\})/);
  const keys: string[] = [];
  let src = "";
  for (const p of parts) {
    const m = /^\{(\w+)\}$/.exec(p);
    if (!m) {
      src += escape(p);
      continue;
    }
    keys.push(m[1]);
    src += NUMERIC.has(m[1]) ? "(\\d[\\d,.]*)" : m[1] === "name" ? "([A-Z0-9].*?)" : "(.+?)";
  }
  // A key that is only placeholders would match everything.
  if (!keys.length || !parts.some((p) => p && !/^\{\w+\}$/.test(p) && /\p{L}/u.test(p))) return null;
  return { re: new RegExp(`^${src}$`), keys, out };
}

const ATTRS = ["aria-label", "placeholder", "title", "alt"] as const;
const SKIP = "script,style,noscript,code,pre,textarea,svg,[data-no-translate],[contenteditable='true']";
const wordy = (s: string) => /\p{L}{2,}[\s,]+\p{L}{2,}/u.test(s);

const withSpace = (raw: string, tr: string) => {
  const lead = /^\s*/.exec(raw)![0];
  const trail = /\s*$/.exec(raw)![0];
  return lead + tr + trail;
};

export class DomTranslator {
  private dict: Dict | null = null;
  private patterns: Pattern[] = [];
  /** Translations rendered directly by components with t() also count as translated. */
  private values = new Set<string>();
  private src = new WeakMap<Text, string>();
  private out = new WeakMap<Text, string>();
  private nodes = new Set<Text>();
  private attrSrc = new WeakMap<Element, Map<string, { src: string; out: string }>>();
  private els = new Set<Element>();
  private enMarked = new Set<Element>();
  private mo: MutationObserver | null = null;
  private timer = 0;

  private onCoverage: (c: number | null) => void;

  constructor(onCoverage: (c: number | null) => void) {
    this.onCoverage = onCoverage;
  }

  apply(dict: Dict | null) {
    this.dict = dict;
    if (!dict) {
      this.stop();
      this.restore();
      this.onCoverage(null);
      return;
    }
    this.values = new Set([...dict.values()].map(norm));
    this.patterns = [];
    dict.forEach((out, key) => {
      if (!key.includes("{")) return;
      const p = compile(key, out);
      if (p) this.patterns.push(p);
    });
    this.walk(document.body);
    const title = document.querySelector("title");
    if (title) this.walk(title);
    this.start();
    this.measureSoon();
  }

  /** Re-measure (e.g. after a route change). */
  measureSoon(delay = 450) {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.measure(), delay);
  }

  destroy() {
    this.apply(null);
    window.clearTimeout(this.timer);
  }

  /* ── internals ── */

  private lookup(raw: string): string | null {
    const k = norm(raw);
    if (!k || !this.dict) return null;
    const hit = this.dict.get(k);
    if (hit != null) return hit;
    if (!/\p{L}{2,}/u.test(k)) return null;
    for (const p of this.patterns) {
      const m = p.re.exec(k);
      if (!m) continue;
      const vals: Record<string, string> = {};
      p.keys.forEach((name, i) => {
        const v = m[i + 1];
        vals[name] = this.dict!.get(v) ?? v;
      });
      return p.out.replace(/\{(\w+)\}/g, (all, name: string) => (name in vals ? vals[name] : all));
    }
    return null;
  }

  private text(n: Text) {
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    const cur = n.nodeValue ?? "";
    let src = this.src.get(n);
    // React (or anything else) replaced the text since we last touched it: that is the new original.
    if (src === undefined || cur !== this.out.get(n)) src = cur;
    const tr = this.lookup(src);
    if (tr == null) {
      if (this.nodes.has(n)) {
        this.nodes.delete(n);
        this.src.delete(n);
        this.out.delete(n);
      }
      return;
    }
    const next = withSpace(src, tr);
    this.src.set(n, src);
    this.out.set(n, next);
    this.nodes.add(n);
    if (cur !== next) n.nodeValue = next;
  }

  private attrs(el: Element) {
    if (el.closest(SKIP)) return;
    for (const a of ATTRS) {
      const cur = el.getAttribute(a);
      if (cur == null) continue;
      let m = this.attrSrc.get(el);
      const rec = m?.get(a);
      const src = rec && rec.out === cur ? rec.src : cur;
      const tr = this.lookup(src);
      if (tr == null) {
        m?.delete(a);
        continue;
      }
      if (!m) this.attrSrc.set(el, (m = new Map()));
      m.set(a, { src, out: tr });
      this.els.add(el);
      if (cur !== tr) el.setAttribute(a, tr);
    }
  }

  private walk(root: Node) {
    if (root.nodeType === Node.TEXT_NODE) return this.text(root as Text);
    if (!(root instanceof Element) || root.closest(SKIP)) return;
    this.attrs(root);
    root.querySelectorAll("[aria-label],[placeholder],[title],img[alt]").forEach((e) => this.attrs(e));
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) this.text(n as Text);
  }

  private start() {
    if (this.mo) return;
    this.mo = new MutationObserver((list) => {
      if (!this.dict) return;
      let main = false;
      for (const m of list) {
        if (m.type === "characterData") this.text(m.target as Text);
        else if (m.type === "attributes") this.attrs(m.target as Element);
        else m.addedNodes.forEach((n) => this.walk(n));
        const el = m.target instanceof Element ? m.target : m.target.parentElement;
        if (!main && el?.closest("#main-content")) main = true;
      }
      if (main) this.measureSoon();
    });
    const opts = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] };
    this.mo.observe(document.body, opts);
    const title = document.querySelector("title");
    if (title) this.mo.observe(title, { subtree: true, childList: true, characterData: true });
  }

  private stop() {
    this.mo?.disconnect();
    this.mo = null;
  }

  private restore() {
    for (const n of this.nodes) {
      if (n.isConnected && n.nodeValue === this.out.get(n)) n.nodeValue = this.src.get(n) ?? n.nodeValue;
    }
    for (const el of this.els) {
      this.attrSrc.get(el)?.forEach((r, a) => {
        if (el.getAttribute(a) === r.out) el.setAttribute(a, r.src);
      });
    }
    for (const el of this.enMarked) el.removeAttribute("lang");
    this.nodes.clear();
    this.els.clear();
    this.enMarked.clear();
    this.src = new WeakMap();
    this.out = new WeakMap();
    this.attrSrc = new WeakMap();
  }

  /** How much of the main content is in the chosen language; mark English leftovers lang="en". */
  private measure() {
    const main = document.getElementById("main-content");
    if (!main || !this.dict) return;
    let done = 0;
    let total = 0;
    const english = new Set<Element>();
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode() as Text | null; n; n = w.nextNode() as Text | null) {
      const p = n.parentElement;
      const s = n.nodeValue ?? "";
      if (!p || !wordy(s) || p.closest(SKIP) || p.closest("[data-i18n-notice]")) continue;
      const len = norm(s).length;
      total += len;
      if (p.closest("[data-i18n-done]") || this.values.has(norm(s)) || (this.nodes.has(n) && this.out.get(n) === s)) done += len;
      else english.add(p);
    }
    for (const el of this.enMarked) if (!english.has(el)) el.removeAttribute("lang");
    const marked = new Set<Element>();
    english.forEach((el) => {
      if (this.enMarked.has(el) || !el.hasAttribute("lang")) {
        el.setAttribute("lang", "en");
        marked.add(el);
      }
    });
    this.enMarked = marked;
    this.onCoverage(total ? done / total : 1);
  }
}
