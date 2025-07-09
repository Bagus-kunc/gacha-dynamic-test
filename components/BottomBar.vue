<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 w-full h-16 max-w-md mx-auto bg-white"
  >
    <div class="inline-flex w-full gap-3">
      <div
        class="absolute -top-[40px] flex flex-col justify-center items-center"
      >
        <IconsBackgroundPointRounded :style="{color: settings.user_dashboard?.footers?.point_background_color?.background}" />
        <p
          class="absolute top-2 text-white text-[11px] font-bold -ml-3 text-center whitespace-pre-line mt-9"
          :style="{color: settings.user_dashboard?.footers?.point_background_color?.color}"
        >
          {{ $t('currentPoints') }}
        </p>
        <div class="absolute -ml-3 bottom-1">
          <Skeleton v-if="!store.point" class="!w-20 !h-7 bg-white mb-[6px]"/>
          <p v-else 
          class="font-bold text-white text-[30px]"
          :style="{color: settings.user_dashboard?.footers?.point_background_color?.color}"
          >
            {{ store.point }}<span class="text-exd-1020">pt</span>
          </p>
        </div>
      </div>

      <div
        class="inline-flex flex-row ml-[27%] sm:ml-[24%] justify-around w-full pt-4 sm:pt-2"
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
  const footers = settings.value?.user_dashboard?.footers;
  if (!footers) return;

  const items = footers.menus || [];

  dynamicItems.value = items.map((item) => {
    const isExternal = item.link_type === 'external';
    const label = item.footer_title_name?.value || '';

    return {
      icon: item.icon_image,
      label,
      onClick: isExternal
        ? () => window.open(item.external_url, '_blank')
        : () => {
            const matched = menuItems.value.find(
              (menu) => menu.label === label
            );
            if (matched && typeof matched.onClick === 'function') {
              matched.onClick();
            }
          },
    };
  });
};

onMounted(() => {
  store.fetchingDashboardData()
  handleItems()
})
</script>
