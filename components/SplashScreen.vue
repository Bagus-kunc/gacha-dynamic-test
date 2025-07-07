<script setup>
const loading = ref(true)
const isSupportSerWroker = ref(false)
const settings = useState('settings')

let checkCachesInterval
let firstCount = 1

const emit = defineEmits(['finish'])

// Init service worker
if (process.client && 'serviceWorker' in navigator) {
  isSupportSerWroker.value = true
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      registration.update()
      console.log('ServiceWorker updated')
    } else {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          )
        },
        (err) => {
          console.log('ServiceWorker registration failed: ', err)
        }
      )
    }
  })
} else {
  isSupportSerWroker.value = false
}

onMounted(() => {
  checkCachesInterval = setInterval(() => {
    firstCount += 1
    if (isSupportSerWroker.value) {
      checkCaches()
    } else {
      clearInterval(checkCachesInterval)
      completeLoading()
    }

    if (firstCount >= 7) {
      clearInterval(checkCachesInterval)
      completeLoading()
    }
  }, 1500)
})

function completeLoading() {
  loading.value = false
  emit('finish')
}

const checkCaches = () => {
  const urlsToCache = [
    '/favicon.ico',
    '/images/sparkling.png',
    '/images/green_base.png',
    '/images/gacha-aichi.png',
    '/images/warning.svg',
    '/images/close.svg',
    '/images/export.svg',
    '/images/intl-icon.png',
    '/images/text-char.png',
    '/icons/icon-gift.svg'
  ]
  caches
    .open(`gacharary-aichi-gurutto-v2 - ${self.location.origin}`)
    .then(function (cache) {
      return cache.keys()
    })
    .then(function (keys) {
      const chachesUrl = keys.map((i) => i.url)
      const isCacheAlready = urlsToCache.every((i) =>
        chachesUrl.some((a) => a.includes(i))
      )

      if (isCacheAlready) {
        clearInterval(checkCachesInterval)
        completeLoading()
      }
    })
}

onMounted(async () => {
  
})
</script>

<template>
  <div
    v-if="loading"
    class="w-full max-w-md mx-auto h-screen overflow-hidden bg-cover bg-center flex flex-col fixed z-[2000]"
    :style="{ backgroundImage: `url(${settings.gacha.loading_screen.background.value})` }"
  >
    <div
      class="flex flex-col items-center justify-center w-full h-full text-exd-red"
    >
      <img
        :src="settings.gacha.loading_screen.gif"
        class="w-[100px] h-[100px]"
      />
      <img
        src="~/assets/images/loading.png"
        class="mt-6 ml-5 w-[126px] h-[24px]"
      />
    </div>
  </div>
</template>
