<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible')"
    modal
    class="!w-11/12 !max-w-sm border border-exd-gray-44"
    :style="{
      background: settings?.global?.modal?.background_color,
    }"
  >
    <template v-if="afterGacha?.option === '2'" #container>
      <!-- ==================== SOCIAL MEDIA ==================== -->
      <div
        v-if="
          afterGacha?.data?.button_and_social_media === 'social_media' ||
          afterGacha?.data?.button_and_social_media === 'both'
        "
      >
        <img
          src="/images/close.svg"
          alt="close"
          width="30"
          height="30"
          class="absolute z-50 cursor-pointer right-1 top-1"
          @click="handleCloseDialog"
        />

        <div
          class="w-full flex flex-col justify-center items-center py-6 !pb-8 relative"
        >
          <!-- Popup Image -->
          <div v-if="popupImage" class="w-auto h-24 mt-4">
            <img :src="popupImage" class="object-contain w-full h-full" />
          </div>

          <!-- Modal Text -->
          <div
            :class="[
              'font-bold px-4 text-exd-1530 text-center text-exd-gray-scorpion',
              popupImage ? 'pt-3 pb-8' : 'py-10',
            ]"
            style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
          >
            <p class="max-h-[200px] px-8 leading-normal whitespace-pre-line">
              {{ afterGacha?.data?.modal_text }}
            </p>
          </div>

          <!-- Social Media Icons -->
          <div
            class="inline-flex flex-wrap items-center justify-center w-full px-8 gap-x-3 gap-y-1"
          >
            <div class="speech-bubble text-[10pt]">
              {{ $t('share') }}
              <div class="triangle-border"></div>
              <div class="triangle-inner"></div>
            </div>

            <img
              v-for="(link, key) in socialMediaLinks"
              :key="key"
              :src="share(link)"
              :alt="key"
              :aria-label="key"
              class="cursor-pointer md:size-7 size-7"
              @click="openLink(link)"
            />
          </div>
        </div>
      </div>

      <!-- ==================== BUTTON ==================== -->
      <div
        v-if="
          afterGacha?.data?.button_and_social_media === 'button' ||
          afterGacha?.data?.button_and_social_media === 'both'
        "
      >
        <img
          src="/images/close.svg"
          alt="close"
          width="30"
          height="30"
          class="absolute z-50 cursor-pointer right-1 top-1"
          @click="handleCloseDialog"
        />

        <div
          class="w-full flex flex-col justify-center items-center !pb-8 relative"
          :class="[
            afterGacha?.data?.button_and_social_media !== 'both' && 'py-6',
          ]"
        >
          <div
            v-if="afterGacha?.data?.button_and_social_media !== 'both'"
            :class="[
              'font-bold px-4 text-exd-1530 text-center text-exd-gray-scorpion',
              settings?.gacha?.after_gacha_screen?.data?.popup_image
                ? 'pt-3 pb-10'
                : 'py-10',
            ]"
            style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
          >
            <div
              class="max-h-[200px] overflow-auto leading-normal"
              :style="{ color: settings?.global?.modal?.text_color }"
            >
              {{ settings?.gacha?.after_gacha_screen?.data?.modal_text }}
            </div>
          </div>

          <SolidButton
            :label="settings?.gacha?.after_gacha_screen?.data?.button_text"
            :bgColor="
              settings?.gacha?.after_gacha_screen?.data?.button_and_text_color
                ?.background
            "
            :textColor="
              settings?.gacha?.after_gacha_screen?.data?.button_and_text_color
                ?.color
            "
            @click="handleToRedirect"
          />
        </div>
      </div>

      <!-- ==================== NONE ==================== -->
      <div v-if="afterGacha?.data?.button_and_social_media === 'none'">
        <img
          src="/images/close.svg"
          alt="close"
          width="30"
          height="30"
          class="absolute z-50 cursor-pointer right-1 top-1"
          @click="handleCloseDialog"
        />

        <div class="relative flex flex-col items-center justify-center w-full">
          <!-- Popup Image -->
          <div v-if="popupImage" class="w-auto h-24 mt-4">
            <img :src="popupImage" class="object-contain w-full h-full" />
          </div>

          <!-- Modal Text -->
          <div
            :class="[
              'font-bold px-4 text-exd-1530 text-center text-exd-gray-scorpion',
              popupImage ? 'pt-3 pb-8' : 'py-10',
            ]"
            style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
          >
            <p class="max-h-[200px] px-8 leading-normal whitespace-pre-line">
              {{ afterGacha?.data?.modal_text }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-else #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 py-6 !pb-8 relative"
      >
        <div
          class="px-4 mt-8 mb-4 font-bold text-center text-exd-1624 text-exd-gray-scorpion"
        >
          <p
            style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
            class="whitespace-pre-line"
          >
            {{ settings?.gacha?.after_gacha_screen?.data?.popup_title }}
          </p>
        </div>
        <SolidButton
          :label="settings?.gacha?.after_gacha_screen?.data?.button_1_text"
          :bgColor="
            settings?.gacha?.after_gacha_screen?.data?.button_1_text_color
              ?.background
          "
          :textColor="
            settings?.gacha?.after_gacha_screen?.data?.button_1_text_color
              ?.color
          "
          :on-click="handleToRegister"
        />
        <SolidButton
          :label="settings?.gacha?.after_gacha_screen?.data?.button_2_text"
          :bgColor="
            settings?.gacha?.after_gacha_screen?.data?.button_2_text_color
              ?.background
          "
          :textColor="
            settings?.gacha?.after_gacha_screen?.data?.button_2_text_color
              ?.color
          "
          :on-click="handleToLogin"
        />
      </div>
    </template>
  </Dialog>

  <ModalLogin v-model="modalLogin" />
</template>

<script setup>
import download from '~/assets/images/download.svg'
import facebook from '~/assets/images/facebook.svg'
import line from '~/assets/images/line.svg'
import x from '~/assets/images/x.svg'
import instagram from '~/assets/images/instagram.png'
import tiktok from '~/assets/images/tiktok.png'
import web1 from '~/assets/icons/web1.png'
import web2 from '~/assets/icons/web2.png'
import web3 from '~/assets/icons/web3.png'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isRedirect: { type: Boolean, default: false },
  popupButton: { type: String, default: '' },
  popupLink: { type: String, default: '' },
  popupDescription: { type: String, default: '' },
  popupImage: { type: String, default: '' },
  pointCategoryIsFail: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'closeModalLogin'])

const modalLogin = ref(false)

const { decryptData } = useEncryption()
const { setSourceFrom } = useRegister()

const settings = useState('settings')
const afterGacha = settings.value?.gacha?.after_gacha_screen

const socialMediaLinks = ref([])

const handleShowDialog = () => emit('update:visible', true)
const handleCloseDialog = () => emit('update:visible', false)
const handleToRedirect = async () => {
  if (props.pointCategoryIsFail) {
    const storedData = useCookie('VALID_PASSWORD')
    let parsedData = decryptData(storedData.value)

    const slug = parsedData.slug

    await navigateTo(`/spin/${slug}`)
  } else {
    const url = settings.value?.gacha?.after_gacha_screen?.data?.url_link

    if (url) {
      window.open(url, '_blank')
    }
  }
}

const handleToRegister = async () => {
  setSourceFrom('spin')
  await navigateTo('/register')
}

const handleToLogin = () => {
  setSourceFrom('spin')
  handleCloseDialog()
  modalLogin.value = true
  emit('closeModalLogin')
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const share = (type) => {
  if (!type) return null

  const map = [
    { match: 'fb', icon: facebook },
    { match: 'x', icon: x },
    { match: 'line', icon: line },
    { match: 'ig', icon: instagram },
    { match: 'tt', icon: tiktok },
    { match: 'web1', icon: web1 },
    { match: 'web2', icon: web2 },
    { match: 'web3', icon: web3 },
  ]

  const found = map.find(({ match }) => type.key.includes(match))
  return found ? found.icon : download
}

onMounted(() => {
  const gachaSocialMedia = afterGacha?.data?.data_share_social_media

  if (!gachaSocialMedia) {
    socialMediaLinks.value = []
    return
  }

  socialMediaLinks.value = Object.entries(gachaSocialMedia)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      key,
      value
    }))
})

</script>

<style scooped>
.speech-bubble {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #555555;
  border-radius: 6px;
  padding: 7px 12px;
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
</style>
