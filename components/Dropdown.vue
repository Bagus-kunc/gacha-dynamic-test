<template>
  <div class="flex flex-col w-full">
    <label
      :for="`label-${label}`"
      class="text-exd-gray-scorpion font-bold text-exd-1424"
      v-if="label !== ''"
      >{{ label }}</label
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
        'grow w-full bg-gray-100 !text-exd-gray-scorpion focus:!border-none focus:!outline-none selection:!rounded-none rounded-xl selection:!bg-gray-300',
        (validateOnSubmit && !isLengthValid && !modelValue) || error !== ''
          ? '!border-2 border-exd-red-vermilion'
          : '!border-none',
        bgWhite && '!bg-white',
      ]"
      inputClass="!text-exd-gray-scorpion"
      overlayClass="bg-white"
      :ptOptions="{ mergeSections: true, mergeProps: true }"
      :pt="{
        option: '!text-gray-500 hover:text-white',
        dropdown: { class: locale === 'en' && '!text-xs px-2 !w-auto' },
      }"
    >
      <template v-if="suffix !== ''" #dropdownicon>
        {{ suffix }}
      </template>
    </Select>
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
  bgWhite: {
    type: Boolean,
    default: false,
  },
  validateOnSubmit: Boolean,
})

const { t } = useI18n()

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
  isLengthValid.value = modelValue.value.length > 0
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

:deep(.p-select-dropdown) {
  color: hlsa(var(--gray-scorpion)) !important;
}

:global(.p-select-option.p-focus) {
  color: hlsa(var(--gray-scorpion)) !important;
  background-color: #d44d20;
}

:global(.p-select-option.p-select-option-selected.p-focus) {
  background-color: #d44d20;
  color: hlsa(var(--gray-scorpion)) !important;
}
</style>
