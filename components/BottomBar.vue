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
          class="absolute top-2 text-white text-[10px] font-bold -ml-3 text-center whitespace-pre-line mt-9"
          :style="{color: settings.user_dashboard?.footers?.point_background_color?.color}"
        >
          {{ $t('currentPoints') }}
        </p>
        <div class="absolute -ml-3 bottom-2">
          <Skeleton v-if="!store.point" class="!w-20 !h-7 bg-white mb-[6px]"/>
          <p v-else 
          class="font-bold text-white text-[25px]"
          :style="{color: settings.user_dashboard?.footers?.point_background_color?.color}"
          >
            {{ store.point }}<span class="text-exd-1020">pt</span>
          </p>
        </div>
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

const dynamicItems = ref([])

const handleItems = () => {
  const footers = settings.value?.user_dashboard?.footers;
  if (!footers) return;

  const items = footers.menus || [];

  dynamicItems.value = items.map((item) => {
    const isExternal = item.link_type === 'external';
    const label = item.footer_title_name?.value || '';
    const key = item.footer_title_name?.key;

    const onClick = () => {
      if (isExternal) {
        window.open(item.external_url, '_blank');
      } else if (key === 'character_collection') {
        router.push('/history');
      } else if (key === 'prize_list' || key === 'prize_exchange' || key === 'prizes') {
        router.push('/prize');
      } else if (key === 'my_page') {
        router.push('/dashboard');
      } else {
        console.warn(`Unknown footer menu key: ${key}`);
      }
    };

    return {
      icon: item.icon_image || iconStar,
      label,
      onClick,
    };
  });
};


onMounted(() => {
  store.fetchingDashboardData()
  handleItems()
})
</script>
