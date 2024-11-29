<template>
  <SplashScreen />

  <div class="grow flex flex-col">
    <HeaderBar withLogo />

    <div
      class="flex flex-col grow bg-[url('/images/bg-blue-green.png')] bg-cover bg-center relative"
    >
      <div
        class="grow w-full flex flex-col items-center justify-center relative mb-4 mt-[15%]"
      >
        <img
          src="/images/gacha-blue-green.png"
          alt="gacha2"
          class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[47%] w-full h-auto max-h-[88%] object-contain"
          preload
        />
      </div>

      <SolidButton
        :label="$t('spinTheGacha')"
        variant="red-coral"
        :on-click="() => (playVideo = true)"
        has-bottom
      />
    </div>
  </div>

  <AutoplayVideo
    v-if="playVideo"
    src="/video/spin-point.mp4"
    @ended="goToSpinPoint"
  />

  <Modal :is-open="isNotAllowed" :on-close="() => handleCloseDialog()">
    <template v-slot:body>
      <div class="w-full flex flex-col justify-center items-center gap-4 py-6">
        <img
          src="/images/warning.png"
          alt="warning"
          width="40"
          height="40"
          preload
        />
        <div class="text-center w-10/12">
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ errorMessages }}
          </p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const errorMessages = ref('')
const isNotAllowed = ref(false)
const playVideo = ref(false)
const handleOpenDialog = () => (isNotAllowed.value = true)
const handleCloseDialog = () => (isNotAllowed.value = false)

const { encryptData, decryptData } = useEncryption()

definePageMeta({
  layout: 'gacha-machine',
  middleware: async (to, from) => {
    const { decryptData } = useEncryption()

    const location = to.params.randomCode
    const validPassword = useCookie('VALID_PASSWORD')

    const { data } = await useFetchApi('GET', '/location/password/' + location)

    if (data) {
      const notRequiredPin = useState('not_required_pin', () => 0)
      notRequiredPin.value = data.not_required_pin
    }

    const validSlug = decryptData(validPassword.value || '{}')

    if (data && data.not_required_pin === 0 && validSlug?.slug !== location) {
      return navigateTo(`/scan/${location}`)
    }
  },
})

const goToSpinPoint = async () => {
  const notRequiredPin = useState('not_required_pin')

  if (notRequiredPin.value) {
    const validPassword = useCookie('VALID_PASSWORD')
    validPassword.value = encryptData({ slug: route.params.randomCode })
  }

  await navigateTo(`/spin/point/${route.params.randomCode}`)
}
</script>
