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
      <div class="w-full overflow-hidden">
        <Skeleton v-if="isFetching" class="!w-full !h-full"></Skeleton>
        <CharacterCard v-else :image="prizeDetailData.image" />
      </div>
      <div class="p-5 flex flex-col justify-between w-full">
        <div class="flex flex-col gap-4">
          <div class="relative inline-flex justify-between w-full gap-5">
            <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>
            <p v-else class="font-bold text-exd-1424 text-exd-gray-scorpion">
              {{ prizeDetailData.name }}
            </p>
            <Skeleton
              v-if="isFetching"
              class="!h-3 !rounded-full !bg-exd-orange-700"
              width="2rem"
            ></Skeleton>
            <p
              v-else
              class="font-bold text-exd-1824.52 text-exd-orange-700 right-0 top-5"
            >
              {{ prizeDetailData.point }}pt
            </p>
          </div>

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('howToGetPrizes')"
            :body="prizeDetailData.how_to_win"
          />

          <HeadingSection
            :is-fetching="isFetching"
            :title="$t('conditionsOfUse')"
            :body="prizeDetailData.terms_of_use"
          />

          <HeadingSection
            v-if="popupType != 'a' && popupType != 'b'"
            :is-fetching="isFetching"
            :title="$t('redemptionLocation')"
            :body="prizeDetailData.location_description"
          />

          <div 
          v-if="popupType != 'a' && popupType != 'b'"
          class="w-full mb-5">
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
                  class="text-exd-red-vermilion text-sm flex items-center cursor-pointer border-b border-b-exd-red-vermilion"
                  @click="openGoogleMaps"
                  >{{ $t('openGoogleMaps') }}
                  <img
                    src="~/assets/images/export-red.svg"
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
        class="w-full flex flex-col justify-center items-center gap-4 px-5 py-8 mt-2"
      >
        <p
          class="text-exd-gray-scorpion font-bold text-center text-exd-1424 small:w-[105%] w-[80%] max-w-w-[93%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('exchanged_message') }}
        </p>
        <div class="flex flex-col items-center w-full">
          <p
            class="text-exd-gray-scorpion font-bold text-center text-exd-1424 w-[70%]"
          >
            {{ $t('1026') }}
          </p>
          <div class="w-8/12 flex flex-col items-center">
            <p
              class="text-exd-blue-link text-center text-exd-1424 border-b border-b-exd-blue-link w-fit cursor-pointer"
              @click="openMapC"
            >
              {{ $t('shibafuHiroba') }}
              <img
                src="~/assets/images/export-blue.svg"
                alt="export"
                width="15"
                height="15"
                class="inline ml-1"
              />
            </p>
          </div>
        </div>
      </div>
      <SolidButton
        :label="$t('arrived')"
        :on-click="handleGoToClaim"
        has-bottom
      />
    </template>
  </Dialog>
</template>

<script setup>
import close from '~/assets/images/close.svg'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { store } from '~/stores/dashboard.js'

definePageMeta({
  middleware: 'auth',
  layout: 'with-bottom-bar',
})

const map = ref(null)
const route = useRoute()
const popupType = ref('')
const router = useRouter()
const id = route.params.id
const hasModal = ref(false)
const isFetching = ref(true)
const prizeDetailData = ref({})
const disableRedeem = ref(false)
const config = useRuntimeConfig()
const LOCALE = useCookie('LOCALE')
const handleToggleModal = () => (hasModal.value = !hasModal.value)
const handleGoToClaim = () => router.push(`/claim/${route.params.id}`)
const handleGoToRedeem = () => router.push(`/redeem/${route.params.id}`)

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
    if (data.lat !== null && data.long !== null) {
      initializeMap(data.lat, data.long)
    }
    popupType.value = data.type
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

onMounted(async () => {
  await loadGoogleMaps()
  fetchingPrizeData()
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
