<template>
  <div
    class="grow bg-[url('/images/bg-rainbow.png')] bg-cover bg-center relative flex flex-col justify-center items-center"
    @touchmove="(e) => e.preventDefault()"
  >
  <SparkleStart className="top-0 mr-10 -mt-10"  />

    <img
      src="/images/gacha-blue-green.png"
      alt="gacha2"
      class="absolute left-1/2 top-1 transform -translate-x-1/2 w-full h-auto max-h-[100vh] object-contain"
      preload
    />
    <img
      src="/images/sparkling.webp"
      alt="sparkling"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover z-10 animate-sparkling"
      preload
    />
    <div class="absolute inset-0 flex justify-center z-20">
      <CircleSpinPoint
        class="relative top-1/2 -translate-y-[60%]"
        imageSrc="/images/gift-card.png"
        typeSrc="/images/rank-gold.png"
        width="100%"
        height="800"
      />
      <div class="absolute text-exd-dark-grey bg-white flex justify-center bottom-[18%] lg:bottom-[20%] px-2 py-2 w-full max-w-[190px] h-auto rounded-lg">
        <p class="text-[17px]">商品券</p>
      </div>
    </div>
    <div class="absolute-10 top-1/2 translate-y-[80%]"></div>
    <div class="w-full absolute bottom-0">
      <SolidButton
        :label="$t('toTheNext')"
        :on-click="() => (playVideo = true)"
        has-bottom
        variant="red-coral"
      />
    </div>

    <AutoplayVideo
      v-if="playVideo"
      src="/video/spin-character.mp4"
      @ended="handleGoToCharacter"
    />
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const apiPoint = ref(null)
const USER = useCookie('USER')
const pointImageUrl = ref(null)
const TOKEN = useCookie('TOKEN')
const playVideo = ref(false)
const { encryptData, decryptData } = useEncryption()

definePageMeta({
  middleware: 'valid-password',
  layout: 'gacha-machine',
})

const fetchImageFromApi = async () => {
  try {
    const storedData = useCookie('VALID_PASSWORD')

    if (!storedData.value) {
      console.error('No verified data found in localStorage')
      return
    }

    let parsedData
    try {
      parsedData = decryptData(storedData.value)
    } catch (e) {
      console.error('Error parsing stored data:', e)
      return
    }

    const slug = parsedData?.slug?.toUpperCase()
    const slugStorageName = `${slug}_GACHA`
    if (TOKEN.value && USER.value) {
      const payload = decryptData(storedData.value) || {}

      const { data, status } = await useFetchApi('POST', 'gacha/spin', {
        body: { ...payload },
      })

      sessionStorage.setItem('IS_ALREADY_SPIN', data.is_already_spin)

      const storage = {
        location_id: data.userPoint.location.id,
        point_id: data.userPoint.point.id,
        point_image: data.userPoint.point.image,
        character_id: data.userCollection.gacha_character.id,
        character_image: data.userCollection.gacha_character.image,
        point: data.userPoint.point.point.value,
      }

      localStorage.setItem(slugStorageName, encryptData(storage))
      pointImageUrl.value = data.userPoint.point.image
    } else {
      const slugData = localStorage.getItem(slugStorageName)

      if (slugData) {
        const parse = decryptData(slugData)
        pointImageUrl.value = parse.point_image
        localStorage.setItem(
          slugStorageName,
          encryptData({ ...parse, is_already_spin: true })
        )
        reportMultipleSpin({ ...parse })
        return
      }

      const { data, error } = await useFetchApi('GET', 'gacha/spin', {
        params: {
          slug: parsedData.slug,
          password: parsedData.password,
        },
      })

      const storage = {
        location_id: data.location.id,
        point_id: data.point.id,
        point_image: data.point.image,
        character_id: data.character.id,
        character_image: data.character.image,
        point: apiPoint.value,
        log_id: data.log_id,
      }

      localStorage.setItem(slugStorageName, encryptData(storage))
      pointImageUrl.value = data.point.image
    }

    if (error) {
      console.error('Error fetching image:', error)
      return
    }
  } catch (e) {
    if (e === 'refetch') {
      TOKEN.value = null
      USER.value = null
      fetchImageFromApi()
    }
    console.error('Unexpected error:', e)
  }
}
const reportMultipleSpin = async ({ point_id, character_id, location_id }) => {
  try {
    const response = await useFetchApi('POST', 'gacha/report', {
      body: { point_id, character_id, location_id },
    })

    console.log(response)
  } catch (error) {
    console.log('Error report multiple spin', error)
  }
}

const handleGoToCharacter = async () => {
  await navigateTo(`/spin/character/${route.params.randomCode}`)
}

onMounted(() => {
  fetchImageFromApi()
})
</script>

<style scoped>
@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-sparkling {
  opacity: 0.4;
  transform-box: fill-box;
  transform-origin: center center;
  animation: sparkle 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
