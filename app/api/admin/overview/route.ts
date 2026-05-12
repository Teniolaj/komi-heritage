import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminOverviewStats, getRecentOrders } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export async function GET() {
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

    if (!profile || !["admin"].includes(profile.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [stats, recentOrders] = await Promise.all([
      getAdminOverviewStats(),
      getRecentOrders(5),
    ]);

    return NextResponse.json({ stats, recentOrders });
  } catch (err) {
    console.error("Admin overview API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
