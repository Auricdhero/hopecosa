<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Admin - Membership Verification
      </h1>
      <p class="mt-2 text-gray-600">
        Review and approve pending membership applications
      </p>
    </div>

    <div
      v-if="error"
      class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <div
      v-if="success"
      class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
    >
      {{ success }}
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card bg-yellow-50">
        <p class="text-sm text-gray-600">Pending Verification</p>
        <p class="text-3xl font-bold text-yellow-600">
          {{ stats.pending }}
        </p>
      </div>
      <div class="card bg-green-50">
        <p class="text-sm text-gray-600">Verified</p>
        <p class="text-3xl font-bold text-green-600">
          {{ stats.verified }}
        </p>
      </div>
      <div class="card bg-blue-50">
        <p class="text-sm text-gray-600">Active Members</p>
        <p class="text-3xl font-bold text-blue-600">
          {{ stats.active }}
        </p>
      </div>
      <div class="card bg-gray-50">
        <p class="text-sm text-gray-600">Total Applications</p>
        <p class="text-3xl font-bold text-gray-600">
          {{ stats.total }}
        </p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="currentFilter = 'pending_verification'"
          :class="[
            currentFilter === 'pending_verification'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          Pending ({{ stats.pending }})
        </button>
        <button
          @click="currentFilter = 'verified'"
          :class="[
            currentFilter === 'verified'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          Verified ({{ stats.verified }})
        </button>
        <button
          @click="currentFilter = 'active'"
          :class="[
            currentFilter === 'active'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          Active ({{ stats.active }})
        </button>
        <button
          @click="currentFilter = 'all'"
          :class="[
            currentFilter === 'all'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          All ({{ stats.total }})
        </button>
      </nav>
    </div>

    <!-- Applications List -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading applications...</p>
    </div>

    <div
      v-else-if="filteredApplications.length === 0"
      class="card text-center py-12"
    >
      <p class="text-gray-500">No applications found</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="application in filteredApplications"
        :key="application.id"
        class="card hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ application.full_name }}
                </h3>
                <p class="text-sm text-gray-600">{{ application.email }}</p>
              </div>
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800':
                    application.membership_status === 'pending_verification',
                  'bg-green-100 text-green-800':
                    application.membership_status === 'verified',
                  'bg-blue-100 text-blue-800':
                    application.membership_status === 'active',
                  'bg-gray-100 text-gray-800':
                    application.membership_status === 'inactive',
                }"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ formatStatus(application.membership_status) }}
              </span>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {{ getMembershipLabel(application.membership_type) }}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-500">Phone</p>
                <p class="text-sm font-medium">
                  {{ application.phone || "N/A" }}
                </p>
              </div>
              <div v-if="application.membership_details?.gender">
                <p class="text-xs text-gray-500">Gender</p>
                <p class="text-sm font-medium capitalize">
                  {{ application.membership_details.gender }}
                </p>
              </div>
              <div v-if="application.membership_details?.dateOfBirth">
                <p class="text-xs text-gray-500">Date of Birth</p>
                <p class="text-sm font-medium">
                  {{ formatDate(application.membership_details.dateOfBirth) }}
                </p>
              </div>
              <div v-if="application.membership_details?.city">
                <p class="text-xs text-gray-500">Location</p>
                <p class="text-sm font-medium">
                  {{ application.membership_details.city }},
                  {{ application.membership_details.country }}
                </p>
              </div>
              <div v-if="application.membership_details?.occupation">
                <p class="text-xs text-gray-500">Occupation</p>
                <p class="text-sm font-medium">
                  {{ application.membership_details.occupation }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Applied On</p>
                <p class="text-sm font-medium">
                  {{ formatDate(application.biodata_completed_at) }}
                </p>
              </div>
            </div>

            <!-- Membership Details -->
            <div
              v-if="application.membership_details"
              class="mb-4 p-4 bg-gray-50 rounded"
            >
              <p class="text-sm font-medium text-gray-700 mb-3">
                Membership Details:
              </p>

              <!-- Contact Information (All Members) -->
              <div class="mb-4 pb-4 border-b border-gray-200">
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  Contact Information
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div v-if="application.membership_details.full_name">
                    <span class="text-gray-600">Full Name:</span>
                    <span class="text-gray-900 ml-1 font-medium">{{
                      application.membership_details.full_name
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.email">
                    <span class="text-gray-600">Email:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.email
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.phone">
                    <span class="text-gray-600">Phone:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.phone
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Associate Member Additional Information -->
              <div
                v-if="application.membership_type === 'associate'"
                class="mb-4 pb-4 border-b border-gray-200"
              >
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  Additional Information
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div v-if="application.membership_details.gender">
                    <span class="text-gray-600">Gender:</span>
                    <span class="text-gray-900 ml-1 capitalize">{{
                      application.membership_details.gender
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.dateOfBirth">
                    <span class="text-gray-600">Date of Birth:</span>
                    <span class="text-gray-900 ml-1">{{
                      formatDate(application.membership_details.dateOfBirth)
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.residentialAddress">
                    <span class="text-gray-600">Address:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.residentialAddress
                    }}</span>
                  </div>
                  <div
                    v-if="application.membership_details.organizationCompany"
                  >
                    <span class="text-gray-600">Organization:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.organizationCompany
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Regular Member Specific -->
              <div
                v-if="application.membership_type === 'regular'"
                class="mb-4"
              >
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  Academic Information
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div v-if="application.membership_details.yearOfGraduation">
                    <span class="text-gray-600">Year of Graduation:</span>
                    <span class="text-gray-900 ml-1 font-medium">{{
                      application.membership_details.yearOfGraduation
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.programOrCourse">
                    <span class="text-gray-600">Program/Course:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.programOrCourse
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.leadershipRole">
                    <span class="text-gray-600">Leadership Role (SRC):</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.leadershipRole
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.graduationConsent">
                    <span class="text-gray-600">Verification Consent:</span>
                    <span class="text-green-600 ml-1">✓ Granted</span>
                  </div>
                </div>
              </div>

              <!-- Honourary Member Specific -->
              <div
                v-if="application.membership_type === 'honourary'"
                class="mb-4"
              >
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  Professional Information
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  <div v-if="application.membership_details.professionalTitle">
                    <span class="text-gray-600">Title:</span>
                    <span class="text-gray-900 ml-1 font-medium">{{
                      application.membership_details.professionalTitle
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.fieldOfExpertise">
                    <span class="text-gray-600">Field of Expertise:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.fieldOfExpertise
                    }}</span>
                  </div>
                  <div v-if="application.membership_details.currentPosition">
                    <span class="text-gray-600">Current Position:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.currentPosition
                    }}</span>
                  </div>
                  <div
                    v-if="
                      application.membership_details.organizationInstitution
                    "
                  >
                    <span class="text-gray-600">Organization/Institution:</span>
                    <span class="text-gray-900 ml-1">{{
                      application.membership_details.organizationInstitution
                    }}</span>
                  </div>
                </div>
                <div
                  v-if="application.membership_details.briefBiography"
                  class="text-sm mb-2"
                >
                  <span class="text-gray-600 font-medium">Biography:</span>
                  <p class="text-gray-900 mt-1">
                    {{ application.membership_details.briefBiography }}
                  </p>
                </div>
                <div
                  v-if="application.membership_details.reasonForHonorary"
                  class="text-sm"
                >
                  <span class="text-gray-600 font-medium"
                    >Reason for Honorary Consideration:</span
                  >
                  <p class="text-gray-900 mt-1">
                    {{ application.membership_details.reasonForHonorary }}
                  </p>
                </div>
              </div>

              <!-- Uploaded Files -->
              <div
                v-if="application.membership_details.uploadedFiles"
                class="mt-4 pt-4 border-t border-gray-200"
              >
                <p class="text-xs font-semibold text-gray-600 mb-2">
                  Uploaded Documents
                </p>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="(url, fileType) in application.membership_details
                      .uploadedFiles"
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

            <div v-if="application.bio" class="mb-4">
              <p class="text-xs text-gray-500 mb-1">Bio</p>
              <p class="text-sm text-gray-700">{{ application.bio }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          v-if="application.membership_status === 'pending_verification'"
          class="flex space-x-3 mt-4 pt-4 border-t border-gray-200"
        >
          <button
            @click="approveApplication(application.id)"
            :disabled="processingId === application.id"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <span v-if="processingId === application.id">Processing...</span>
            <span v-else>✓ Approve</span>
          </button>
          <button
            @click="rejectApplication(application.id)"
            :disabled="processingId === application.id"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <span v-if="processingId === application.id">Processing...</span>
            <span v-else>✗ Reject</span>
          </button>
        </div>

        <!-- Status Info for Verified/Active -->
        <div
          v-else-if="
            application.membership_status === 'verified' ||
            application.membership_status === 'active'
          "
          class="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600"
        >
          <div v-if="application.verified_at">
            ✓ Verified on {{ formatDate(application.verified_at) }}
          </div>
          <div v-if="application.payment_status === 'paid'" class="mt-1">
            💳 Payment received: ${{ application.payment_amount }} on
            {{ formatDate(application.payment_date) }}
          </div>
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

const applications = ref<any[]>([]);
const loading = ref(true);
const error = ref("");
const success = ref("");
const processingId = ref<string | null>(null);
const currentFilter = ref("pending_verification");

const stats = computed(() => {
  return {
    pending: applications.value.filter(
      (a: any) => a.membership_status === "pending_verification",
    ).length,
    verified: applications.value.filter(
      (a: any) =>
        a.membership_status === "verified" ||
        a.membership_status === "pending_payment",
    ).length,
    active: applications.value.filter(
      (a: any) => a.membership_status === "active",
    ).length,
    total: applications.value.length,
  };
});

const filteredApplications = computed(() => {
  if (currentFilter.value === "all") {
    return applications.value;
  }
  return applications.value.filter(
    (a: any) => a.membership_status === currentFilter.value,
  );
});

onMounted(async () => {
  await fetchApplications();
});

const fetchApplications = async () => {
  loading.value = true;
  try {
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .not("membership_type", "is", null)
      .order("biodata_completed_at", { ascending: false });

    if (fetchError) throw fetchError;

    applications.value = data || [];
  } catch (err: any) {
    error.value = err.message || "Failed to load applications";
  } finally {
    loading.value = false;
  }
};

const approveApplication = async (profileId: string) => {
  processingId.value = profileId;
  error.value = "";
  success.value = "";

  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        membership_status: "verified",
        verified_at: new Date().toISOString(),
        verified_by: user.value?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (updateError) throw updateError;

    success.value = "Application approved successfully!";
    await fetchApplications();

    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Failed to approve application";
  } finally {
    processingId.value = null;
  }
};

const rejectApplication = async (profileId: string) => {
  if (!confirm("Are you sure you want to reject this application?")) {
    return;
  }

  processingId.value = profileId;
  error.value = "";
  success.value = "";

  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        membership_status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (updateError) throw updateError;

    success.value = "Application rejected";
    await fetchApplications();

    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Failed to reject application";
  } finally {
    processingId.value = null;
  }
};

const getMembershipLabel = (type: string) => {
  const labels: Record<string, string> = {
    associate: "Associate",
    honourary: "Honourary",
    regular: "Regular",
  };
  return labels[type] || type;
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
