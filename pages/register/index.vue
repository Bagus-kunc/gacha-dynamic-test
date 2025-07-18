<template>
  <div class="flex flex-col grow">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion text-exd-1824.52"
      >
        {{ settings?.register_login?.membership_registration_page?.page_title }}
      </p>
    </HeaderBar>

    <div class="flex flex-col justify-between w-full gap-6 pb-3 mt-24 grow"
      :style="{ background: settings?.register_login?.membership_registration_page?.background_page?.type === 'image' ? `url(${settings?.register_login?.membership_registration_page?.background_page?.value})` : settings?.register_login?.membership_registration_page?.background_page?.value, 'background-size': 'cover', 'background-repeat': 'no-repeat' }"
    >
      <div class="flex flex-col px-3 grow">

        <div v-for="(item, index) in settings?.register_login?.register_fields" :key="index" class="!w-full p-0">
          <div 
          v-if="item.show"
          class="gap-4 px-5 py-5 border-b border-b-exd-light-grey">
            <InputText
              v-if="item.type === 'text' || item.type === 'email' || item.type === 'password' || item.type === 'number' || item.type === 'tel'"
              :onlyNumeric="item.name === 'postal_code' || item.type === 'number' || item.type === 'tel' ? true : false"
              :type="item.type"
              :model="form[item.name]"
              :label="item.label_translation_key_id"
              :required="item.required"
              :placeholder="item.placeholder_translation_key_id"
              @update:model="
                ($event) => {
                  updateModel(item.name, $event)
                  if (item.name === 'postal_code') {
                    checkPostalCode($event)
                  }
                }
              "
              @validate="validateInput(item.name, $event)"
              :minLength="maxLengthMap(item.name)"
              :validate-on-submit="validateOnSubmit"
              :error="handleError(item.name)"
              hasHelper
              :class="{
                'input-error': handleError(item.name),
              }"
              :w230Px="item.name === 'phoneNumber' || item.name === 'postal_code' ? true : false"
              :border="true"
              :bgColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.background"
              :textColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.color"
            />

            <GenderSelection
              v-if="item.type === 'gender'"
              v-model="form[item.name]"
              :label="item.label_translation_key_id"
              :required="item.required"
              :bg-color="settings?.register_login?.membership_registration_page?.button_text_and_color?.background"
              :text-color="settings?.register_login?.membership_registration_page?.button_text_and_color?.color"
            />

            <InputDate 
              v-if="item.type === 'date'"
              :label="item.label_translation_key_id"
              :placeholder="item.placeholder_translation_key_id"
              :required="item.required"
              v-model:model="form[item.name]" 
              :bgColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.background"
              :textColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.color"
              border 
            />

            <RadioButton
              v-if="item.type === 'radio'"
              :label="t('questionnaire1')"
              v-model:model="form[item.name]"
              :options="questionnaire1Options"
              :name="item.name"
              :error="handleError(item.name)"
              :bgColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.background"
              :textColor="settings?.register_login?.membership_registration_page?.button_text_and_color?.color"
              :required="item.required"
            />
          </div>
        </div>

        <div class="inline-flex items-center justify-center w-full gap-2 mt-7">
          <Checkbox v-model="form.checked" :binary="true" />
          <p class="font-bold text-exd-gray-scorpion text-exd-1424">
            {{ $t('acceptTerm') }}
          </p>
        </div>
        <div
          class="w-full mt-5 border border-exd-gray-44 rounded-xl bg-white h-[98px] max-w-xs mx-auto text-exd-gray-scorpion pr-2"
          style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
        >
          <div
            class="max-h-[85px] mt-[5.5px] scrollable-content overflow-y-auto pl-6 pr-4"
          >
            <p class="font-bold text-center text-exd-1424">
              {{ $t('termOfService') }}
            </p>

            <div
              class="text-exd-1220 font-medium leading-relaxed h-[84px] flex flex-col gap-1"
            >
              <p
                class="flex flex-col gap-1 text-justify"
                v-html="terms"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-16" />
      <div class="fixed bottom-0 z-50 w-full max-w-md mx-auto mb-2">
        <SolidButton
          :label="settings?.register_login?.membership_registration_page?.button_text"
          :has-loading="isLoading"
          :bgColor="settings?.register_login?.membership_registration_page?.button_text_and_color.background"
          :textColor="settings?.register_login?.membership_registration_page?.button_text_and_color.color"
          :disabled="!form.checked || isLoading"
          :on-click="handleSubmit"
          has-bottom
        />
        <!-- class="!-inset-x-1/4 !-translate-x-3" -->
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isErrorMessage"
    modal
    class="!w-11/12 !max-w-sm border border-exd-gray-44"
    :style="{
          background: settings?.global?.modal?.background_color
    }"
  >
    <template #container>
      <img
        :src="close"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div class="flex flex-col items-center justify-center w-full gap-4 py-6">
        <img :src="warning" alt="warning" width="40" height="40" preload />
        <div class="w-10/12 text-center">
          <p
            v-for="(item, index) in errorScroll"
            :key="index"
            class="font-bold text-exd-1424"
            :style="{
              color: settings?.global?.modal?.text_color
            }"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import close from '~/assets/images/close.svg'
import JapanPostalCode from 'japan-postal-code'
import Dropdown from '~/components/Dropdown.vue'
import warning from '~/assets/images/warning.svg'
import InputText from '~/components/InputText.vue'
import InputTextArea from '~/components/InputTextArea.vue'
import RadioButton from '~/components/RadioButton.vue'
import {
  questionnaire1Options,
  questionnaire2Options,
} from '~/data/questionnaire'

const form = ref({
  checked: false,
})
const { t } = useI18n()
const errorScroll = ref([])
const isLoading = ref(false)
const errorMessages = ref([])
const errorAgeMessage = ref('')
const emailErrorKey = ref('')
const errorEmailMessage = computed(() => emailErrorKey.value && t(emailErrorKey.value))
const isErrorMessage = ref(false)
const validateOnSubmit = ref(false)
const errorNicknameMessage = ref('')
const errorPasswordMessage = ref('')
const errorConfPasswordMessage = ref('')
const register = useRegister()
const { isSpin } = storeToRefs(register)
const { decryptData, encryptData } = useEncryption()

const errorPhoneNumber = ref('')
const errorKeyPostCode = ref('')
const errorPostCodeMessage = computed(() => errorKeyPostCode.value && t(errorKeyPostCode.value))

const settings = useState('settings')
const LOCALE = useCookie('LOCALE')

const terms = ref('')

const getTerms = async () => {
  try {
    terms.value = settings.value?.global?.terms?.[LOCALE.value] || ''
  } catch (error) {
    console.error("Error: Can't get terms", error)
    terms.value = ''
  }
}

const handleCloseDialog = () => (isErrorMessage.value = false)

const updateModel = (field, value) => {
  form.value[field] = value

  const password = form.value.password

  if (field === 'password') {
    passwordValidate()
  }
}

const filterPostalCodeInput = (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, '')
  form.value.postCode = event.target.value
}

const maxLengthMap = (field) => {
  switch (field) {
    case 'postal_code':
      return 7
    case 'phone_number':
      return 12
    case 'password':
      return 20
    case 'confPassword':
      return 20
    default:
      return null
  }
}

const handleError = (field) => {
  const value = form.value[field] || ''

  if (!value && validateOnSubmit.value) {
    return t('fieldRequired')
  } else if (field === 'email') {
    if (value && !emailRegex(value)) {
      return t('emailFormat')
    } else {
      return errorEmailMessage.value
    }
  } else if (field === 'postal_code') {
    if (value?.length > 0 && value?.length < 7) {
      return t('minLengthPostalCode')
    } else if (errorPostCodeMessage.value) {
      return errorPostCodeMessage.value
    }
  } else if (field === 'phone_number') {
    return errorPhoneNumber.value
  }
}

const validateInput = (field, value) => {
  
}

const passwordValidate = () => {
  const password = form.value.password
  const alphanumericRegex = /^[a-zA-Z0-9]{8,}$/

  if (password.length > 0 && password.length < 8) {
    errorPasswordMessage.value = 'passwordMin'
  } else if (!alphanumericRegex.test(password)) {
    errorPasswordMessage.value = 'validPassword'
  } else {
    errorPasswordMessage.value = ''
  }
}

const validateForm = () => {
  const requiredFields = []
  const firstErrorElement = document.querySelector('.input-error')

  if (errorEmailMessage.value) {
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
      console.log('Field must be filled:', field)
      return false
    }
  }

  return true
}

const getAgeOptions = [
  { value: 1, label: t('10') },
  { value: 2, label: t('20') },
  { value: 3, label: t('30') },
  { value: 4, label: t('40') },
  { value: 5, label: t('50') },
  { value: 6, label: t('60') },
  { value: 7, label: t('70') },
]

const fetchRegister = async (payload) => {
  errorMessages.value = []
  emailErrorKey.value = ''

  isLoading.value = true

  try {
    const { data, status } = await useFetchApi('POST', 'register', {
      body: payload,
    })

    if (!data || !data.user?.id) {
      throw new Error(t('unexpectedResponse'))
    }

    if (validateForm() && status) {
      localStorage.setItem('USER_ID', data.user.id)
      await saveSpin()

      sessionStorage.setItem('EMAIL', payload.email)
      sessionStorage.setItem('PASSWORD', encryptData(payload.password))


      navigateTo('/#registration-complete')
      isLoading.value = false
    }
  } catch (error) {
    handleApiError(error)
    isLoading.value = false
  }
}

const emailRegex = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleApiError = (error) => {
  errorScroll.value = []

  const response = error?._data?.errors || {}

  if (Object.keys(response).length) {
    const message = Object.keys(response).map((item) => {
      return Array.isArray(response[item]) && response[item]?.[0]
        ? response[item][0]
        : 'Unknown error'
    })
    errorScroll.value = message
    errorMessages.value.push(response)
  }

  errorNicknameMessage.value = Array.isArray(response?.nickname)
    ? response.nickname[0]
    : ''

  errorAgeMessage.value = Array.isArray(response?.age) ? response.age[0] : ''

  if (response.email) {
    if (
      response.email?.[0] === 'emailはすでに使用されています。' ||
      response.email?.[0] === 'The email has already been taken.'
    ) {
      emailErrorKey.value = 'emailIsAlreadyRegistered'
    }
  }
}

const buildPayload = () => {
  const payload = {
    email: form.value?.email,
    gender: form.value?.gender,
    address: form.value?.address,
    password: form.value?.password,
    first_name: form.value?.firstName,
    last_name: form.value?.lastName,
    postal_code: form.value?.postCode,
    prefecture: form.value?.prefecture,
    date_of_birth: form.value?.birthday,
    password_confirmation: form.value?.password,
    questionnaire_1: form.value?.questionnaire1,
    questionnaire_2: form.value?.questionnaire2,
  }

  return payload
}

const handleSubmit = async () => {

  errorScroll.value = []
  
  validateOnSubmit.value = true

  const { checked, ...payload } = form.value

  await fetchRegister(payload)

  if (errorScroll.value.length > 0) {
    await nextTick()
    const firstErrorElement = document.querySelector('.input-error')
    if (firstErrorElement) {
      firstErrorElement.style.paddingTop = '115px'
      firstErrorElement.style.marginTop = '-115px'

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
    form.value.city = ''
    if (code && code.length > 0 && code.length < 7) {
      errorKeyPostCode.value = 'minLengthPostalCode'
    } else {
      errorKeyPostCode.value = ''
    }
    return
  }

  isLoading.value = true

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
    // form.value.city = address.city
    // form.value.area = address.area
    form.value.municipalities = `${address.city}, ${address.area}`
    errorKeyPostCode.value = ''
  } catch (error) {
    console.error('Postal code error:', error)

    form.value.prefecture = ''
    form.value.city = ''

    if (error.message.includes('timeout')) {
      errorKeyPostCode.value = 'postalCodeNotFound'
    }
  } finally {
    isLoading.value = false
  }
}

const saveSpin = async () => {
  if (!isSpin.value) return
  const storedData = useCookie('VALID_PASSWORD')

  const parseData = decryptData(storedData.value)
  const slug = parseData?.slug?.toUpperCase()
  const slugStorageName = `${slug}_GACHA`
  const slugStorage = decryptData(localStorage.getItem(slugStorageName))
  try {
    const { data } = await useFetchApi('POST', 'gacha/save/registered', {
      body: {
        point_id: slugStorage?.point_id,
        location_id: slugStorage?.location_id,
        user_id: localStorage.getItem('USER_ID'),
        character_id: slugStorage?.character_id,
        log_id: slugStorage?.log_id,
      },
    })

    storedData.value = null
    localStorage.removeItem(slugStorageName)

    sessionStorage.setItem('IS_QUOTA_AVAILABLE', data?.is_quota_available)
    sessionStorage.setItem('LOCATION_SLUG', data?.location_slug)
  } catch (error) {
    console.log("Error: Can't save spin result")
  }
}

onMounted(() => {
  getTerms()
})
</script>

<style scoped>
::v-deep(.p-checkbox-box) {
  @apply !bg-white !size-5 !border !border-exd-gray-44 !rounded-none;
}

::v-deep(.p-checkbox-checked .p-checkbox-icon) {
  @apply !text-black;
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
  background: #9a9a9a !important;
  border-radius: 10px !important;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  display: block !important;
  background: #555 !important;
}
</style>
