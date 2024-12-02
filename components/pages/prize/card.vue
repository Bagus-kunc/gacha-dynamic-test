<template>
  <div class="rounded-xl max-w-sm overflow-hidden cursor-pointer" v-if="body.length > 0">
    <div
      class="flex justify-between bg-center w-full p-2 bg-no-repeat bg-cover"
      :style="color ? { backgroundImage: `url(${color})` } : {}"
    >
      <template v-if="!isFetching">
        <p class="text-white font-bold text-exd-1824">
          <span class="text-[16px]" v-html="t(classType)"></span>
        </p>

        <p
          class="text-white font-medium text-exd-1224"
          v-html="totalGift"
        ></p>
      </template>
      <template v-else>
        <Skeleton width="10rem" class="bg-white"></Skeleton>
        <Skeleton width="5rem" class="bg-white"></Skeleton>
      </template>
    </div>
    <template v-if="!isFetching">
      <ImageTextCard
        v-for="item in body"
        :key="item.user_point_id"
        :on-click="() => handleGoToDetailRedeem(item.user_point_id)"
        :image-card="item.image"
      >
        <template v-slot:text>
          <div class="inline-flex justify-between w-100 pr-4">
            <div class="flex flex-col justify-center gap-1">
              <p class="text-exd-gray-scorpion font-semibold text-[15px] h-[35px] truncate">
                {{ item.name }}
              </p>
             <p class="text-exd-red-500 text-exd-1320 font-medium">
                {{ $t('availablePeriod') }}：{{ formatDate(item.started_at) }}〜
                {{ formatDate(item.expired_at) }}
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
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import rainbow from '~/assets/images/rainbow.png'
import gold from '~/assets/images/gold.png'
import silver from '~/assets/images/silver.png'
import bronze from '~/assets/images/bronze.png'
import iron from '~/assets/images/brown.png'

const { t } = useI18n()

const props = defineProps({
  isFetching: { type: Boolean, default: false },

  body: {
    type: Object,
    default: () => {},
  },
  keyBody: {
    type: [String, Number],
  },
  totalData: {
    type: [String, Number],
  },
  currentPoint: {
    type: Number,
    default: 0,
  },
})

const color = ref('')
const classType = ref('')

const totalGift = ref(null)
const prizesData = ref({})

const router = useRouter()
const handleGoToDetailRedeem = (id) => router.push(`/prize/${id}`)

const handleRankClass = () => {
  const rank = props.keyBody
  if (rank === 'special_prize') {
    color.value = rainbow
    classType.value = 'specialPrize'
    return color.value
  } else if (rank === 'gold') {
    color.value = gold
    classType.value = '1stClass'
    return color.value
  } else if (rank === 'silver') {
    color.value = silver
    classType.value = '2ndClass'
    return color.value
  } else if (rank === 'bronze') {
    color.value = bronze
    classType.value = '3rdClass'
    return color.value
  } else if (rank === 'iron') {
    color.value = iron
    classType.value = '4thClass'
    return color.value
  }
}

const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toISOString().split('T')[0];
};

const handleTotalData = () => {
  totalGift.value = t('canBeReplaced', { limit: props.totalData })
}

handleRankClass()
handleTotalData();


</script>