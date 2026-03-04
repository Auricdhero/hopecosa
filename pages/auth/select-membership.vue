<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Select Your Membership Type
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Choose the membership that best suits your needs
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

      <!-- Membership Type Selection -->
      <div v-if="!selectedType" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          @click="selectMembershipType('associate')"
          class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-2">Associate Member</h3>
          <p class="text-gray-600 text-sm mb-4">
            For affiliated members and partners
          </p>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>✓ Access to events</li>
            <li>✓ Networking opportunities</li>
            <li>✓ Collaborative benefits</li>
          </ul>
        </div>

        <div
          @click="selectMembershipType('honourary')"
          class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-2">Honourary Member</h3>
          <p class="text-gray-600 text-sm mb-4">
            For distinguished alumni and contributors
          </p>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>✓ Lifetime membership</li>
            <li>✓ Recognition privileges</li>
            <li>✓ Mentorship opportunities</li>
          </ul>
        </div>

        <div
          @click="selectMembershipType('regular')"
          class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-2">Regular Member</h3>
          <p class="text-gray-600 text-sm mb-4">
            For active students and participants
          </p>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>✓ Full access to all facilities</li>
            <li>✓ Voting rights</li>
            <li>✓ Leadership opportunities</li>
          </ul>
        </div>
      </div>

      <!-- Membership Details Form -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ getMembershipTitle(selectedType) }} - Details
          </h3>
          <button
            @click="resetSelection"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Change Membership Type
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Associate Member Fields (Personal Information) -->
          <div v-if="selectedType === 'associate'" class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p class="text-sm font-medium text-blue-800">
                Associate Member - Personal Information
              </p>
            </div>

            <div>
              <label
                for="full-name-id"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Full Name (as it should appear on ID card) *</label
              >
              <input
                id="full-name-id"
                v-model="formData.full_name"
                type="text"
                required
                class="input-field"
                placeholder="Enter your full legal name"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="gender"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Gender *</label
                >
                <select
                  id="gender"
                  v-model="formData.gender"
                  required
                  class="input-field"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label
                  for="dob"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Date of Birth *</label
                >
                <input
                  id="dob"
                  v-model="formData.dateOfBirth"
                  type="date"
                  required
                  class="input-field"
                  :max="new Date().toISOString().split('T')[0]"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="phone-number"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Phone Number *</label
                >
                <input
                  id="phone-number"
                  v-model="formData.phone"
                  type="tel"
                  required
                  class="input-field"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label
                  for="email-address"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address *</label
                >
                <input
                  id="email-address"
                  v-model="formData.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                for="residential-address"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Residential Address *</label
              >
              <textarea
                id="residential-address"
                v-model="formData.residentialAddress"
                required
                rows="2"
                class="input-field"
                placeholder="Street address, apartment/unit number"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >City *</label
                >
                <input
                  id="city"
                  v-model="formData.city"
                  type="text"
                  required
                  class="input-field"
                  placeholder="City"
                />
              </div>

              <div>
                <label
                  for="country"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Country *</label
                >
                <input
                  id="country"
                  v-model="formData.country"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Country"
                />
              </div>
            </div>

            <div>
              <label
                for="occupation"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Occupation *</label
              >
              <input
                id="occupation"
                v-model="formData.occupation"
                type="text"
                required
                class="input-field"
                placeholder="Your current occupation"
              />
            </div>

            <div>
              <label
                for="organization-company"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Organization / Company (if applicable)</label
              >
              <input
                id="organization-company"
                v-model="formData.organizationCompany"
                type="text"
                class="input-field"
                placeholder="Company or organization name"
              />
            </div>

            <div
              class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6"
            >
              <p class="text-sm text-green-800">
                ✓ All required information has been collected. Click "Complete
                Membership Selection" to proceed.
              </p>
            </div>
          </div>

          <!-- Honourary Member Fields -->
          <div v-if="selectedType === 'honourary'" class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p class="text-sm font-medium text-blue-800">
                Honourary Member Information
              </p>
            </div>

            <!-- Contact Information -->
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="full-name-hon"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Full Name *</label
                >
                <input
                  id="full-name-hon"
                  v-model="formData.full_name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  for="email-hon"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address *</label
                >
                <input
                  id="email-hon"
                  v-model="formData.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                for="phone-hon"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Phone Number *</label
              >
              <input
                id="phone-hon"
                v-model="formData.phone"
                type="tel"
                required
                class="input-field"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label
                for="professional-title"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Professional Title *</label
              >
              <select
                id="professional-title"
                v-model="formData.professionalTitle"
                required
                class="input-field"
              >
                <option value="" disabled>Select title</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Hon.">Hon.</option>
                <option value="Rev.">Rev.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                for="field-expertise"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Field of Expertise *</label
              >
              <input
                id="field-expertise"
                v-model="formData.fieldOfExpertise"
                type="text"
                required
                class="input-field"
                placeholder="e.g., Education, Medicine, Engineering"
              />
            </div>

            <div>
              <label
                for="current-position-hon"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Current Position *</label
              >
              <input
                id="current-position-hon"
                v-model="formData.currentPosition"
                type="text"
                required
                class="input-field"
                placeholder="Your current professional position"
              />
            </div>

            <div>
              <label
                for="organization-institution"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Organization / Institution *</label
              >
              <input
                id="organization-institution"
                v-model="formData.organizationInstitution"
                type="text"
                required
                class="input-field"
                placeholder="Where you currently work or are affiliated"
              />
            </div>

            <div>
              <label
                for="brief-biography"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Brief Biography *</label
              >
              <textarea
                id="brief-biography"
                v-model="formData.briefBiography"
                required
                rows="4"
                class="input-field"
                placeholder="Provide a brief professional biography (200-500 words)"
              />
            </div>

            <div>
              <label
                for="honorary-reason"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Reason for Honorary Consideration *</label
              >
              <textarea
                id="honorary-reason"
                v-model="formData.reasonForHonorary"
                required
                rows="4"
                class="input-field"
                placeholder="Explain why you are seeking honorary membership and your contributions to the field or community"
              />
            </div>

            <div>
              <label
                for="cv-upload-hon"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Upload CV (Optional)</label
              >
              <input
                id="cv-upload-hon"
                ref="cvFileInput"
                type="file"
                accept=".pdf,.doc,.docx"
                @change="handleFileUpload($event, 'cv')"
                class="input-field"
              />
              <p class="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          <!-- Regular Member Fields -->
          <div v-if="selectedType === 'regular'" class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p class="text-sm font-medium text-blue-800">
                Regular Member Information
              </p>
            </div>

            <!-- Contact Information -->
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="full-name-reg"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Full Name *</label
                >
                <input
                  id="full-name-reg"
                  v-model="formData.full_name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  for="email-reg"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address *</label
                >
                <input
                  id="email-reg"
                  v-model="formData.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                for="phone-reg"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Phone Number *</label
              >
              <input
                id="phone-reg"
                v-model="formData.phone"
                type="tel"
                required
                class="input-field"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label
                for="graduation-year-reg"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Year of Graduation *</label
              >
              <input
                id="graduation-year-reg"
                v-model.number="formData.yearOfGraduation"
                type="number"
                required
                class="input-field"
                placeholder="2026"
                :min="new Date().getFullYear()"
                :max="new Date().getFullYear() + 10"
              />
            </div>

            <div>
              <label
                for="program-course"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Program / Course Studied *</label
              >
              <input
                id="program-course"
                v-model="formData.programOrCourse"
                type="text"
                required
                class="input-field"
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>

            <div>
              <label
                for="leadership-role"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Leadership Role - SRC (Optional)</label
              >
              <input
                id="leadership-role"
                v-model="formData.leadershipRole"
                type="text"
                class="input-field"
                placeholder="e.g., President, Secretary, Treasurer"
              />
            </div>

            <div>
              <label
                for="certificate-upload"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Upload Certificate or Transcript *</label
              >
              <input
                id="certificate-upload"
                ref="certificateFileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                @change="handleFileUpload($event, 'certificate')"
                class="input-field"
              />
              <p class="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

            <div class="flex items-start">
              <input
                id="graduation-consent"
                v-model="formData.graduationConsent"
                type="checkbox"
                required
                class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                for="graduation-consent"
                class="ml-2 text-sm text-gray-700"
              >
                I agree to HOPECOSA verifying my graduation status with Hope
                College *
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              @click="resetSelection"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Saving...</span>
              <span v-else>Complete Membership Selection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const selectedType = ref<"associate" | "honourary" | "regular" | null>(null);
const formData = ref<any>({});
const uploadedFiles = ref<any>({});
const loading = ref(false);
const error = ref("");
const success = ref("");

// File input refs
const cvFileInput = ref<HTMLInputElement | null>(null);
const certificateFileInput = ref<HTMLInputElement | null>(null);

// Check if user already has a membership selected
onMounted(async () => {
  if (user.value) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_type")
      .eq("id", user.value.id)
      .single();

    if (profile?.membership_type) {
      // User already has membership, redirect to dashboard
      navigateTo("/dashboard");
    }
  }
});

const selectMembershipType = (type: "associate" | "honourary" | "regular") => {
  selectedType.value = type;
  formData.value = {};
  error.value = "";
};

const resetSelection = () => {
  selectedType.value = null;
  formData.value = {};
  uploadedFiles.value = {};
  error.value = "";
};

const getMembershipTitle = (type: string) => {
  const titles: Record<string, string> = {
    associate: "Associate Member",
    honourary: "Honourary Member",
    regular: "Regular Member",
  };
  return titles[type] || "";
};

const handleFileUpload = async (event: Event, fileType: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    error.value = "File size must be less than 5MB";
    input.value = "";
    return;
  }

  // Store the file for upload later
  uploadedFiles.value[fileType] = file;
  error.value = "";
};

const handleSubmit = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    if (!user.value) {
      throw new Error("User not authenticated");
    }

    // Upload files if any
    const fileUrls: any = {};

    for (const [fileType, file] of Object.entries(uploadedFiles.value)) {
      if (file) {
        const fileExt = (file as File).name.split(".").pop();
        const fileName = `${user.value.id}/${selectedType.value}_${fileType}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, file as File);

        if (uploadError) {
          console.error("File upload error:", uploadError);
          throw new Error(
            `Failed to upload ${fileType}: ${uploadError.message}`,
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);

        fileUrls[fileType] = urlData.publicUrl;
      }
    }

    // Add file URLs to form data
    if (Object.keys(fileUrls).length > 0) {
      formData.value.uploadedFiles = fileUrls;
    }

    // Prepare the update data
    const updateData: any = {
      membership_type: selectedType.value,
      membership_status: "pending_biodata",
      membership_details: formData.value,
      membership_selected_at: new Date().toISOString(),
    };

    // Add common fields to profile
    updateData.full_name = formData.value.full_name;
    updateData.phone = formData.value.phone;
    updateData.email = formData.value.email;

    // Update the profile with membership information
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.value.id);

    if (updateError) throw updateError;

    success.value = "Membership selected successfully!";

    // Redirect to profile to complete biodata
    setTimeout(() => {
      navigateTo("/profile?biodata=true");
    }, 1500);
  } catch (err: any) {
    error.value = err.message || "An error occurred while saving membership";
  } finally {
    loading.value = false;
  }
};
</script>
