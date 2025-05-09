<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible')"
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
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center py-6 !pb-8 relative"
      >
        <div v-if="popupImage" class="w-auto h-24 mt-4">
          <img :src="popupImage" class="object-contain w-full h-full" />
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
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 py-6 !pb-8 relative"
      >
        <div class="font-bold text-center text-exd-1624 text-exd-gray-scorpion mt-8 mb-4 px-4">
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)" class="whitespace-pre-line" v-html="$t('toExchangePrizes')"></p>
          <!-- <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('mustBeMember') }}
          </p> -->
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

const handleShowDialog = () => emit('update:visible', true)
const handleCloseDialog = () => emit('update:visible', false)
const handleToRedirect = async () => {
  if (props.pointCategoryIsFail) {
    const storedData = useCookie('VALID_PASSWORD')
    let parsedData = decryptData(storedData.value)

    const slug = parsedData.slug

    await navigateTo(`/spin/${slug}`)
  } else {
    window.location.href = props.popupLink // Use self-navigation
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
