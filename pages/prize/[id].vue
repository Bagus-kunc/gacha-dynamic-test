<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('listOfPrizesAndApplication') }}
    </p>
  </HeaderBar>

  <div class="flex flex-col px-8 mt-32 text-black bg-center">
    <div
      class="flex flex-col max-w-sm gap-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow"
    >
      <div class="w-full overflow-hidden bg-[#FFF6E8]">
        <Skeleton v-if="isFetching" class="!w-full !h-full"></Skeleton>
        <CharacterCard
          v-else
          :image="prizeDetailData.image"
          variant="without-background"
        />
      </div>
      <div class="flex flex-col justify-between w-full p-5">
        <div class="flex flex-col gap-4">
          <div class="relative inline-flex items-center justify-between w-full gap-5">
            <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>
            <p
              v-else
              class="font-bold text-exd-1424 max-w-[220px] line-clamp-2 text-exd-gray-scorpion"
            >
              {{ prizeDetailData.name }}
            </p>
            <Skeleton
              v-if="isFetching"
              class="!h-3 !rounded-full !bg-exd-orange-700"
              width="2rem"
            ></Skeleton>
            <img 
              v-else-if="prizeDetailData.rarity?.type === 'image'"
              :src="prizeDetailData.rarity?.image"
              alt="arrow"
              width="50"
              height="50"
              preload
              class=""
            />
            <i18n-t
              v-else-if="prizeDetailData.rarity?.type === 'color'"
              keypath="prize"
              tag="div"
              scope="global"
              class="font-bold text-exd-1824.52 text-white p-1 flex items-center justify-center rounded-full right-0 top-5 min-w-12 min-h-12"
              :style="{ backgroundColor: prizeDetailData.rarity.background_color, color: prizeDetailData.rarity.text_color }"
            >
              <template v-slot:rank>
                {{ prizeDetailData.rarity.text.toUpperCase() }}
              </template>
            </i18n-t>
          </div>

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('howToGetPrizes')"
            :body="prizeDetailData != null ? prizeDetailData?.how_to_win : ''"
          />

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('conditionsOfUse')"
            :body="prizeDetailData != null ? prizeDetailData?.terms_of_use : ''"
          />
        </div>
      </div>
      <SolidButton
        :label="disableRedeem ? $t('cannotBeExchanged') : $t('exchange')"
        :disabled="disableRedeem || isFetching"
        :on-click="handleToggleModal"
        :variant="`red-coral`"
        has-bottom
      />
    </div>
  </div>

  <Dialog
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
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleToggleModal"
      />
      <div
        class="flex flex-col items-center justify-center w-full gap-1 px-5 py-8 my-2"
      >
        <p
          class="text-exd-gray-scorpion font-bold text-center text-exd-1424 small:w-[105%] w-[93%] max-w-w-[93%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('thePrizeWillBeAwarded') }}
        </p>
        <p class="text-center text-exd-gray-scorpion text-exd-1424">
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

</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import close from '~/assets/images/close.svg'
import { store } from '~/stores/dashboard.js'

definePageMeta({
  middleware: 'auth',
  layout: 'with-bottom-bar',
})

const map = ref(null)
const route = useRoute()
const popupType = ref('a')
const router = useRouter()
const id = route.params.id
const hasModal = ref(false)
const isFetching = ref(false)
const prizeTypeText = ref(null)
const prizeDetailData = ref({})
const disableRedeem = ref(false)
const config = useRuntimeConfig()
const { t } = useI18n()
const LOCALE = useCookie('LOCALE')
const handleGoToClaim = () => router.push(`/claim/${route.params.id}`)
const handleToggleModal = () => {
  if (disableRedeem.value) return
  hasModal.value = !hasModal.value
}
const handleGoToRedeem = () =>
  router.push(`/redeem/${route.params.id}`)

const colorBg = ref('')

const imgTag =
  '<img src="/images/export.svg" alt="export" width="23" height="23" class="inline ml-1" />'

const formattedMessage = t('exchange_prize', {
  img: imgTag,
  link1: 'https://maps.app.goo.gl/JBjhtuEiDRWySEjKA',
  link2: 'https://maps.app.goo.gl/hSwAQSMUTHNW8qbW7',
})

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
    const { data } = await useFetchApi('GET', 'prizes/' + id)
    prizeDetailData.value = data
    checkPoint(data.point)
    // if (data.lat !== null && data.long !== null) {
    //   initializeMap(data.location.lat, data.location.long)
    // }
    popupType.value = data.type
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const checkType = (type) => {
  if (type === 1) {
    disableRedeem.value = false
  } else {
    disableRedeem.value = true
  }
}

const checkPoint = (point) => {

  try {
    const currentPoint = parseInt(store.point)
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

onMounted(async () => {
  await loadGoogleMaps()
  await fetchingPrizeData()
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
