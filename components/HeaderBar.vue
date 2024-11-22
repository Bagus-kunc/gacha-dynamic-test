<template>
  <header
    class="pt-exd-15 bg-white pb-exd-15 flex justify-between items-center top-0 left-0 right-0 z-40 fixed w-full max-w-md mx-auto"
    style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
    @touchmove="(e) => e.preventDefault()"
  >
    <div class="pl-5" v-if="hasBack">
      <img
        src="/images/back-button.svg"
        alt="back"
        width="40"
        height="40"
        preload
        class="cursor-pointer"
        @click="handleGoBack"
      />
    </div>
    <div
      :class="['grow text-center', !hasBack ? 'pl-[60px]' : '']"
      v-if="!withLogo"
    >
      <slot />
    </div>
    <div
      :class="[
        'grow text-center w-full justify-center items-center flex',
        !hasBack ? 'pl-[60px]' : '',
      ]"
      v-else
    >
      <img src="/images/logo.png" alt="intl" width="130" height="48" preload />
    </div>
    <div class="pr-5 shrink-0">
      <div class="relative">
        <button type="button" aria-haspopup="true" @click="langPanelToggle">
          <img
            src="/images/intl-icon.svg"
            alt="intl"
            width="40"
            height="40"
            preload
            class="cursor-pointer"
          />
        </button>
        <LanguangePanel v-model:visible="langPanel" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

defineProps({
  hasBack: {
    type: Boolean,
    default: false,
  },
  withLogo: {
    type: Boolean,
    default: false,
  },
})

const langPanel = ref(false)

const langPanelToggle = (event) => {
  langPanel.value = !langPanel.value
}

const handleGoBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
