<template>
  <Modal :is-open="isOpen" :on-close="() => handleClose()">
    <template v-slot:body>
      <div
        class="w-full h-exd-200 flex flex-col justify-end items-center gap-8 mt-2"
      >
        <p
          class="font-bold text-exd-1424 text-exd-gray-scorpion p-5 text-center"
        >
          {{ modalTitle }}
        </p>

        <div class="pb-5 w-full">
          <SolidButton
            v-if="hasButton"
            :label="labelButton"
            :on-click="() => handleClick()"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  labelButton: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  modalTitle: {
    type: String,
    default: '',
  },
  hasButton: {
    type: Boolean,
    default: false,
  },
  onClickButton: {
    type: Function,
    default: null,
  },
  onClose: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['update:isOpen'])

const handleClose = (event) => {
  props.onClose(event)
}

const handleClick = (event) => {
  if (props.onClickButton) {
    props.onClickButton(event)
  }
}
</script>
