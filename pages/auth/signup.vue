<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for an account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join the student association today
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
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
              minlength="6"
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Confirm Password</label
            >
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
              minlength="6"
            />
          </div>

          <div>
            <label
              for="full-name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name</label
            >
            <input
              id="full-name"
              v-model="form.fullName"
              type="text"
              required
              class="input-field"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing up...</span>
            <span v-else>Sign Up</span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            Already have an account? Sign in
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
  confirmPassword: "",
  fullName: "",
});

const loading = ref(false);
const error = ref("");

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});

const handleSignup = async () => {
  error.value = "";

  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.value.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName,
        },
      },
    });

    if (signUpError) throw signUpError;

    if (data.user) {
      // Create profile entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: form.value.fullName,
        email: form.value.email,
      });

      if (profileError && profileError.code !== "23505") {
        // Ignore duplicate key error
        console.error("Profile creation error:", profileError);
      }

      navigateTo("/profile?setup=true");
    }
  } catch (err: any) {
    error.value = err.message || "An error occurred during signup";
  } finally {
    loading.value = false;
  }
};
</script>
