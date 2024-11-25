<template>
  <div
    class="grow bg-[url('/images/bg-green.webp')] bg-cover bg-center relative flex flex-col justify-center items-center"
    @touchmove="(e) => e.preventDefault()"
  >
    <img
      src="/images/gacha2.webp"
      alt="gacha2"
      class="absolute left-1/2 top-1 transform -translate-x-1/2 w-full h-auto max-h-[90vh] object-contain"
      preload
    />
    <img
      src="/images/sparkling.webp"
      alt="sparkling"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover z-10 animate-sparkling"
      preload
    />
    <div class="absolute inset-0 flex justify-center z-20">
      <CircleSpinCharacter
        class="relative top-1/2 -translate-y-[50%]"
        :imageSrc="characterImageUrl"
        width="100%"
        height="100%"
      />
    </div>

    <div class="absolute bottom-0 w-full">
      <SolidButton
        :label="$t('toTheNext')"
        :on-click="handleButton"
        variant="red-coral"
        has-bottom
      />
    </div>
  </div>

  <Dialog
    v-model:visible="hasModal"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 py-6 !pb-8 relative"
      >
        <div class="font-bold text-exd-1424 text-center text-exd-gray-scorpion">
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('toWinPrizes') }}
          </p>
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('membershipRegistrationRequired') }}
          </p>
        </div>
        <SolidButton
          :label="$t('newMemberRegistration')"
          :on-click="handleToRegister"
          variant="red-coral"
        />
        <SolidButton
          :label="$t('loginToMyPage')"
          :on-click="handleToLogin"
          variant="blue-green"
        />
      </div>
    </template>
  </Dialog>

  <ModalLogin v-model="modalLogin" />

  <Dialog
    v-model:visible="isNotAllowed"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleClose"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 py-6 px-6"
      >
        <img
          src="/images/warning.svg"
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
        <SolidButton label="ガチャTOP" :on-click="() => goTo('/dashboard')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import useRegister from '~/composables/useRegister'

definePageMeta({
  middleware: 'valid-password',
  layout: 'gacha-machine',
})

const { setSourceFrom } = useRegister()

const hasModal = ref(false)
const errorMessages = ref('')
const modalLogin = ref(false)
const isNotAllowed = ref(false)

const USER = useCookie('USER')
const TOKEN = useCookie('TOKEN')
const characterImageUrl = ref(null)

const handleClose = () => (isNotAllowed.value = false)
const handleShowDialog = () => (hasModal.value = true)
const handleCloseDialog = () => (hasModal.value = false)
const { decryptData } = useEncryption()

const handleButton = async () => {
  if (!TOKEN.value && !USER.value) {
    handleShowDialog()
  } else {
    await navigateTo('/dashboard')
  }
}

const fetchImage = async () => {
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

    const slug = parsedData.slug.toUpperCase()

    const slugData = decryptData(localStorage.getItem(`${slug}_GACHA`))
    characterImageUrl.value = slugData?.character_image
  } catch (e) {
    console.error('Unexpected error:', e)
  }
}

const handleToRegister = async () => {
  setSourceFrom('spin')
  await navigateTo('/register')
}

const handleToLogin = () => {
  setSourceFrom('spin')
  hasModal.value = false
  modalLogin.value = true
}

const goTo = async (url) => {
  await navigateTo(url)
}

onMounted(() => {
  fetchImage()
})
</script>

<style scoped>
::v-deep(.p-dialog-header) {
  display: none;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-sparkling {
  opacity: 0.4;
  transform-box: fill-box;
  transform-origin: center center;
  animation: sparkle 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
