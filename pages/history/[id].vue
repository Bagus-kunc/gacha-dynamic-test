<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('collection') }}
    </p>
  </HeaderBar>
  <div class="flex flex-col bg-center text-black mt-24 px-8 gap-3">
    <div class="max-w-sm bg-white rounded-lg shadow">
      <div class="w-full overflow-hidden rounded-t-lg">
        <Skeleton v-if="isFetching" class="!w-full !h-full"></Skeleton>
        <CharacterCard
          v-else
          :image="
            historyDetailData.character_image != null
              ? historyDetailData.character_image
              : duck
          "
        />
      </div>
      <div class="p-5 flex flex-col gap-2">
        <div class="inline-flex justify-between w-full gap-5">
          <Skeleton
            v-if="isFetching"
            class="!h-3 !bg-exd-gray-scorpion !rounded-full"
            width="15rem"
          />
          <p
            v-else
            class="font-bold text-exd-1424 text-exd-gray-scorpion w-full"
          >
            {{ historyDetailData.character_name }}
          </p>
          <Skeleton
            v-if="isFetching"
            class="!h-3 !bg-exd-gold !rounded-full"
            width="2rem "
          />
          <p v-else class="font-bold text-exd-1824.52 text-exd-gold pr-2">
            {{ historyDetailData.point_amount }}pt
          </p>
        </div>
        <Skeleton
          v-if="isFetching"
          class="!h-3 !bg-exd-gray-scorpion !rounded-full"
          width="5rem"
        />
        <p
          v-else
          class="font-medium text-exd-1218 text-exd-gray-scorpion mb-4 text-word-wrap vhtml-desc"
          v-html="historyDetailData.character_description"
        />
        <div class="inline-flex gap-3 w-full justify-center my-2">
          <img
            :src="download"
            alt="download"
            class="size-8 cursor-pointer"
            @click="share('image')"
            preload
          />
          <img
            :src="line"
            alt="line"
            class="size-8 cursor-pointer"
            @click="share('line')"
            preload
          />
          <img
            :src="x"
            alt="x"
            class="size-8 cursor-pointer"
            @click="share('x')"
            preload
          />
          <img
            :src="facebook"
            alt="facebook"
            class="size-8 cursor-pointer"
            @click="share('facebook')"
            preload
          />
        </div>

        <HeadingSection
          :is-fetching="isFetching"
          :title="historyDetailData.location_name"
          :body="historyDetailData.location_description"
        />

        <div class="w-full">
          <Skeleton v-if="isFetching" class="!w-full !h-72" />
          <div
            class="relative"
            v-show="!isFetching"
            id="parentMap"
            style="width: 100%; height: 300px"
          >
            <div id="map" tabindex="-1" style="width: 100%; height: 100%" />
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
  </div>

  <transition name="slide-right">
    <div
      v-if="showSuccessPopup"
      class="popup-success bg-exd-dark-grey flex items-center gap-2"
    >
      <div
        class="w-7 h-7 bg-exd-green rounded-full flex items-center justify-center text-exd-1320"
      >
        <img :src="check" alt="success" class="w-6 h-6" />
      </div>
      {{ $t('downloadImage') }}
    </div>
  </transition>
</template>

<script setup>
import duck from '~/assets/images/duck.svg'
import download from '~/assets/images/download.svg'
import facebook from '~/assets/images/facebook.svg'
import check from '~/assets/images/check.svg'
import line from '~/assets/images/line.svg'
import x from '~/assets/images/x.svg'
import { useRoute } from 'nuxt/app'

definePageMeta({
  layout: 'with-bottom-bar',
  middleware: 'auth',
})

const config = useRuntimeConfig()
const route = useRoute()
const id = route.params.id
const title = config.public.META_TITLE
const description = config.public.META_DESCRIPTION
const image = config.public.META_IMAGE
const url = config.public.META_URL
const quote = config.public.META_QUOTE
const historyDetailData = ref({})
const props = defineProps(['id'])
const isFetching = ref(true)
const LOCALE = useCookie('LOCALE')

const showSuccessPopup = ref(false)

const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const existingScript = document.getElementById('google-maps')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.GOOGLE_API}&libraries=places&language=${LOCALE.value}&region=ja`
    script.async = true
    script.id = 'google-maps'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const fetchingHistoryData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'history/' + id)
    historyDetailData.value = data
    let lat = historyDetailData.value.lat
    let long = historyDetailData.value.long

    if (lat != undefined && long != undefined) {
      initializeMap(lat, long)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
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
    fullscreenControl: false, // Disables fullscreen control,
  }

  const mapElement = document.getElementById('map')
  const map = new google.maps.Map(mapElement, mapOptions)

  new google.maps.Marker({
    position: { lat: lat, lng: long },
    map: map,
  })
}

const updateMetaHead = () => {
  useHead({
    meta: [
      { name: 'description', content: description },
      // Facebook
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      { name: 'og:url', content: url },
      { name: 'og:type', content: 'Website' },

      // twitter
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },

      // // LINE
      { name: 'line:title', content: title },
      { name: 'line:description', content: description },
      { name: 'line:image', content: image },
      { name: 'line:card', content: 'summary_large_image' },
    ],
  })
}

const share = (type) => {
  switch (type) {
    case 'image':
      downloadImage()

      break
    case 'facebook':
      shareToFacebook()
      break
    case 'x':
      shareToX()
      break
    case 'line':
      shareToLine()
      break

    default:
      break
  }
}

const generateUrlToShare = () => {
  let objectToShare = {
    url: url,
    quote: quote,
  }

  try {
    objectToShare.url =
      url +
      '/share/' +
      historyDetailData.value.character_id +
      '/' +
      historyDetailData.value.location_id
    objectToShare.quote =
      quote +
      '/share/' +
      historyDetailData.value.character_id +
      '/' +
      historyDetailData.value.location_id
  } catch (error) {
    console.log(error)
  }

  return objectToShare
}

const shareToFacebook = () => {
  let objectToShare = generateUrlToShare()
  try {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        objectToShare.url
      )}`
    )
  } catch (error) {
    console.log(error)
  }
}

const shareToX = () => {
  let objectToShare = generateUrlToShare()

  try {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        objectToShare.quote
      )}`
    )
  } catch (error) {
    console.log(error)
  }
}

const shareToLine = () => {
  let objectToShare = generateUrlToShare()
  try {
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(objectToShare.quote)}`
    )
  } catch (error) {
    console.log(error)
  }
}

const openGoogleMaps = () => {
  const lat = historyDetailData.value.lat
  const long = historyDetailData.value.long
  if (lat && long) {
    const googleMapsUrl = `https://www.google.jp/maps?q=${lat},${long}`
    window.open(googleMapsUrl, '_blank')
  }
}

const downloadImage = async () => {
  try {
    const fileName = historyDetailData.value.character_name + '.png'
    const blob = await useFetchApi('GET', '/history/image/' + id)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    showSuccessPopup.value = true

    setTimeout(() => {
      showSuccessPopup.value = false
    }, 2000)
  } catch (error) {
    console.error('Error downloading the image:', error)
  }
}

onBeforeMount(async () => {
  await loadGoogleMaps()
  fetchingHistoryData()
  updateMetaHead()
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
  let lat = historyDetailData.value.lat
  let long = historyDetailData.value.long

  if (lat != undefined && long != undefined) {
    initializeMap(lat, long)
  }
})
</script>

<style scoped>
.popup-success {
  position: absolute;
  top: 15px;
  right: 10px;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slide-in 0.5s forwards, slide-out 0.5s 1.5s forwards;
  z-index: 1000;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
