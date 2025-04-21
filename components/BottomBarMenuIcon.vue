<template>
  <div class="flex items-center justify-center gap-2">
    <img
      :src="icon"
      alt="icon"
      width="40"
      height="40"
      preload
      class="text-center cursor-pointer"
      @click="handleClick"
    />
    <p class="text-exd-gray-scorpion text-exd-1424">{{ $t(label) }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function,
    default: null,
  },
})

const handleClick = (event) => {
  if (props.onClick) {
    props.onClick(event)
  }
}
</script>
