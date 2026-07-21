<template>
  <div class="grid grid-cols-3 gap-2">
    <select
      v-model="countryCode"
      class="input-field col-span-1"
      :aria-label="`${label} country code`"
    >
      <option
        v-for="c in countries"
        :key="c.code"
        :value="c.code"
      >
        {{ countryFlag(c.code) }} {{ c.dialCode }}
      </option>
    </select>

    <input
      :id="id"
      v-model="localNumber"
      type="tel"
      :required="required"
      class="input-field col-span-2"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
    defaultCountry?: string;
  }>(),
  {
    id: "",
    label: "Phone",
    required: false,
    placeholder: "24 123 4567",
    defaultCountry: "GH",
  },
);

const phone = defineModel<string>({ default: "" });
const country = defineModel<string>("country", { default: "" });

const countryCode = ref(country.value || props.defaultCountry);
const localNumber = ref("");

const selectedDialCode = computed(
  () => countries.find((c) => c.code === countryCode.value)?.dialCode || "",
);

function syncPhone() {
  const digits = localNumber.value.replace(/[^\d]/g, "");
  phone.value = digits ? `${selectedDialCode.value}${digits}` : "";
  country.value = countryCode.value;
}

watch(countryCode, syncPhone);
watch(localNumber, syncPhone);
</script>
