"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/views/theme/ui";

/**
 * Adapters so the Resources sections keep their logic while taking the "for everyone" look:
 * SectionHeading renders the home page's numbered title (Headline), and Dialog/DialogContent/DialogTitle/
 * DialogDescription render the theme's accessible Modal.
 */

export { SectionHeading } from "@/views/theme/heading";

const DialogCtx = createContext<{ open: boolean; onClose: () => void; titleId: string; descId: string }>({ open: false, onClose: () => {}, titleId: "", descId: "" });

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (o: boolean) => void; children: ReactNode }) {
  const id = useId();
  return <DialogCtx.Provider value={{ open, onClose: () => onOpenChange(false), titleId: `${id}-t`, descId: `${id}-d` }}>{children}</DialogCtx.Provider>;
}

export function DialogContent({ className, children }: { className?: string; children: ReactNode }) {
  const c = useContext(DialogCtx);
  // Keep sizing classes; drop the old library's close-button overrides.
  const keep = (className ?? "")
    .split(/\s+/)
    .filter((k) => /^(sm:)?max-w-|^max-h-/.test(k))
    .join(" ");
  return (
    <Modal open={c.open} onClose={c.onClose} labelledBy={c.titleId} className={cn("max-w-3xl", keep)}>
      {children}
    </Modal>
  );
}

export function DialogTitle({ className, children }: { className?: string; children: ReactNode }) {
  const c = useContext(DialogCtx);
  return (
    <h2 id={c.titleId} className={className}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children }: { className?: string; children: ReactNode }) {
  const c = useContext(DialogCtx);
  return (
    <p id={c.descId} className={className}>
      {children}
    </p>
  );
}
