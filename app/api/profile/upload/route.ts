import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null; // "avatar" | "logo"
  if (!file || !type || !["avatar", "logo"].includes(type)) {
    return NextResponse.json({ error: "Invalid file or type" }, { status: 400 });
  }

  const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
  }
  const mime = file.type?.toLowerCase();
  if (!mime || !ALLOWED_MIME.includes(mime)) {
    return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." }, { status: 400 });
  }

  const bucket = type === "avatar" ? "avatars" : "logos";
  const ext = file.name.split(".").pop() || "png";
  const path = `${user.id}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (uploadError) {
    const msg = uploadError.message?.includes("Bucket not found")
      ? "Storage bucket not configured. Create 'avatars' and 'logos' buckets in Supabase Dashboard > Storage."
      : uploadError.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
  const field = type === "avatar" ? "avatar_url" : "logo_url";
  await supabase.from("profiles").update({ [field]: publicUrl }).eq("id", user.id);

  return NextResponse.json({ url: publicUrl });
}
