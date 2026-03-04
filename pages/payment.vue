<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
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
              ${{ membershipFees[profile?.membership_type] || 0 }}.00
            </p>
            <p class="text-sm text-gray-600 mt-1">One-time payment</p>
          </div>
          <div class="text-5xl">💳</div>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Payment Information
        </h2>

        <form @submit.prevent="handlePayment" class="space-y-6">
          <!-- Card Holder Name -->
          <div>
            <label
              for="card-name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Cardholder Name *
            </label>
            <input
              id="card-name"
              v-model="paymentForm.cardName"
              type="text"
              required
              class="input-field"
              placeholder="John Doe"
            />
          </div>

          <!-- Card Details (Stripe Elements would go here in production) -->
          <div>
            <label
              for="card-number"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Number *
            </label>
            <input
              id="card-number"
              v-model="paymentForm.cardNumber"
              type="text"
              required
              class="input-field"
              placeholder="4242 4242 4242 4242"
              maxlength="19"
              @input="formatCardNumber"
            />
            <p class="text-xs text-gray-500 mt-1">
              For demo: Use 4242 4242 4242 4242
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="expiry"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date *
              </label>
              <input
                id="expiry"
                v-model="paymentForm.expiry"
                type="text"
                required
                class="input-field"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
              />
            </div>
            <div>
              <label
                for="cvc"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                CVC *
              </label>
              <input
                id="cvc"
                v-model="paymentForm.cvc"
                type="text"
                required
                class="input-field"
                placeholder="123"
                maxlength="4"
              />
            </div>
          </div>

          <!-- Billing Address -->
          <div>
            <label
              for="billing-address"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Billing Address
            </label>
            <input
              id="billing-address"
              v-model="paymentForm.billingAddress"
              type="text"
              class="input-field"
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="paymentForm.acceptTerms"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              I agree to the payment terms and conditions. This is a one-time
              non-refundable membership fee.
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="processing || !paymentForm.acceptTerms"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="processing">Processing Payment...</span>
              <span v-else
                >Pay ${{
                  membershipFees[profile?.membership_type] || 0
                }}.00</span
              >
            </button>
          </div>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div
            class="flex items-center justify-center space-x-4 text-sm text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>Secure payment powered by Stripe</span>
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
definePageMeta({
  layout: false,
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const profile = ref<any>(null);
const processing = ref(false);
const error = ref("");
const success = ref("");

// Membership fees based on type
const membershipFees: Record<string, number> = {
  associate: 50,
  honourary: 0, // Honourary members might be free
  regular: 100,
};

const paymentForm = ref({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  billingAddress: "",
  acceptTerms: false,
});

onMounted(async () => {
  if (!user.value) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.value.id)
    .single();

  profile.value = data;

  // Check if user should be on this page
  if (data?.membership_status === "active") {
    // Already paid, redirect to dashboard
    navigateTo("/dashboard");
  } else if (
    data?.membership_status !== "verified" &&
    data?.membership_status !== "pending_payment"
  ) {
    // Not yet verified, redirect to verification page
    navigateTo("/verification-pending");
  }

  // Pre-fill card name with user's name
  if (data?.full_name) {
    paymentForm.value.cardName = data.full_name;
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

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  paymentForm.value.cardNumber = formattedValue;
};

const formatExpiry = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  paymentForm.value.expiry = value;
};

const handlePayment = async () => {
  error.value = "";
  success.value = "";
  processing.value = true;

  try {
    if (!user.value || !profile.value) {
      throw new Error("User or profile not found");
    }

    // Validate card number (basic validation for demo)
    const cardNumber = paymentForm.value.cardNumber.replace(/\s/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      throw new Error("Invalid card number");
    }

    // In production, you would:
    // 1. Create a Stripe payment intent on your backend
    // 2. Confirm the payment with Stripe
    // 3. Update the database after successful payment

    // For demo purposes, simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate successful payment for demo card
    if (cardNumber === "4242424242424242") {
      const paymentAmount = membershipFees[profile.value.membership_type] || 0;

      // Update profile with payment information
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          membership_status: "active",
          payment_status: "paid",
          payment_amount: paymentAmount,
          payment_date: new Date().toISOString(),
          stripe_payment_intent_id: `pi_demo_${Date.now()}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.value.id);

      if (updateError) throw updateError;

      success.value = "Payment successful! Redirecting to dashboard...";

      setTimeout(() => {
        navigateTo("/dashboard");
      }, 2000);
    } else {
      throw new Error(
        "Payment failed. Please use card 4242 4242 4242 4242 for demo.",
      );
    }
  } catch (err: any) {
    error.value = err.message || "Payment processing failed";
  } finally {
    processing.value = false;
  }
};
</script>
