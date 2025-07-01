<template>
  <div
    :class="[
      variantClass,
      'h-full w-full flex justify-center items-center p-2',
    ]"
  >
    <img
      :src="image || notImage"
      alt="character"
      class="relative object-fill w-full h-full"
      preload
      @error="handleImageError"
      :class="isDisabled ? 'opacity-50' : ''"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import notImage from '~/assets/images/notimage.png'

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'with-background',
    validator: (value) =>
      ['with-background', 'without-background'].includes(value),
  },
  isDisabled: {
    type: Boolean,
    default: false,
  }
})

const variantClass = computed(() => {
  return props.variant === 'with-background' ? 'bg-[#FFF6E8]' : 'bg-transparent'
})
</script>
