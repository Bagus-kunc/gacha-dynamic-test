<template>
  <div
    @touchmove="(e) => e.preventDefault()"
    class="flex flex-col grow bg-[url('/images/bg-blue-green.png')] bg-cover bg-center justify-between relative overflow-hidden cursor-pointer"
  >
    <div class="background-gradient absolute inset-0"></div>

    <!-- container scrollable -->
    <div
      class="relative min-h-dvh overflow-y-auto no-scrollbar"
      @touchmove="handleTouchMove"
      @click="handleShowModal"
    >
      <img src="/assets/images/TOP.png" alt="top" class="h-screen w-full" />
      <div class="">
        <!-- Tap screen -->
        <!-- <div class="absolute w-full pb-10 tap-screen">
          <div class="justify-center items-center w-full flex flex-col mb-3">
            <img :src="tapScreen" alt="intl" class="" preload />
            <p class="text-exd-1218 text-white text-center">
              {{ $t('loginOrRegisterTop') }}
            </p>
          </div>

          <p
            class="text-white text-center text-exd-1218 font-semibold cursor-pointer"
          >
            {{ $t('addToBookmarks') }}
          </p>
        </div> -->
      </div>
    </div>
  </div>

  <ModalLogin v-model="hasModal" :email="emailVerified" />

  <WarningPopUp
    :is-open="isComplete"
    :on-close="handleClose"
    :has-button="true"
    :on-click-button="handleDialog"
    label-button="GO!"
    :modal-title="$t('verificationCompleted')"
  />

  <WarningPopUp
    :is-open="isFailed"
    :on-close="handleClose"
    :has-button="true"
    :on-click-button="handleDialog"
    label-button="GO!"
    :modal-title="$t('verificationFailed')"
  />
</template>

<script setup>
import intlRounded from '~/assets/images/intl-rounded.svg'
import logoIcon from '~/assets/images/logo-icon.svg'
import tapScreen from '~/assets/images/tap-screen.png'
import logo from '~/assets/images/logo.png'
import { nextTick } from 'vue'
import WarningPopUp from '~/components/WarningPopUp.vue'
import gacha from '~/assets/images/gacha.png'
import picture1 from '~/assets/images/picture1.png'
import picture2 from '~/assets/images/picture2.png'
import get from '~/assets/images/get.png'
import intl from '~/assets/images/intl.png'
import character from '~/assets/images/character.png'
import talk from '~/assets/images/talk.png'

const route = useRoute()
const router = useRouter()
const { setSourceFrom } = useRegister()
const hasModal = ref(false)
const isComplete = ref(false)
const isFailed = ref(false)
const emailVerified = ref('')

const TOKEN = useCookie('TOKEN')
const USER = useCookie('USER')
const VALID_PASSWORD = useCookie('VALID_PASSWORD')
const langPanel = ref(false)

const handleShowModal = () => {
  hasModal.value = true
  setSourceFrom('top')
}
const handleDialog = async () => {
  isComplete.value = false
  isFailed.value = false
  router.push('/')
  await nextTick()
  handleShowModal()
}

const handleClose = () => {
  isComplete.value = false
  isFailed.value = false
}

const form = ref({
  emailAddress: '',
  password: '',
})

const updateModel = (field, value) => {
  form.value[field] = value
}

const validateInput = (field, value) => {
  console.log(`Validated ${field}:`, value)
}

const langPanelToggle = (event) => {
  langPanel.value = !langPanel.value
}

const handleTouchMove = (e) => {
  const scrollableElement = e.currentTarget
  const scrollTop = scrollableElement.scrollTop
  const scrollHeight = scrollableElement.scrollHeight
  const offsetHeight = scrollableElement.offsetHeight

  if (scrollHeight > offsetHeight) {
    e.stopPropagation()
  }
}
const checkVerified = async (verified) => {
  try {
    const { status, data } = await useFetchApi(
      'GET',
      `/login/decrypt/${verified}`
    )
    if (status && data && data.email) {
      emailVerified.value = data.email
      handleShowModal()
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  const verified = route.query.verified
  const hash = window.location.hash

  const clearSession = () => {
    localStorage.clear()
    sessionStorage.clear()
    TOKEN.value = null
    USER.value = null
    VALID_PASSWORD.value = null
  }

  if (verified) {
    await checkVerified(verified)
    clearSession()
  } else if (hash === '#verification-failed') {
    isFailed.value = true
    clearSession()
  } else if (TOKEN.value) {
    navigateTo('/dashboard')
  }

  if (hash === '#registration-complete') {
    isComplete.value = true
  }
})
</script>

<style>
.no-scrollbar {
  overflow-x: hidden; /* Mencegah scroll horizontal */
  scrollbar-width: none; /* Sembunyikan scrollbar pada Firefox */
}

/* Sembunyikan scrollbar pada Chrome, Edge, dan Safari */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.background-gradient {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(63, 11, 6, 0.8) 0%,
    rgba(63, 11, 6, 1) 50%
  );
  pointer-events: none;
}

.tap-screen {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(63, 11, 6, 0.8) 00%,
    rgba(63, 11, 6, 1) 100%
  );
  pointer-events: none;
}
</style>
