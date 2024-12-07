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
          <p
            v-else
            class="font-bold text-exd-1824.52 text-white p-1 min-h-10 min-w-12 h-10 w-12 flex items-center justify-center rounded-full pr-2 bg-no-repeat bg-contain bg-center"
            :style="rarityImg ? { backgroundImage: `url(${rarityImg})` } : {}"
          ></p>
        </div>
        <div v-if="isFetching" class="flex items-center gap-5 text-exd-1218">
          <Skeleton
            class="border-[1px] border-exd-blue-green text-exd-blue-green rounded-[5px] px-2"
          />
          <Skeleton class="text-exd-gray-scorpion bg-exd-gray-scorpion" />
        </div>
        <div v-else class="flex items-center gap-5 text-exd-1218">
          <p
            class="border-[1px] border-exd-blue-green text-exd-blue-green rounded-[5px] px-2"
          >
            カテゴリ
          </p>
          <p class="text-exd-gray-scorpion">
            {{ historyDetailData.character_category }}
          </p>
        </div>

        <Skeleton
          v-if="isFetching"
          class="!h-3 !bg-exd-gray-scorpion !rounded-full"
          width="5rem"
        />
        <p
          v-else
          class="font-medium text-exd-1218 text-exd-gray-scorpion text-word-wrap vhtml-desc"
          v-html="historyDetailData.character_description"
        />

        <div
          class="flex flex-col gap-2 py-4 text-exd-gray-scorpion text-exd-1218"
        >
          <div class="max-w-full">
            <p class="flex flex-row justify-between w-full">
              {{ star1Name }}<StarRating :value="star1" :show-value="false" />
            </p>
            <p class="flex flex-row justify-between w-full">
              {{ star2Name }}<StarRating :value="star2" :show-value="false" />
            </p>
            <p class="flex justify-between w-full">
              {{ star3Name }}
              <StarRating :value="star3" :show-value="false" />
            </p>
          </div>
        </div>

        <HeadingSection
          :is-fetching="isFetching"
          :title="
            historyDetailData.character != null
              ? historyDetailData.character.store_name
              : ''
          "
          :body="
            historyDetailData.character != null
              ? historyDetailData.character.store_description
              : ''
          "
        />

        <div
          v-if="socialMediaLinks.length"
          class="inline-flex md:gap-3 gap-[6px] w-full justify-center items-center mb-6 bg-exd-zinc-100 p-5 rounded-lg"
        >
          <img
            v-for="(link, index) in socialMediaLinks"
            :key="index"
            :src="link.src"
            :alt="link.alt"
            :aria-label="link.alt"
            class="md:size-7 size-7 cursor-pointer"
            @click="openLink(link.url)"
            preload
          />
        </div>

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
                class="text-exd-blue-green text-sm flex items-center cursor-pointer border-b border-b-exd-blue-green"
                @click="openGoogleMaps"
                >{{ $t('openGoogleMaps') }}
                <img
                  src="~/assets/images/export-blue-green.png"
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

      <div class="inline-flex gap-3 w-full justify-center items-center mb-6">
        <div class="speech-bubble text-[10pt]">
          {{ $t('share') }}
          <div class="triangle-border"></div>
          <div class="triangle-inner"></div>
        </div>
        <img
          :src="download"
          alt="download"
          class="size-5 cursor-pointer"
          @click="share('image')"
          preload
        />
        <img
          :src="line"
          alt="line"
          class="size-5 cursor-pointer"
          @click="share('line')"
          preload
        />
        <img
          :src="x"
          alt="x"
          class="size-5 cursor-pointer"
          @click="share('x')"
          preload
        />
        <img
          :src="facebook"
          alt="facebook"
          class="size-5 cursor-pointer"
          @click="share('facebook')"
          preload
        />
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
import instagram from '~/assets/images/instagram.png'
import tiktok from '~/assets/images/tiktok.png'
import { useRoute } from 'nuxt/app'
import web1 from '~/assets/icons/web1.png'
import web2 from '~/assets/icons/web2.png'
import web3 from '~/assets/icons/web3.png'

definePageMeta({
  layout: 'with-bottom-bar',
  middleware: 'auth',
})

const route = useRoute()
const config = useRuntimeConfig()
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
const star1Name = ref('')
const star2Name = ref('')
const star3Name = ref('')
const star1 = ref(0)
const star2 = ref(0)
const star3 = ref(0)
const colorBg = ref('')
const rarityImg = ref('')

const socialMediaLinks = ref([])

const openLink = (url) => {
  window.open(url, '_blank')
}

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

const calculateStar = (characterStar) => {
  const starMapping = {
    1: 0,
    2: 0.5,
    3: 1,
    4: 1.5,
    5: 2,
    6: 2.5,
    7: 3,
    8: 3.5,
    9: 4,
    10: 4.5,
    11: 5,
  }

  return starMapping[characterStar] ?? 0
}

const fetchingHistoryData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'history/' + id)
    historyDetailData.value = data

    star1.value = calculateStar(data.character_star1)
    star2.value = calculateStar(data.character_star2)
    star3.value = calculateStar(data.character_star3)

    star1Name.value = data.character_star_name1
    star2Name.value = data.character_star_name2
    star3Name.value = data.character_star_name3

    socialMediaLinks.value = [
      { url: data.character.web1_link, src: web1, alt: 'Web 1' },
      { url: data.character.web2_link, src: web2, alt: 'Web 2' },
      { url: data.character.web3_link, src: web3, alt: 'Web 3' },
      { url: data.character.line_link, src: line, alt: 'Line' },
      { url: data.character.x_link, src: x, alt: 'X (Twitter)' },
      { url: data.character.fb_link, src: facebook, alt: 'Facebook' },
      { url: data.character.ig_link, src: instagram, alt: 'Instagram' },
      { url: data.character.tt_link, src: tiktok, alt: 'TikTok' },
    ].filter((link) => link.url)

    // Memuat peta jika ada koordinat
    if (data.lat && data.long) {
      initializeMap(data.lat, data.long)
    }

    handleRarity(data.character_rarity)
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

const handleRarity = (rarityChar) => {
  const rarity = rarityChar
  if (rarity === '1') {
    rarityImg.value = '/images/r-bg.png'
  } else if (rarity === '2') {
    rarityImg.value = '/images/sr-bg.png'
  } else if (rarity === '3') {
    rarityImg.value = '/images/ssr-bg.png'
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

.speech-bubble {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #555555;
  border-radius: 6px;
  padding: 2px 10px;
  display: inline-block;
  color: #000;
  max-width: 300px;
}

.triangle-border {
  position: absolute;
  top: 50%;
  right: -9px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 9px;
  border-color: transparent transparent transparent #606060;
  transform: translateY(-50%);
}

.triangle-inner {
  position: absolute;
  top: 50%;
  right: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 14px;
  border-color: transparent transparent transparent white;
  transform: translateY(-50%);
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
