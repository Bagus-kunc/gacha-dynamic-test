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
      <div class="flex flex-col px-3 grow">
        <div
          v-for="(item, index) in visibleRedeemFields"
          :key="index"
          class="!w-full p-0"
        >
          <div
            v-if="item.show"
            class="gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
            <InputText
              v-if="
                item.type !== 'checkbox' &&
                item.type !== 'date' &&
                item.type !== 'select_button' &&
                item.type !== 'radio' &&
                item.type !== 'dropdown' &&
                item.type !== 'textarea'
              "
              :onlyNumeric="
                item.name === 'postal_code' ||
                item.text_type === 'number' ||
                item.text_type === 'tel'
                  ? true
                  : false
              "
              :type="item.text_type"
              :model="form[item.name]"
              :label="item.label"
              :required="item.required"
              :placeholder="item.placeholder"
              @update:model="
                ($event) => {
                  updateModel(item.name, item.type, $event)
                  if (item.name === 'postal_code') {
                    checkPostalCode($event)
                  }
                }
              "
              @validate="validateInput(item.name, $event)"
              :validate-on-submit="validateOnSubmit"
              :error="
                handleError(item.name, item.required, item?.min, item?.max)
              "
              hasHelper
              :class="{
                'input-error': handleError(
                  item.name,
                  item.required,
                  item?.min,
                  item?.max
                ),
              }"
              :w230Px="
                item.name === 'phone_number' || item.name === 'postal_code'
                  ? true
                  : false
              "
              :border="true"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
            />

            <p
              v-if="item.name === 'postal_code'"
              class="mt-2 font-normal text-exd-1320 text-exd-gray-scorpion"
            >
              {{ t('postalCodeInformation') }}
            </p>

            <GenderSelection
              v-if="item.type === 'select_button'"
              v-model="form[item.name]"
              :label="item.label"
              :required="item.required"
              :options="optionsMap(item.options)"
              :bg-color="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :text-color="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
            />

            <InputDate
              v-if="item.type === 'date'"
              :label="item.label"
              :placeholder="item.placeholder"
              :required="item.required"
              v-model:model="form[item.name]"
              :error="handleError(item.name, item.required)"
              @update:model="updateModel(item.name, item.type, $event)"
              :manualInput="false"
              :class="{
                'input-error': handleError(item.name, item.required),
              }"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
              border
            />

            <InputTextArea
              v-show="item?.type === 'textarea'"
              v-model:model="form[item.name]"
              :label="item.label"
              :placeholder="item.placeholder"
              :required="item.required"
              @validate="validateInput(item.name, $event)"
              :error="
                handleError(item.name, item.required, item?.min, item?.max)
              "
              :validate-on-submit="validateOnSubmit"
              :class="{
                'input-error': handleError(
                  item.name,
                  item.required,
                  item?.min,
                  item?.max
                ),
              }"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
            />

            <RadioButton
              v-if="item?.type === 'radio'"
              :label="item.label || ''"
              v-model="form[item.name]"
              @update:modelValue="updateModel(item.name, item.type, $event)"
              :options="optionsMap(item.options)"
              :error="handleError(item.name, item.required)"
              :class="{
                'input-error': handleError(item.name, item.required),
              }"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
              :required="item.required"
            />

            <Dropdown
              v-if="item?.type === 'dropdown'"
              :model="form[item.name]"
              @update:model="updateModel(item.name, item.type, $event)"
              @validate="validateInput(item.name, $event)"
              :label="item.label"
              :options="optionsMap(item.options)"
              optionValue="value"
              optionLabel="label"
              :placeholder="item.placeholder"
              :hasHelper="true"
              :validate-on-submit="validateOnSubmit"
              :error="handleError(item.name, item.required)"
              :class="{
                'input-error': handleError(item.name, item.required),
              }"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
            />

            <InputMultipleSelect
              v-if="item?.type === 'checkbox'"
              :label="item.label"
              :placeholder="item.placeholder"
              :required="item.required"
              v-model:model="form[item.name]"
              @validate="validateInput(item.name, $event)"
              :options="optionsMap(item.options)"
              :error="handleError(item.name, item.required)"
              :validate-on-submit="validateOnSubmit"
              @update:model="updateModel(item.name, item.type, $event)"
              :class="{
                'input-error': handleError(item.name, item.required),
              }"
              :bgColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.background
              "
              :textColor="
                settings?.register_login?.membership_registration_page
                  ?.button_text_and_color?.color
              "
            />
          </div>

          <template
            v-if="
              item.name === 'postal_code' && item.prefecture_and_municipality
            "
          >
            <div
              class="inline-flex flex-col w-full gap-4 px-5 py-5 border-b border-b-exd-light-grey"
            >
              <InputText
                :model="form.prefecture"
                required
                :label="item.prefecture.label || $t('prefecture')"
                :placeholder="item.prefecture.placeholder || $t('prefecture')"
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
                  !form.prefecture && validateOnSubmit
                    ? $t('fieldRequired')
                    : ''
                "
                :class="{
                  'input-error': !form.prefecture && validateOnSubmit,
                }"
                :border="true"
                :bgColor="
                  settings?.register_login?.membership_registration_page
                    ?.button_text_and_color?.background
                "
                :textColor="
                  settings?.register_login?.membership_registration_page
                    ?.button_text_and_color?.color
                "
              />

              <InputText
                :model="form.municipality"
                disabled
                required
                :label="item.municipality.label || $t('municipality')"
                :placeholder="
                  item.municipality.placeholder || $t('municipality')
                "
                @update:model="
                  ($event) => {
                    updateModel('municipality', $event)
                    checkPostalCode($event)
                  }
                "
                @validate="validateInput('municipality', $event)"
                :validate-on-submit="validateOnSubmit"
                :error="
                  !form.municipality && validateOnSubmit
                    ? $t('fieldRequired')
                    : ''
                "
                :class="{
                  'input-error': !form.municipality && validateOnSubmit,
                }"
                :border="true"
                :bgColor="
                  settings?.register_login?.membership_registration_page
                    ?.button_text_and_color?.background
                "
                :textColor="
                  settings?.register_login?.membership_registration_page
                    ?.button_text_and_color?.color
                "
              />
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 z-50 w-full max-w-md px-8 mx-auto mb-1">
      <SolidButton
        :label="$t('applyNow')"
        :has-loading="isLoading"
        :disabled="disableRedeem || isLoading"
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
import JapanPostalCode from 'japan-postal-code'
import Dropdown from '~/components/Dropdown.vue'
import InputText from '~/components/InputText.vue'
import InputTextArea from '~/components/InputTextArea.vue'
import RadioButton from '~/components/RadioButton.vue'
import InputMultipleSelect from '~/components/InputMultipleSelect.vue'

definePageMeta({
  // middleware: ['auth', 'navigation-guard'],
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
const isFetching = ref(false)
const errorMessages = ref([])
const disableRedeem = ref(false)
const LOCALE = useCookie('LOCALE')
const validateOnSubmit = ref(false)
const isLoadingPostalCode = ref(false)
const settings = useState('settings')

const handleToggleModal = () => {
  if (disableRedeem.value) return
  hasModal.value = !hasModal.value
}
const handleGoToClaim = () => router.push(`/claim/${route.params.id}`)
const errorKeyPostCode = ref('')
const errorPostCodeMessage = computed(() => t(errorKeyPostCode.value))
const errorPhoneNumber = ref('')
const errorEmailMessage = ref('')
const errorPasswordMessage = ref('')

const form = ref({})

const emailRegex = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const registerFields =
  settings.value?.prize?.step_2?.data?.redeem_prize_form || []

const visibleRedeemFields = computed(() =>
  registerFields
    .map((item) => {
      const name = Object.keys(item)[0]
      const fieldData = item[name]
      return {
        name,
        ...fieldData,
      }
    })
    .filter((field) => field.show)
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: config.public.TIME_ZONE,
  })
}

const optionsMap = (rawOptions) => {
  if (!rawOptions || typeof rawOptions !== 'object') return []

  return Object.entries(rawOptions)
    .filter(([value, label]) => !!value && !!label)
    .map(([value, label]) => ({
      label,
      value,
    }))
}

const updateModel = (field, type, value) => {
  form.value[field] = value

  if (type === 'date') {
    form.value[field] = formatDate(value)
  }

  if (field === 'password') {
    passwordValidate()
  }
}

const handleError = (field, required, min, max) => {
  const value = form.value[field] || ''

  if (!value && validateOnSubmit.value && required) {
    return t('fieldRequired')
  }

  if (min && value.length > 0 && value.length < min) {
    return t('minLength', { number: min })
  }

  if (max && value.length > max) {
    return t('maxLength', { number: max })
  }

  if (field === 'email') {
    if (value && !emailRegex(value)) {
      return t('emailFormat')
    } else if (errorEmailMessage.value) {
      return errorEmailMessage.value
    }
  }

  if (field === 'password') {
    if (!value) return ''

    if (value?.length < 8) {
      return t('passwordMin')
    }

    if (!alphanumericRegex.test(value)) {
      return t('validPassword')
    }
  }

  if (field === 'password_confirmation') {
    if (value && value !== form.value.password) {
      return t('passwordNotMatch')
    }
  }

  if (field === 'postal_code') {
    if (value?.length > 0 && value?.length < 7) {
      return t('minLengthPostalCode')
    } else if (errorPostCodeMessage.value) {
      return errorPostCodeMessage.value
    }
  }

  if (field === 'phone_number') {
    return errorPhoneNumber.value
  }

  return ''
}

const passwordValidate = () => {
  const password = form.value.password
  const alphanumericRegex = /^[a-zA-Z0-9]{8,}$/

  if (password?.length > 0 && password?.length < 8) {
    errorPasswordMessage.value = 'passwordMin'
  } else if (!alphanumericRegex.test(password)) {
    errorPasswordMessage.value = 'validPassword'
  } else {
    errorPasswordMessage.value = ''
  }
}

const validateForm = () => {
  const requiredFields = []
  let isValid = true

  if (!emailRegex(form.value.email)) {
    isValid = false
  } else {
    errorEmailMessage.value = ''
  }

  const firstErrorElement = document.querySelector('.input-error')

  if (!isValid && firstErrorElement) {
    firstErrorElement.style.paddingTop = '80px'
    firstErrorElement.style.marginTop = '-80px'

    firstErrorElement.scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      firstErrorElement.style.paddingTop = ''
      firstErrorElement.style.marginTop = ''
    }, 3000)

    return false
  }

  for (const field of requiredFields) {
    if (!form.value[field]) {
      console.log('Field must be filled:', field.value)
      return false
    }
  }

  return true
}

const fetchingPrizeData = async () => {
  try {
    const { data } = await useFetchApi('GET', 'prizes/' + id)
    sessionStorage.setItem('type', data.type)
    type.value = data.type
    checkPoint(data.point)
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const checkPoint = (point) => {
  try {
    const currentPoint = parseInt(store.point)
    if (currentPoint < point) {
      disableRedeem.value = true
    }
  } catch (error) {}
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
  if (disableRedeem.value) return

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
  await store.fetchingDashboardData()
  await fetchingPrizeData()
})
</script>

<style scoped>
::v-deep(.p-checkbox-box) {
  @apply !bg-white !size-5 !border !border-exd-gray-44 !rounded-none;
}

::v-deep(.p-checkbox-checked .p-checkbox-icon) {
  @apply !text-black;
}

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
