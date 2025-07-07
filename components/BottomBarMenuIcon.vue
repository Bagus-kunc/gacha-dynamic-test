<template>
  <div
    class="flex flex-col items-center justify-center cursor-pointer"
    @click="handleClick"
  >
    <img
      :src="icon"
      alt="icon"
      width="33"
      height="33"
      preload
      class="text-center"
    />
    <p class="text-exd-gray-scorpion text-[8px] line-clamp-1">{{ label }}</p>
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
