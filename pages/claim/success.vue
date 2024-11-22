<template>
  <HeaderBar withLogo />
  <div class="flex flex-col mt-20 grow justify-between px-8">
    <p
      class="text-exd-gray-scorpion text-exd-1424 text-center font-bold max-w-44 my-8 mx-auto"
    >
      {{ $t('done') }}
    </p>
    <div class="flex-1 w-full relative">
      <div
        class="border-4 border-exd-red-vermilion flex-1 w-5/6 text-center absolute top-8 left-1/2 transform -translate-x-1/2 px-6 py-2 text-exd-red-vermilion !font-extrabold rounded-lg text-[38px]"
      >
        {{ $t('replaced') }}
      </div>
    </div>
  </div>
  <div class="flex flex-col w-full relative gap-1">
    <SolidButton
      :on-click="() => goTo('external')"
      :label="$t('digitalMapTop')"
    />
    <div class="h-5 w-full" />
    <SolidButton
      variant="red"
      :on-click="() => goTo('top')"
      :has-loading="isLoading"
      :label="$t('gachaTop')"
      has-bottom
    />
  </div>
</template>

<script setup>
import duck from '~/assets/images/duck.svg'
import arrow from '~/assets/images/arrow.svg'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const router = useRouter()

const goTo = (type) => {
  switch (type) {
    case 'top':
      router.push('/dashboard')
      break
    case 'external':
      window.open('https://nospot.new-ordinary.co.jp/maps/nagoya')
      break

    default:
      break
  }
}
</script>
