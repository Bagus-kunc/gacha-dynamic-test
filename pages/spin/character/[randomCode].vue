<template>
  <div
    class="grow bg-[url('/images/bg-gacha-character.png')] bg-cover bg-center relative flex flex-col justify-center items-center"
    @touchmove="(e) => e.preventDefault()"
  >
    <SparkleStart className="top-3 z-30" />

    <img
      src="/images/gacha-tom.png"
      alt="gacha2"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none h-auto max-h-[96svh] object-contain"
      preload
    />
    <img
      src="/images/sparkling.png"
      alt="sparkling"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover z-10 animate-sparkling"
      preload
    />
    <div class="absolute inset-0 flex justify-center z-20">
      <CircleSpinCharacter
        class="relative top-1/2 -translate-y-[50%]"
        :imageSrc="characterImageUrl"
        :raritySrc="raritySrc"
        headSrc="/images/text-char.png"
        width="100%"
        height="100%"
      />

      <div
        class="absolute text-exd-dark-grey bg-white flex justify-center bottom-[20%] px-4 py-3 min-h-[50px] rounded-lg"
      >
        <p class="text-[17px] max-w-[278px] text-center">{{ charName }}</p>
      </div>
    </div>

    <div class="absolute bottom-0 w-full">
      <SolidButton
        :label="$t('toTheNext')"
        :on-click="handleButton"
        variant="dark"
        has-bottom
      />
    </div>
  </div>

  <Dialog
    v-model:visible="hasModal"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
  >
    <template v-if="isRedirect" #container>
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
        class="w-full flex flex-col justify-center items-center py-6 !pb-8 relative"
      >
        <div v-if="popupImage" class="w-auto h-24 mt-4">
          <img :src="popupImage" class="w-full h-full object-contain" />
        </div>
        <div
          :class="[
            'font-bold  px-4 text-exd-1530 text-center text-exd-gray-scorpion',
            popupImage ? 'pt-3 pb-10' : 'py-10',
          ]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          <div
            class="max-h-[200px] overflow-auto leading-normal"
            v-html="popupDescription"
          ></div>
        </div>
        <SolidButton
          :label="popupButton"
          :on-click="() => handleToRedirect()"
          variant="dark"
        />
      </div>
    </template>

    <template v-else #container>
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
          variant="tom"
        />
        <SolidButton
          :label="$t('loginToMyPage')"
          :on-click="handleToLogin"
          variant="gray"
        />
      </div>
    </template>
    <!-- <template v-else #container>
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
        <div
          class="font-bold py-10 text-exd-1424 text-center text-exd-gray-scorpion"
        >
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('thankYou') }}
          </p>
        </div>
        <SolidButton
          :label="$t('tomWeb')"
          :on-click="handleTomWeb"
          variant="tom"
        />
      </div>
    </template> -->
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
import iconGift from '/icons/icon-gift.svg'
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'valid-password',
  layout: 'gacha-machine',
})

const { setSourceFrom } = useRegister()

const hasModal = ref(false)
const errorMessages = ref('')
const modalLogin = ref(false)
const isNotAllowed = ref(false)
const isVisible = ref(false)
const isHiding = ref(false)

const USER = useCookie('USER')
const TOKEN = useCookie('TOKEN')

const characterImageUrl = ref(null)
const charName = ref(null)
const raritySrc = ref(null)

const isRedirect = ref(false)
const popupButton = ref('')
const popupLink = ref('')
const popupDescription = ref('')
const popupImage = ref('')
const pointCategoryIsFail = ref(false)

const handleClose = () => (isNotAllowed.value = false)
const handleShowDialog = () => (hasModal.value = true)
const handleCloseDialog = () => (hasModal.value = false)
const { decryptData } = useEncryption()
const { t } = useI18n()

const handleButton = async () => {
  if (isRedirect.value) {
    return handleShowDialog()
  }

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
    charName.value = slugData?.character_name
    raritySrc.value = slugData?.character_rarity
    isRedirect.value = true
    popupLink.value = slugData?.redirect_link
    popupDescription.value = slugData?.popup_description
    popupImage.value = slugData?.popup_image
    pointCategoryIsFail.value = slugData?.point_category_is_fail

    if (slugData?.point_category_is_fail) {
      popupButton.value = t('playAgain')
    } else {
      popupButton.value = t('formHere')
    }
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

const handleToRedirect = async () => {
  if (pointCategoryIsFail.value) {
    const storedData = useCookie('VALID_PASSWORD')
    let parsedData = decryptData(storedData.value)

    const slug = parsedData.slug

    await navigateTo(`/spin/${slug}`)
  } else {
    await navigateTo(popupLink.value, {
      external: true,
      open: {
        target: '_blank',
      },
    })
  }
}

onMounted(() => {
  fetchImage()
})
</script>

<style scoped>
::v-deep(.p-dialog-header) {
  display: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

.notif {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  top: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.638);

  animation: slideIn 0.3s ease-out forwards;
}

.notif.hide {
  animation: slideOut 0.3s ease-in forwards;
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
