<template>
  <HeaderBar hasBack>
    <div v-if="!type" class="flex justify-center">
      <Skeleton class="!w-32 !h-6 bg-gray-200" />
    </div>
    <p
      v-if="type === 'a'"
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('enteringInformation') }}
    </p>
    <p
      v-if="type === 'b'"
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('enterYourMailing') }}
    </p>
  </HeaderBar>

  <div class="flex flex-col h-auto text-black bg-center">
    <div
      class="relative w-full px-3 mb-24 overflow-y-auto bg-white border border-b-0 border-gray-200"
    >
      <div class="w-full flex items-center justify-center text-[15px]">
        <h1
          v-if="type === 'a'"
          class="flex justify-center w-full pt-32 pb-10 font-bold text-exd-gray-scorpion"
        >
          {{ $t('enterYourInformation') }}
        </h1>
        <h1
          v-if="type === 'b'"
          class="flex justify-center w-full pt-32 pb-10 font-bold text-exd-gray-scorpion"
        >
          {{ $t('deliveryAddress') }}
        </h1>
        <div v-if="!type" class="flex justify-center pt-32">
          <Skeleton class="!w-44 !h-6 bg-gray-200" />
        </div>
      </div>
      <div class="flex flex-col w-full gap-10">
        <div class="flex flex-col grow text-[19px] font-bold !text-exd-1624">
          <div
            v-if="type"
            class="inline-flex gap-4 px-5 pb-5 border-b border-b-exd-light-grey"
          >
            <InputText
              bold
              :model="form.lastName"
              :label="$t('lastName')"
              required
              @update:model="updateModel('lastName', $event)"
              @validate="validateInput('lastName', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.lastName && validateOnSubmit ? $t('fieldRequired') : ''
              "
              :class="{
                'input-error': !form.nickName && validateOnSubmit,
              }"
              :border="true"
            />
            <InputText
              bold
              :model="form.firstName"
              :label="$t('firstName')"
              required
              :is-nick-name="true"
              @update:model="updateModel('firstName', $event)"
              @validate="validateInput('firstName', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.firstName && validateOnSubmit ? $t('fieldRequired') : ''
              "
              :class="{
                'input-error': !form.firstName && validateOnSubmit,
              }"
              :border="true"
            />
          </div>

          <div
            v-else
            class="inline-flex gap-4 px-5 pb-5 mt-10 border-b border-b-exd-light-grey"
          >
            <Skeleton class="!w-56 !h-10 bg-gray-200" />
            <Skeleton class="!w-56 !h-10 bg-gray-200" />
          </div>

          <div
            v-if="type === 'b'"
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
            <div class="max-w-[270px]">
              <InputText
                onlyNumeric
                bold
                :model="form.postCode"
                required
                :label="$t('postalCodeNoHyphens')"
                :disabled="isLoadingPostalCode"
                @update:model="
                  ($event) => {
                    updateModel('postCode', $event)
                    checkPostalCode($event)
                  }
                "
                @validate="validateInput('postCode', $event)"
                :validate-on-submit="validateOnSubmit"
                :error="
                  !form.postCode && validateOnSubmit
                    ? $t('fieldRequired')
                    : '' ||
                      (form.postCode.length > 0 && form.postCode.length < 7)
                    ? $t('minLengthPostalCode')
                    : '' || errorPostCodeMessage
                "
                :class="{
                  'input-error':
                    (!form.postCode && validateOnSubmit) ||
                    (form.postCode.length > 0 && form.postCode.length < 7) ||
                    errorPostCodeMessage,
                  'opacity-50': isLoadingPostalCode,
                }"
                :border="true"
              />
            </div>
            <p class="font-normal text-exd-1320 text-exd-gray-scorpion">
              {{ t('postalCodeInformation') }}
            </p>
          </div>

          <div
            v-if="type === 'b'"
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
            <InputText
              bold
              :model="form.prefecture"
              required
              :label="$t('prefecture')"
              disabled
              @update:model="
                ($event) => {
                  updateModel('prefecture', $event)
                  checkPostalCode($event)
                }
              "
              @validate="validateInput('prefecture', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.prefecture && validateOnSubmit ? $t('fieldRequired') : ''
              "
              :class="{
                'input-error': !form.prefecture && validateOnSubmit,
              }"
              :border="true"
            />

            <InputText
              bold
              :model="form.municipalities"
              disabled
              required
              :label="$t('municipalities')"
              @update:model="
                ($event) => {
                  updateModel('municipalities', $event)
                  checkPostalCode($event)
                }
              "
              @validate="validateInput('municipalities', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.municipalities && validateOnSubmit
                  ? $t('fieldRequired')
                  : ''
              "
              :class="{
                'input-error': !form.municipalities && validateOnSubmit,
              }"
              :border="true"
            />

            <InputText
              bold
              :model="form.streetAddressEtc"
              required
              :label="$t('streetAddressEtc')"
              @update:model="
                ($event) => {
                  updateModel('streetAddressEtc', $event)
                }
              "
              @validate="validateInput('streetAddressEtc', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.streetAddressEtc && validateOnSubmit
                  ? $t('fieldRequired')
                  : ''
              "
              :class="{
                'input-error': !form.streetAddressEtc && validateOnSubmit,
              }"
              :border="true"
            />
            <p class="font-normal text-exd-1320 text-exd-gray-scorpion">
              {{ t('streetAddressInformation') }}
            </p>
          </div>

          <div
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
            <div class="max-w-[270px]">
              <InputText
                v-if="type"
                type="number"
                bold
                :model="form.phoneNumber"
                required
                :label="$t('phoneNumberNoHyphens')"
                @update:model="
                  ($event) => {
                    updateModel('phoneNumber', $event)
                  }
                "
                @validate="validateInput('phoneNumber', $event)"
                :maxLength="12"
                :validate-on-submit="validateOnSubmit"
                :error="
                  !form.phoneNumber && validateOnSubmit
                    ? $t('fieldRequired')
                    : '' || errorPhoneNumber
                "
                :class="{
                  'input-error':
                    (!form.phoneNumber && validateOnSubmit) || errorPhoneNumber,
                }"
                :border="true"
              />
              <Skeleton v-else class="!w-56 !h-10 bg-gray-200" />
            </div>
          </div>

          <div
            v-if="type === 'a'"
            class="inline-flex gap-4 px-4 py-5 border-b border-b-exd-light-grey"
          >
            <InputText
              type="email"
              :model="form.email"
              required
              :label="$t('emailAddress')"
              @update:model="updateModel('email', $event)"
              @validate="validateInput('email', $event)"
              :validate-on-submit="validateOnSubmit"
              :is-email-error="true"
              hasHelper
              :error="
                !form.email && validateOnSubmit
                  ? t('fieldRequired')
                  : '' || (form.email && !emailRegex(form.email))
                  ? t('emailFormat')
                  : errorEmailMessage
              "
              :class="{
                'input-error':
                  !form.email && validateOnSubmit
                    ? t('fieldRequired')
                    : '' || (form.email && !emailRegex(form.email))
                    ? t('emailFormat')
                    : errorEmailMessage,
              }"
              :border="true"
            />
          </div>

          <div
            class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
          >
            <template v-if="!type">
              <Skeleton width="10rem" height="1rem" class="mb-2 bg-gray-200" />
              <div class="flex flex-col gap-2">
                <Skeleton
                  v-for="n in 3"
                  :key="n"
                  width="100%"
                  height="1.5rem"
                  class="bg-gray-200"
                />
              </div>
            </template>
            <template v-else>
              <RadioButton
                :label="$t('questionnaire1')"
                v-model="form.questionnaire1"
                :options="questionnaire1Options"
                name="questionnaire1"
                :error="
                  !form.questionnaire1 && validateOnSubmit
                    ? $t('fieldRequired')
                    : ''
                "
                required
              />
            </template>
          </div>

          <div
            class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
          >
            <template v-if="!type">
              <Skeleton width="10rem" height="1rem" class="mb-2 bg-gray-200" />
              <div class="flex flex-col gap-2">
                <Skeleton
                  v-for="n in 3"
                  :key="n"
                  width="100%"
                  height="1.5rem"
                  class="bg-gray-200"
                />
              </div>
            </template>
            <template v-else>
              <RadioButton
                :label="$t('questionnaire2')"
                v-model="form.questionnaire2"
                :options="questionnaire2Options"
                name="questionnaire2"
                :error="
                  !form.questionnaire2 && validateOnSubmit
                    ? $t('fieldRequired')
                    : ''
                "
                required
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 z-50 w-full max-w-md px-8 mx-auto mb-1">
      <SolidButton
        :label="$t('applyNow')"
        :has-loading="isLoading"
        :disabled="isLoading"
        variant="red-coral"
        :on-click="handleSubmit"
        has-bottom
      />
    </div>
  </div>

  <Dialog
    v-model:visible="hasModal"
    modal
    class="!bg-white w-11/12 md:!w-5/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleToggleModal"
      />
      <div
        class="flex flex-col items-center justify-center w-full gap-1 px-5 py-8 my-2"
      >
        <p
          class="text-exd-gray-scorpion font-bold text-center text-1416 small:w-[105%] w-[93%] max-w-w-[93%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('thePrizeWillBeAwarded') }}
        </p>
        <p class="text-center text-exd-gray-scorpion text-1416">
          {{ $t('winnerWillBeNotifed') }}
        </p>
      </div>

      <div class="py-3">
        <SolidButton
          :label="$t('applyNow')"
          :on-click="handleGoToClaim"
          has-bottom
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import close from '~/assets/images/close.svg'
import { store } from '~/stores/dashboard.js'
import Dropdown from '~/components/Dropdown.vue'
import InputText from '~/components/InputText.vue'
import JapanPostalCode from 'japan-postal-code'
import {
  questionnaire1Options,
  questionnaire2Options,
} from '~/data/questionnaire'
import RadioButton from '~/components/RadioButton.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const type = ref('')
const map = ref(null)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const id = route.params.id
const hasModal = ref(false)
const errorScroll = ref([])
const isLoading = ref(false)
const errorMessages = ref([])
const LOCALE = useCookie('LOCALE')
const validateOnSubmit = ref(false)
const isLoadingPostalCode = ref(false)

const handleToggleModal = () => (hasModal.value = !hasModal.value)
const handleGoToClaim = () => router.push(`/claim/${route.params.id}`)
const errorKeyPostCode = ref('')
const errorPostCodeMessage = computed(() => t(errorKeyPostCode.value))
const errorPhoneNumber = ref('')
const errorEmailMessage = ref('')

const form = ref({
  lastName: '',
  firstName: '',
  phoneNumber: '',
  address: '',
  postCode: '',
  prefecture: '',
  municipalities: '',
  streetAddressEtc: '',
  questionnaire1: '',
  questionnaire2: '',
})

const emailRegex = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const fetchingPrizeData = async () => {
  try {
    const { data } = await useFetchApi('GET', 'prizes/' + id)
    sessionStorage.setItem('type', data.type)
    type.value = data.type

    isFetching.value = false
  } catch (error) {
    console.log(error)
  }
}

const updateModel = (field, value) => {
  form.value[field] = value
}

const validateInput = (field, value) => {
  if (field === 'phoneNumber') {
    if (
      form.value.phoneNumber.length < 10 ||
      form.value.phoneNumber.length > 12
    ) {
      errorPhoneNumber.value = t('validPhoneNumber')
    } else {
      errorPhoneNumber.value = ''
    }
  }
}

const handleApiError = (error) => {
  errorScroll.value = []

  const response = error._data?.errors

  if (response) {
    const message = Object.keys(response).map((item) => {
      return Array.isArray(response[item]) && response[item]?.[0]
        ? response[item][0]
        : 'Unknown error'
    })

    errorScroll.value = message
    errorMessages.value.push(response)
    console.log('errorMessages', errorMessages.value)
  }
}

const validateForm = () => {
  const requiredFields = [
    'lastName',
    'firstName',
    'phoneNumber',
    'postCode',
    'prefecture',
    'municipalities',
    'streetAddressEtc',
    'questionnaire1',
    'questionnaire2',
  ]

  for (const field of requiredFields) {
    if (!form.value[field]) {
      console.log('Field must be filled:', field)
      return false
    }
  }

  if (form.value.postCode.length < 7) {
    errorKeyPostCode.value = 'minLengthPostalCode'
    return false
  }

  if (
    form.value.phoneNumber.length < 10 ||
    form.value.phoneNumber.length > 12
  ) {
    errorPhoneNumber.value = t('validPhoneNumber')
    return false
  }

  errorKeyPostCode.value = ''
  errorPhoneNumber.value = ''

  return true
}

const fetchRedeem = async (payload) => {
  errorMessages.value = []
  isLoading.value = true

  try {
    const { status, data } = await useFetchApi('POST', 'prizes/redeem', {
      body: payload,
    })

    if (!status) {
      throw new Error(t('unexpectedResponse'))
    }

    navigateTo('/redeem/complete')
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

const buildPayload = () => {
  const payload = {
    prize_id: id,
    last_name: form.value.lastName,
    first_name: form.value.firstName,
    phone_number: form.value.phoneNumber,
    email: form.value.email,
    find_event: form.value.questionnaire1,
    coming_purpose: form.value.questionnaire2,
  }

  if (type.value === 'b') {
    payload.postal_code = form.value.postCode
    payload.prefecture = form.value.prefecture
    payload.city = form.value.municipalities
    payload.address = form.value.streetAddressEtc
  }
  return payload
}

const handleSubmit = async () => {
  errorScroll.value = []

  isLoading.value = true

  validateOnSubmit.value = true

  const payload = buildPayload()
  if (type.value === 'b') {
    if (validateForm()) {
      await fetchRedeem(payload)
    } else {
      isLoading.value = false
    }
  } else {
    await fetchRedeem(payload)
  }

  if (errorScroll.value.length > 0) {
    await nextTick()
    const firstErrorElement = document.querySelector('.input-error')
    if (firstErrorElement) {
      firstErrorElement.style.paddingTop = '80px'
      firstErrorElement.style.marginTop = '-80px'

      firstErrorElement.scrollIntoView({ behavior: 'smooth' })

      setTimeout(() => {
        firstErrorElement.style.paddingTop = ''
        firstErrorElement.style.marginTop = ''
      }, 3000)
    }
  }
}

let postCodeBounds

const checkPostalCode = async (code) => {
  if (!code || code.length < 7) {
    form.value.prefecture = ''
    form.value.municipalities = ''
    if (code && code.length > 0 && code.length < 7) {
      errorKeyPostCode.value = 'minLengthPostalCode'
    } else {
      errorKeyPostCode.value = ''
    }
    return
  }

  isLoadingPostalCode.value = true

  if (postCodeBounds) {
    clearTimeout(postCodeBounds)
  }

  try {
    const address = await new Promise((resolve, reject) => {
      postCodeBounds = setTimeout(() => {
        reject(new Error('Request timeout: Postal code not found'))
      }, 2000)

      JapanPostalCode.get(code, function (address) {
        clearTimeout(postCodeBounds)

        if (!address || !address.prefecture || !address.city || !address.area) {
          errorKeyPostCode.value = 'postalCodeNotFound'
          reject(new Error('Invalid postal code or incomplete address data'))
        } else {
          resolve(address)
        }
      })
    })

    form.value.prefecture = address.prefecture
    form.value.municipalities = `${address.city}, ${address.area}`
    errorKeyPostCode.value = ''
  } catch (error) {
    console.error('Postal code error:', error)
    form.value.prefecture = ''
    form.value.municipalities = ''

    if (error.message.includes('timeout')) {
      errorKeyPostCode.value = 'postalCodeNotFound'
    }
  } finally {
    isLoadingPostalCode.value = false
  }
}

onMounted(async () => {
  await fetchingPrizeData()
  type.value = route.query.type
})
</script>

<style>
.opacity-50 {
  opacity: 0.5;
  pointer-events: none;
}

.scrollable-content::-webkit-scrollbar {
  display: block !important;
  width: 7px !important;
}

.scrollable-content::-webkit-scrollbar-track {
  display: block !important;
  margin-block: 10px;
  background: #f1f1f1 !important;
  border-radius: 10px !important;
}

.scrollable-content::-webkit-scrollbar-thumb {
  display: block !important;
  height: 30px !important;
  background: #d7a237 !important;
  border-radius: 10px !important;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  display: block !important;
  background: #555 !important;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 15px solid #d44d20;
}

.highlight {
  color: #d44d20;
}

.font-event {
  font-size: 14px;
}

.font-style {
  font-size: 20px;
}
</style>
