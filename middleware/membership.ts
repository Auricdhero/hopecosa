import { resolveMembershipRedirect } from "~/utils/membershipFlow";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (!user.value) {
    return navigateTo("/auth/login");
  }

  // Check if user has selected a membership and completed all steps
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "membership_type, membership_status, biodata_completed, payment_status",
    )
    .eq("id", user.value.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error checking membership status:", profileError);
    return navigateTo("/auth/select-membership");
  }

  const redirectPath = resolveMembershipRedirect(
    { path: to.path, query: to.query },
    profile,
  );

  if (redirectPath) {
    return navigateTo(redirectPath);
  }
});
