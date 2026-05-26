import { describe, expect, it } from "vitest";
import { resolveMembershipRedirect } from "../../utils/membershipFlow";

describe("resolveMembershipRedirect", () => {
  it("redirects to membership selection when membership type is missing", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: null, membership_status: "active" },
      ),
    ).toBe("/auth/select-membership");
  });

  it("allows biodata profile route during pending biodata", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/profile", query: { biodata: "true" } },
        { membership_type: "regular", membership_status: "pending_biodata" },
      ),
    ).toBeNull();
  });

  it("redirects pending biodata users to profile completion", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: "regular", membership_status: "pending_biodata" },
      ),
    ).toBe("/profile?biodata=true");
  });

  it("redirects pending verification users to verification pending page", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        {
          membership_type: "associate",
          membership_status: "pending_verification",
        },
      ),
    ).toBe("/verification-pending");
  });

  it("allows pending verification users on verification page", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/verification-pending", query: {} },
        {
          membership_type: "associate",
          membership_status: "pending_verification",
        },
      ),
    ).toBeNull();
  });

  it("redirects verified users to payment for protected routes", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: "regular", membership_status: "verified" },
      ),
    ).toBe("/payment");
  });

  it("allows verified users on verification-pending page", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/verification-pending", query: {} },
        { membership_type: "regular", membership_status: "verified" },
      ),
    ).toBeNull();
  });

  it("redirects pending payment users to payment", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/profile", query: {} },
        { membership_type: "honourary", membership_status: "pending_payment" },
      ),
    ).toBe("/payment");
  });

  it("allows active users on all routes", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: "regular", membership_status: "active" },
      ),
    ).toBeNull();
  });

  it("redirects inactive users to verification-pending", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: "associate", membership_status: "inactive" },
      ),
    ).toBe("/verification-pending");
  });

  it("does not bypass pending biodata redirect when biodata query is non-string", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: { biodata: ["true"] } },
        { membership_type: "regular", membership_status: "pending_biodata" },
      ),
    ).toBe("/profile?biodata=true");
  });

  it("returns no redirect for unknown status with membership selected", () => {
    expect(
      resolveMembershipRedirect(
        { path: "/dashboard", query: {} },
        { membership_type: "regular", membership_status: "unknown_status" },
      ),
    ).toBeNull();
  });
});
