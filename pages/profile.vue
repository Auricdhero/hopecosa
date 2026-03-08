<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
      <p class="mt-2 text-gray-600">
        Manage your personal information and bio data
      </p>
    </div>

    <div
      v-if="isBiodata"
      class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6"
    >
      <strong>Step 2 of 4:</strong> Please complete your biodata. After
      submission, your profile will be sent for verification.
    </div>

    <div
      v-else-if="isSetup"
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

    <!-- Membership Information Display -->
    <div
      v-if="membershipInfo.type"
      class="card mb-6 bg-gradient-to-r from-primary-50 to-blue-50"
    >
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold text-gray-900">
          Membership Information
        </h2>
        <span
          :class="{
            'bg-green-100 text-green-800': membershipInfo.status === 'active',
            'bg-yellow-100 text-yellow-800':
              membershipInfo.status === 'pending_verification' ||
              membershipInfo.status === 'verified' ||
              membershipInfo.status === 'pending_payment',
            'bg-blue-100 text-blue-800':
              membershipInfo.status === 'pending_biodata',
            'bg-gray-100 text-gray-800': membershipInfo.status === 'inactive',
          }"
          class="px-3 py-1 rounded-full text-sm font-medium"
        >
          {{ formatStatus(membershipInfo.status) }}
        </span>
      </div>

      <div class="space-y-3">
        <div>
          <p class="text-sm font-medium text-gray-600">Membership Type</p>
          <p class="text-lg font-semibold text-gray-900">
            {{ getMembershipLabel(membershipInfo.type) }}
          </p>
        </div>

        <div v-if="membershipInfo.selectedAt">
          <p class="text-sm font-medium text-gray-600">Member Since</p>
          <p class="text-gray-900">
            {{ formatDate(membershipInfo.selectedAt) }}
          </p>
        </div>

        <div
          v-if="membershipInfo.details"
          class="pt-3 border-t border-gray-200"
        >
          <p class="text-sm font-medium text-gray-600 mb-3">
            Membership Details
          </p>

          <!-- Associate Member Personal Information -->
          <div
            v-if="membershipInfo.type === 'associate'"
            class="mb-4 pb-3 border-b border-gray-200"
          >
            <p class="text-xs font-semibold text-gray-500 mb-2">
              Personal Information
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div
                v-if="membershipInfo.details.full_name"
                class="flex flex-col"
              >
                <span class="text-gray-600">Full Name</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.full_name
                }}</span>
              </div>
              <div v-if="membershipInfo.details.gender" class="flex flex-col">
                <span class="text-gray-600">Gender</span>
                <span class="text-gray-900 font-medium capitalize">{{
                  membershipInfo.details.gender
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.dateOfBirth"
                class="flex flex-col"
              >
                <span class="text-gray-600">Date of Birth</span>
                <span class="text-gray-900 font-medium">{{
                  formatDate(membershipInfo.details.dateOfBirth)
                }}</span>
              </div>
              <div v-if="membershipInfo.details.phone" class="flex flex-col">
                <span class="text-gray-600">Phone Number</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.phone
                }}</span>
              </div>
              <div v-if="membershipInfo.details.email" class="flex flex-col">
                <span class="text-gray-600">Email Address</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.email
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.residentialAddress"
                class="flex flex-col"
              >
                <span class="text-gray-600">Residential Address</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.residentialAddress
                }}</span>
              </div>
              <div
                v-if="
                  membershipInfo.details.city && membershipInfo.details.country
                "
                class="flex flex-col"
              >
                <span class="text-gray-600">Location</span>
                <span class="text-gray-900 font-medium"
                  >{{ membershipInfo.details.city }},
                  {{ membershipInfo.details.country }}</span
                >
              </div>
              <div
                v-if="membershipInfo.details.occupation"
                class="flex flex-col"
              >
                <span class="text-gray-600">Occupation</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.occupation
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.organizationCompany"
                class="flex flex-col"
              >
                <span class="text-gray-600">Organization/Company</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.organizationCompany
                }}</span>
              </div>
            </div>
          </div>

          <!-- Regular Member Specific -->
          <div
            v-if="
              membershipInfo.type === 'regular' &&
              membershipInfo.details.yearOfGraduation
            "
            class="mb-4"
          >
            <p class="text-xs font-semibold text-gray-500 mb-2">
              Academic Information
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div
                v-if="membershipInfo.details.yearOfGraduation"
                class="flex flex-col"
              >
                <span class="text-gray-600">Year of Graduation</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.yearOfGraduation
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.programOrCourse"
                class="flex flex-col"
              >
                <span class="text-gray-600">Program/Course Studied</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.programOrCourse
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.leadershipRole"
                class="flex flex-col"
              >
                <span class="text-gray-600">Leadership Role (SRC)</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.leadershipRole
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.graduationConsent"
                class="flex flex-col"
              >
                <span class="text-gray-600">Verification Consent</span>
                <span class="text-green-600 font-medium">✓ Granted</span>
              </div>
            </div>
          </div>

          <!-- Honourary Member Specific -->
          <div
            v-if="
              membershipInfo.type === 'honourary' &&
              membershipInfo.details.professionalTitle
            "
            class="mb-4"
          >
            <p class="text-xs font-semibold text-gray-500 mb-2">
              Professional Information
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div
                v-if="membershipInfo.details.professionalTitle"
                class="flex flex-col"
              >
                <span class="text-gray-600">Professional Title</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.professionalTitle
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.fieldOfExpertise"
                class="flex flex-col"
              >
                <span class="text-gray-600">Field of Expertise</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.fieldOfExpertise
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.currentPosition"
                class="flex flex-col"
              >
                <span class="text-gray-600">Current Position</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.currentPosition
                }}</span>
              </div>
              <div
                v-if="membershipInfo.details.organizationInstitution"
                class="flex flex-col"
              >
                <span class="text-gray-600">Organization/Institution</span>
                <span class="text-gray-900 font-medium">{{
                  membershipInfo.details.organizationInstitution
                }}</span>
              </div>
            </div>
            <div v-if="membershipInfo.details.briefBiography" class="mt-3">
              <span class="text-gray-600 text-sm">Biography:</span>
              <p class="text-gray-900 text-sm mt-1">
                {{ membershipInfo.details.briefBiography }}
              </p>
            </div>
            <div v-if="membershipInfo.details.reasonForHonorary" class="mt-3">
              <span class="text-gray-600 text-sm"
                >Reason for Honorary Consideration:</span
              >
              <p class="text-gray-900 text-sm mt-1">
                {{ membershipInfo.details.reasonForHonorary }}
              </p>
            </div>
          </div>

          <!-- Uploaded Documents -->
          <div
            v-if="membershipInfo.details.uploadedFiles"
            class="pt-3 border-t border-gray-200"
          >
            <p class="text-xs font-semibold text-gray-500 mb-2">
              Uploaded Documents
            </p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="(url, fileType) in membershipInfo.details.uploadedFiles"
                :key="fileType"
                :href="url"
                target="_blank"
                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                📄 {{ formatKey(String(fileType)) }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-6">Personal Information</h2>
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
          <select id="major" v-model="profile.major" class="input-field">
            <option value="">Select major...</option>
            <option value="General Science">General Science</option>
            <option value="General Arts">General Arts</option>
            <option value="Business">Business</option>
            <option value="Home Economics">Home Economics</option>
          </select>
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
  middleware: ["auth", "membership"],
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const isSetup = computed(() => route.query.setup === "true");
const isBiodata = computed(() => route.query.biodata === "true");

const profile = ref({
  full_name: "",
  email: "",
  bio: "",
  year_group: "",
  phone: "",
  major: "",
});

const membershipInfo = ref({
  type: "",
  status: "",
  details: null as any,
  selectedAt: "",
});

const loading = ref(false);
const error = ref("");
const successMessage = ref("");

// Helper functions
const getMembershipLabel = (type: string) => {
  const labels: Record<string, string> = {
    associate: "Associate Member",
    honourary: "Honourary Member",
    regular: "Regular Member",
  };
  return labels[type] || type;
};

const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatStatus = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

    // Set membership information
    membershipInfo.value = {
      type: data.membership_type || "",
      status: data.membership_status || "",
      details: data.membership_details || null,
      selectedAt: data.membership_selected_at || "",
    };
  }
});

const handleSubmit = async () => {
  if (!user.value) return;

  error.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const updateData: any = {
      id: user.value.id,
      full_name: profile.value.full_name,
      email: profile.value.email,
      bio: profile.value.bio,
      year_group: profile.value.year_group,
      phone: profile.value.phone,
      major: profile.value.major,
      updated_at: new Date().toISOString(),
    };

    // If completing biodata for the first time, mark as pending verification
    if (isBiodata.value) {
      updateData.biodata_completed = true;
      updateData.biodata_completed_at = new Date().toISOString();
      updateData.membership_status = "pending_verification";
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert(updateData);

    if (updateError) throw updateError;

    successMessage.value = isBiodata.value
      ? "Biodata submitted successfully! Redirecting to verification status..."
      : "Profile updated successfully!";

    if (isBiodata.value) {
      setTimeout(() => {
        navigateTo("/verification-pending");
      }, 1500);
    } else if (isSetup.value) {
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
