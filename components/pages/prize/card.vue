<template>
  <div
    class="max-w-sm overflow-hidden cursor-pointer rounded-xl"
    v-if="body.length > 0"
  >
    <div class="flex justify-between w-full px-2 py-1 min-h-6" :class="color">
      <template v-if="!isFetching">
        <i18n-t
          keypath="availablePoints"
          tag="div"
          scope="global"
          class="font-bold text-white text-exd-1624"
        >
          <template v-slot:points>
            <span class=""> {{ $t(keyBody) }}</span>
          </template>
        </i18n-t>
      </template>
    </div>
    <template v-if="!isFetching">
      <ImageTextCard
        v-for="item in body"
        :key="item.user_point_id"
        :on-click="() => handleGoToDetailRedeem(item.point_id)"
        :image-card="item.image"
        :is-fetching="isFetching"
      >
        <template v-slot:text>
          <div class="inline-flex justify-between pr-4 w-100">
            <div class="flex flex-col justify-center gap-1">
              <p
                class="text-exd-gray-scorpion font-semibold text-[12px] sm:text-[14px] line-clamp-2"
              >
                {{ item.name }}
              </p>
              <p
                class="text-exd-red-500 text-[10px] sm:text-[12px] font-medium"
              >
                {{ $t('applicationPeriod') }}：{{ item.started_at }}〜{{
                  item.expired_at
                }}
              </p>
            </div>
          </div>
        </template>
      </ImageTextCard>
    </template>
    <template v-else>
      <ImageTextCard v-for="n in 1" :key="n" :is-fetching="isFetching" />
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const props = defineProps({
  isFetching: { type: Boolean, default: true },

  body: {
    type: Array,
    default: () => [],
  },
  keyBody: {
    type: [String, Number],
  },
  totalData: {
    type: [String, Number],
  },
  currentPoint: {
    type: [Number, String],
    default: 0,
  },
})

const color = ref('')
const classType = ref('')

const totalGift = ref(null)

const router = useRouter()
const handleGoToDetailRedeem = (id) => router.push(`/prize/${id}`)

const handleRankClass = () => {
  const rank = props.keyBody
  if (rank === '2000pt') {
    color.value = 'bg-exd-gold'
    return color.value
  } else if (rank === '1000pt') {
    color.value = 'bg-exd-red-vermilion'
    return color.value
  } else if (rank === '500pt') {
    color.value = 'bg-exd-blue-sky'
    return color.value
  } else if (rank === '200pt') {
    color.value = 'bg-exd-green-tea'
    return color.value
  } else if (rank === '50pt') {
    color.value = 'bg-exd-purple-gray'
    return color.value
  }
}

const formatDate = (datetime) => {
  const date = new Date(datetime)
  return date.toISOString().split('T')[0]
}

const handleTotalData = () => {
  totalGift.value = t('canBeReplaced', { limit: props.totalData })
}

handleRankClass()
handleTotalData()
</script>
