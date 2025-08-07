<template>
    <div>
      <label class="flex items-center gap-2 text-exd-gray-scorpion text-exd-1424">
        {{ label }}
        <span
          v-if="required"
          class="text-exd-0910 px-1 py-[2px] rounded-sm"
          :style="{
            backgroundColor: bgColor,
            color: textColor
          }"
        >
          {{ $t('required') }}
        </span>
      </label>
  
      <MultiSelect
        v-model="modelValue"
        display="chip"
        :options="options"
        optionLabel="label"
        :placeholder="label"
        :loading="loading"
        :maxSelectedLabels="3"
        :filter="true" 
        class="w-full bg-gray-100 selection:!bg-gray-300"
      ></MultiSelect>
    </div>
  </template>
  
  <script setup>
    const props = defineProps({
      label: String,
      required: Boolean,
      error: {
        type: String,
        default: '',
      },
      model: {
        type: [String, Number, Date, Array],
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
      loading: Boolean,
      bgColor: {
        type: String,
        default: '',
      },
      textColor: {
        type: String,
        default: '', 
      },
      loading: Boolean
    })
    
    const emit = defineEmits(['update:model'])

    const modelValue = computed({
      get: () => props.model,
      set: (value) => emit('update:model', value),
  })
  </script>
  
  <style scoped>
    :global(.p-multiselect-overlay) {
      @apply bg-white;
    }
    :global(.p-multiselect-option) {
      @apply !text-exd-gray-scorpion;
    }
    :global(.p-multiselect-option .p-checkbox input) {
      @apply !bg-white;
    }
    :global(.p-multiselect-list .p-focus) {
      @apply !text-white bg-[var(--register-bg-color)];
    }
    :global(.p-checkbox .p-checkbox-box) {
      @apply bg-[var(--register-text-color)] border;
    }
    :global(.p-chip) {
      @apply text-exd-gray-scorpion bg-white border border-exd-gray-scorpion;
    }
    :global(.p-chip svg) {
      @apply text-exd-gray-scorpion;
    }
    :global(.p-multiselect-filter-container) {
      @apply flex items-center;
    }
    :global(.p-multiselect-filter-container input) {
      @apply h-10 bg-white border;
    }
  </style>