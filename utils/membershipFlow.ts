export interface MembershipProfile {
  membership_type?: string | null;
  membership_status?: string | null;
}

export interface MembershipRoute {
  path: string;
  query?: Record<string, unknown>;
}

export function resolveMembershipRedirect(
  to: MembershipRoute,
  profile?: MembershipProfile | null,
): string | null {
  if (!profile?.membership_type) {
    return "/auth/select-membership";
  }

  const status = profile.membership_status;

  if (to.path === "/profile" && to.query?.biodata === "true") {
    return null;
  }

  if (status === "pending_biodata" && to.path !== "/profile") {
    return "/profile?biodata=true";
  }

  if (status === "pending_verification" && to.path !== "/verification-pending") {
    return "/verification-pending";
  }

  if (
    (status === "verified" || status === "pending_payment") &&
    to.path !== "/payment" &&
    to.path !== "/verification-pending"
  ) {
    return "/payment";
  }

  if (status === "active") {
    return null;
  }

  if (status === "inactive") {
    return "/verification-pending";
  }

  return null;
}
