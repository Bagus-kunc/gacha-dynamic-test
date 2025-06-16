<template>
  <div v-if="!isFetching" class="bg-white">
    <ImageTextCard
      :key="body.user_point_id"
      :history="true"
      :image-card="body.image"
      isDisabled
    >
      <template v-slot:text>
        <div
          class="inline-flex justify-between pr-4 text-exd-gray-scorpion w-100"
        >
          <div class="flex flex-col items-start justify-center gap-1">
            <img 
              v-if="body.rarity?.type === 'image'"
              :src="body.rarity?.image"
              alt="arrow"
              width="30"
              height="30"
              preload
              class=""
            />

            <i18n-t
              v-else-if="body.rarity?.type === 'color'"
              keypath="prize"
              tag="div"
              scope="global"
              class="font-bold text-exd-1013.62 text-white py-[2px] px-2 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: body.rarity.background_color, color: body.rarity.text_color }"
            >
              <template v-slot:rank>
                {{ body.rarity.text.toUpperCase() }}
              </template>
            </i18n-t>

            <p class="font-semibold md:text-[15px] sm:text-[14px] text-[13px]">
              {{ body.name }}
            </p>
            
          </div>
        </div>
      </template>
    </ImageTextCard>
  </div>
</template>

<script setup>
import { useRouter } from "nuxt/app"

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
</script>
