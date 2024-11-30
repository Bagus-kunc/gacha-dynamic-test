<template>
  <div
    class="flex justify-between bg-center w-full p-2 bg-no-repeat bg-cover"
    :class="[]"
    :style="color ? { backgroundImage: `url(${color})` } : {}"
  >
    <template v-if="!isFetching">
      <p class="text-white font-bold text-exd-1824">
        <!-- {{ keyBody }}-->
        1<span class="text-exd-1424">等</span>
      </p>

      <p
        v-if="currentPoint >= keyBody"
        class="text-white font-medium text-exd-1224"
        v-html="limit"
      ></p>
    </template>
    <template v-else>
      <Skeleton width="10rem" class="bg-white"></Skeleton>
      <Skeleton width="5rem" class="bg-white"></Skeleton>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import rainbow from '~/assets/images/rainbow.png'
import gold from '~/assets/images/gold.png'
import silver from '~/assets/images/silver.png'
import brown from '~/assets/images/brown.png'
import bronze from '~/assets/images/bronze.png'

const { t } = useI18n()

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

const redeemLimit = 3

const limit = t('canBeReplaced', { limit: redeemLimit })

const handleRankColor = () => {
  const rank = props.rankColor
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

handleRankColor()
</script>
