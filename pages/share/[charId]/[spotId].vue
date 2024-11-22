<template>
  <Head>
    <Title> {{ shareDetailData?.character_name }}</Title>
    <Meta
      name="description"
      :content="shareDetailData?.character_description"
    />

    <Meta name="og:url" :content="`${url}/${charId}/${spotId}`" />
    <Meta name="og:type" content="website" />
    <Meta name="og:title" :content="shareDetailData?.character_name" />
    <Meta
      name="og:description"
      :content="shareDetailData?.character_description"
    />
    <Meta name="og:image" :content="shareDetailData?.character_image" />
    <Meta
      name="og:image:secure_url"
      :content="shareDetailData?.character_image"
    />
    <Meta name="og:image:width" :content="200" />
    <Meta name="og:image:height" :content="200" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" :content="shareDetailData?.character_name" />
    <Meta
      name="twitter:description"
      :content="shareDetailData?.character_description"
    />
    <Meta name="twitter:image" :content="shareDetailData?.character_image" />
    <Meta
      name="twitter:image:secure_url"
      :content="shareDetailData?.character_image"
    />
    <Meta name="twitter:image:width" :content="900" />
    <Meta name="twitter:image:height" :content="900" />
  </Head>

  <div
    v-if="isValidPath"
    class="w-full max-w-md mx-auto min-h-dvh max-h-full overflow-hidden bg-white flex flex-col relative bg-[url('/images/bg-red2.webp')] bg-cover bg-center"
  >
    <HeaderBar>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion font-bold text-exd-1824.52"
      >
        {{ shareDetailData?.character_name }}
      </p>
    </HeaderBar>

    <section
      class="min-h-dvh max-h-[calc(100dvh-30px)] overflow-y-auto pb-6"
      v-if="shareDetailData == null"
    >
      <div
        class="flex flex-col bg-center text-black mt-[105px] px-8 gap-3 mb-20"
      >
        <div class="max-w-sm bg-white rounded-lg shadow">
          <div class="h-72 w-full overflow-hidden rounded-t-lg no-char-avail">
            <div class="p-5 flex flex-col gap-2 text-center">
              {{ t('no_available_data') }}
            </div>
            <SolidButton
              :label="$t('back_to_top')"
              :on-click="backToTop"
              has-bottom
            />
          </div>
        </div>
      </div>
    </section>
    <section
      class="min-h-dvh max-h-[calc(100dvh-30px)] overflow-y-auto pb-6"
      v-else
    >
      <div
        class="flex flex-col bg-center text-black mt-[105px] px-8 gap-3 mb-20"
      >
        <div class="max-w-sm bg-white rounded-lg shadow">
          <div class="w-full overflow-hidden rounded-t-lg">
            <Skeleton v-if="isFetching" class="!w-full !h-full" />
            <CharacterCard
              v-else-if="shareDetailData.is_valid_char"
              :image="shareDetailData.character_image"
            />
          </div>
          <div class="p-5 flex flex-col gap-2">
            <div class="inline-flex justify-between w-full gap-2">
              <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>

              <p
                v-else-if="shareDetailData.is_valid_char"
                class="font-bold text-exd-1424 text-exd-gray-scorpion w-full"
              >
                {{ shareDetailData.character_name }}
              </p>
            </div>

            <Skeleton v-if="isFetching" class="!h-3" width="15rem"></Skeleton>
            <p
              v-else-if="shareDetailData.is_valid_char"
              class="font-medium text-exd-1218 text-exd-gray-scorpion mb-4 text-word-wrap vhtml-desc"
              v-html="shareDetailData.character_description"
            />

            <!-- Check if has location data -->
            <div v-if="shareDetailData.is_valid_spot">
              <Skeleton v-if="isFetching" class="!w-full !h-72" />
              <HeadingSection
                v-else
                :is-fetching="isFetching"
                :title="shareDetailData.location_name"
                :body="shareDetailData.location_description"
              />

              <div class="w-full mt-2">
                <Skeleton v-if="isFetching" class="!w-full !h-72" />
                <div
                  class="relative"
                  v-else
                  id="parentMap"
                  style="width: 100%; height: 300px"
                >
                  <div
                    id="map"
                    tabindex="-1"
                    style="width: 100%; height: 100%"
                  />
                  <div class="absolute inset-0 z-10"></div>
                  <div
                    class="absolute bg-white inset-x-0 bottom-0 h-8 flex items-center z-20"
                  >
                    <span
                      class="text-exd-red-vermilion text-sm flex items-center cursor-pointer relative after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:border-b after:border-b-exd-red-vermilion"
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
      </div>
    </section>

    <div class="fixed bottom-0 w-full max-w-md mx-auto px-8 mb-3 z-50">
      <Button
        class="!bg-exd-gold !py-4 !w-full !uppercase !font-bold !text-exd-1424 !rounded-full !text-white !flex !flex-row !justify-between !px-5"
        raised
        @click="
          () =>
            navigateTo('http://digital-gurutto.nagoya-info.jp/', {
              external: true,
              open: {
                target: '_blank',
              },
            })
        "
      >
        <span class="grow text-center">{{ $t('shareClickHere') }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dynamic-seo-meta',
})

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const charId = route.params.charId
const spotId = route.params.spotId
const title = config.public.META_TITLE
const description = config.public.META_DESCRIPTION
const image = config.public.META_IMAGE
const url = config.public.META_URL
const quote = config.public.META_QUOTE
const props = defineProps(['id'])
const isFetching = ref(true)
const shareDetailData = ref(null)
const LOCALE = useCookie('LOCALE')
const backToTop = () => {
  return navigateTo('/')
}

const isValidPath = computed(() => {
  return route.path.startsWith('/share') && charId && spotId
})

const showSuccessPopup = ref(false)

const fetchingShareData = async () => {
  try {
    isFetching.value = true
    let payload = {
      character_id: charId,
      location_id: spotId,
    }

    const { data, error } = await useAsyncData(() =>
      useFetchApi('POST', 'share', { body: payload })
    )

    if (data.value) {
      shareDetailData.value = data.value.data
    }

    if (error.value) {
      console.log(error.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

fetchingShareData()

onBeforeMount(async () => {
  await loadGoogleMaps()
  let lat = shareDetailData.value?.lat
  let long = shareDetailData.value?.long

  if (lat != undefined && long != undefined) {
    initializeMap(lat, long)
  }
})

const initializeMap = async (lat, long) => {
  try {
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

    await nextTick()

    const mapElement = document.getElementById('map')
    const map = new google.maps.Map(mapElement, mapOptions)

    new google.maps.Marker({
      position: { lat: lat, lng: long },
      map: map,
    })
  } catch (error) {
    console.log(error)
  }
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

const openGoogleMaps = () => {
  const lat = shareDetailData.value.lat
  const long = shareDetailData.value.long
  if (lat && long) {
    const googleMapsUrl = `https://www.google.jp/maps?q=${lat},${long}`
    window.open(googleMapsUrl, '_blank')
  }
}
</script>

<style scoped>
.no-char-avail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
