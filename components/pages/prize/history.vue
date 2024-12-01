<template>
  <div class="bg-white">
    <ImageTextCard
      v-for="item in prizesData"
      :key="item.id"
      :on-click="() => handleGoToDetailRedeem(item.id)"
      :history="true"
      :image-card="item.image"
    >
      <template v-slot:text>
        <div
          class="text-exd-gray-scorpion inline-flex justify-between w-100 pr-4"
        >
          <div class="flex flex-col justify-center gap-1">
            <p
              class="text-exd-1218 rounded-md text-white px-1 w-8 max-w-10 text-center bg-no-repeat bg-cover bg-center"
              :style="color ? { backgroundImage: `url(${color})` } : {}"
            >
              1等
            </p>
            <p class="font-semibold text-[15px]">
              {{ item.name }}
            </p>
            <p class="text-exd-1218 font-medium">
              {{ $t('availablePeriod') }}：{{ item.started_at }}〜
              {{ item.expired_at }}
            </p>
          </div>
        </div>
      </template>
    </ImageTextCard>
  </div>
</template>

<script setup>
import rainbow from '~/assets/images/rainbow-tag.png'
import gold from '~/assets/images/gold-tag.png'
import silver from '~/assets/images/silver-tag.png'
import brown from '~/assets/images/brown-tag.png'
import bronze from '~/assets/images/bronze-tag.png'

const props = defineProps({
  isFetching: { type: Boolean, default: false },
  body: {
    type: Object,
    default: () => {},
  },
  body: {
    type: Object,
    default: () => {},
  },
  keyBody: {
    type: [String, Number],
  },
  rankColor: {
    type: [String, Number],
  },
  currentPoint: {
    type: Number,
    default: 0,
  },
})

const color = ref('')

const redeemLimit = ref(null)
const prizesData = ref({})

const handleRankColor = () => {
  const rank = props.keyBody
  if (rank === 'rainbow') {
    color.value = rainbow
    return color.value
  } else if (rank === 'gold') {
    color.value = gold
    return color.value
  } else if (rank === 'silver') {
    color.value = silver
    return color.value
  } else if (rank === 'bronze') {
    color.value = bronze
    return color.value
  } else if (rank === 'brown') {
    color.value = brown
    return color.value
  }
}

const mapBody = () => {
  props.body.map((item) => {
    redeemLimit.value = item.totalData
    prizesData.value = item.data
    console.log('item body', item.totalData)
  })
}

handleRankColor()
mapBody()

const handleGoToDetailRedeem = (id) => {
  console.log('klik id', id)
}
</script>
