<template>
  <div class="flex flex-col w-full">
    <label
      :for="`label-${label}`"
      :class="`text-exd-gray-scorpion text-exd-1424 flex gap-2 items-center py-0 ${
          bold && 'font-bold'
        }`"
      v-if="label !== ''"
      >{{ label }}</label
    >
    <div
      :class="[
        'inline-flex rounded-xl bg-gray-100 text-exd-gray-scorpion px-4 h-10 items-center',
        (validateOnSubmit && !isLengthValid && !modelValue) || error !== '' ? '!border-2 !border-exd-red-vermilion' : '',
        border ? 'border border-gray-300 ' : '',
      ]"
    >
      <Select
        :inputId="`id-${model}`"
        :modelValue="modelValue"
        @update:modelValue="($value) => updateValue($value)"
        @blur="validate"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :invalid="error !== '' ? true : false"
        :aria-describedby="`${model}-help`"
        :placeholder="placeholder"
        :editable="editable"
        :class="[
          'grow !w-full bg-transparent focus:!border-none focus:!outline-none selection:!rounded-none rounded-none !border-none font-normal'
        ]"
        inputClass="!text-exd-gray-scorpion"
        overlayClass="bg-white"
        :ptOptions="{ mergeSections: true, mergeProps: true }"
        :pt="{
          option: `!text-gray-500 hover:text-white !bg-${bgColor}`,
          dropdown: { class: locale === 'en' && '!text-xs px-2 !w-auto' },
        }"
      >
        <template v-if="suffix !== ''" #dropdownicon>
          {{ suffix }}
        </template>
      </Select>
    </div>
    <small v-if="hasHelper" :id="`${model}-help`">{{ helperText }}</small>
    <small v-if="error !== ''" :id="`${model}-error`" :class="['p-error']">{{
      error
    }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  error: {
    type: String,
    default: '',
  },
  hasHelper: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  model: {
    type: [Number, Object, String, null],
    default: null,
  },
  options: {
    type: Array,
    default: [],
  },
  optionLabel: {
    type: String,
    default: null,
  },
  optionValue: {
    type: String,
    default: null,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  translate: {
    type: Boolean,
    default: false,
  },
  bold: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
  bgWhite: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#000000',
  },
  validateOnSubmit: Boolean,
})

const emit = defineEmits(['update:model', 'validate'])
const isLengthValid = ref(true)
const modelValue = computed({
  get: () => props.model,
  set: (value) => emit('update:model', value),
})

const updateValue = (value) => {
  modelValue.value = value
  validate()
  emit('validate', value)
}

const validate = () => {
  const value = modelValue.value

  if (typeof value === 'string' || Array.isArray(value)) {
    isLengthValid.value = value.length > 0
  } else if (typeof value === 'number') {
    isLengthValid.value = true 
  } else if (value === null || value === undefined) {
    isLengthValid.value = false
  } else {
    isLengthValid.value = !!value
  }

  emit('validate', value)
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

<style scoped>
:global(.p-select-overlay) {
  @apply w-[35%] !important;
}

:global(.p-select-overlay .p-select-option-label) {
  @apply block truncate max-w-full;
}


::v-deep(.p-inputtext) {
  box-shadow: none !important;
}

:deep(.p-select-dropdown) {
  color: hlsa(var(--gray-scorpion)) !important;
}

:global(.p-select-list .p-select-option-selected) {
  @apply !bg-[var(--register-bg-color)];
}

:global(.p-select-list .p-select-option.p-focus) {
  @apply !bg-[var(--register-bg-color)] !text-[var(--register-text-color)];
}

:global(.p-select-option.p-select-option-selected.p-focus) {
  color: hlsa(var(--gray-scorpion)) !important;
}
</style>
