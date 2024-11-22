<template>
  <ImageTextCard
    :on-click="() => handleGoToDetailHistory()"
    :image-card="characterImage"
    :has-rounded="true"
    :is-fetching="isFetching"
  >
    <template v-slot:text v-if="!isFetching">
      <div class="flex gap-1 flex-col">
        <p class="text-exd-gold text-exd-1624 font-bold">
          {{ data.amount }}<span class="text-exd-1224">pt</span>
        </p>
        <p class="text-exd-gray-scorpion font-medium text-exd-1014">
          {{ data.created_at }}
        </p>
        <p class="text-exd-gray-scorpion font-semibold text-exd-1218">
          {{ data.location }}
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
    default: () => {},
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
const handleGoToDetailHistory = () => router.push(`/history/${props.data.id}`)
</script>
