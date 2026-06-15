"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/locale-routing";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Internal link that preserves the active locale prefix (/ja/..., /en/..., or Thai unprefixed). */
export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const locale = useLocale();
  return <Link href={localePath(href, locale)} {...props} />;
}
