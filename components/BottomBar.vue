<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 w-full h-16 max-w-md mx-auto bg-white"
  >
    <div class="inline-flex w-full gap-3">
      <div
        class="absolute -top-[40px] bg-[url('assets/images/point-navbar.png')] bg-cover bg-center w-[110px] md:w-[130px] h-[115px] flex flex-col justify-center items-center"
      >
        <p
          class="text-white text-[11px] font-bold -ml-3 text-center whitespace-pre-line mt-9"
        >
          {{ $t('currentPoints') }}
        </p>
        <Skeleton v-if="!store.point" class="!h-5 mt-2 bg-white !w-20 mr-4"/>
        <p v-else class="relative -ml-3 font-bold text-white text-[30px] -top-1">
          {{ store.point }}<span class="text-exd-1020">pt</span>
        </p>
      </div>

      <div
        class="inline-flex flex-row justify-around w-full ml-[28%] pt-2"
      >
      <BottomBarMenuIcon
        v-for="(item, index) in dynamicItems"
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
import iconPin from '~/assets/images/icon-pin.svg'
import iconStar from '~/assets/images/icon-star.svg'
import collection from '~/assets/images/collection.png'
import iconPerson from '~/assets/images/icon-person.png'
import { store } from '~/stores/dashboard.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const settings = useState('settings')

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
    icon: iconPin,
    label: 'targetSpot',
    onClick: () => window.open('https://aichi-platform.com', '_blank'),
  },
  {
    icon: iconPerson,
    label: 'myPage',
    onClick: () => router.push('/dashboard'),
  },
])

const dynamicItems = ref([])

const handleItems = () => {
  if (settings.value.user_dashboard.footers) {
    const items = settings.value.user_dashboard.footers.menus
    dynamicItems.value = items.map((item) => ({
      icon: item.icon_image,
      label: item.footer_title_name_translation_key_id,
      onClick:
        item.link_type === 'external'
          ? () => window.open(item.external_url, '_blank')
          : () => {
              const matched = menuItems.value.find(
                (menu) =>
                  menu.label === item.footer_title_name_translation_key_id
              )
              if (matched) matched.onClick()
            },
    }))
  }
}

onMounted(() => {
  store.fetchingDashboardData()
  handleItems()
})
</script>
