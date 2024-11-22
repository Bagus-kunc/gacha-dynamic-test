<template>
  <HeaderBar hasBack>
    <p
      v-if="type === 'a'"
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('chooseDigitalGift') }}
    </p>
    <p
      v-if="type === 'b'"
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('enterYourMailing') }}
    </p>
  </HeaderBar>

  <div class="flex flex-col bg-center text-black h-auto">
    <div
      class="relative w-full bg-white border border-gray-200 border-b-0 overflow-y-auto px-3"
    >
      <div class="w-full flex items-center justify-center text-[15px]">
        <h1
          v-if="type === 'a'"
          class="text-center flex text-exd-gray-scorpion pt-32 pb-10 w-full max-w-[270px] mx-auto font-bold"
        >
          {{ $t('chooseYourDesired') }}
        </h1>
        <h1
          v-if="type === 'b'"
          class="text-center flex flex-col text-exd-gray-scorpion w-full max-w-[360px] pt-32 pb-10 font-bold"
        >
          {{ $t('deliveryAddress') }}
        </h1>
      </div>
      <div class="w-full flex flex-col gap-10">
        <div v-if="type === 'a'" class="px-5 !text-exd-1424 font-bold">
          <Dropdown
            :model="form.gift"
            @update:model="updateModel('gift', $event)"
            @validate="validateInput('gift', $event)"
            :options="getGiftType()"
            optionValue="value"
            optionLabel="label"
            class="font-bold text-[15px]"
            :hasHelper="true"
          />
        </div>
        <div
          v-if="type === 'b'"
          class="flex flex-col grow text-[19px] font-bold !text-exd-1624"
        >
          <div
            class="inline-flex gap-4 border-b border-b-exd-light-grey pb-5 px-5"
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
            />
            <InputText
              bold
              :model="form.givenName"
              :label="$t('givenName')"
              required
              :is-nick-name="true"
              @update:model="updateModel('givenName', $event)"
              @validate="validateInput('givenName', $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                !form.givenName && validateOnSubmit ? $t('fieldRequired') : ''
              "
              :class="{
                'input-error': !form.givenName && validateOnSubmit,
              }"
            />
          </div>

          <div
            class="inline-flex gap-4 border-b border-b-exd-light-grey py-5 px-5 flex-col"
          >
            <div class="">
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
              />
            </div>
            <p class="text-exd-1320 text-exd-gray-scorpion font-normal">
              {{ t('postalCodeInformation') }}
            </p>
          </div>

          <div
            class="inline-flex gap-4 border-b border-b-exd-light-grey py-5 px-5 flex-col"
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
            />
            <p class="text-exd-1320 text-exd-gray-scorpion font-normal">
              {{ t('streetAddressInformation') }}
            </p>
          </div>

          <div
            class="inline-flex gap-4 border-b border-b-exd-light-grey py-5 px-5 flex-col"
          >
            <div class="max-w-[270px]">
              <InputText
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
                :maxLength="11"
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
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5 pb-10">
          <div
            v-if="type"
            class="relative bg-exd-banana flex flex-col gap-2 items-center justify-center pb-8"
          >
            <div
              class="relative max-w-[220pt] -top-3 bg-exd-orange-700 text-white px-5 py-1"
            >
              <p
                class="text-[15px] font-medium small:text-[13px] extraSmall:text-[10px] text-center"
                v-html="$t('evenIfYouDontWin')"
              ></p>
              <span class="triangle absolute left-[48%]"></span>
            </div>
            <div
              class="flex flex-col justify-center text-exd-gray-scorpion font-medium text-exd-1424 px-4 gap-2"
            >
              <div class="flex flex-col text-[15px] text-center font-bold">
                <p v-html="$t('500people')"></p>
                <p v-html="$t('500people2')"></p>
                <p v-if="type === 'b'">{{ t('selectDigitalGift') }}</p>
              </div>

              <div v-if="type === 'b'" class="w-auto">
                <Dropdown
                  :model="form.gift"
                  @update:model="updateModel('gift', $event)"
                  @validate="validateInput('gift', $event)"
                  :options="getGiftType()"
                  optionValue="value"
                  optionLabel="label"
                  :hasHelper="true"
                  class="font-bold text-[15px] small:text-[14px] extraSmall:text-[13px]"
                  bgWhite
                />
              </div>

              <p class="font-normal text-[13px]">
                {{ t('winnerWillBeContact') }}
              </p>
            </div>
          </div>

          <div
            v-if="type === 'a'"
            class="flex flex-col text-justify px-5 text-exd-gray-scorpion mb-20 text-exd-1424 leading-7 font-semibold"
          >
            <p>{{ t('afterTheLotery') }}</p>
            <p>{{ t('makeSureEmail') }}</p>
          </div>
          <div
            v-if="type === 'b'"
            class="flex flex-col text-justify px-5 text-exd-gray-scorpion mb-20 text-exd-1424 leading-7 font-semibold"
          >
            <p>{{ t('afterTheLottery') }}</p>
            <p>{{ t('theWinnerW') }}</p>
            <p>{{ t('pleaseSetYourEmail') }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- :disabled="disableRedeem || isFetching" -->
    <div class="fixed bottom-0 w-full max-w-md mx-auto px-8 mb-1 z-50">
      <SolidButton
        :label="$t('applyNow')"
        :has-loading="isLoading"
        :disabled="isLoading"
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
        class="absolute right-1 top-1 cursor-pointer z-50"
        @click="handleToggleModal"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-1 px-5 py-8 my-2"
      >
        <p
          class="text-exd-gray-scorpion font-bold text-center text-1416 small:w-[105%] w-[93%] max-w-w-[93%]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('thePrizeWillBeAwarded') }}
        </p>
        <p class="text-exd-gray-scorpion text-center text-1416">
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
import arrow from '~/assets/images/arrow.svg'
import close from '~/assets/images/close.svg'
import { store } from '~/stores/dashboard.js'
import Dropdown from '~/components/Dropdown.vue'
import InputText from '~/components/InputText.vue'
import JapanPostalCode from 'japan-postal-code'

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

const form = ref({
  gift: 'amazon',
  lastName: '',
  givenName: '',
  phoneNumber: '',
  address: '',
  postCode: '',
  prefecture: '',
  municipalities: '',
  streetAddressEtc: '',
})

const fetchingPrizeData = async () => {
  try {
    const { data } = await useFetchApi('GET', 'prizes/' + id)
    sessionStorage.setItem('type', data.type)
    type.value = data.type
  } catch (error) {
    console.log(error)
  }
}

const getGiftType = () => [
  { value: 'amazon', label: t('amazonGift') },
  { value: 'quo', label: t('quoGift') },
]

const updateModel = (field, value) => {
  form.value[field] = value
}

const validateInput = (field, value) => {
  //console.log(`Validated ${field}:`, value)
  if (field === 'phoneNumber') {
    if (
      form.value.phoneNumber.length < 10 ||
      form.value.phoneNumber.length > 11
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
    'givenName',
    'phoneNumber',
    'postCode',
    'prefecture',
    'municipalities',
    'streetAddressEtc',
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
    form.value.phoneNumber.length > 11
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
    prize_options: form.value.gift,
  }

  if (type.value === 'b') {
    payload.last_name = form.value.lastName
    payload.first_name = form.value.givenName
    payload.postal_code = form.value.postCode
    payload.prefecture = form.value.prefecture
    payload.city = form.value.municipalities
    payload.address = form.value.streetAddressEtc
    payload.phone_number = form.value.phoneNumber
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
