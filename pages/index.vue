<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center text-white mb-12">
        <h1 class="text-5xl font-bold mb-4">Student Association</h1>
        <p class="text-xl opacity-90">Connect, Share, and Grow Together</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-4xl mb-4">👥</div>
          <h3 class="text-xl font-semibold mb-2">Build Your Profile</h3>
          <p class="opacity-90">
            Create a comprehensive profile with your bio and year group
            information
          </p>
        </div>
        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-4xl mb-4">📁</div>
          <h3 class="text-xl font-semibold mb-2">Share Resources</h3>
          <p class="opacity-90">
            Upload and share folders with fellow students
          </p>
        </div>
        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-4xl mb-4">🤝</div>
          <h3 class="text-xl font-semibold mb-2">Stay Connected</h3>
          <p class="opacity-90">
            Network with students from different year groups
          </p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          to="/auth/signup"
          class="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors mr-4"
        >
          Get Started
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-primary-600 transition-colors"
        >
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const user = useSupabaseUser();

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});
</script>
