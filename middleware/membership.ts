export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (!user.value) {
    return navigateTo("/auth/login");
  }

  // Check if user has selected a membership and completed all steps
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "membership_type, membership_status, biodata_completed, payment_status",
    )
    .eq("id", user.value.id)
    .single();

  if (!profile?.membership_type) {
    // User hasn't selected a membership yet
    return navigateTo("/auth/select-membership");
  }

  // Check membership status and redirect accordingly
  const status = profile.membership_status;

  // If on profile page with biodata query, allow access
  if (to.path === "/profile" && to.query.biodata === "true") {
    return;
  }

  // If status is pending_biodata, redirect to profile to complete biodata
  if (status === "pending_biodata" && to.path !== "/profile") {
    return navigateTo("/profile?biodata=true");
  }

  // If status is pending_verification, redirect to verification page
  if (
    status === "pending_verification" &&
    to.path !== "/verification-pending"
  ) {
    return navigateTo("/verification-pending");
  }

  // If status is verified or pending_payment, redirect to payment page
  if (
    (status === "verified" || status === "pending_payment") &&
    to.path !== "/payment" &&
    to.path !== "/verification-pending"
  ) {
    return navigateTo("/payment");
  }

  // If status is active, allow access to all pages
  if (status === "active") {
    return;
  }

  // If inactive or any other status, redirect to verification page
  if (status === "inactive") {
    return navigateTo("/verification-pending");
  }
});
