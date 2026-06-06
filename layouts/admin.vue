<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 border-b border-gray-700">
        <h1 class="text-xl font-bold">Admin Panel</h1>
        <p class="text-sm text-gray-400 mt-1">HOPECOSA</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          to="/admin"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
          :class="
            route.path === '/admin'
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <span class="text-lg">📊</span>
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/users"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
          :class="
            route.path === '/admin/users'
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <span class="text-lg">👥</span>
          <span>Users &amp; Verification</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/payments"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
          :class="
            route.path === '/admin/payments'
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <span class="text-lg">💳</span>
          <span>Payments</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center space-x-3 mb-3">
          <div
            class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold"
          >
            {{ adminInitial }}
          </div>
          <div class="text-sm">
            <p class="font-medium">{{ adminEmail }}</p>
            <p class="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>
        <button
          @click="signOut"
          class="w-full text-left text-sm text-gray-400 hover:text-white transition-colors px-2 py-1"
        >
          ← Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 bg-gray-50 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const adminEmail = computed(() => user.value?.email || "Admin");
const adminInitial = computed(() =>
  (user.value?.email || "A").charAt(0).toUpperCase(),
);

const signOut = async () => {
  await supabase.auth.signOut();
  navigateTo("/admin/login");
};
</script>
