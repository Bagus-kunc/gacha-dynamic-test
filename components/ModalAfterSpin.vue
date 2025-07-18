<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible')"
    modal
    class="!w-11/12 !max-w-sm border border-exd-gray-44"
    :style="{
      background: settings?.global?.modal?.background_color
    }"
  >
    <template v-if="settings?.gacha?.after_gacha_screen?.option === '2'" #container>
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
        class="w-full flex flex-col justify-center items-center py-6 !pb-8 relative"
      >
        <!-- <div v-if="settings?.gacha?.after_gacha_screen?.data?.popup_image" class="flex items-center justify-center w-auto h-24 mt-4">
          <img :src="settings?.gacha?.after_gacha_screen?.data?.popup_image" class="object-contain w-[90%] h-full" />
        </div> -->
        <div
          :class="[
            'font-bold  px-4 text-exd-1530 text-center text-exd-gray-scorpion',
            settings?.gacha?.after_gacha_screen?.data?.popup_image ? 'pt-3 pb-10' : 'py-10',
          ]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          <div
            class="max-h-[200px] overflow-auto leading-normal"
            :style="{
              color: settings?.global?.modal?.text_color
            }"
          >
            <!-- v-html="popupDescription" -->
            {{ settings?.gacha?.after_gacha_screen?.data?.modal_text }}
        </div>
        </div>
        <SolidButton
          :label="settings?.gacha?.after_gacha_screen?.data?.button_text"
          :bgColor="settings?.gacha?.after_gacha_screen?.data?.button_and_text_color?.background"
          :textColor="settings?.gacha?.after_gacha_screen?.data?.button_and_text_color?.color"
          :on-click="() => handleToRedirect()"
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
            <!-- v-html="$t('toExchangePrizes')" -->
            {{ settings?.gacha?.after_gacha_screen?.data?.popup_title }}
        </p>
          <!-- <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('mustBeMember') }}
          </p> -->
        </div>
        <SolidButton
          :label="settings?.gacha?.after_gacha_screen?.data?.button_1_text"
          :bgColor="settings?.gacha?.after_gacha_screen?.data?.button_1_text_color?.background"
          :textColor="settings?.gacha?.after_gacha_screen?.data?.button_1_text_color?.color"
          :on-click="handleToRegister"
        />
        <SolidButton
          :label="settings?.gacha?.after_gacha_screen?.data?.button_2_text"
          :bgColor="settings?.gacha?.after_gacha_screen?.data?.button_2_text_color?.background"
          :textColor="settings?.gacha?.after_gacha_screen?.data?.button_2_text_color?.color"
          :on-click="handleToLogin"
        />
      </div>
    </template>
  </Dialog>

  <ModalLogin v-model="modalLogin" />
</template>

<script setup>
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
    // window.location.href = props.popupLink

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
</script>
