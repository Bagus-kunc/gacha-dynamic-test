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
  </Dialog>
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
    await navigateTo(props.popupLink, {
      external: true,
      open: {
        target: '_blank',
      },
    })
  }
}

const handleToRegister = async () => {
  setSourceFrom('spin')
  await navigateTo('/register')
}

const handleToLogin = () => {
  setSourceFrom('spin')
  handleCloseDialog()
  emit('closeModalLogin')
}
</script>
