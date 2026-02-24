<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
              Student Association
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <NuxtLink
                to="/dashboard"
                class="text-gray-700 hover:text-primary-600"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="text-gray-700 hover:text-primary-600"
              >
                Profile
              </NuxtLink>
              <button @click="signOut" class="btn-secondary">Sign Out</button>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="text-gray-700 hover:text-primary-600"
              >
                Sign In
              </NuxtLink>
              <NuxtLink to="/auth/signup" class="btn-primary">
                Sign Up
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2026 Student Association. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const signOut = async () => {
  await supabase.auth.signOut();
  navigateTo("/auth/login");
};
</script>
