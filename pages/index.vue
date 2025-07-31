<template>
  <div
    @touchmove.prevent
    class="flex flex-col grow bg-[url('/images/green_base.png')] bg-cover bg-center justify-between relative overflow-hidden cursor-pointer"
    @click="handleShowModal"
  >
    <div class="flex flex-col items-center justify-between h-full">
      <div
        class="bg-[url(~/assets/images/top-char.png)] w-full h-[550px] bg-origin-border bg-center bg-no-repeat bg-contain"
      />
      
      <img :src="headLogo" alt="Logo" class="w-[90%]" />

      <div
        class="bg-exd-green-light w-full h-[150px] flex flex-col justify-center items-center gap-3"
      >
        <img :src="tapScreen" alt="intl" width="280" class="" preload />

        <p
          class="font-semibold text-center underline cursor-pointer text-exd-gray-scorpion text-exd-1320"
          @click.stop="openBookmarkLink"
        >
          {{ settings?.gacha?.user_tap_splash_screen?.url?.url_text }}
        </p>
      </div>
    </div>

    <!-- container scrollable -->

    <!-- Tap screen -->
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
import topChar from '~/assets/images/top-char.png'
import headLogo from '~/public/images/header-logo.png'
import tapScreen from '~/assets/images/tap-screen.png'
import { nextTick } from 'vue'
import WarningPopUp from '~/components/WarningPopUp.vue'

definePageMeta({
  middleware: 'navigation-guard',
})

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
const settings = useState('settings')

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

const openBookmarkLink = () => {
  window.open(settings.value?.gacha?.user_tap_splash_screen?.url?.url_link, '_blank')
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
