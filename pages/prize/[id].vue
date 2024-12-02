<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('listOfPrizesAndExchanges') }}
    </p>
  </HeaderBar>

  <div class="flex flex-col bg-center text-black mt-24 px-8">
    <div
      class="max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-hidden"
    >
      <div class="w-full overflow-hidden bg-[#E8FFF3]">
        <Skeleton v-if="isFetching" class="!w-full !h-full"></Skeleton>
        <CharacterCard
          v-else
          :image="prizeDetailData.gift.image"
          variant="without-background"
        />
      </div>
      <div class="p-5 flex flex-col justify-between w-full">
        <div class="flex flex-col gap-4">
          <div class="relative inline-flex justify-between w-full gap-5">
            <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>
            <p v-else class="font-bold text-exd-1424 text-exd-gray-scorpion">
              {{ prizeDetailData.gift.name }}
            </p>
            <Skeleton
              v-if="isFetching"
              class="!h-3 !rounded-full !bg-exd-orange-700"
              width="2rem"
            ></Skeleton>
            <div
              v-else
              class="items-center justify-center rounded-full bg-no-repeat bg-cover bg-center min-h-12 min-w-12"
              :style="colorBg ? { backgroundImage: `url(${colorBg})` } : {}"
            >
              <p class="font-bold text-exd-1416 text-white flex items-center justify-center min-h-12 min-w-12 right-0 top-5">{{ prizeTypeText }}</p>
            </div>
          </div>

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('howToGetPrizes')"
            :body="prizeDetailData.gift != null ? prizeDetailData.gift.how_to_win : null"
          />

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('conditionsOfUse')"
            :body="prizeDetailData.gift != null ? prizeDetailData.gift.terms_of_use : null"
          />

          <HeadingSection
            v-if="popupType != 'a' && popupType != 'b'"
            :is-fetching="isFetching"
            :title="$t('redemptionLocation')"
            :body="prizeDetailData.location != null ? prizeDetailData.location.description : null"
          />

          <div v-if="popupType != 'a' && popupType != 'b'" class="w-full mb-5">
            <Skeleton v-if="isFetching" class="!w-full !h-72" />
            <div
              v-show="!isFetching"
              id="parentMap"
              class="relative"
              style="width: 100%; height: 300px"
            >
              <div id="map" style="width: 100%; height: 100%" />
              <div class="absolute inset-0 z-10"></div>
              <div
                class="absolute bg-white inset-x-0 bottom-0 h-8 flex items-center z-20"
              >
                <span
                  class="text-exd-gray-scorpion text-sm flex items-center cursor-pointer border-b border-b-exd-gray-scorpion"
                  @click="openGoogleMaps"
                  >{{ $t('openGoogleMaps') }}
                  <img
                    src="~/assets/images/export.svg"
                    alt="export"
                    width="15"
                    height="15"
                    class="inline ml-1"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SolidButton
        :disabled="disableRedeem || isFetching"
        :label="disableRedeem ? $t('cannotBeExchanged') : $t('exchange')"
        :on-click="handleToggleModal"
        :variant="!disableRedeem ? 'red-coral' : 'disabled'"
        has-bottom
      />
    </div>
  </div>

  <Dialog
    v-if="popupType === 'a' || popupType === 'b'"
    v-model:visible="hasModal"
    modal
    class="!bg-white w-11/12 md:!w-5/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleToggleModal"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-1 px-5 py-8 my-2"
      >
        <p
          class="text-exd-gray-scorpion font-bold text-center text-exd-1424 small:w-[105%] w-[93%] max-w-w-[93%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('thePrizeWillBeAwarded') }}
        </p>
        <p class="text-exd-gray-scorpion text-center text-exd-1424">
          {{ $t('winnerWillBeNotifed') }}
        </p>
      </div>
      <div class="py-3">
        <SolidButton
          :label="$t('applyNow')"
          :on-click="handleGoToRedeem"
          variant="red-coral"
          has-bottom
        />
      </div>
    </template>
  </Dialog>

  <Dialog
    v-else
    v-model:visible="hasModal"
    modal
    class="!bg-white w-11/12 md:!w-5/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleToggleModal"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 px-5 py-8 my-2"
      >
        <p
          class="text-exd-gray-scorpion text-center text-[14px] small:w-[105%] w-[80%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
          v-html="formattedMessage"
        ></p>
      </div>
      <div class="mt-3 mb-7">
        <SolidButton
          :label="$t('arrived')"
          :on-click="handleGoToClaim"
          variant="red-coral"
          has-bottom
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import close from '~/assets/images/close.svg'
import { store } from '~/stores/dashboard.js'
import rainbow from '~/assets/images/rainbow-circle.png'
import gold from '~/assets/images/gold-circle.png'
import silver from '~/assets/images/silver-circle.png'
import brown from '~/assets/images/brown-circle.png'
import bronze from '~/assets/images/bronze-circle.png'

definePageMeta({
  middleware: 'auth',
  layout: 'with-bottom-bar',
})

const map = ref(null)
const route = useRoute()
const popupType = ref('c')
const router = useRouter()
const id = route.params.id
const hasModal = ref(false)
const isFetching = ref(true)
const prizeTypeText = ref(null)
const prizeDetailData = ref({})
const disableRedeem = ref(false)
const config = useRuntimeConfig()
const { t } = useI18n()
const LOCALE = useCookie('LOCALE')
const handleToggleModal = () => (hasModal.value = !hasModal.value)
const handleGoToClaim = () => router.push(`/claim/${route.params.id}`)
const handleGoToRedeem = () => router.push(`/redeem/${route.params.id}`)

const colorBg = ref('')

const imgTag =
  '<img src="/images/export.svg" alt="export" width="23" height="23" class="inline ml-1" />'

const formattedMessage = t('exchange_prize', { img: imgTag })

const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.GOOGLE_API}&libraries=places&language=${LOCALE.value}&region=ja`
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const fetchingPrizeData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'prize-by-poin/' + id)
    prizeDetailData.value = data
    checkPoint(data.point)
    if (data.lat !== null && data.long !== null) {
      initializeMap(data.location.lat, data.location.long)
    }
    // popupType.value = data.type
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const checkPoint = (point) => {
  try {
    const currentPoint = store.point
    if (currentPoint < point) {
      disableRedeem.value = true
    }
  } catch (error) {}
}

const openMapA = () => {
  const googleMapsUrl = `https://maps.app.goo.gl/YfqmSJ6Azkbethyf6`
  window.open(googleMapsUrl, '_blank')
}

const openMapB = () => {
  const googleMapsUrl = `https://maps.app.goo.gl/ZWaTkoyFa1orUyZC7`
  window.open(googleMapsUrl, '_blank')
}

const openMapC = () => {
  const googleMapsUrl = `https://maps.app.goo.gl/YFCpSQixPXDAw68v6?g_st=com.google.maps.preview.copy`
  window.open(googleMapsUrl, '_blank')
}

const initializeMap = async (lat, long) => {
  const mapOptions = {
    center: { lat: lat, lng: long },
    zoom: 17,
    disableDefaultUI: true, // Disables all default controls like zoom and map type
    draggable: false, // Disables dragging of the map
    scrollwheel: false, // Disables zooming with the mouse scroll
    disableDoubleClickZoom: true, // Disables zooming by double-clicking
    zoomControl: false, // Disables zoom control buttons
    mapTypeControl: false, // Disables map type control (e.g., satellite vs. roadmap)
    streetViewControl: false, // Disables street view control
    fullscreenControl: false, // Disables fullscreen control
  }
  const mapElement = document.getElementById('map')
  const map = new google.maps.Map(mapElement, mapOptions)

  new google.maps.Marker({
    position: { lat: lat, lng: long },
    map: map,
  })
}

const openGoogleMaps = () => {
  const lat = prizeDetailData.value.lat
  const long = prizeDetailData.value.long
  if (lat && long) {
    const googleMapsUrl = `https://www.google.jp/maps?q=${lat},${long}`
    window.open(googleMapsUrl, '_blank')
  }
}

const handleRankColor = () => {
  const rank = prizeDetailData.value.gift.type
  if (rank == 6) {
    colorBg.value = rainbow
    prizeTypeText.value = "特賞"
    return colorBg.value
  } else if (rank == 1) {
    colorBg.value = gold
    prizeTypeText.value = "1等"
    return colorBg.value
  } else if (rank == 2) {
    colorBg.value = silver
    prizeTypeText.value = "2等"
    return colorBg.value
  } else if (rank == 3) {
    colorBg.value = bronze
    prizeTypeText.value = "3等"
    return colorBg.value
  } else if (rank == 4) {
    colorBg.value = brown
    prizeTypeText.value = "4等"
    return colorBg.value
  }
}


onMounted(async () => {
  await loadGoogleMaps()
  await fetchingPrizeData()
  handleRankColor()
})

watch(LOCALE, async (val) => {
  const map = document.getElementById('map')

  if (map.parentNode) {
    map.parentNode.removeChild(map)
    const div = document.createElement('div')
    const parentMap = document.getElementById('parentMap')
    div.id = 'map'
    div.style = 'width: 100%; height: 100%'

    parentMap.appendChild(div)
  }

  delete window.google

  await loadGoogleMaps()
  let lat = prizeDetailData.value.lat
  let long = prizeDetailData.value.long

  if (lat != undefined && long != undefined) {
    initializeMap(lat, long)
  }
})
</script>

<style scoped></style>
