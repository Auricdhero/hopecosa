<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Membership Payment
        </h1>
        <p class="text-lg text-gray-600">
          Your application has been verified! Complete your payment to activate
          your membership.
        </p>
      </div>

      <div
        v-if="error"
        class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
      >
        {{ success }}
      </div>

      <!-- Membership Details Card -->
      <div v-if="profile" class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Membership Details
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Membership Type</p>
            <p class="font-medium text-gray-900">
              {{ getMembershipLabel(profile.membership_type) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Member Name</p>
            <p class="font-medium text-gray-900">{{ profile.full_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium text-gray-900">{{ profile.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Verification Date</p>
            <p class="font-medium text-gray-900">
              {{ formatDate(profile.verified_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Amount Card -->
      <div class="card mb-6 bg-gradient-to-r from-primary-50 to-blue-50">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600 mb-1">Membership Dues</p>
            <p class="text-4xl font-bold text-gray-900">
              ₵{{ membershipFees[profile?.membership_type] || 0 }}.00
            </p>
            <p class="text-sm text-gray-600 mt-1">One-time payment</p>
          </div>
          <div class="text-5xl">📱</div>
        </div>
      </div>

      <!-- Payment Methods & Form -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Pay with Mobile Money
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          Select your preferred mobile money network. You will be prompted to
          approve the payment on your phone.
        </p>

        <!-- Mobile Money Network Badges -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div
            class="border-2 border-yellow-400 rounded-xl p-4 flex flex-col items-center bg-yellow-50"
          >
            <div
              class="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-3"
            >
              <span class="font-extrabold text-white text-sm tracking-tight"
                >MTN</span
              >
            </div>
            <p class="font-semibold text-gray-800 text-sm text-center">
              MTN Mobile Money
            </p>
            <p class="text-xs text-gray-500 mt-1 text-center">MoMo</p>
          </div>

          <div
            class="border-2 border-red-400 rounded-xl p-4 flex flex-col items-center bg-red-50"
          >
            <div
              class="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mb-3"
            >
              <span class="font-extrabold text-white text-xs tracking-tight"
                >Telecel</span
              >
            </div>
            <p class="font-semibold text-gray-800 text-sm text-center">
              Telecel Cash
            </p>
            <p class="text-xs text-gray-500 mt-1 text-center">formerly Vodafone Cash</p>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start mb-6">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label for="terms" class="ml-2 text-sm text-gray-600">
            I agree to the payment terms and conditions. This is a one-time
            non-refundable membership fee.
          </label>
        </div>

        <!-- Pay Button -->
        <div class="pt-2">
          <button
            :disabled="processing || !acceptTerms || !profile"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handlePayment"
          >
            <span v-if="processing">Processing Payment...</span>
            <span v-else>
              Pay ₵{{ membershipFees[profile?.membership_type] || 0 }}.00 via
              Mobile Money
            </span>
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div
            class="flex items-center justify-center space-x-2 text-sm text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>Secure payment powered by Paystack</span>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink
          to="/verification-pending"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Status
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

definePageMeta({
  layout: false,
  middleware: "auth",
});

useHead({
  script: [{ src: "https://js.paystack.co/v1/inline.js", defer: true }],
});

const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const profile = ref<any>(null);
const processing = ref(false);
const acceptTerms = ref(false);
const error = ref("");
const success = ref("");

// Membership fees in GHS
const membershipFees: Record<string, number> = {
  associate: 20,
  honourary: 20,
  regular: 20,
};

onMounted(async () => {
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

  if (data?.membership_status === "active") {
    navigateTo("/dashboard");
  } else if (
    data?.membership_status !== "verified" &&
    data?.membership_status !== "pending_payment"
  ) {
    navigateTo("/verification-pending");
  }
});

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

const handlePayment = () => {
  if (!profile.value || !user.value) return;

  const amount = membershipFees[profile.value.membership_type] ?? 0;

  // Honourary members pay nothing — activate directly
  if (amount === 0) {
    activateMembership("FREE_HONOURARY");
    return;
  }

  const reference = `hopecosa_${user.value.id}_${Date.now()}`;
  processing.value = true;
  error.value = "";

  const handler = window.PaystackPop.setup({
    key: config.public.paystackPublicKey,
    email: profile.value.email,
    amount: amount * 100, // Paystack expects pesewas (1 GHS = 100 pesewas)
    currency: "GHS",
    ref: reference,
    channels: ["mobile_money"],
    metadata: {
      userId: user.value.id,
      membershipType: profile.value.membership_type,
    },
    callback: (response: { reference: string }) => {
      verifyAndActivate(response.reference);
    },
    onClose: () => {
      processing.value = false;
    },
  });

  handler.openIframe();
};

const verifyAndActivate = async (reference: string) => {
  try {
    const result = await $fetch<{
      data: { status: string; amount: number };
    }>(`/api/payment/verify?reference=${encodeURIComponent(reference)}`);

    if (result?.data?.status === "success") {
      await activateMembership(reference, result.data.amount / 100);
    } else {
      throw new Error("Payment verification failed. Please contact support.");
    }
  } catch (err: any) {
    error.value = err.message || "Payment verification failed";
    processing.value = false;
  }
};

const activateMembership = async (reference: string, amount?: number) => {
  try {
    const paymentAmount =
      amount ?? membershipFees[profile.value.membership_type] ?? 0;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        membership_status: "active",
        payment_status: "paid",
        payment_amount: paymentAmount,
        payment_date: new Date().toISOString(),
        paystack_transaction_id: reference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.value!.id);

    if (updateError) throw updateError;

    success.value = "Payment successful! Redirecting to dashboard...";
    setTimeout(() => navigateTo("/dashboard"), 2000);
  } catch (err: any) {
    error.value = err.message || "Failed to activate membership";
  } finally {
    processing.value = false;
  }
};
</script>
