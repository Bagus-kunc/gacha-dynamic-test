<template>
  <ImageTextCard
    :on-click="() => handleGoToDetailHistory()"
    :image-card="characterImage"
    :has-rounded="true"
    :is-fetching="isFetching"
  >
    <template v-slot:text v-if="!isFetching">
      <div class="flex gap-1 flex-col justify-center overflow-hidden pr-4">
        <p class="text-exd-gold text-exd-1624 font-bold truncate">
          {{ data.subtitle }}
        </p>
        <p class="text-exd-gray-scorpion font-medium text-exd-1014 truncate">
          {{ formatDate(data.date) }}
        </p>
        <p class="text-exd-gray-scorpion font-medium text-exd-1416 truncate">
          {{ data.title }}
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
  isFetching: { type: Boolean, default: false },
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

watchEffect(() => {
  console.log(props.data)
})

const characterImage = props.data.image || noImage

const router = useRouter()
const raritySrc = ref('')

const handleGoToDetailHistory = () => router.push(`/history/${props.data.id}`)

const handleRarity = () => {
  const rarity = props.data.character?.rarity
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
