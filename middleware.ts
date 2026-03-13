import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: object) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: object) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl;
  const { pathname, searchParams } = url;

  if (pathname === "/dashboard/billing") {
    const billingUrl = url.clone();
    billingUrl.pathname = "/billing";
    return NextResponse.redirect(billingUrl);
  }

  // If a logged-in user is sent to the homepage with any query parameters
  // (e.g. from Paddle payment links like /?_ptdn=...), treat it as a
  // post-checkout callback and send them to the billing page instead.
  const hasQueryParams = searchParams.toString().length > 0;

  // Redirect logged-in users from homepage with query params to billing,
  // but NOT when it's a Paddle checkout overlay (_ptxn) — that must stay on /.
  if (pathname === "/" && user && hasQueryParams && !searchParams.has("_ptxn")) {
    const billingUrl = url.clone();
    billingUrl.pathname = "/billing";
    billingUrl.search = "";
    return NextResponse.redirect(billingUrl);
  }

  // Protect dashboard and app routes (including billing)
  const protectedPaths = ["/dashboard", "/proposals", "/templates", "/clients", "/settings", "/onboarding", "/analytics", "/pipeline", "/contracts", "/invoices"];
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    const originalPath = pathname + (url.search ? url.search : "");
    loginUrl.searchParams.set("redirectTo", originalPath);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login" || pathname === "/signup") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
