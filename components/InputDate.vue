<template>
    <div class="flex flex-col w-full">
        <!-- Label -->
        <div class="flex items-center justify-between">
        <label
            v-if="label"
            :for="`label-${label}`"
            :class="[
            'text-exd-gray-scorpion text-exd-1424 flex gap-2 items-center py-0',
            bold ? 'font-bold' : '',
            ]"
        >
            {{ label }}
            <span
            v-if="required"
            class="text-exd-0910 px-1 py-[2px] rounded-sm"
            :style="{ backgroundColor: bgColor, color: 'var(--primary)' }"
            >
            {{ $t('required') }}
            </span>
        </label>

        <!-- Informasi tambahan -->
        <span
            v-if="inform"
            class="truncate max-w-56 text-exd-1220 text-exd-gray-scorpion"
        >
            {{ $t(inform) }}
        </span>
        </div>

        <!-- Date Picker -->
        <div
        :class="[
            'inline-flex rounded-xl bg-gray-100 text-exd-gray-scorpion h-10 items-center',
            w230Px ? '!w-[230px]' : 'w-full',
            error ? '!border-2 !border-exd-red-vermilion' : '',
            border ? 'border border-gray-300' : '',
        ]"
        >
        <span v-if="prefix" class="mr-2 font-bold text-exd-1424">{{ prefix }}</span>

        <DatePicker
            v-model="modelValue"
            size="large"
            :placeholder="placeholder"
            class="w-full h-full pl-2"
            inputClass="bg-transparent"
            showIcon
            iconDisplay="input"
            variant="filled"
            :disabled="disabled"
        />

        <span v-if="suffix" class="ml-2 font-bold text-exd-1424">{{ suffix }}</span>
        </div>

        <!-- Helper text -->
        <small
        v-if="hasHelper"
        :id="`${model}-${label}--${prefix}-${suffix}-help`"
        class="!text-exd-gray-scorpion"
        >
        {{ helperText }}
        </small>

        <!-- Error text -->
        <small
        v-if="error"
        :id="`${model}-${label}--${prefix}-${suffix}-error`"
        class="font-normal p-error"
        >
        {{ error }}
        </small>
    </div>
</template>
  
  <script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import DatePicker from 'primevue/datepicker'
  
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
      type: [String, Number, Date],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    minLength: {
      type: Number,
      default: 0,
    },
    inform: {
      type: String,
      default: '',
    },
    messages: {
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
    border: {
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
  
  const { t } = useI18n()
  
  const emit = defineEmits(['update:model', 'validate'])
  
  const isValid = ref(true)
  const value3 = ref(props.model)
  
  const modelValue = computed({
    get: () => props.model,
    set: (value) => emit('update:model', value),
  })
  const updateValue = (value) => {
    modelValue.value = value
    validate()
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
  ::v-deep(.p-datepicker-input-icon-container) {
    padding: 0 !important;
    margin: 0 !important;
    top: 5px !important;
  }
  </style>
  