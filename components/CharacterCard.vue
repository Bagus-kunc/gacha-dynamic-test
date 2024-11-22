<template>
  <div
    :class="[variantClass, 'h-full w-full flex justify-center items-center']"
  >
    <img
      :src="image || notImage"
      alt="character"
      class="relative w-full h-full object-fill"
      preload
      @error="handleImageError"
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
})

const variantClass = computed(() => {
  return props.variant === 'with-background' ? 'bg-[#FFEEE8]' : 'bg-transparent'
})
</script>
