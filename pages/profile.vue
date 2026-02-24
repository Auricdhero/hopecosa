<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
      <p class="mt-2 text-gray-600">
        Manage your personal information and bio data
      </p>
    </div>

    <div
      v-if="isSetup"
      class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6"
    >
      Welcome! Please complete your profile to get started.
    </div>

    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6"
    >
      {{ successMessage }}
    </div>

    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ error }}
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label
              for="full-name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="full-name"
              v-model="profile.full_name"
              type="text"
              required
              class="input-field"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              v-model="profile.email"
              type="email"
              disabled
              class="input-field bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            v-model="profile.bio"
            rows="4"
            class="input-field"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label
              for="year-group"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Year Group of Completion <span class="text-red-500">*</span>
            </label>
            <select
              id="year-group"
              v-model="profile.year_group"
              required
              class="input-field"
            >
              <option value="">Select year...</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              v-model="profile.phone"
              type="tel"
              class="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label
            for="major"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Major/Field of Study
          </label>
          <input
            id="major"
            v-model="profile.major"
            type="text"
            class="input-field"
            placeholder="Computer Science"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="navigateTo('/dashboard')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const isSetup = computed(() => route.query.setup === "true");

const profile = ref({
  full_name: "",
  email: "",
  bio: "",
  year_group: "",
  phone: "",
  major: "",
});

const loading = ref(false);
const error = ref("");
const successMessage = ref("");

// Generate year options (current year - 10 to current year + 10)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

onMounted(async () => {
  if (!user.value) return;

  profile.value.email = user.value.email || "";

  // Fetch existing profile
  const { data, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.value.id)
    .single();

  if (data) {
    profile.value = {
      full_name: data.full_name || "",
      email: data.email || user.value.email || "",
      bio: data.bio || "",
      year_group: data.year_group || "",
      phone: data.phone || "",
      major: data.major || "",
    };
  }
});

const handleSubmit = async () => {
  if (!user.value) return;

  error.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.value.id,
      full_name: profile.value.full_name,
      email: profile.value.email,
      bio: profile.value.bio,
      year_group: profile.value.year_group,
      phone: profile.value.phone,
      major: profile.value.major,
      updated_at: new Date().toISOString(),
    });

    if (updateError) throw updateError;

    successMessage.value = "Profile updated successfully!";

    if (isSetup.value) {
      setTimeout(() => {
        navigateTo("/dashboard");
      }, 1500);
    }
  } catch (err: any) {
    error.value = err.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};
</script>
