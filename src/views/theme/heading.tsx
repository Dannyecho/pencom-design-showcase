"use client";

import type { ReactNode } from "react";
import Headline from "./Headline";

/**
 * Old-style SectionHeading props mapped onto the showcase Headline (ghost word, pill tag, gradient mark), so
 * ported sections keep their markup while taking the theme’s look. Sections are not numbered in this theme;
 * `n` is kept for compatibility and ignored.
 */
export function SectionHeading({
  n,
  id,
  eyebrow,
  title,
  highlight,
  intro,
  dark,
  action,
  stacked,
}: {
  n?: string;
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: ReactNode;
  dark?: boolean;
  action?: ReactNode;
  stacked?: boolean;
}) {
  return <Headline id={id} n={n} kicker={eyebrow} title={title} mark={highlight} intro={intro} dark={dark} action={action} stacked={stacked} />;
}
