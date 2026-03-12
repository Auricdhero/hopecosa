<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-2xl w-full">
      <div class="card text-center">
        <div class="mb-6">
          <div
            class="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Verification Pending
          </h1>
          <p class="text-lg text-gray-600">
            Your membership application is under review
          </p>
        </div>

        <div v-if="profile" class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Application Status
          </h2>

          <div class="space-y-4">
            <!-- Step 1: Signup - Always completed if they're here -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  Sign Up Complete
                </p>
                <p class="text-sm text-gray-500">
                  Account created successfully
                </p>
              </div>
            </div>

            <!-- Step 2: Membership Type - Always completed if they're here -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  Membership Type Selected
                </p>
                <p class="text-sm text-gray-500">
                  {{ getMembershipLabel(profile.membership_type) }}
                </p>
              </div>
            </div>

            <!-- Step 3: Biodata - Always completed if they're here -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  Biodata Submitted
                </p>
                <p class="text-sm text-gray-500">
                  Completed on {{ formatDate(profile.biodata_completed_at) }}
                </p>
              </div>
            </div>

            <!-- Step 4: Verification - Current step -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  Admin Verification
                </p>
                <p class="text-sm text-gray-500">
                  Waiting for admin approval...
                </p>
              </div>
            </div>

            <!-- Step 5: Payment - Pending -->
            <div class="flex items-start opacity-50">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm">5</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">Payment</p>
                <p class="text-sm text-gray-500">
                  Available after verification
                </p>
              </div>
            </div>

            <!-- Step 6: Activation - Pending -->
            <div class="flex items-start opacity-50">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm">6</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  Membership Activation
                </p>
                <p class="text-sm text-gray-500">Final step after payment</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800">
            <strong>What happens next?</strong><br />
            An administrator will review your application and verify your
            details. This typically takes 1-2 business days. You'll receive an
            email notification once your application is approved.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="checkStatus"
            :disabled="checking"
            class="btn-primary disabled:opacity-50"
          >
            <span v-if="checking">Checking...</span>
            <span v-else>Check Status</span>
          </button>
          <NuxtLink
            to="/profile"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Edit Profile
          </NuxtLink>
        </div>

        <div class="mt-6">
          <button
            @click="logout"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profile = ref<any>(null);
const checking = ref(false);

const getMembershipLabel = (type: string) => {
  const labels: Record<string, string> = {
    associate: "Associate Member",
    honourary: "Honourary Member",
    regular: "Regular Member",
  };
  return labels[type] || type;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(async () => {
  await fetchProfile();
});

const fetchProfile = async () => {
  if (!user.value) return;

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.value.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return;
  }

  profile.value = data;

  // If verified, redirect to payment page
  if (data?.membership_status === "verified") {
    navigateTo("/payment");
  }
  // If payment pending, redirect to payment page
  else if (data?.membership_status === "pending_payment") {
    navigateTo("/payment");
  }
  // If active, redirect to dashboard
  else if (data?.membership_status === "active") {
    navigateTo("/dashboard");
  }
};

const checkStatus = async () => {
  checking.value = true;
  await fetchProfile();
  checking.value = false;
};

const logout = async () => {
  await supabase.auth.signOut();
  navigateTo("/auth/login");
};
</script>
