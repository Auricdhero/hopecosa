<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome back to the student association
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        >
          {{ error }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email address</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="your.email@university.edu"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Password</label
            >
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/auth/signup"
            class="text-sm text-primary-600 hover:text-primary-500"
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
const user = useSupabaseUser();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    });

    if (signInError) throw signInError;

    navigateTo("/dashboard");
  } catch (err: any) {
    error.value = err.message || "Invalid email or password";
  } finally {
    loading.value = false;
  }
};
</script>
