"use client";

import { toast } from "sonner";
import { useState } from "react";
import { apiUrl } from "@/lib/apiUrl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export function useSaveStep(step: number) {
  const [loading, setLoading] = useState(false);

  const save = async (data: Record<string, any>, opts?: { complete?: boolean }) => {
    setLoading(true);
    try {
      // 1️⃣ Get or refresh token
      let { data: sessionData } = await supabase.auth.getSession();
      let token = sessionData?.session?.access_token;
      if (!token) {
        await supabase.auth.refreshSession();
        const refreshed = await supabase.auth.getSession();
        token = refreshed?.data?.session?.access_token;
      }
      if (!token) throw new Error("Not authenticated. Please sign in again.");

      // 2️⃣ Save onboarding step
      const res = await fetch(apiUrl("/api/onboarding/save"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // fine to keep
        cache: "no-store",
        body: JSON.stringify({
          step,
          data,
          markComplete: opts?.complete ?? false,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed (status ${res.status})`);
      }

      const json = await res.json();
      if (json?.ok !== true) {
        throw new Error(json?.error || `Save failed (status ${res.status})`);
      }

      toast.success("Saved");
      return true;
    } catch (e: any) {
      toast.error(e.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    return save({ skipped: true });
  };

  return { save, skip, loading };
}
