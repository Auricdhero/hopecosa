<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Check your email
        </h2>
        <p class="mt-3 text-sm text-gray-600">
          We sent a confirmation link to
          <span class="font-semibold text-gray-900">{{ displayEmail }}</span
          >.
        </p>
        <p class="mt-2 text-sm text-gray-600">
          Open your inbox and click the link to activate your account.
        </p>
      </div>

      <div
        class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm"
      >
        If you do not see the email, check your spam folder and promotions tab.
      </div>

      <div class="space-y-3">
        <NuxtLink to="/auth/login" class="w-full btn-primary block text-center">
          Back to Sign In
        </NuxtLink>
        <NuxtLink
          to="/auth/signup"
          class="w-full btn-secondary block text-center"
        >
          Use a different email
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();

const displayEmail = computed(() => {
  const email = route.query.email;
  if (typeof email === "string" && email.trim().length > 0) {
    return email;
  }
  return "your email address";
});
</script>
