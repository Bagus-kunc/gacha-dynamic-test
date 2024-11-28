<template>
  <div
    class="grow flex flex-col overflow-hidden"
    @touchmove="onTouchmove"
    style="touch-action: none"
  >
    <HeaderBar>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="header text-black font-bold text-exd-1824.52"
      >
        {{ $t('passwordInput') }}
      </p>
    </HeaderBar>
    <div
      class="scan-content flex flex-col grow items-center justify-center mt-20 small:mt-14"
    >
      <div
        class="scan-otp flex flex-col gap-4 pt-exd-81 pb-exd-60 justify-center items-center"
      >
        <p class="text-exd-gray-scorpion">{{ $t('pleaseEnterPassword') }}</p>
        <OtpInput
          v-model="value"
          :length="4"
          :clear-field="isNotAllowed || wrongPassword || stepAllowLocation"
        />
      </div>
      <div class="grow w-full flex flex-col gap-5 small:gap-2">

        <div
          class="password-inform bg-exd-banana mx-3 font-bold text-exd-orange-700 text-exd-1424 p-5 flex justify-center"
        >
          <span class="underline cursor-pointer" @click="() => toggleModal()">{{
            $t('passwordIsHere')
          }}</span>
        </div>
        <div class="w-full grow bg-gray-100 relative flex flex-col">
          <div class="grow p-5 small:p-[15px]">
            <ul
              ref="refsNotes"
              class="uiHeight list-disc list-inside overflow-y-auto"
              style="touch-action: pan-y"
            >
              <p
                class="scan-title font-bold text-exd-1424 text-exd-gray-scorpion mb-1"
              >
                {{ $t('scanNotesTitle') }}
              </p>
              <li
                v-for="i in 16"
                :key="i"
                class="text-exd-1220 text-exd-gray-scorpion font-medium text-justify"
              >
                {{ $t(`scanNotesDescription.note${i}`) }}
              </li>
            </ul>
          </div>
          <div class="fixed bottom-0 w-full max-w-md mx-auto px-8 mb-1 z-50">
            <SolidButton
              label="GO!"
              :has-loading="isLoading"
              :on-click="goToScan"
              :disabled="isLoading"
              :has-bottom="true"
              class="flex-none h-[56px]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
    :is-open="showModal"
    :on-close="() => toggleModal()"
    :is-hidden-close="true"
  >
    <template v-slot:body>
      <div
        class="w-full flex flex-col justify-center items-center gap-5 py-6 px-4 relative"
      >
        <img
          :src="close"
          alt="close"
          width="30"
          height="30"
          preload
          class="absolute right-2 top-3 cursor-pointer z-50"
          @click="() => toggleModal()"
        />

        <ModalContent :image="popup1" v-if="selectedContent === 1">
          <template v-slot:content>
            <p v-if="locale === 'ja'">
              <span class="text text-exd-red-vermilion"
                >名古<a
                  href="https://nospot.new-ordinary.co.jp/maps/nagoya"
                  target="_blank"
                  ><span class="underline"
                    >屋観光デジタルマップ
                    <img
                      :src="exportIcon"
                      alt="exportIcon"
                      width="20"
                      height="20"
                      preload
                      class="text-exd-red-vermilion inline" /></span></a
              ></span>
              右下の「<span class="font-extrabold">もっと見る</span
              >」から「<span class="font-extrabold">イベント</span
              >」を選び、<span class="font-extrabold"
                >赤枠で囲まれた現在のスポット</span
              >をタップ！
            </p>
            <p v-else>
              <a
                href="https://nospot.new-ordinary.co.jp/maps/nagoya"
                target="_blank"
                ><span class="text text-exd-red-vermilion"
                  >Nagoya Sightseeing Digital Map
                  <img
                    :src="exportIcon"
                    alt="exportIcon"
                    width="20"
                    height="20"
                    preload
                    class="text-exd-red-vermilion inline" /></span></a
              >Select "<span class="font-extrabold">Events</span>" from "<span
                class="font-extrabold"
                >See more</span
              >" on the bottom right and tap the current spot surrounded by a
              red frame!
            </p>
          </template>
        </ModalContent>

        <ModalContent :image="popup2" v-if="selectedContent === 2">
          <template v-slot:content>
            <p v-if="locale === 'ja'">
              スポット詳細ページ下のリンクをタップすると、このスポットのパスワードが表示されます。
            </p>
            <p v-else>
              Tap the link at the bottom of the spot details page to display the
              password for this spot.
            </p>
          </template>
        </ModalContent>

        <ModalContent :image="popup3" v-if="selectedContent === 3">
          <template v-slot:content>
            <p v-if="locale === 'ja'">
              現在のページに、デジタルマップに表示されたパスワードを入力してゲームをプレイ！ポイントを集めて景品をGET！
            </p>
            <p v-else>
              Enter the password displayed on the digital map on the current
              page and play the game! Collect points and get prizes!
            </p>
          </template>
        </ModalContent>

        <div class="!w-full">
          <SolidButton
            :label="selectedContent === 3 ? $t('close') : $t('toTheNext')"
            :on-click="handleNextButton"
            class="!p-0"
          />
        </div>
      </div>
    </template>
  </Modal>

  <Modal
    :is-open="isNotAllowed"
    :on-close="() => handleCloseDialog()"
    :is-hidden-close="checkRadiusFailed || locationBlocked || isHiddenClose"
  >
    <template v-slot:body>
      <div class="w-full flex flex-col justify-center items-center gap-4 py-6">
        <img :src="warning" alt="warning" width="40" height="40" preload />
        <div v-if="errorLink || locationBlocked" class="text-center w-10/12">
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ errorMessages }}
          </p>
        </div>
        <div v-else class="text-center w-10/12">
          <p
            class="font-bold text-exd-1424 text-exd-gray-scorpion vhtml-desc"
            v-html="checkRadiusMessage"
          ></p>
        </div>
      </div>
    </template>
  </Modal>

  <Dialog
    :visible="stepAllowLocation"
    modal
    @update:visible="() => closeStepAllowLocation()"
    class="!rounded-2xl !text-exd-gray-scorpion !bg-white !w-exd-300 !max-w-sm border border-exd-gray-44"
    pt:root:class="!border-none"
    pt:root:style="width: 21rem !important"
    style="
      font-family: -apple-system, 'Noto Sans JP', sans-serif;
      font-size: 1rem;
    "
  >
    <template #container>
      <div
        class="w-full flex flex-col justify-center items-center gap-1.5 py-6 px-6 overflow-hidden relative"
      >
        <!-- <img
          :src="close"
          alt="close"
          width="30"
          height="30"
          preload
          class="absolute right-2 top-3 cursor-pointer z-50"
          @click="() => closeStepAllowLocation()"
        /> -->
        <h3
          class="text-center max-w-[14rem] text-lg font-medium mt-2 flex-none"
        >
          {{ $t('titleChangeLocationSettings') }}
        </h3>
        <div class="flex flex-col flex-1 overflow-y-auto">
          <StepDown number="1">
            <template v-slot:header>
              {{ $t('settingWithPick') }}
            </template>
            <template v-slot:body>
              <img src="/images/apple_settings.webp" class="w-14 h-14" />
              <span class="text-exd-0910">{{ $t('setting') }}</span>
            </template>
          </StepDown>

          <StepDown number="2" type="col">
            <template v-slot:header>
              <span class="text-exd-red-vermilion">
                {{ $t('privacyAndSecurity') }}
              </span>
              {{ $t('littleBelow') }}
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/privacy_and_security.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown number="3" type="col">
            <template v-slot:header>
              <span class="text-exd-red-vermilion">
                {{ $t('locationServices') }}
              </span>
              {{ $t('top') }}
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/location_services.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown
            v-if="getBrowserInfo === 'Apple Safari'"
            number="4"
            type="col"
          >
            <template v-slot:header>
              <span class="text-exd-red-vermilion"
                >{{ $t('safariWebsite') }}
              </span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/safari.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown
            v-else-if="getBrowserInfo === 'Chrome'"
            number="4"
            type="col"
          >
            <template v-slot:header>
              <span class="text-exd-red-vermilion">Chrome </span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/chrome.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown v-else-if="getBrowserInfo === 'Bing'" number="4" type="col">
            <template v-slot:header>
              <span class="text-exd-red-vermilion">Bing </span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/bing.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown
            v-else-if="getBrowserInfo === 'Opera'"
            number="4"
            type="col"
          >
            <template v-slot:header>
              <span class="text-exd-red-vermilion">
                {{ $t('browserEg') }}
              </span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/safari.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown
            v-else-if="getBrowserInfo === 'Firefox'"
            number="4"
            type="col"
          >
            <template v-slot:header>
              <span class="text-exd-red-vermilion">Firefox</span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/firefox.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown v-else-if="getBrowserInfo === 'Edge'" number="4" type="col">
            <template v-slot:header>
              <span class="text-exd-red-vermilion">Edge</span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/edge.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown
            v-else-if="getBrowserInfo === 'Unknown'"
            number="4"
            type="col"
          >
            <template v-slot:header>
              <span class="text-exd-red-vermilion">
                {{ $t('browserEg') }}
              </span>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/safari.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown number="5" type="col">
            <template v-slot:header>
              <i18n-t keypath="changeToWhileUsingApp" tag="div" scope="global">
                <template v-slot:whileUsingApp>
                  <span class="text-exd-red-vermilion">
                    {{ $t('whileUsingApp') }}</span
                  >
                </template>
              </i18n-t>
            </template>
            <template v-slot:body>
              <div class="">
                <img src="/images/while_using_this_app.png" class="w-full" />
              </div>
            </template>
          </StepDown>
          <StepDown number="6" type="col" :isArrow="false">
            <template v-slot:header>
              <i18n-t
                keypath="tapBrowserRefreshToComplete"
                tag="div"
                scope="global"
              >
                <template v-slot:tapBrowserRefresh>
                  <span class="text-exd-red-vermilion">
                    {{ $t('tapBrowserRefresh') }}</span
                  >
                </template>
              </i18n-t>
            </template>
            <template v-slot:body>
              <div class="">
                <img
                  src="/images/tap_the_browser_refresh_button.png"
                  class="w-full"
                />
              </div>
            </template>
          </StepDown>
        </div>
      </div>
    </template>
  </Dialog>

  <div class="overlay" v-if="isRequestingLocation" />
</template>

<script setup>
import warning from '~/assets/images/warning.svg'
import close from '~/assets/images/close.svg'

import HeaderBar from '~/components/HeaderBar.vue'
import ModalContent from '~/components/pages/scan/ModalContent.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import exportIcon from '~/assets/images/export-red.svg'
import popup1 from '~/assets/images/popup-1.png'
import popup2 from '~/assets/images/popup-2.png'
import popup3 from '~/assets/images/popup-3.png'

const value = ref('')
const route = useRoute()
const router = useRouter()
const isNotAllowed = ref(false)
const showModal = ref(false)
const isRequestingLocation = ref(false)
const isLoading = ref(false)
const description = ref(null)
const errorLink = ref(false)
const errorMessages = ref('')
const refsNotes = ref(null)
const isHiddenClose = ref(false)
const locationBlocked = ref(false)
const stepAllowLocation = ref(false)

const config = useRuntimeConfig()

const handleCloseDialog = () => {
  isNotAllowed.value = false
  if (locationBlocked.value) {
    checkingLocation()
  }
}

const { t, locale } = useI18n()

const wrongPassword = ref(false)

const selectedContent = ref(1)
const radiusCheckResult = ref(null)
const checkRadiusFailed = ref(false)
const checkRadiusMessage = ref(null)
const longitude = ref('')
const latitude = ref('')
const isJa = computed(() => locale.value === 'ja')

const { encryptData } = useEncryption()

const checkPassword = async (params) => {
  isLoading.value = true

  try {
    const { data, status } = await useFetchApi('GET', 'gacha/check', {
      params,
    })

    const validPassword = useCookie('VALID_PASSWORD')
    validPassword.value = encryptData(params)

    isLoading.value = false
    return status
  } catch (error) {
    console.log("Error: Can't check password")

    errorLink.value = true
    errorMessages.value = t('wrongPassword')

    wrongPassword.value = true

    setTimeout(() => {
      wrongPassword.value = false
    }, 3000)

    isLoading.value = false
  }
}

const closeStepAllowLocation = () => {
  stepAllowLocation.value = false
  selectedContent.value = 1
}

const handleNextButton = () => {
  let currSelectedContent = selectedContent.value
  if (currSelectedContent > 2) {
    toggleModal()
    return
  }

  selectedContent.value = currSelectedContent += 1
}
const toggleModal = () => {
  selectedContent.value = 1
  showModal.value = !showModal.value
}

const goToScan = async () => {
  const location = route.params.randomCode
  const passwordValue = value.value

  const isTrue = await checkPassword({
    slug: location,
    password: passwordValue,
  })

  if (isTrue) router.push(`/spin/${location}`)
  else isNotAllowed.value = true
}

const getPassword = async (id) => {
  try {
    isLoading.value = true

    const { data } = await useFetchApi('GET', '/location/password/' + id)

    if (data) {
      description.value = data.description
      await checkingLocation()
    }

    isLoading.value = false
  } catch (error) {
    errorLink.value = true
    isHiddenClose.value = true
    errorMessages.value = error._data.message

    isNotAllowed.value = true
  }
}

const onTouchmove = (event) => {
  if (!refsNotes.value.contains(event.target)) {
    event.preventDefault()
  }
}

const radiusCheck = async () => {
  const location = route.params.randomCode
  isLoading.value = true
  try {
    const { data } = await useFetchApi('POST', 'radius-check', {
      body: {
        lat: latitude.value,
        long: longitude.value,
        slug: location,
      },
    })
    radiusCheckResult.value = data
  } catch (error) {
    checkRadiusMessage.value = error?._data.message
    checkRadiusFailed.value = true
    isNotAllowed.value = true
    document.body.style.pointerEvents = 'none'
  } finally {
    isLoading.value = false
  }
}

const checkingLocation = async () => {
  const handleSuccess = (position) => {
    latitude.value = position.coords.latitude
    longitude.value = position.coords.longitude
    // radiusCheck()
    isRequestingLocation.value = false
  }

  const showErrorBlockedLocation = () => {
    const isMobileDevice = navigator.userAgent.toLowerCase().includes('mobi')

    if (
      isMobileDevice &&
      (navigator.userAgent.includes('iPhone') ||
        navigator.userAgent.includes('iPad'))
    ) {
      stepAllowLocation.value = true
      isRequestingLocation.value = false
    } else {
      isRequestingLocation.value = false
      isNotAllowed.value = true
      checkRadiusFailed.value = true
      checkRadiusMessage.value = t('locationAccessBlocked')
    }
  }

  const handleError = (error) => {
    console.log('Geolocation error:', error)
    showErrorBlockedLocation()
  }

  const handleDenied = () => {
    showErrorBlockedLocation()
  }

  const checkGeolocationSupport = () => {
    return 'geolocation' in navigator
  }

  const requestLocation = () => {
    isRequestingLocation.value = true
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }

  if ('permissions' in navigator) {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      })

      switch (permissionStatus.state) {
        case 'granted':
          isRequestingLocation.value = false
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
          break
        case 'prompt':
          if (checkGeolocationSupport()) requestLocation()
          break
        case 'denied':
          handleDenied()
          break
      }

      // Listen for changes to the permission status
      permissionStatus.onchange = () => {
        if (permissionStatus.state === 'granted') {
          isRequestingLocation.value = false
        } else if (permissionStatus.state === 'denied') {
          handleDenied()
        }
      }
    } catch (error) {
      console.error('Permission query error:', error)
    }
  } else if (checkGeolocationSupport()) {
    requestLocation()
  } else {
    isNotAllowed.value = true
  }
}

const getBrowserInfo = computed(() => {
  const userAgent = navigator.userAgent

  if (userAgent.indexOf('Firefox') > -1 || userAgent.indexOf('FxiOS') > -1) {
    return 'Firefox'
  } else if (
    userAgent.indexOf('Opera') > -1 ||
    userAgent.indexOf('OPR') > -1 ||
    userAgent.indexOf('OPT') > -1
  ) {
    return 'Opera'
  } else if (
    userAgent.indexOf('Chrome') > -1 ||
    userAgent.indexOf('CriOS') > -1
  ) {
    return 'Chrome'
  } else if (userAgent.indexOf('BingSapphire') > -1) {
    return 'Bing'
  } else if (userAgent.indexOf('EdgiOS') > -1) {
    return 'Edge'
  } else if (userAgent.indexOf('Safari') > -1) {
    return 'Apple Safari'
  } else {
    return 'Unknown'
  }
})

onMounted(async () => {
  const location = route.params.randomCode
  await getPassword(location)
})

watch(isNotAllowed, (newValue) => {
  if (newValue) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})
</script>

<style scoped>
::v-deep(.p-inputtext) {
  @apply border border-exd-gray-44 bg-white w-exd-40 h-exd-50 text-exd-gray-scorpion;
}

::v-deep(.p-dialog-header) {
  @apply hidden;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

:global(body.modal-open) {
  pointer-events: none;
}

:global(body.modal-open .p-dialog) {
  pointer-events: auto;
}

/* @media screen and (max-width: 460px) { */

@media screen and (max-height: 500px) and (max-width: 320px) {
  .scan-otp {
    padding-top: 40px !important;
    padding-bottom: 20px !important;
  }

  .uiHeight {
    max-height: 98px !important;
  }
}

@media screen and (max-height: 600px) {
  .header {
    font-size: 15px;
  }

  .scan-content {
    font-size: 12px;
  }

  .scan-otp {
    padding-top: 50px;
    padding-bottom: 30px;
  }

  .password-inform {
    padding: 10px;
    font-size: 8.5px;
  }

  .scan-title {
    font-size: 13px;
  }

  .uiHeight {
    max-height: 170px;
  }

  .uiHeight li {
    font-size: 10px;
  }
}

@media screen and (min-height: 600px) and (max-width: 360px) {
  .uiHeight {
    max-height: 110px !important;
  }
}

@media screen and (min-height: 600px) {
  .uiHeight {
    max-height: 150px;
  }
}

@media screen and (min-height: 700px) {
  .uiHeight {
    max-height: 190px;
  }
}

@media screen and (min-height: 740px) {
  .uiHeight {
    max-height: 190px;
  }
}

@media screen and (min-height: 800px) {
  .uiHeight {
    max-height: 270px;
  }
}

@media screen and (min-height: 860px) {
  .uiHeight {
    max-height: 330px;
  }
}

@media screen and (min-height: 900px) {
  .uiHeight {
    max-height: 370px;
  }
}

@media screen and (min-height: 960px) {
  .uiHeight {
    max-height: 390px;
  }
}

@media screen and (min-height: 1000px) {
  .uiHeight {
    max-height: 430px;
  }
}

@media screen and (min-height: 1050px) {
  .uiHeight {
    max-height: 450px;
  }
}

@media screen and (min-height: 1100px) {
  .uiHeight {
    max-height: 480px;
  }
}

@media screen and (min-height: 1150px) {
  .uiHeight {
    max-height: 570px;
  }
}

@media screen and (min-height: 1200px) {
  .uiHeight {
    max-height: 670px;
  }
}
/* } */
</style>
