<template>
  <Dialog
    :visible="isOpen"
    modal
    class="!bg-white !w-exd-300 !max-w-sm border border-exd-gray-44 rounded-xl"
    @update:visible="$emit('isOpen', $event)"
  >
    <template #container>
      <img
        :src="close"
        :hidden="isHiddenClose"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="() => handleClose()"
      />
      <div class="w-full h-full">
        <slot name="body" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import close from '~/assets/images/close.svg'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
    default: null,
  },
  isHiddenClose: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isOpen'])

const handleClose = () => {
  props.onClose && props.onClose()
}
</script>
