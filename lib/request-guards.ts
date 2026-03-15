import { NextRequest, NextResponse } from "next/server";

export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || "";

  if (!host || originHost === host) {
    return null;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      if (originHost === new URL(appUrl).host) {
        return null;
      }
    } catch {
      // ignore invalid app url
    }
  }

  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}

export function normalizeEmail(input: unknown): string {
  return typeof input === "string" ? input.trim().toLowerCase() : "";
}
