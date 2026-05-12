import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MENU_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_MENU_IMAGES_BUCKET ?? "menu-item-images";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown upload error";
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files can be uploaded." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File is too large. Please use an image smaller than 5MB." },
        { status: 400 },
      );
    }

    const fileExt = file.name.split(".").pop() || file.type.split("/").pop() || "jpg";
    const filePath = `menu-items/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(MENU_IMAGE_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Admin menu image upload failed:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: "statusCode" in uploadError ? Number(uploadError.statusCode) : 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error("Admin menu image API error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
