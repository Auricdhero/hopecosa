<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-2 text-gray-600">Overview of HOPECOSA activity</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-gray-600">Total Members</p>
        <p class="text-3xl font-bold text-primary-600">
          {{ stats.totalMembers }}
        </p>
      </div>

      <div class="card">
        <p class="text-sm text-gray-600">Pending Verification</p>
        <p class="text-3xl font-bold text-yellow-600">
          {{ stats.pendingVerification }}
        </p>
      </div>

      <div class="card">
        <p class="text-sm text-gray-600">Active Members</p>
        <p class="text-3xl font-bold text-green-600">
          {{ stats.activeMembers }}
        </p>
      </div>

      <div class="card">
        <p class="text-sm text-gray-600">Total Payments</p>
        <p class="text-3xl font-bold text-blue-600">
          ${{ stats.totalPayments.toFixed(2) }}
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Recent Registrations -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Recent Registrations</h2>
          <NuxtLink
            to="/admin/users"
            class="text-sm text-primary-600 hover:underline"
          >
            View All
          </NuxtLink>
        </div>

        <div
          v-if="recentUsers.length === 0"
          class="text-center py-6 text-gray-500"
        >
          No recent registrations
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="u in recentUsers"
            :key="u.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-sm">{{ u.full_name || "N/A" }}</p>
              <p class="text-xs text-gray-500">{{ u.email }}</p>
            </div>
            <span
              :class="statusBadgeClass(u.membership_status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ formatStatus(u.membership_status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Recent Payments</h2>
          <NuxtLink
            to="/admin/payments"
            class="text-sm text-primary-600 hover:underline"
          >
            View All
          </NuxtLink>
        </div>

        <div
          v-if="recentPayments.length === 0"
          class="text-center py-6 text-gray-500"
        >
          No payments yet
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="p in recentPayments"
            :key="p.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-sm">{{ p.full_name || "N/A" }}</p>
              <p class="text-xs text-gray-500">
                {{ formatDate(p.payment_date) }}
              </p>
            </div>
            <span class="text-sm font-semibold text-green-600">
              ${{ p.payment_amount?.toFixed(2) || "0.00" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProfileRecord {
  id: string;
  full_name: string | null;
  email: string;
  membership_status: string;
  membership_type: string;
  payment_status: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  created_at: string;
}

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const supabase = useSupabaseClient();

const stats = ref({
  totalMembers: 0,
  pendingVerification: 0,
  activeMembers: 0,
  totalPayments: 0,
});

const recentUsers = ref<ProfileRecord[]>([]);
const recentPayments = ref<ProfileRecord[]>([]);

const formatStatus = (status: string) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending_verification: "bg-yellow-100 text-yellow-800",
    pending_biodata: "bg-blue-100 text-blue-800",
    verified: "bg-purple-100 text-purple-800",
    pending_payment: "bg-orange-100 text-orange-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(async () => {
  // Fetch all profiles for stats
  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, membership_status, membership_type, payment_status, payment_amount, payment_date, created_at",
    )
    .order("created_at", { ascending: false });

  if (profiles) {
    const typedProfiles = profiles as ProfileRecord[];
    stats.value.totalMembers = typedProfiles.length;
    stats.value.pendingVerification = typedProfiles.filter(
      (p: ProfileRecord) =>
        p.membership_status === "pending_verification" ||
        p.membership_status === "pending",
    ).length;
    stats.value.activeMembers = typedProfiles.filter(
      (p: ProfileRecord) => p.membership_status === "active",
    ).length;
    stats.value.totalPayments = typedProfiles
      .filter((p: ProfileRecord) => p.payment_status === "paid")
      .reduce(
        (sum: number, p: ProfileRecord) => sum + (p.payment_amount || 0),
        0,
      );

    recentUsers.value = typedProfiles.slice(0, 5);

    recentPayments.value = typedProfiles
      .filter(
        (p: ProfileRecord) => p.payment_status === "paid" && p.payment_amount,
      )
      .sort(
        (a: ProfileRecord, b: ProfileRecord) =>
          new Date(b.payment_date!).getTime() -
          new Date(a.payment_date!).getTime(),
      )
      .slice(0, 5);
  }
});
</script>
