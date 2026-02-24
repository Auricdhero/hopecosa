<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Handle SPA redirect from 404.html
onMounted(() => {
  const redirect = sessionStorage.redirect;
  if (redirect && redirect !== location.pathname) {
    delete sessionStorage.redirect;
    const baseURL = "/student-association-app/";
    const path = redirect.replace(baseURL, "/");
    navigateTo(path);
  }
});
</script>
