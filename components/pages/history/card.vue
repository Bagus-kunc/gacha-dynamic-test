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
          30,000<span class="text-exd-1224">pt</span>
          <!-- {{ data.amount }}<span class="text-exd-1224">pt</span> -->
        </p>
        <p class="font-medium text-exd-gray-scorpion text-exd-1014">
          {{ data.created_at }}
        </p>
        <p class="font-semibold text-exd-gray-scorpion text-exd-1218">
          {{ data?.character?.name }}
        </p>
      </div>
    </template>
  </ImageTextCard>
</template>

<script setup>
import { useRouter } from 'vue-router'
import noImage from '~/assets/images/no-image.svg'

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

const characterImage = props.data.character?.image || noImage

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

handleRarity()
</script>
