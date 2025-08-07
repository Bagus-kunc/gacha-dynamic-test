<template>
  <div class="inline-flex flex-col w-full">
    <label class="flex items-center gap-2 text-exd-gray-scorpion text-exd-1424">
      {{ label }}
      <span
        v-if="required"
        class="text-exd-0910 px-1 py-[2px] rounded-sm"
        :style="{ backgroundColor: bgColor, color: textColor }"
      >
        {{ $t('required') }}
      </span>
    </label>
    <ButtonGroup
      class="flex justify-between w-full h-10 mt-1 rounded-none text-exd-gray-scorpion"
      style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
    >
      <Button
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option.value)"
        :label="option.label"
        :class="[
          'bg-white w-full h-full border border-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
          index !== 0 && 'border-l-0',
          modelValue === option.value && '!bg-exd-banana',
          `w-${100 / options.length}%`,
        ]"
      />
    </ButtonGroup>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'sex',
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#000000',
  },
  options: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['update:modelValue'])

const selectOption = (value) => {
  emit('update:modelValue', value)
}

watchEffect(() => {
  if (!props.modelValue && props.options.length > 0) {
    const lastOption = props.options[props.options.length - 1]
    emit('update:modelValue', lastOption.value)
  }
})
</script>
