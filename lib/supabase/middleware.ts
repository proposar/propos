import { createServerClient } from "@supabase/ssr";

export async function createClient(
  request: Request,
  response: { cookies: { get: (n: string) => { value: string }; set: (n: string, v: string, o: object) => void } }
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return response.cookies.get(name)?.value ?? "";
        },
        set(name: string, value: string, options: object) {
          response.cookies.set(name, value, options);
        },
      },
    }
  );
}
