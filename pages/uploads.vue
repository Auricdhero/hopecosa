<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">File Uploads</h1>
      <p class="mt-2 text-gray-600">Upload and manage your files and folders</p>
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

    <!-- Upload Section -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold mb-4">Upload Files</h2>

      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          class="hidden"
          accept="*/*"
        />

        <div
          v-if="!uploading"
          @click="$refs.fileInput.click()"
          class="cursor-pointer"
        >
          <div class="text-6xl mb-4">📁</div>
          <p class="text-lg font-medium text-gray-700 mb-2">
            Click to upload files or drag and drop
          </p>
          <p class="text-sm text-gray-500">
            Any file type supported (Max 50MB per file)
          </p>
        </div>

        <div v-else class="space-y-3">
          <div class="text-4xl">⏳</div>
          <p class="text-lg font-medium">Uploading...</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
            <div
              class="bg-primary-600 h-2.5 rounded-full transition-all"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-600">{{ uploadProgress }}%</p>
        </div>
      </div>

      <div v-if="selectedFiles.length > 0 && !uploading" class="mt-4">
        <p class="text-sm font-medium text-gray-700 mb-2">
          Selected Files ({{ selectedFiles.length }}):
        </p>
        <div class="space-y-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <span class="text-sm"
              >{{ file.name }} ({{ formatSize(file.size) }})</span
            >
            <button
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="mt-4">
          <label
            for="folder-name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Folder Name (optional)
          </label>
          <input
            id="folder-name"
            v-model="folderName"
            type="text"
            class="input-field"
            placeholder="e.g., Assignment 1, Project Files"
          />
        </div>

        <button @click="uploadFiles" class="btn-primary mt-4">
          Upload {{ selectedFiles.length }} file(s)
        </button>
      </div>
    </div>

    <!-- Uploaded Files List -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">My Uploads</h2>
        <button
          @click="refreshUploads"
          class="text-sm text-primary-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Loading uploads...</p>
      </div>

      <div
        v-else-if="uploads.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <p>No uploads yet. Start by uploading your first file!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="upload in uploads"
          :key="upload.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-4 flex-1">
            <span class="text-3xl">{{ getFileIcon(upload.file_name) }}</span>
            <div class="flex-1">
              <p class="font-medium">{{ upload.file_name }}</p>
              <div
                class="flex items-center space-x-3 text-xs text-gray-500 mt-1"
              >
                <span
                  v-if="upload.folder_name"
                  class="bg-primary-100 text-primary-700 px-2 py-0.5 rounded"
                >
                  📂 {{ upload.folder_name }}
                </span>
                <span>{{ formatSize(upload.file_size) }}</span>
                <span>{{ formatDate(upload.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="downloadFile(upload)"
              class="text-primary-600 hover:text-primary-700 px-3 py-1 rounded hover:bg-primary-50"
            >
              Download
            </button>
            <button
              @click="deleteFile(upload)"
              class="text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
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

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const folderName = ref("");
const uploading = ref(false);
const uploadProgress = ref(0);
const loading = ref(false);
const error = ref("");
const successMessage = ref("");
const uploads = ref<any[]>([]);

onMounted(() => {
  refreshUploads();
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const uploadFiles = async () => {
  if (!user.value || selectedFiles.value.length === 0) return;

  error.value = "";
  successMessage.value = "";
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    const totalFiles = selectedFiles.value.length;
    let uploadedCount = 0;

    for (const file of selectedFiles.value) {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.value.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase.from("uploads").insert({
        user_id: user.value.id,
        file_name: file.name,
        file_path: fileName,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type || "application/octet-stream",
        folder_name: folderName.value || null,
      });

      if (dbError) throw dbError;

      uploadedCount++;
      uploadProgress.value = Math.round((uploadedCount / totalFiles) * 100);
    }

    successMessage.value = `Successfully uploaded ${totalFiles} file(s)!`;
    selectedFiles.value = [];
    folderName.value = "";

    await refreshUploads();
  } catch (err: any) {
    error.value = err.message || "Failed to upload files";
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const refreshUploads = async () => {
  if (!user.value) return;

  loading.value = true;

  try {
    const { data, error: fetchError } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", user.value.id)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    uploads.value = data || [];
  } catch (err: any) {
    error.value = err.message || "Failed to fetch uploads";
  } finally {
    loading.value = false;
  }
};

const downloadFile = async (upload: any) => {
  try {
    const { data, error: downloadError } = await supabase.storage
      .from("uploads")
      .download(upload.file_path);

    if (downloadError) throw downloadError;

    // Create download link
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = upload.file_name;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    error.value = err.message || "Failed to download file";
  }
};

const deleteFile = async (upload: any) => {
  if (!confirm(`Are you sure you want to delete "${upload.file_name}"?`))
    return;

  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("uploads")
      .remove([upload.file_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from("uploads")
      .delete()
      .eq("id", upload.id);

    if (dbError) throw dbError;

    successMessage.value = "File deleted successfully";
    await refreshUploads();
  } catch (err: any) {
    error.value = err.message || "Failed to delete file";
  }
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    pdf: "📕",
    doc: "📘",
    docx: "📘",
    xls: "📗",
    xlsx: "📗",
    ppt: "📙",
    pptx: "📙",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    zip: "📦",
    rar: "📦",
    txt: "📄",
    mp4: "🎥",
    mp3: "🎵",
  };
  return iconMap[ext || ""] || "📄";
};
</script>
