<template>
  <div
    class="bg-white bottom-0 left-0 right-0 fixed h-16 z-50 w-full max-w-md mx-auto"
  >
    <div class="inline-flex gap-3 w-full pt-3">
      <div
        class="absolute -top-10 bg-[url('assets/images/point-navbar.png')] bg-cover bg-center w-[104px] h-[104px] flex flex-col justify-center items-center"
      >
        <p
          class="text-white text-[10px] font-bold mt-10 -ml-4 max-w-14 text-center whitespace-pre-line"
        >
          {{ $t('currentPoints') }}
        </p>
        <p class="text-white text-exd-2856 font-bold relative -top-2 -ml-4">
          {{ store.point }}<span class="text-exd-1020">個</span>
        </p>
      </div>

      <div class="inline-flex flex-row ml-[6.5rem] justify-around w-full">
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
import iconGift from '~/assets/images/icon-gift.svg'
import iconStar from '~/assets/images/icon-star.svg'
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
    icon: iconGift,
    label: 'collection',
    onClick: () => router.push('/history'),
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
