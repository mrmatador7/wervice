// app/api/onboarding/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function getBearerToken(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/onboarding/save" });
}

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized (no token)" }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createSupabaseClient(url, anon, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Verify token & get user
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Unauthorized (invalid token)" }, { status: 401 });
    }
    const userId = userRes.user.id;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Bad request (no body)" }, { status: 400 });
    }
    const { step, data, markComplete } = body as {
      step: number;
      data: any;
      markComplete?: boolean;
    };
    if (typeof step !== "number") {
      return NextResponse.json({ error: "Bad request (step is required)" }, { status: 400 });
    }

    // Load current profile data
    const { data: profile, error: fetchErr } = await supabase
      .from("profiles")
      .select("onboarding_data")
      .eq("id", userId)
      .single();

    if (fetchErr) throw fetchErr;

    const merged = {
      ...(profile?.onboarding_data ?? {}),
      [`step_${step}`]: data,
      last_updated: new Date().toISOString(),
    };

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        onboarding_data: merged,
        ...(markComplete ? { onboarded: true } : {}),
      })
      .eq("id", userId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Onboarding save error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
