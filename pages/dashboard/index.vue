<template>
  <HeaderBar>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('myPage') }}
    </p>
  </HeaderBar>
  <div class="flex flex-col px-12 bg-center">
    <div class="flex flex-col mt-[35%] items-center">
      <div class="flex flex-col mt-[5%] items-center">
        <p class="font-bold text-white text-exd-1530">
          {{ $t('currentPoints') }}
        </p>
        <p class="relative font-bold text-white text-exd-56112 -top-9">
          {{ store.point }}<span class="ml-1 text-exd-1530">pt</span>
        </p>
      </div>
    </div>

    <div
      class="relative inline-flex flex-col items-center justify-center gap-4 mt-10 -top-12"
    >
      <div
        class="flex flex-col items-center justify-center w-full p-6 bg-white cursor-pointer rounded-xl h-exd-130"
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
        <p class="font-bold text-center text-exd-gray-scorpion text-exd-1424">
          {{ $t('collection') }}
        </p>
      </div>
    </div>
    <div class="relative w-full -top-12">
      <div
        class="inline-flex items-center justify-between w-full px-5 mt-5 bg-white border-b-2 cursor-pointer h-exd-50 rounded-tl-xl rounded-tr-xl border-b-exd-light-grey"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="profile"
      >
        <p class="font-bold text-exd-gray-scorpion grow text-exd-1424">
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
        class="inline-flex items-center justify-between w-full px-5 bg-white border-b-2 h-exd-50 border-b-exd-light-grey"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToHelp()"
      >
        <p
          class="inline-flex items-center gap-1 font-bold cursor-pointer text-exd-gray-scorpion grow text-exd-1424"
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
        class="inline-flex items-center justify-between w-full px-5 bg-white border-b-2 cursor-pointer h-exd-50 border-b-exd-light-grey"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="handleGoToDigitalMap()"
      >
        <p
          class="inline-flex items-center gap-1 font-bold text-exd-gray-scorpion grow text-exd-1424"
        >
          {{ $t('toHoriShoten') }}
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
        class="inline-flex items-center justify-between w-full px-5 bg-white cursor-pointer h-exd-50 rounded-bl-xl rounded-br-xl"
        style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        @click="logout"
      >
        <p
          class="inline-flex items-center gap-1 font-bold text-exd-gray-scorpion grow text-exd-1424"
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

    <div
      class="relative inline-flex flex-col items-center justify-between mx-auto md:w-[352px] w-[280px] mt-7 -top-12"
    >
      <!-- <p
        class="inline-flex items-center justify-center font-bold text-white underline grow text-exd-1424"
      >
        {{ $t('addToHomeScreen') }}
      </p> -->
      <NuxtLink to="https://www.horishoten.co.jp/" target="_blank">
        <img :src="banner" width="352" height="180" preload class="w-full" />
      </NuxtLink>
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
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleClose"
      />
      <div
        class="flex flex-col items-center justify-center w-full gap-4 px-6 py-6"
      >
        <img :src="warning" alt="warning" width="40" height="40" preload />
        <div class="w-10/12 text-center">
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
import banner from '~/assets/images/banner.png'

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
  window.open('https://www.horishoten.co.jp/', '_blank')
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
    (spinType === '4' || spinType === '5') &&
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

const bannerList = ref([
  { image: '/images/banner_01.jpg', link: 'https://www.yabaton.com/' },
  { image: '/images/banner_02.jpg', link: 'https://www.koushoji.or.jp/' },
  { image: '/images/banner_03.jpg', link: 'https://www.maruya-honten.com/' },
  {
    image: '/images/banner_04.jpg',
    link: 'https://www.nagoya-tv-tower.co.jp/',
  },
  {
    image: '/images/banner_05.jpg',
    link: 'https://www.tokyuhotels.co.jp/nagoya-h/index.html',
  },
  { image: '/images/banner_06.jpg', link: 'https://www.kani-honke.co.jp/' },
  { image: '/images/banner_07.jpg', link: 'https://nagoya.nikkostyle.jp/' },
  {
    image: '/images/banner_08.jpg',
    link: 'https://www.nagoya-info.jp/accommodation/detail/115/',
  },
])

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
