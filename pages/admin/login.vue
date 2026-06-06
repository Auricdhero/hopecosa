<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
        <h2 class="text-3xl font-extrabold text-white">Admin Login</h2>
        <p class="mt-2 text-sm text-gray-400">HOPECOSA Administration</p>
      </div>

      <form
        class="mt-8 space-y-6 bg-gray-800 p-8 rounded-xl"
        @submit.prevent="handleLogin"
      >
        <div
          v-if="error"
          class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded"
        >
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="admin@association.edu"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In as Admin</span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-gray-400 hover:text-gray-300"
          >
            ← Back to member login
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

// Redirect if already logged in as admin
onMounted(async () => {
  if (user.value) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.value.id)
      .maybeSingle();

    if (profile?.is_admin) {
      navigateTo("/admin");
    }
  }
});

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: form.value.email,
        password: form.value.password,
      },
    );

    if (signInError) throw signInError;

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      throw new Error(
        "Access denied. This account does not have admin privileges.",
      );
    }

    navigateTo("/admin");
  } catch (err: any) {
    error.value = err.message || "Failed to sign in";
  } finally {
    loading.value = false;
  }
};
</script>
