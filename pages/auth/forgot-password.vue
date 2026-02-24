<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        >
          {{ error }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
        >
          {{ successMessage }}
        </div>

        <div v-if="!successMessage">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email address</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="your.email@university.edu"
          />
        </div>

        <div v-if="!successMessage">
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Sending reset link...</span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>

        <div class="text-center space-y-2">
          <NuxtLink
            to="/auth/login"
            class="block text-sm text-primary-600 hover:text-primary-500"
          >
            Back to Sign In
          </NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="block text-sm text-gray-600 hover:text-gray-500"
          >
            Don't have an account? Sign up
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const supabase = useSupabaseClient();
const config = useRuntimeConfig();

const email = ref("");
const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const handleForgotPassword = async () => {
  error.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
    );

    if (resetError) throw resetError;

    successMessage.value =
      "Password reset link sent! Check your email inbox (and spam folder).";
  } catch (err: any) {
    error.value = err.message || "Failed to send reset link";
  } finally {
    loading.value = false;
  }
};
</script>
