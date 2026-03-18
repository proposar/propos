"use client";

import type React from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthAwareLinkProps extends Omit<LinkProps, "href"> {
  authenticatedHref?: string;
  unauthenticatedHref: string;
  children?: React.ReactNode;
  className?: string;
}

export function AuthAwareLink({
  authenticatedHref = "/dashboard",
  unauthenticatedHref,
  children,
  ...linkProps
}: AuthAwareLinkProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (busy) return;
      setBusy(true);
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        router.push(session ? authenticatedHref : unauthenticatedHref);
      } catch (error) {
        router.push(unauthenticatedHref);
      } finally {
        setBusy(false);
      }
    },
    [authenticatedHref, unauthenticatedHref, router, busy]
  );

  return (
    <Link {...linkProps} href={unauthenticatedHref} onClick={handleClick} role="link">
      {children}
    </Link>
  );
}
