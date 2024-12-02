<template>
  <div class="flex flex-col gap-2 mb-2">
    <div class="w-full bg-exd-gray-44 p-1">
      <Skeleton v-if="isFetching" width="5rem" class="!h-2"></Skeleton>
      <p v-else class="text-white text-exd-1220 font-bold">{{ title }}</p>
    </div>
    <div v-if="isFetching" class="flex flex-col gap-3">
      <Skeleton class="!w-full !h-2"></Skeleton>
      <Skeleton class="!w-full !h-2"></Skeleton>
      <Skeleton width="5rem" class="!h-2"></Skeleton>
    </div>
    <div
      v-else
      class="text-exd-gray-scorpion font-medium text-exd-1218 vhtml-desc"
      v-html="body"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  isFetching: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  body: {
    type: String,
    required: true,
  },
})
</script>
