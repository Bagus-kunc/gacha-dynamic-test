<template>
  <div class="flex flex-col items-center justify-center">
    <img
      :src="icon"
      alt="icon"
      width="30"
      height="30"
      preload
      class="text-center cursor-pointer"
      @click="handleClick"
    />
    <p class="text-exd-gray-scorpion text-exd-1020">{{ $t(label) }}</p>
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
