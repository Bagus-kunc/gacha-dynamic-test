<template>
  <div class="flex flex-col gap-2 mb-2">
    <div class="w-full p-1 bg-exd-gray-44" v-if="title != null">
      <Skeleton v-if="isFetching" width="5rem" class="!h-5 rounded-full"></Skeleton>
      <p v-else class="font-bold text-white text-exd-1220">{{ title }}</p>
    </div>
    <div v-if="isFetching" class="flex flex-col gap-3">
      <Skeleton class="!w-full !h-2"></Skeleton>
      <Skeleton class="!w-full !h-2"></Skeleton>
      <Skeleton width="5rem" class="!h-2"></Skeleton>
    </div>
    <div
      v-else
      class="font-medium width-text text-exd-gray-scorpion text-exd-1218 vhtml-desc"
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
    default: '',
  },
})
</script>

<style scoped>
.width-text {
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.vhtml-desc {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
