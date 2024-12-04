<template>
  <div class="bg-white">
    <ImageTextCard
      :key="body.user_point_id"
      :on-click="() => handleGoToDetailRedeem(body.user_point_id)"
      :history="true"
      :image-card="body.image"
    >
      <template v-slot:text>
        <div
          class="text-exd-gray-scorpion inline-flex justify-between w-100 pr-4"
        >
          <div class="flex flex-col justify-center gap-1">
            <p
              class="text-exd-1218 rounded-md text-white px-1 w-[30px] text-center bg-no-repeat bg-cover bg-center"
              :style="color ? { backgroundImage: `url(${color})` } : {}"
            >
              <span class="text-[10px]">{{ prizeTypeText }}</span>
            </p>
            <p class="font-semibold md:text-[15px] sm:text-[14px] text-[13px]">
              {{ body.name }}
            </p>
            <p class="md:text-[13px] sm:text-[12px] text-[10px] font-medium">
              {{ $t('availablePeriod') }}：{{ body.started_at }}〜{{ body.expired_at }}
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
const prizeTypeText = ref(null)

const handleRankColor = () => {
  const rank = props.body.type
  if (rank == 6) {
    color.value = rainbow
    prizeTypeText.value = '特賞'
  } else if (rank == 1) {
    color.value = gold
    prizeTypeText.value = '1等'
  } else if (rank == 2) {
    color.value = silver
    prizeTypeText.value = '2等'
  } else if (rank == 3) {
    color.value = bronze
    prizeTypeText.value = '3等'
  } else if (rank == 4) {
    color.value = brown
    prizeTypeText.value = '4等'
  }
}

handleRankColor()

const handleGoToDetailRedeem = (id) => {
  console.log('klik id', id)
}
</script>
