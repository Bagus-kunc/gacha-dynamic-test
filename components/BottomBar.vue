<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 w-full h-16 max-w-md mx-auto bg-white"
  >
    <div class="inline-flex w-full gap-3 pt-3">
      <div
        class="absolute -top-[40px] bg-[url('assets/images/point-navbar.png')] bg-cover bg-center w-[130px] md:w-[160px] h-[135px] flex flex-col justify-center items-center"
      >
        <p
          class="text-white text-[11px] font-bold -ml-4 text-center whitespace-pre-line"
        >
          {{ $t('currentPoints') }}
        </p>
        <Skeleton v-if="!store.point" class="!h-5 mt-2 bg-white !w-20 mr-4"/>
        <p v-else class="relative -ml-4 font-bold text-white text-[30px] -top-[2px]">
          {{ store.point }}<span class="text-exd-1020">pt</span>
        </p>
      </div>

      <div
        class="inline-flex flex-row ml-[7.8rem] md:ml-[9.5rem] justify-around w-full"
      >
        <BottomBarMenuIcon
          v-for="(item, index) in menuItems"
          :key="index"
          :icon="item.icon"
          :label="item.label"
          :on-click="item.onClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import goToAichi from '~/assets/images/go-to-aichi.png'
import iconStar from '~/assets/images/icon-star.svg'
import collection from '~/assets/images/collection.png'
import iconPerson from '~/assets/images/icon-person.png'
import { store } from '~/stores/dashboard.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = ref([
  {
    icon: iconStar,
    label: 'listOfPrizesAndExchanges',
    onClick: () => router.push('/prize'),
  },
  {
    icon: collection,
    label: 'collection',
    onClick: () => router.push('/history'),
  },
  {
    icon: goToAichi,
    label: 'letsGoToAichi',
    onClick: () => window.open('https://aichi-platform.com', '_blank'),
  },
  {
    icon: iconPerson,
    label: 'myPage',
    onClick: () => router.push('/dashboard'),
  },
])

onMounted(() => {
  store.fetchingDashboardData()
})
</script>
