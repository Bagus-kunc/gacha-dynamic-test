<template>
  <div
    v-if="type === 'row'"
    :class="[
      'w-full flex justify-between items-center',
      isArrow && arrowBottomClass,
    ]"
  >
    <div class="flex items-center">
      <div
        class="font-bold text-exd-1218 bg-exd-gray-scorpion text-white w-[0.875rem] h-[0.875rem] rounded-full flex items-center justify-center mr-1"
        style="font-family: serif"
      >
        {{ number }}
      </div>
      <p class="text-exd-1422 font-medium">
        <slot name="header"></slot>
      </p>
    </div>
    <div class="flex flex-col items-center">
      <slot name="body"></slot>
    </div>
  </div>
  <div
    v-if="type === 'col'"
    :class="['w-full flex flex-col', isArrow && arrowBottomClass]"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <div
          class="font-bold text-exd-1218 bg-exd-gray-scorpion text-white w-[0.875rem] h-[0.875rem] rounded-full flex items-center justify-center mr-1"
          style="font-family: serif"
        >
          {{ number }}
        </div>
        <p class="text-exd-1422 font-medium">
          <slot name="header"></slot>
        </p>
      </div>
    </div>
    <div class="mt-2">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    validator(value, props) {
      return ['row', 'col'].includes(value)
    },
    default: 'row',
  },
  number: {
    type: [Number, String],
    default: 0,
  },
  isArrow: {
    type: Boolean,
    default: true,
  },
})

const arrowBottomClass = computed(
  () =>
    "pb-4 relative after:absolute after:content-[''] after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:border-t-[0.45rem] after:border-l-[0.5rem] after:border-r-[0.5rem] after:border-t-exd-stone-300 after:border-x-transparent"
)
</script>
