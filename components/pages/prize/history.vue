<template>
  <div v-if="!isFetching" class="bg-white">
    <ImageTextCard
      :key="body.user_point_id"
      :history="true"
      :image-card="body.image"
    >
      <template v-slot:text>
        <div
          class="inline-flex justify-between pr-4 text-exd-gray-scorpion w-100"
        >
          <div class="flex flex-col items-start justify-center gap-1">
            <p
              class="px-[6px] text-center text-white rounded-md text-[11px]"
              :class="color"
            >
              {{ body.rank.toUpperCase() }}{{ $t('prize') }}
            </p>
            <p class="font-semibold md:text-[15px] sm:text-[14px] text-[13px]">
              {{ body.name }}
            </p>
            <!-- <p class="md:text-[13px] sm:text-[12px] text-[10px] font-medium">
              {{ $t('exchangeCompleted') }}：{{ body.reedem_at }}
            </p> -->
          </div>
        </div>
      </template>
    </ImageTextCard>
  </div>
  <div v-else>
    <ImageTextCard v-for="n in 1" :key="n" :is-fetching="isFetching" />
  </div>
</template>

<script setup>
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
    type: [Number, String],
    default: 0,
  },
})

const color = ref('')
const router = useRouter()

const handleGoToDetailRedeem = (id) => router.push(`/prize/history/${id}`)

const handleRankColor = () => {
  const rank = props.body.rank
  if (rank === 's') {
    color.value = 'bg-exd-gold'
    return color.value
  } else if (rank === 'a') {
    color.value = 'bg-exd-red-vermilion'
    return color.value
  } else if (rank === 'b') {
    color.value = 'bg-exd-blue-sky'
    return color.value
  } else if (rank === 'c') {
    color.value = 'bg-exd-green-tea'
    return color.value
  } else if (rank === 'd') {
    color.value = 'bg-exd-purple-gray'
    return color.value
  }
}

handleRankColor()
</script>
