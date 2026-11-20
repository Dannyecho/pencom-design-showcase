/** Splits a Service Charter requirement ("1) … 2) …", "a) …", "• …") into checklist items. */
export function splitReq(req: string) {
  const parts = req
    .split(/\s+•\s+|\s(?=(?:\d{1,2}\)|[a-h]\)|[ivx]{1,4}\.|\d{1,2}\.)\s+[A-Z(])/)
    .map((s) => s.trim().replace(/^(?:\d{1,2}\)|[a-h]\)|[ivx]{1,4}\.|\d{1,2}\.)\s+/, ""))
    .filter((s) => s.length > 1);
  return parts.length ? parts : [req];
}
