<template>
  <ImageTextCard
    :on-click="() => handleGoToDetailHistory()"
    :image-card="characterImage"
    :has-rounded="true"
    :is-fetching="isFetching"
  >
    <template v-slot:text v-if="!isFetching">
      <div class="flex flex-col justify-between gap-1">
        <p class="font-bold text-exd-gold text-exd-1624">
          {{ data.subtitle }}
          <!-- <img :src="raritySrc" alt="power char" width="30" height="30" /> -->
        </p>
        <p class="font-medium text-exd-gray-scorpion text-exd-1014">
          {{ formatDate(data.date) }}
        </p>
        <p class="font-semibold text-exd-gray-scorpion text-exd-1416">
          {{ data?.title }}
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
