<template>
  <ImageTextCard
    :on-click="() => handleGoToDetailHistory()"
    :image-card="characterImage"
    :has-rounded="true"
    :is-fetching="isFetching"
  >
    <template v-slot:text v-if="!isFetching">
      <div class="flex flex-col justify-center gap-1 pr-4 overflow-hidden">
        <p
          class="h-5 bg-no-repeat bg-contain bg-start"
          :style="raritySrc ? { backgroundImage: `url(${raritySrc})` } : {}"
        >
          <!-- {{ data.subtitle }} -->
        </p>
        <p class="font-medium truncate text-exd-gray-scorpion text-exd-1416">
          {{ data.title }}
        </p>
        <p class="font-medium truncate text-exd-gray-scorpion text-exd-1014">
          {{ data.date }}
        </p>
      </div>
    </template>
  </ImageTextCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import noImage from '~/assets/images/no-image.svg'
import moment from 'moment'

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  id: {
    type: String,
    default: '',
  },
  isFetching: {
    type: Boolean,
    default: true,
  },
})

const characterImage = props.data.image || noImage

const router = useRouter()
const raritySrc = ref('')

const handleGoToDetailHistory = () => router.push(`/history/${props.data.id}`)

const handleRarity = () => {
  const rarity = '2'
  if (rarity === '1') {
    raritySrc.value = '/images/r-bg.png'
  } else if (rarity === '2') {
    raritySrc.value = '/images/sr-bg.png'
  } else if (rarity === '3') {
    raritySrc.value = '/images/ssr-bg.png'
  }
}

const formatDate = (datetime) => {
  return moment(datetime).format('YYYY/MM/DD HH:mm:ss')
}

handleRarity()
</script>
