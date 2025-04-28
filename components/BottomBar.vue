<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 w-full h-16 max-w-md mx-auto bg-white"
  >
    <div class="inline-flex w-full gap-3 pt-3">
      <div
        class="absolute -top-[40px] bg-[url('assets/images/point-navbar.png')] bg-cover bg-center w-[175px] h-[135px] flex flex-col justify-center items-center"
      >
        <p
          class="text-white text-[10px] font-bold -ml-4 text-center whitespace-pre-line"
        >
          {{ $t('currentPoints') }}
        </p>
        <p class="relative -ml-4 font-bold text-white text-exd-2856 -top-2">
          {{ store.point }}<span class="text-exd-1020">pt</span>
          <!-- {{ store.point }}<span class="text-exd-1020">個</span> -->
        </p>
      </div>

      <div class="inline-flex flex-row ml-[9rem] justify-around w-full">
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
  // {
  //   icon: iconStar,
  //   label: 'listOfPrizesAndExchanges',
  //   onClick: () => router.push('/prize'),
  // },
  // {
  //   icon: iconGift,
  //   label: 'collection',
  //   onClick: () => router.push('/history'),
  // },
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
