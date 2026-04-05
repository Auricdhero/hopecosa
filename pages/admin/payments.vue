<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Payments</h1>
      <p class="mt-2 text-gray-600">
        View all students who have made membership payments
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-gray-600">Total Revenue</p>
        <p class="text-3xl font-bold text-green-600">
          ${{ totalRevenue.toFixed(2) }}
        </p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-600">Paid Members</p>
        <p class="text-3xl font-bold text-primary-600">{{ paidMembers }}</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-600">Pending Payments</p>
        <p class="text-3xl font-bold text-yellow-600">
          {{ pendingPayments }}
        </p>
      </div>
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
          <select v-model="paymentFilter" class="input-field">
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div>
          <select v-model="typeFilter" class="input-field">
            <option value="">All Types</option>
            <option value="associate">Associate ($50)</option>
            <option value="honourary">Honourary ($0)</option>
            <option value="regular">Regular ($100)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Student
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Membership Type
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Payment Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Payment Date
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Transaction ID
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="p in filteredPayments"
              :key="p.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ p.full_name || "N/A" }}
                  </p>
                  <p class="text-xs text-gray-500">{{ p.email }}</p>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ getMembershipLabel(p.membership_type) }}
              </td>
              <td class="px-4 py-4 text-sm font-semibold">
                <span v-if="p.payment_status === 'paid'" class="text-green-600">
                  ${{ p.payment_amount?.toFixed(2) || "0.00" }}
                </span>
                <span v-else class="text-gray-400">
                  ${{ membershipFees[p.membership_type] || 0 }}.00
                </span>
              </td>
              <td class="px-4 py-4">
                <span
                  :class="{
                    'bg-green-100 text-green-800': p.payment_status === 'paid',
                    'bg-gray-100 text-gray-800':
                      !p.payment_status || p.payment_status === 'unpaid',
                    'bg-red-100 text-red-800': p.payment_status === 'failed',
                    'bg-yellow-100 text-yellow-800':
                      p.payment_status === 'refunded',
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ (p.payment_status || "unpaid").toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ formatDate(p.payment_date) }}
              </td>
              <td
                class="px-4 py-4 text-xs text-gray-400 max-w-[200px] truncate"
              >
                {{ p.stripe_payment_intent_id || "—" }}
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                No payments found matching your criteria
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaymentRecord {
  id: string;
  full_name: string | null;
  email: string;
  membership_type: string;
  membership_status: string;
  payment_status: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  stripe_payment_intent_id: string | null;
}

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const supabase = useSupabaseClient();

const payments = ref<PaymentRecord[]>([]);
const searchQuery = ref("");
const paymentFilter = ref("");
const typeFilter = ref("");

const membershipFees: Record<string, number> = {
  associate: 50,
  honourary: 0,
  regular: 100,
};

const totalRevenue = computed(() =>
  payments.value
    .filter((p: PaymentRecord) => p.payment_status === "paid")
    .reduce(
      (sum: number, p: PaymentRecord) => sum + (p.payment_amount || 0),
      0,
    ),
);

const paidMembers = computed(
  () =>
    payments.value.filter((p: PaymentRecord) => p.payment_status === "paid")
      .length,
);

const pendingPayments = computed(
  () =>
    payments.value.filter(
      (p: PaymentRecord) =>
        (!p.payment_status || p.payment_status === "unpaid") &&
        p.membership_type,
    ).length,
);

const filteredPayments = computed(() => {
  return payments.value.filter((p: PaymentRecord) => {
    const matchesSearch =
      !searchQuery.value ||
      (p.full_name || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesPayment =
      !paymentFilter.value ||
      (paymentFilter.value === "paid" && p.payment_status === "paid") ||
      (paymentFilter.value === "unpaid" &&
        (!p.payment_status || p.payment_status === "unpaid"));

    const matchesType =
      !typeFilter.value || p.membership_type === typeFilter.value;

    return matchesSearch && matchesPayment && matchesType;
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

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(async () => {
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, membership_type, membership_status, payment_status, payment_amount, payment_date, stripe_payment_intent_id",
    )
    .order("payment_date", { ascending: false, nullsFirst: false });

  if (data) {
    payments.value = data as PaymentRecord[];
  }
});
</script>
