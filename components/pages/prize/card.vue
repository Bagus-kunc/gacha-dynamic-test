<template>
  <div class="rounded-xl max-w-sm overflow-hidden cursor-pointer">
    <div class="inline-flex justify-between w-full py-2 px-4" :class="[color ]">
      <template v-if="!isFetching">
        <p class="text-white font-bold text-exd-1824">
          <!-- {{ keyBody }}<span class="text-exd-1424">pt</span> -->
          1等
        </p>

        <p
          class="text-white font-medium text-exd-1224"
          v-if="currentPoint >= keyBody"
        >
          {{ $t('canBeReplaced') }}
        </p>
      </template>
      <template v-else>
        <Skeleton width="10rem" class="bg-white"></Skeleton>
        <Skeleton width="5rem" class="bg-white"></Skeleton>
      </template>
    </div>
    <template v-if="!isFetching">
      <ImageTextCard
        v-for="item in body"
        :key="item.id"
        :on-click="() => handleGoToDetailRedeem(item.id)"
        :image-card="item.image"
      >
        <template v-slot:text>
          <div class="inline-flex justify-between w-100 pr-4">
            <div class="flex flex-col justify-center gap-1">
              <p class="text-exd-gray-scorpion font-semibold text-[15px]">
                {{ item.name }}
              </p>
              <p class="text-exd-red-500 text-exd-1218 font-medium">
                {{ $t('availablePeriod') }}：{{ item.started_at }}〜
                {{ item.expired_at }}
              </p>
            </div>
          </div>
        </template>
      </ImageTextCard>
    </template>
    <template v-else>
      <ImageTextCard v-for="n in 5" :key="n" :is-fetching="isFetching" />
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

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

const router = useRouter()
const handleGoToDetailRedeem = (id) => router.push(`/prize/${id}`)

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


console.log('keyBody', props.keyBody)
console.log('rankColor', props.rankColor)

</script>
