<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
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

        <div v-if="!successMessage" class="space-y-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >New Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="!successMessage">
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Updating password...</span>
            <span v-else>Update Password</span>
          </button>
        </div>

        <div v-if="successMessage" class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Go to Sign In →
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

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const handleResetPassword = async () => {
  error.value = "";
  successMessage.value = "";

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  // Validate password length
  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (updateError) throw updateError;

    successMessage.value =
      "Password updated successfully! You can now sign in with your new password.";

    // Clear form
    password.value = "";
    confirmPassword.value = "";

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigateTo("/auth/login");
    }, 2000);
  } catch (err: any) {
    error.value = err.message || "Failed to update password";
  } finally {
    loading.value = false;
  }
};
</script>
