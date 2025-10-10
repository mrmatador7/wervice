"use client";

import { toast } from "sonner";
import { useState } from "react";

export function useSaveStep(step: number) {
  const [loading, setLoading] = useState(false);

  const save = async (data: Record<string, any>, opts?: { complete?: boolean }) => {
    setLoading(true);
    try {
      // Check authentication via API
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      if (!sessionResponse.ok) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      const sessionData = await sessionResponse.json();
      if (!sessionData.user) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      // If completing onboarding, use the complete endpoint
      if (opts?.complete) {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to complete onboarding');
        }

        toast.success("Onboarding completed!");
        return true;
      }

      // Use the save endpoint for regular step saves
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          step: `step_${step}`,
          data
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save step data');
      }

      toast.success("Saved");
      return true;
    } catch (e: any) {
      console.error('Save error:', e);
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
