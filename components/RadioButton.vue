<template>
  <div class="flex flex-col gap-2">
    <label
      :for="`label-${label}`"
      class="flex items-center gap-2 py-0 text-exd-gray-scorpion text-exd-1424"
      v-if="label !== ''"
      >{{ label }}
      <span
        v-if="required"
        class="text-exd-0910 px-1 py-[2px] rounded-sm"
        :style="{ backgroundColor: bgColor, color: 'var(--primary)' }"
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
          :pt="{
            root: {
              class: 'cursor-pointer w-[20px] h-[20px] flex items-center justify-center'
            },
            box: {
              class: 'w-full bg-white h-full rounded-full border-[1px] flex items-center justify-center transition-colors duration-200',
              style: bgColor ? { borderColor: bgColor } : { borderColor: '#D44D20' }
            },
            icon: {
              class: 'w-[10px] h-[10px] rounded-full',
              style: bgColor ? { backgroundColor: bgColor } : { backgroundColor: '#D44D20' }
            }
          }"
        />


        <label
          :for="option.label"
          class="ml-1 font-semibold cursor-pointer text-exd-gray-scorpion text-exd-1424"
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
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  model: {
    type: [String, Number],
    default: '',
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
  bgColor: {
    type: String,
    default: 'gray',
  },
  textColor: {
    type: String,
    default: 'white',
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
