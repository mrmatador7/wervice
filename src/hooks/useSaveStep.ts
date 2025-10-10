"use client";

import { toast } from "sonner";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export function useSaveStep(step: number) {
  const [loading, setLoading] = useState(false);

  const save = async (data: Record<string, any>, opts?: { complete?: boolean }) => {
    setLoading(true);
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      const userId = session.user.id;

      // Prepare the data to save
      const stepKey = `step_${step}`;
      const onboardingData = {
        [stepKey]: data
      };

      // Check if profile exists, if not create it
      let { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, onboarding_data, onboarded')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            onboarded: false,
            user_type: 'user',
            user_status: 'active',
            onboarding_data: onboardingData
          })
          .select('id, onboarding_data, onboarded')
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw new Error('Failed to create profile');
        }

        profile = newProfile;
      } else if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw new Error('Failed to fetch profile');
      }

      // Update the onboarding data
      const existingData = profile?.onboarding_data || {};
      const updatedData = {
        ...existingData,
        ...onboardingData
      };

      const updateData: any = {
        onboarding_data: updatedData,
        updated_at: new Date().toISOString()
      };

      // If completing onboarding, mark as onboarded
      if (opts?.complete) {
        updateData.onboarded = true;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error('Failed to save onboarding data');
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
