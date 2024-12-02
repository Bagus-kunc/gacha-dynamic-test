<template>
  <HeaderBar hasBack withLogo />
  <div class="flex flex-col mt-20 grow">
    <p
      class="text-exd-red-coral text-exd-1724 text-center font-extrabold max-w-[356px] mx-auto p-4 my-4"
    >
      {{ $t('pleaseShowThisScreen') }}
    </p>
    <div
      class="bg-exd-banana grow flex flex-col py-8 px-7 justify-between gap-5"
    >
      <div class="flex flex-col gap-5">
        <div class="w-full h-auto bg-white rounded-lg relative mx-auto">
          <Skeleton v-if="isFetching" class="!w-full !h-full" />

          <CharacterCard
            v-else
            :image="prizeDetailData.gift.image"
            variant="without-background"
          />
        </div>
        <div class="flex flex-col gap-4">
          <div class="inline-flex justify-between w-full gap-5">
            <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>
            <p v-else class="font-bold text-exd-1424 text-exd-gray-scorpion">
              {{ prizeDetailData.gift.name }}
            </p>

            <Skeleton
              v-if="isFetching"
              class="!h-3 !rounded-full !bg-exd-orange-700"
              width="2rem"
            ></Skeleton>
            <p
              v-else
              class="font-bold text-exd-1824.52 text-white p-1 flex items-center justify-center rounded-full right-0 top-5 bg-no-repeat bg-cover bg-center w-12 h-12"
              :style="colorBg ? { backgroundImage: `url(${colorBg})` } : {}"
            >
              {{ prizeTypeText }}
            </p>
          </div>

          <Skeleton v-if="isFetching" class="!w-full !h-full" />


          <HeadingSection
          v-else
            :is-fetching="isFetching"
            :title="$t('conditionsOfUse')"
            :body="prizeDetailData.gift.term_of_use"
          />
        </div>
      </div>

      <SlideUnlock
        ref="vueslideunlock"
        :auto-width="true"
        :circle="true"
        :width="400"
        :height="56"
        :text="$t('swipe')"
        :success-text="$t('claimed')"
        name="slideunlock"
        @completed="handleSwipe()"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="isRedeemDialogVisible"
    modal
    class="!bg-white !w-exd-300 h-exd-200 !max-w-sm border border-exd-gray-44 rounded-xl"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleClose"
      />
      <div
        class="w-full h-full flex flex-col justify-end items-center gap-4 p-5"
      >
        <div class="w-full flex flex-col justify-center items-center gap-8">
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ redeemMessage }}
          </p>

          <SolidButton
            :on-click="() => handleDialog"
            :has-loading="isLoading"
            label="GO!"
          />
        </div>
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="insufficientDialogVisible"
    modal
    class="!bg-white !w-exd-300 h-exd-200 !max-w-sm border border-exd-gray-44 rounded-xl"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleClose"
      />
      <div
        class="w-full h-full flex flex-col justify-center items-center gap-4 p-5"
      >
        <div class="w-full flex flex-col justify-center items-center gap-8">
          <img :src="warning" alt="warning" width="40" height="40" preload />
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import warning from '~/assets/images/warning.svg'
import close from '~/assets/images/close.svg'
import rainbow from '~/assets/images/rainbow-circle.png'
import gold from '~/assets/images/gold-circle.png'
import silver from '~/assets/images/silver-circle.png'
import brown from '~/assets/images/brown-circle.png'
import bronze from '~/assets/images/bronze-circle.png'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const isFetching = ref(true)
const route = useRoute()
const router = useRouter()

const isClicked = ref(false)
const isRedeemDialogVisible = ref(false)
const insufficientDialogVisible = ref(false)
const errorMessage = ref(null)
const redeemMessage = ref('')
const isLoading = ref(false)
const disableSwipe = ref(false)
const vueslideunlock = ref(null)
const prizeTypeText = ref(null)
const colorBg = ref('')

const fetchRedeem = async () => {
  try {
    errorMessage.value = null
    disableSwipe.value = true
    const { message, status } = await useFetchApi('POST', 'prizes/redeem-point', {
      params: {
        user_point_id: id,
      },
    })

    // Periksa apakah response memiliki properti _data
    if (status) {
      // Ekstrak pesan dari _data
      redeemMessage.value = message
      isRedeemDialogVisible.value = true
      setTimeout(() => {
        router.push('/claim/success') // Redirect ke halaman yang diinginkan
      }, 2000)
    } else {
      errorMessage.value = message
      insufficientDialogVisible.value = true
      vueslideunlock.value.reset()
    }

    // Tampilkan dialog dengan pesan
  } catch (error) {
    console.error(error)
    errorMessage.value = error._data.message
    insufficientDialogVisible.value = true
    vueslideunlock.value.reset()
  }
}

const handleSwipe = () => {
  isClicked.value = true
  if (isClicked.value) {
    fetchRedeem()
  }
}

const handleClose = () => {
  isRedeemDialogVisible.value = false
  insufficientDialogVisible.value = false
}

const prizeDetailData = ref({})
const id = route.params.id

const fetchingPrizeData = async () => {
  isFetching.value = true
  try {
    const { data } = await useFetchApi('GET', 'prize-by-poin/' + id)
    prizeDetailData.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const handleRankColor = () => {
  const rank = prizeDetailData.value.gift.type
  if (rank == 6) {
    colorBg.value = rainbow
    prizeTypeText.value = '特賞'
    return colorBg.value
  } else if (rank == 1) {
    colorBg.value = gold
    prizeTypeText.value = '1等'
    return colorBg.value
  } else if (rank == 2) {
    colorBg.value = silver
    prizeTypeText.value = '2等'
    return colorBg.value
  } else if (rank == 3) {
    colorBg.value = bronze
    prizeTypeText.value = '3等'
    return colorBg.value
  } else if (rank == 4) {
    colorBg.value = brown
    prizeTypeText.value = '4等'
    return colorBg.value
  }
}

onMounted(async () => {
  await fetchingPrizeData()
  handleRankColor();
})
</script>
