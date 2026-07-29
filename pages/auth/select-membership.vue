<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Logout Button -->
      <div class="flex justify-end mb-4">
        <button
          @click="handleLogout"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            class="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

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
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p class="text-sm font-medium text-blue-800">
              {{ getMembershipTitle(selectedType) }} Information
            </p>
          </div>

          <MembershipDetailsForm
            v-model="formData"
            :membership-type="selectedType"
            @file-selected="handleFileUpload"
            @file-error="error = $event"
          />

          <div
            v-if="selectedType === 'associate'"
            class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6"
          >
            <p class="text-sm text-green-800">
              ✓ All required information has been collected. Click "Complete
              Membership Selection" to proceed.
            </p>
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

// Check if user already has a membership selected
onMounted(async () => {
  if (user.value) {
    const { data: profile, error: queryError } = await supabase
      .from("profiles")
      .select("membership_type")
      .eq("id", user.value.id)
      .maybeSingle();

    if (queryError) {
      console.error("Error checking membership:", queryError);
      return;
    }

    // If profile doesn't exist, create it silently
    if (!profile) {
      console.log("Profile not found on page load, creating one...");
      // Create minimal profile, letting database defaults handle status fields
      const profileData = {
        id: user.value.id,
        email: user.value.email || "",
      };
      console.log("Inserting minimal profile data:", profileData);

      const { data: insertedData, error: createError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.value.id)
        .select();

      if (createError) {
        console.error("Error creating profile on load:", createError);
        console.error("Error code:", createError.code);
        console.error("Error message:", createError.message);
        console.error("Error hint:", createError.hint);
      } else {
        console.log("Profile created successfully:", insertedData);
      }
      return;
    }

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

const handleLogout = async () => {
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    navigateTo("/auth/login");
  } catch (err: any) {
    console.error("Logout error:", err);
    error.value = "Failed to logout. Please try again.";
  }
};

const getMembershipTitle = (type: string) => {
  const titles: Record<string, string> = {
    associate: "Associate Member",
    honourary: "Honourary Member",
    regular: "Regular Member",
  };
  return titles[type] || "";
};

const handleFileUpload = (fileType: string, file: File) => {
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

    console.log("Starting form submission for user:", user.value.id);
    console.log("Selected membership type:", selectedType.value);
    console.log("Form data:", formData.value);

    // First, check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.value.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking profile:", checkError);
      throw new Error(`Failed to check profile: ${checkError.message}`);
    }

    if (!existingProfile) {
      console.log(
        "Profile does not exist, creating one for user:",
        user.value.id,
      );

      // Create the profile with minimal data, let database defaults handle status
      const newProfileData = {
        id: user.value.id,
        email: user.value.email || "",
      };
      console.log("Creating minimal profile with data:", newProfileData);

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert(newProfileData)
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        console.error("Error code:", createError.code);
        console.error("Error message:", createError.message);
        console.error("Error hint:", createError.hint);
        throw new Error(`Failed to create profile: ${createError.message}`);
      }

      console.log("Profile created successfully:", newProfile);
    } else {
      console.log("Profile exists, proceeding with update");
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
      membership_status: "pending",
      membership_details: formData.value,
      membership_selected_at: new Date().toISOString(),
    };

    // Add common fields to profile
    updateData.full_name = formData.value.full_name;
    updateData.phone = formData.value.phone;
    updateData.email = formData.value.email;

    console.log("Attempting to update profile with data:", updateData);
    console.log("User ID:", user.value.id);

    // Update the profile with membership information
    const { data: updatedData, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.value.id)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    if (!updatedData || updatedData.length === 0) {
      console.error("No rows were updated. Profile may not exist.");
      throw new Error("Failed to update profile. Profile may not exist.");
    }

    console.log("Profile updated successfully:", updatedData);
    success.value = "Membership selected successfully!";

    // Redirect to profile to complete biodata
    setTimeout(() => {
      navigateTo("/profile?biodata=true");
    }, 1500);
  } catch (err: any) {
    console.error("Form submission error:", err);
    error.value = err.message || "An error occurred while saving membership";

    // Scroll to top to show error message
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    loading.value = false;
  }
};
</script>
