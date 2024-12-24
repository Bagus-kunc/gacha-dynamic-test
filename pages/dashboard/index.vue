<template>
  <HeaderBar>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('myPage') }}
    </p>
  </HeaderBar>
  <div class="flex flex-col bg-center px-12">
    <div class="flex flex-col mt-[35%] items-center"></div>

    <div
      class="inline-flex flex-col gap-4 items-center justify-center relative -top-12 mt-16"
    >
      <div
        class="bg-white rounded-xl p-6 w-full h-exd-130 flex justify-center items-center cursor-pointer"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToPrize"
      >
        <img
          :src="iconStar"
          alt="icon-star"
          width="60"
          height="60"
          preload
          class="text-center cursor-pointer"
        />
        <p class="text-exd-gray-scorpion text-exd-1424 font-bold text-center">
          {{ $t('listOfPrizesAndExchanges') }}
        </p>
      </div>
      <div
        class="bg-white rounded-xl p-6 w-full h-exd-130 flex justify-center items-center cursor-pointer"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToHistory"
      >
        <img
          :src="iconGift"
          alt="icon-gift"
          width="60"
          height="60"
          preload
          class="text-center cursor-pointer"
        />
        <p class="text-exd-gray-scorpion text-exd-1424 font-bold text-center">
          {{ $t('collection') }}
        </p>
      </div>
    </div>
    <div class="w-full relative -top-12">
      <div
        class="mt-5 bg-white h-exd-50 w-full rounded-tl-xl rounded-tr-xl px-5 inline-flex justify-between items-center cursor-pointer border-b-2 border-b-exd-light-grey"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="profile"
      >
        <p class="text-exd-gray-scorpion grow text-exd-1424 font-bold">
          {{ $t('membershipInformation') }}
        </p>
        <img
          :src="arrow"
          alt="arrow"
          width="12"
          height="12"
          preload
          class="invert"
        />
      </div>
      <div
        class="bg-white w-full h-exd-50 px-5 inline-flex justify-between items-center border-b-2 border-b-exd-light-grey cursor-pointer"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToDigitalMap()"
      >
        <p
          class="text-exd-gray-scorpion grow inline-flex items-center gap-1 text-exd-1424 font-bold"
        >
          {{ $t('shoppingStreet') }}
          <span>
            <img :src="exportIcon" alt="export" width="20" height="20" preload
          /></span>
        </p>
        <img
          :src="arrow"
          alt="arrow"
          width="12"
          height="12"
          preload
          class="invert"
        />
      </div>

      <div
        class="bg-white w-full h-exd-50 px-5 inline-flex justify-between items-center border-b-2 border-b-exd-light-grey"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToHelp()"
      >
        <p
          class="text-exd-gray-scorpion grow inline-flex items-center gap-1 cursor-pointer text-exd-1424 font-bold"
        >
          {{ $t('helpAndInquiries') }}
          <span>
            <img :src="exportIcon" alt="export" width="20" height="20" preload
          /></span>
        </p>
        <img
          :src="arrow"
          alt="arrow"
          width="12"
          height="12"
          preload
          class="invert"
        />
      </div>
      <div
        class="bg-white w-full h-exd-50 rounded-bl-xl rounded-br-xl px-5 inline-flex justify-between items-center cursor-pointer"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="logout"
      >
        <p
          class="text-exd-gray-scorpion grow inline-flex items-center gap-1 text-exd-1424 font-bold"
        >
          {{ $t('logout') }}
        </p>
        <img
          :src="arrow"
          alt="arrow"
          width="12"
          height="12"
          preload
          class="invert"
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isNotAllowed"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
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
        class="w-full flex flex-col justify-center items-center gap-4 py-6 px-6"
      >
        <img :src="warning" alt="warning" width="40" height="40" preload />
        <div class="text-center w-10/12">
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ errorMessages }}
          </p>
        </div>
        <SolidButton
          v-if="redirectLink"
          :label="$t('gacha')"
          variant="red-coral"
          :on-click="() => goToSpin(redirectLink)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import iconStar from '~/assets/images/icon-star.svg'
import iconGift from '~/assets/images/icon-gift.svg'
import arrow from '~/assets/images/arrow.svg'
import exportIcon from '~/assets/images/export.svg'
import { useRouter } from 'vue-router'
import { store } from '~/stores/dashboard.js'
import close from '~/assets/images/close.svg'
import warning from '~/assets/images/warning.svg'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useI18n } from 'vue-i18n'

const router = useRouter()

const config = useRuntimeConfig()

definePageMeta({
  middleware: 'auth',
  layout: 'with-bottom-bar',
})

const handleGoToHistory = () => router.push('/history')
const handleGoToPrize = () => router.push('/prize')
const profile = () => router.push('/profile')
const handleGoToHelp = () => {
  window.open('https://endo-ji-shotengai.dela-kuji.jp/manual', '_blank')
}
const handleGoToDigitalMap = () => {
  window.open('https://endojishotengai.com/', '_blank')
}

const TOKEN = useCookie('TOKEN')
const USER = useCookie('USER')
const VALID_PASSWORD = useCookie('VALID_PASSWORD')

const isNotAllowed = ref(false)
const errorMessages = ref('')
const redirectLink = ref('')
const { t } = useI18n()

const handleClose = () => {
  isNotAllowed.value = false
  sessionStorage.removeItem('IS_ALREADY_SPIN')
  sessionStorage.removeItem('SPIN_TYPE')
  sessionStorage.removeItem('READY_SPIN_AFTER_DATE')
  sessionStorage.removeItem('IS_QUOTA_AVAILABLE')
  sessionStorage.removeItem('LOCATION_SLUG')
}

const logout = async () => {
  try {
    const { data, status } = await useFetchApi('POST', 'logout')

    localStorage.clear()
    sessionStorage.clear()
    TOKEN.value = null
    USER.value = null
    VALID_PASSWORD.value = null
    await navigateTo('/')
  } catch (error) {
    localStorage.clear()
    sessionStorage.clear()
    TOKEN.value = null
    USER.value = null
    VALID_PASSWORD.value = null
    await navigateTo('/')
    console.log(error)
  }
}

const getLocalStorageItem = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error accessing localStorage for key "${key}":`, error)
    return null
  }
}

const checkSpinEligibility = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))

  const isAlreadySpin = sessionStorage.getItem('IS_ALREADY_SPIN')
  const spinType = sessionStorage.getItem('SPIN_TYPE')
  const readySpinAfterDate = sessionStorage.getItem('READY_SPIN_AFTER_DATE')
  const now = formatDate(new Date())
  const isQuotaAvailable = sessionStorage.getItem('IS_QUOTA_AVAILABLE')
  const locationSlug = sessionStorage.getItem('LOCATION_SLUG')

  if (isAlreadySpin == 'true' && spinType === '1') {
    errorMessages.value = t('eligibilityMessageType1')
    isNotAllowed.value = true
  }

  if (isAlreadySpin == 'true' && spinType === '3') {
    errorMessages.value = t('eligibilityMessageType3')
    isNotAllowed.value = true
  }

  if (
    isAlreadySpin == 'true' &&
    spinType === '4' &&
    readySpinAfterDate &&
    new Date(readySpinAfterDate).getTime() > new Date(now).getTime()
  ) {
    await countdown(readySpinAfterDate)
  }

  if (isQuotaAvailable === 'false' && locationSlug) {
    errorMessages.value = t('eligibilityMessageMaxQuota')
    isNotAllowed.value = true
    redirectLink.value = `/scan/${locationSlug}`
  }
}

function countdown(targetDate) {
  const remainingTime = () => {
    const now = formatDate(new Date())
    const difference = new Date(targetDate).getTime() - new Date(now).getTime()

    if (difference <= 0) {
      clearInterval(intervals)
      handleClose()
      return
    }

    const minutes = Math.floor(difference / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    errorMessages.value = t('eligibilityMessageType4', {
      minutes,
      seconds,
    })
  }

  remainingTime()
  isNotAllowed.value = true

  let intervals = setInterval(() => remainingTime(), 1000)
}

const formatDate = (date) => {
  return new Date(date)
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: config.public.TIME_ZONE,
    })
    .replace(',', '')
}

const goToSpin = async (url) => {
  handleClose()
  return await navigateTo(url)
}

onMounted(() => {
  checkSpinEligibility()
})
</script>

<style>
.swiper {
  width: 100%;
  height: 100px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: white;
}

.swiper-pagination {
  top: 78px !important;
}
</style>
