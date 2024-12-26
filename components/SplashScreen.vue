<script setup>
const loading = ref(true)
const isSupportSerWroker = ref(false)
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
    '/logo-icon.ico',
    '/video/spin-voucher.mp4',
    '/video/new-spin-character.mp4',
    '/images/gacha-tom.png',
    '/images/bg-red2.webp',
    '/images/sparkling.png',
    '/images/bg-tom.png',
    '/images/logo.png',
    '/images/warning.svg',
    '/images/logo-tom.png',
    '/images/close.svg',
    '/images/export.svg',
    '/images/intl-tom.png',
    '/images/back-button.svg',
    '/images/character.png',
    '/images/ssr.png',
    '/images/sr.png',
    '/images/r.png',
    '/images/tom-1.png',
    '/images/tom-2.png',
    '/images/tom-3.png',
    '/images/bg-gacha-tom.png',
    '/images/text-char.png',
    '/icons/icon-gift.svg',
  ]
  caches
    .open(`gacharary-endo-ji-v2 - ${self.location.origin}`)
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
</script>

<template>
  <div
    v-if="loading"
    class="w-full max-w-md mx-auto h-screen overflow-hidden bg-[url('~/assets/images/bg-tom.png')] bg-cover bg-center flex flex-col fixed z-[2000]"
  >
    <div
      class="h-full w-full flex flex-col justify-center items-center text-exd-red"
    >
      <img
        src="~/assets/images/gacha-loading.gif"
        class="w-[100px] h-[100px]"
      />
      <img
        src="~/assets/images/loading.png"
        class="mt-6 ml-5 w-[126px] h-[24px]"
      />
    </div>
  </div>
</template>
