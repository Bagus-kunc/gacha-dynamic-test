<template>
  <div class="bg-white">
    <ImageTextCard
      v-for="item in body"
      :key="item.id"
      :on-click="() => handleGoToDetailRedeem(item.id)"
      :history="true"
      :image-card="item.image"
    >
      <template v-slot:text>
        <div class="text-exd-gray-scorpion inline-flex justify-between w-100 pr-4">
          <div class="flex flex-col justify-center gap-1">
            <p class="text-exd-1218 rounded-md text-white px-1 w-8 max-w-10 text-center" :class="[color ]" >1等</p>
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

const color = ref(props.rankColor)

const handleRankColor = () => {
    const rank = props.rankColor
    if (rank === 'gold') {
        color.value = 'bg-exd-redeem'
        return color.value
    } else if ( rank === 'silver') {
        color.value = 'bg-exd-redeem-silver'
        return color.value
    } else if (rank === 'bronze') {
        color.value = 'bg-exd-redeem-bronze'
        return color.value
    }
}

handleRankColor()

const handleGoToDetailRedeem = (id) => {
    console.log('klik id', id)
}
</script>
