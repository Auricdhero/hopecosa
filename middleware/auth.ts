export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (!user.value) {
    return navigateTo("/auth/login");
  }

  // Only enforce verification lock after membership selection is completed.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("membership_type, membership_status")
    .eq("id", user.value.id)
    .maybeSingle();

  if (error) {
    console.error("Error checking verification status:", error);
    return;
  }

  // If membership has not been selected yet, allow normal onboarding flow.
  if (!profile?.membership_type) {
    return;
  }

  const verifiedStatuses = ["verified", "pending_payment", "active"];
  const isVerified = verifiedStatuses.includes(
    profile?.membership_status || "",
  );

  if (!isVerified && to.path !== "/verification-pending") {
    return navigateTo("/verification-pending");
  }
});
