"use client";

/**
 * Small adapter so components written for react-router run unchanged on the Next.js App Router:
 * <Link to>, useLocation, useNavigate, useSearchParams ([params, setParams]) and <Navigate>.
 * Next changes the URL with history.pushState/replaceState, which fire no events, so the history
 * methods are wrapped once to announce every change; hooks re-read search and hash from it.
 */
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

export type To = string | { pathname?: string; search?: string; hash?: string };
type NavOptions = { replace?: boolean; preventScrollReset?: boolean; state?: unknown };

const EVT = "pencom:locationchange";

if (typeof window !== "undefined") {
  const w = window as typeof window & { __pencomHistoryPatched?: boolean };
  if (!w.__pencomHistoryPatched) {
    w.__pencomHistoryPatched = true;
    for (const m of ["pushState", "replaceState"] as const) {
      const orig = history[m].bind(history);
      history[m] = (...args: Parameters<History["pushState"]>) => {
        orig(...args);
        // Next calls these from an insertion effect, where updates are not allowed: announce afterwards.
        queueMicrotask(() => window.dispatchEvent(new Event(EVT)));
      };
    }
    window.addEventListener("popstate", () => window.dispatchEvent(new Event(EVT)));
    window.addEventListener("hashchange", () => window.dispatchEvent(new Event(EVT)));
  }
}

export function toHref(to: To): string {
  if (typeof to === "string") return to;
  const path = to.pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const hash = to.hash ? (to.hash.startsWith("#") ? to.hash : `#${to.hash}`) : "";
  const search = to.search ? (to.search.startsWith("?") ? to.search : `?${to.search}`) : "";
  return `${path}${search}${hash}`;
}

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & NavOptions & { to: To; children?: ReactNode };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, replace, preventScrollReset, state, ...rest }, ref) {
  void state;
  return <NextLink ref={ref} href={toHref(to)} replace={replace} scroll={!preventScrollReset} {...rest} />;
});

export function useLocation() {
  const pathname = usePathname() ?? "/";
  const [loc, setLoc] = useState({ search: "", hash: "" });
  useEffect(() => {
    const read = () => setLoc((p) => (p.search === window.location.search && p.hash === window.location.hash ? p : { search: window.location.search, hash: window.location.hash }));
    read();
    window.addEventListener(EVT, read);
    return () => window.removeEventListener(EVT, read);
  }, [pathname]);
  return { pathname, search: loc.search, hash: loc.hash, state: null as unknown, key: pathname };
}

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (to: To | number, opts?: NavOptions) => {
      if (typeof to === "number") {
        window.history.go(to);
        return;
      }
      const href = toHref(to);
      if (opts?.replace) router.replace(href, { scroll: !opts?.preventScrollReset });
      else router.push(href, { scroll: !opts?.preventScrollReset });
    },
    [router],
  );
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>, opts?: NavOptions) => void] {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const set = useCallback(
    (next: URLSearchParams | Record<string, string>, opts?: NavOptions) => {
      const s = new URLSearchParams(next as Record<string, string>).toString();
      navigate(`${pathname}${s ? `?${s}` : ""}${window.location.hash}`, opts);
    },
    [navigate, pathname],
  );
  return [params, set];
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
