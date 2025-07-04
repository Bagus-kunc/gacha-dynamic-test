<template>
  <header
    class="pt-[39px] pb-3 flex justify-between items-center top-0 left-0 right-0 z-40 fixed w-full max-w-md mx-auto bg-white"
    style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
    @touchmove="(e) => e.preventDefault()"
  >

    <div class="flex pl-5">
      <IconsArrowIcon v-if="hasBack" :handleGoBack="handleGoBack" :currentColor="settings?.global?.icon_color?.background" />
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
      <img
        :src="headerLogo"
        alt="intl"
        width="241"
        height="58"
        preload
        class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      />
    </div>
    <div class="pr-5 shrink-0">
      <div class="relative flex">
        <button type="button" aria-haspopup="true" @click="langPanelToggle">
          <IconsLangIcon :style="{color: settings.global.icon_color.background}" />
        </button>
        <LanguangePanel v-model:visible="langPanel" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import backIcon from '~/public/images/back-button.svg'
import headerLogo from '~/public/images/header-logo.png'

const router = useRouter()
const settings = useState('settings')

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
