<template>
  <div class="flex items-center">
    <div class="flex">
      <div
        v-for="index in maxStars"
        :key="index"
        class="relative"
        :style="{ width: `${size}px`, height: `${size}px` }"
      >
        <!-- Empty Star -->
        <svg
          viewBox="0 0 24 24"
          :style="{
            width: `${size}px`,
            height: `${size}px`,
            fill: emptyColor
          }"
          class="absolute top-0 left-0"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>

        <!-- Filled Star Overlay -->
        <div
          class="absolute top-0 left-0 overflow-hidden"
          :style="{
            width: `${calculateStarFillWidth(index)}%`,
            height: '100%'
          }"
        >
          <svg
            viewBox="0 0 24 24"
            :style="{
              width: `${size}px`,
              height: `${size}px`,
              fill: color
            }"
            class="absolute top-0 left-0"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
      </div>
    </div>
    <span
      v-if="showValue"
      class="ml-2 text-sm text-gray-600"
    >
      {{ formattedValue }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  maxStars: {
    type: Number,
    default: 5
  },
  size: {
    type: Number,
    default: 23
  },
  color: {
    type: String,
    default: "#FFD700"
  },
  emptyColor: {
    type: String,
    default: "#E0E0E0"
  },
  showValue: {
    type: Boolean,
    default: true
  }
})

// Safely convert value to number
const safeValue = computed(() => Math.min(Math.max(Number(props.value) || 0, 0), props.maxStars))

// Format value to one decimal place
const formattedValue = computed(() => safeValue.value.toFixed(1))

// Calculate the fill width for each star
const calculateStarFillWidth = (starIndex) => {
  if (safeValue.value >= starIndex) return 100
  if (safeValue.value > starIndex - 1 && safeValue.value < starIndex) {
    return (safeValue.value - (starIndex - 1)) * 100
  }
  return 0
}
</script>