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
        class="w-full bg-gray-100 selection:!bg-gray-300"
      >
        <!-- <template #listContainer="slotProps">
            <div class="!bg-white">
            {{ slotProps.option.label }}
            </div>
        </template> -->
    </MultiSelect>
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
      default: '#FEE2E2',
    },
    textColor: {
      type: String,
      default: '#B91C1C', 
    },
    loading: Boolean
  })
  
  const emit = defineEmits(['update:model'])

  const modelValue = computed({
    get: () => props.model,
    set: (value) => emit('update:model', value),
  })
  </script>
  