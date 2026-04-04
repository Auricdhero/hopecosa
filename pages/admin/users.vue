<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Users &amp; Verification</h1>
      <p class="mt-2 text-gray-600">
        View user details and verify membership applications
      </p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            class="input-field"
            placeholder="Search by name or email..."
          />
        </div>
        <div>
          <select v-model="statusFilter" class="input-field">
            <option value="">All Statuses</option>
            <option value="pending_biodata">Pending Biodata</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <select v-model="typeFilter" class="input-field">
            <option value="">All Types</option>
            <option value="associate">Associate</option>
            <option value="honourary">Honourary</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Name
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Email
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Membership
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Registered
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm font-medium text-gray-900">
                {{ u.full_name || "N/A" }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ u.email }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ getMembershipLabel(u.membership_type) }}
              </td>
              <td class="px-4 py-4">
                <span
                  :class="statusBadgeClass(u.membership_status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ formatStatus(u.membership_status) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ formatDate(u.created_at) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex space-x-2">
                  <button
                    @click="openUserDetail(u)"
                    class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    v-if="
                      u.membership_status === 'pending_verification' ||
                      u.membership_status === 'pending'
                    "
                    @click="verifyUser(u)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Verify
                  </button>
                  <button
                    v-if="u.membership_status === 'active'"
                    @click="deactivateUser(u)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Deactivate
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                No users found matching your criteria
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="selectedUser = null"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-6 border-b border-gray-200 flex justify-between items-start"
        >
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ selectedUser.full_name || "N/A" }}
            </h2>
            <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
          </div>
          <button
            @click="selectedUser = null"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Basic Info -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">
              Basic Information
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Full Name</p>
                <p class="font-medium">{{ selectedUser.full_name || "N/A" }}</p>
              </div>
              <div>
                <p class="text-gray-600">Email</p>
                <p class="font-medium">{{ selectedUser.email }}</p>
              </div>
              <div>
                <p class="text-gray-600">Phone</p>
                <p class="font-medium">{{ selectedUser.phone || "N/A" }}</p>
              </div>
              <div>
                <p class="text-gray-600">Year Group</p>
                <p class="font-medium">
                  {{ selectedUser.year_group || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Major</p>
                <p class="font-medium">{{ selectedUser.major || "N/A" }}</p>
              </div>
              <div>
                <p class="text-gray-600">Bio</p>
                <p class="font-medium">{{ selectedUser.bio || "N/A" }}</p>
              </div>
            </div>
          </div>

          <!-- Membership Info -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">
              Membership
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Type</p>
                <p class="font-medium">
                  {{ getMembershipLabel(selectedUser.membership_type) }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Status</p>
                <span
                  :class="statusBadgeClass(selectedUser.membership_status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ formatStatus(selectedUser.membership_status) }}
                </span>
              </div>
              <div>
                <p class="text-gray-600">Selected At</p>
                <p class="font-medium">
                  {{ formatDate(selectedUser.membership_selected_at) }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Biodata Completed</p>
                <p class="font-medium">
                  {{ selectedUser.biodata_completed ? "Yes" : "No" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Membership Details (JSONB) -->
          <div v-if="selectedUser.membership_details">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">
              Membership Form Details
            </h3>

            <!-- Associate -->
            <div
              v-if="selectedUser.membership_type === 'associate'"
              class="grid grid-cols-2 gap-4 text-sm"
            >
              <div v-for="(val, key) in associateFields" :key="key">
                <p class="text-gray-600">{{ val }}</p>
                <p class="font-medium">
                  {{ selectedUser.membership_details[key] || "N/A" }}
                </p>
              </div>
            </div>

            <!-- Regular -->
            <div
              v-else-if="selectedUser.membership_type === 'regular'"
              class="grid grid-cols-2 gap-4 text-sm"
            >
              <div v-for="(val, key) in regularFields" :key="key">
                <p class="text-gray-600">{{ val }}</p>
                <p class="font-medium">
                  {{ selectedUser.membership_details[key] || "N/A" }}
                </p>
              </div>
            </div>

            <!-- Honourary -->
            <div
              v-else-if="selectedUser.membership_type === 'honourary'"
              class="grid grid-cols-2 gap-4 text-sm"
            >
              <div v-for="(val, key) in honouraryFields" :key="key">
                <p class="text-gray-600">{{ val }}</p>
                <p class="font-medium">
                  {{ selectedUser.membership_details[key] || "N/A" }}
                </p>
              </div>
            </div>

            <!-- Uploaded Documents -->
            <div
              v-if="selectedUser.membership_details.uploadedFiles"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <p class="text-sm font-medium text-gray-600 mb-2">
                Uploaded Documents
              </p>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="(url, fileType) in selectedUser.membership_details
                    .uploadedFiles"
                  :key="String(fileType)"
                  :href="String(url)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  📄 {{ formatKey(String(fileType)) }}
                </a>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">
              Payment
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Payment Status</p>
                <p
                  :class="{
                    'text-green-600 font-semibold':
                      selectedUser.payment_status === 'paid',
                    'text-gray-500': selectedUser.payment_status !== 'paid',
                  }"
                >
                  {{ (selectedUser.payment_status || "unpaid").toUpperCase() }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Amount</p>
                <p class="font-medium">
                  ${{ selectedUser.payment_amount?.toFixed(2) || "0.00" }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Payment Date</p>
                <p class="font-medium">
                  {{ formatDate(selectedUser.payment_date) }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Transaction ID</p>
                <p class="font-medium text-xs break-all">
                  {{ selectedUser.stripe_payment_intent_id || "N/A" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-gray-200 flex space-x-3">
            <button
              v-if="
                selectedUser.membership_status === 'pending_verification' ||
                selectedUser.membership_status === 'pending'
              "
              @click="verifyUser(selectedUser)"
              class="btn-primary"
            >
              Verify User
            </button>
            <button
              v-if="selectedUser.membership_status === 'active'"
              @click="deactivateUser(selectedUser)"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Deactivate
            </button>
            <button @click="selectedUser = null" class="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const users = ref<any[]>([]);
const selectedUser = ref<any>(null);
const searchQuery = ref("");
const statusFilter = ref("");
const typeFilter = ref("");

const associateFields: Record<string, string> = {
  full_name: "Full Name (ID Card)",
  gender: "Gender",
  dateOfBirth: "Date of Birth",
  phone: "Phone",
  email: "Email",
  residentialAddress: "Residential Address",
  city: "City",
  country: "Country",
  occupation: "Occupation",
  organizationCompany: "Organization/Company",
};

const regularFields: Record<string, string> = {
  yearOfGraduation: "Year of Graduation",
  programOrCourse: "Program/Course",
  leadershipRole: "Leadership Role (SRC)",
  graduationConsent: "Verification Consent",
};

const honouraryFields: Record<string, string> = {
  professionalTitle: "Professional Title",
  fieldOfExpertise: "Field of Expertise",
  currentPosition: "Current Position",
  organizationInstitution: "Organization/Institution",
  briefBiography: "Biography",
  reasonForHonorary: "Reason for Honorary",
};

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchesSearch =
      !searchQuery.value ||
      (u.full_name || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      !statusFilter.value || u.membership_status === statusFilter.value;

    const matchesType =
      !typeFilter.value || u.membership_type === typeFilter.value;

    return matchesSearch && matchesStatus && matchesType;
  });
});

const getMembershipLabel = (type: string) => {
  const labels: Record<string, string> = {
    associate: "Associate",
    honourary: "Honourary",
    regular: "Regular",
  };
  return labels[type] || type || "N/A";
};

const formatStatus = (status: string) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending_verification: "bg-yellow-100 text-yellow-800",
    pending: "bg-yellow-100 text-yellow-800",
    pending_biodata: "bg-blue-100 text-blue-800",
    verified: "bg-purple-100 text-purple-800",
    pending_payment: "bg-orange-100 text-orange-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const openUserDetail = (u: any) => {
  selectedUser.value = u;
};

const verifyUser = async (u: any) => {
  if (!user.value) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      membership_status: "verified",
      verified_at: new Date().toISOString(),
      verified_by: user.value.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", u.id);

  if (error) {
    alert("Failed to verify user: " + error.message);
    return;
  }

  u.membership_status = "verified";
  u.verified_at = new Date().toISOString();
  alert(`${u.full_name || u.email} has been verified successfully.`);
};

const deactivateUser = async (u: any) => {
  if (
    !confirm(`Are you sure you want to deactivate ${u.full_name || u.email}?`)
  ) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      membership_status: "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", u.id);

  if (error) {
    alert("Failed to deactivate user: " + error.message);
    return;
  }

  u.membership_status = "inactive";
  alert(`${u.full_name || u.email} has been deactivated.`);
};

onMounted(async () => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (data) {
    users.value = data;
  }
});
</script>
