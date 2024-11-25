<template>
  <div class="flex flex-col w-full">
    <div class="flex items-center justify-between">
      <label
        :for="`label-${label}`"
        :class="`text-exd-gray-scorpion text-exd-1424 flex gap-2 items-center py-0 ${
          bold && 'font-bold'
        }`"
        v-if="label !== ''"
        >{{ label }}
        <span
          v-if="required"
          class="!bg-exd-red-coral text-white text-exd-0910 px-1 py-[2px] rounded-sm"
          >{{ $t('required') }}</span
        >
      </label>
      <span
        v-if="inform !== ''"
        class="truncate max-w-56 text-exd-1220 text-exd-gray-scorpion"
        >{{ $t(inform) }}</span
      >
    </div>
    <div
      :class="[
        'inline-flex rounded-xl bg-gray-100 text-exd-gray-scorpion px-4 h-10 items-center w-full',
        error !== '' ? '!border-2 !border-exd-red-vermilion' : '!border-none',
      ]"
    >
      <span v-if="prefix !== ''" class="mr-2 text-exd-1424 font-bold">{{
        prefix
      }}</span>
      <InputText
        :type="type"
        :id="`id-${model}-${label}--${prefix}-${suffix}`"
        :value="modelValue"
        v-only-numeric="onlyNumeric"
        @keydown="preventInvalidInput"
        @input="updateValue($event.target.value)"
        @blur="validate"
        @paste="handlePaste"
        :invalid="error !== '' ? true : false || !isValid"
        :aria-describedby="`${model}-${label}--${prefix}-${suffix}-help`"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'grow w-full bg-gray-100 focus:!border-none focus:!outline-none selection:!rounded-none rounded-none selection:!bg-gray-300 !border-none font-normal',
          disabled && '!text-gray-400',
          w230Px && `!w-[230px]`,
        ]"
      />
      <span v-if="suffix !== ''" class="ml-2 text-exd-1424 font-bold">{{
        suffix
      }}</span>
    </div>
    <small
      v-if="hasHelper"
      :id="`${model}-${label}--${prefix}-${suffix}-help`"
      >{{ helperText }}</small
    >
    <small
      v-if="error !== ''"
      :id="`${model}-${label}--${prefix}-${suffix}-error`"
      :class="['p-error font-normal']"
    >
      {{ error }}
    </small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { useI18n } from 'vue-i18n'

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
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onlyNumeric: {
    type: Boolean,
    default: false,
  },
  onlyZipCode: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  isConfPassword: {
    type: Boolean,
    default: false,
  },
  minLength: {
    type: Number,
    default: 0,
  },
  isEmailError: {
    type: Boolean,
    default: false,
  },
  isNickName: {
    type: Boolean,
    default: false,
  },
  inform: {
    type: String,
    default: '',
  },
  bold: {
    type: Boolean,
    default: false,
  },
  w230Px: {
    type: Boolean,
    default: false,
  },
  validateOnSubmit: Boolean,
  maxLength: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const emit = defineEmits(['update:model', 'validate'])

const isValid = ref(true)

const modelValue = computed({
  get: () => props.model,
  set: (value) => emit('update:model', value),
})

const handlePaste = (event) => {
  if (props.onlyZipCode) {
    event.preventDefault() // Prevent the default paste action
    let pastedData = (event.clipboardData || window.clipboardData).getData(
      'text'
    )

    // Only allow numeric characters
    pastedData = pastedData.replace(/\D/g, '')

    // Format the pasted value with the zip code mask
    const formattedValue = formatZipCode(pastedData)
    modelValue.value = formattedValue
    saveValue.value = formattedValue.replace(/-/g, '') // Save only numeric part
    validate()
    emit('validate', formattedValue)
  }
}

const preventInvalidInput = (event) => {
  if (props.onlyZipCode) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
    ]
    const isNumber = /^[0-9]$/.test(event.key)
    const isHyphen = event.key === '-'
    const isCtrlA = (event.ctrlKey || event.metaKey) && event.key === 'a' // Allow Ctrl+A or Cmd+A for select-all
    const isCtrlV = (event.ctrlKey || event.metaKey) && event.key === 'v' // Allow Ctrl+V or Cmd+V for paste

    if (
      !isNumber &&
      !isHyphen &&
      !allowedKeys.includes(event.key) &&
      !isCtrlA &&
      !isCtrlV
    ) {
      event.preventDefault() // Prevent invalid keypress
    }

    // Prevent typing if length is 8 (7 digits + 1 hyphen) and it's not a control key
    if (event.target.value.length >= 8 && !allowedKeys.includes(event.key)) {
      event.preventDefault()
    }
  }

  if (props.type === 'number' && props.maxLength) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
    ]
    const isNumber = /^[0-9]$/.test(event.key)
    const isHyphen = event.key === '-'
    const isCtrlA = (event.ctrlKey || event.metaKey) && event.key === 'a' // Allow Ctrl+A or Cmd+A for select-all
    const isCtrlV = (event.ctrlKey || event.metaKey) && event.key === 'v' // Allow Ctrl+V or Cmd+V for paste

    if (
      !isNumber &&
      !isHyphen &&
      !allowedKeys.includes(event.key) &&
      !isCtrlA &&
      !isCtrlV
    ) {
      event.preventDefault() // Prevent invalid keypress
    }

    if (
      event.target.value.length >= props.maxLength &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault()
    }
  }
}

const formatZipCode = (value) => {
  value = value.replace(/\D/g, '')

  if (value.length > 3) {
    value = value.slice(0, 3) + '-' + value.slice(3, 7)
  }

  return value.slice(0, 8)
}

const updateValue = (value) => {
  if (props.onlyZipCode) {
    // Apply masking format for zip code
    value = formatZipCode(value)
  }
  modelValue.value = value
  validate()
  emit('validate', value)
}

const validate = () => {
  emit('validate', modelValue.value)
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
::v-deep(.p-inputtext) {
  box-shadow: none !important;
}
</style>
