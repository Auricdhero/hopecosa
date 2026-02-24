<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back, {{ userName }}!</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Uploads</p>
            <p class="text-3xl font-bold text-primary-600">
              {{ stats.totalUploads }}
            </p>
          </div>
          <div class="text-4xl">📁</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Storage Used</p>
            <p class="text-3xl font-bold text-primary-600">
              {{ stats.storageUsed }}
            </p>
          </div>
          <div class="text-4xl">💾</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Year Group</p>
            <p class="text-3xl font-bold text-primary-600">
              {{ userProfile?.year_group || "N/A" }}
            </p>
          </div>
          <div class="text-4xl">🎓</div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">My Uploads</h2>
          <NuxtLink to="/uploads" class="btn-primary"> Upload Files </NuxtLink>
        </div>

        <div v-if="uploads.length === 0" class="text-center py-8 text-gray-500">
          <p>No uploads yet</p>
          <NuxtLink
            to="/uploads"
            class="text-primary-600 hover:underline mt-2 inline-block"
          >
            Upload your first file
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="upload in uploads.slice(0, 5)"
            :key="upload.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">📄</span>
              <div>
                <p class="font-medium text-sm">{{ upload.file_name }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(upload.created_at) }}
                </p>
              </div>
            </div>
            <span class="text-xs text-gray-500">{{
              formatSize(upload.file_size)
            }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Profile Summary</h2>
          <NuxtLink
            to="/profile"
            class="text-primary-600 hover:underline text-sm"
          >
            Edit Profile
          </NuxtLink>
        </div>

        <div v-if="userProfile" class="space-y-3">
          <div>
            <p class="text-sm text-gray-600">Name</p>
            <p class="font-medium">{{ userProfile.full_name || "Not set" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ userProfile.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Year Group</p>
            <p class="font-medium">{{ userProfile.year_group || "Not set" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Major</p>
            <p class="font-medium">{{ userProfile.major || "Not set" }}</p>
          </div>
          <div v-if="userProfile.bio">
            <p class="text-sm text-gray-600">Bio</p>
            <p class="text-sm">{{ userProfile.bio }}</p>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>Complete your profile to get started</p>
          <NuxtLink
            to="/profile?setup=true"
            class="text-primary-600 hover:underline mt-2 inline-block"
          >
            Set up profile
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const userProfile = ref<any>(null);
const uploads = ref<any[]>([]);
const stats = ref({
  totalUploads: 0,
  storageUsed: "0 MB",
});

const userName = computed(() => {
  return (
    userProfile.value?.full_name || user.value?.email?.split("@")[0] || "User"
  );
});

onMounted(async () => {
  if (!user.value) return;

  // Fetch user profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.value.id)
    .single();

  userProfile.value = profileData;

  // Fetch user uploads
  const { data: uploadsData } = await supabase
    .from("uploads")
    .select("*")
    .eq("user_id", user.value.id)
    .order("created_at", { ascending: false });

  uploads.value = uploadsData || [];

  // Calculate stats
  stats.value.totalUploads = uploads.value.length;

  const totalBytes = uploads.value.reduce(
    (sum: number, upload: any) => sum + (upload.file_size || 0),
    0,
  );
  stats.value.storageUsed = formatSize(totalBytes);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
</script>
