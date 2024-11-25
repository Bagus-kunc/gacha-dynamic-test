<template>
  <div class="flex flex-col gap-2">
    <label
      :for="`label-${label}`"
      class="text-exd-gray-scorpion text-exd-1424 flex gap-2 items-center py-0"
      v-if="label !== ''"
      >{{ label }}
      <span
        v-if="required"
        class="!bg-exd-red-coral text-white text-exd-0910 px-1 py-[2px] rounded-sm"
        >{{ $t('required') }}</span
      >
    </label>
    <div class="flex flex-wrap gap-3 pb-3">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="flex items-center cursor-pointer"
      >
        <RadioButton
          :model-value="modelValue"
          @update:model-value="updateValue"
          :inputId="option.label"
          :name="name"
          @blur="validate"
          :value="option.label"
          class="custom-radio"
          pt:root="bg-white cursor-pointer w-[20px] h-[20px] rounded-full border-[1px] border-exd-red-vermilion flex items-center justify-center"
        />
        <label
          :for="option.label"
          class="ml-1 text-exd-gray-scorpion text-exd-1424 font-bold cursor-pointer"
        >
          {{ t(option.label) }}
        </label>
      </div>
    </div>
    <small
      v-if="error !== ''"
      :id="`${model}-${label}--${prefix}-${suffix}-error`"
      :class="['p-error']"
    >
      {{ error }}
    </small>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import RadioButton from 'primevue/radiobutton'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Mendefinisikan properti yang bisa di-passing ke komponen ini
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  validateOnSubmit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'validate'])

const updateValue = (newValue) => {
  emit('update:modelValue', newValue)
}

const validate = () => {
  emit('validate', props.modelValue)
}

watch(
  () => props.validateOnSubmit,
  (newValue) => {
    if (newValue) {
      validate()
    }
  }
)
</script>

<style>
.custom-radio {
  /* Custom theme variables for RadioButton */
  --p-radiobutton-checked-background: transparent; /*dipilih */
  --p-radiobutton-checked-hover-background: transparent; /*dipilih */
  --p-radiobutton-filled-background: transparent;
  --p-radiobutton-icon-size: 9.5px;
  --p-radiobutton-icon-checked-color: #d44d20;
  --p-radiobutton-icon-checked-hover-color: #d44d20;

  --p-radiobutton-shadow: none;
}
</style>
