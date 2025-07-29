<template>
  <div class="flex flex-col grow">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion text-exd-1824.52"
      >
        {{
          settings?.register_login?.change_membership_information_page_1
            ?.page_title
        }}
      </p>
    </HeaderBar>

    <div
      class="flex flex-col justify-between w-full gap-6 pt-32 pb-3 font-bold grow"
      :style="{
        background:
          settings?.register_login?.change_membership_information_page_1
            ?.background_page?.type === 'image'
            ? `url(${settings?.register_login?.change_membership_information_page_1?.background_page?.value})`
            : settings?.register_login?.change_membership_information_page_1
                ?.background_page?.value,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
      }"
    >
      <h1
        class="text-center flex flex-col text-1416 text-exd-gray-scorpion pb-4 w-full max-w-[360px] mx-auto"
      >
        {{
          settings?.register_login?.change_membership_information_page_1
            ?.page_description
        }}
      </h1>
      <div
        class="inline-flex items-center justify-between gap-4 pb-5 border-b border-b-exd-light-grey px-7 text-exd-gray-scorpion text-1416"
      >
        <h1>{{ $t('member') }} <span class="font-bold">ID</span></h1>
        <p
          v-if="userId"
          class="overflow-hidden font-bold text-right whitespace-nowrap"
        >
          {{ userId }}
        </p>
        <p
          v-else
          class="w-48 overflow-hidden font-bold text-right whitespace-nowrap"
        >
          00000000000
        </p>
      </div>
      <div class="flex flex-col px-3 grow">
        <div
          v-for="(item, index) in settings?.register_login?.register_fields"
          :key="index"
          class="!w-full p-0"
        >
          <div
            v-if="item.show"
            class="gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
            <InputText
              v-if="
                item.type !== 'gender' &&
                item.type !== 'radio' &&
                item.type !== 'date'
              "
              :onlyNumeric="
                item.name === 'postal_code' ||
                item.type === 'number' ||
                item.type === 'tel'
                  ? true
                  : false
              "
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
              :error="handleError(item.name, item.required)"
              hasHelper
              :class="{
                'input-error': handleError(item.name, item.required),
              }"
              :w230Px="
                item.name === 'phoneNumber' || item.name === 'postal_code'
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

            <!--
            <div
              v-if="item.name === 'first_name' || item.name === 'last_name'"
              class="inline-flex gap-4"
            >
              <InputText
                :model="form['last_name']"
                :label="$t('lastName')"
                required
                @update:model="updateModel('last_name', $event)"
                @validate="validateInput('last_name', $event)"
                :validate-on-submit="validateOnSubmit"
                :error="handleError('last_name')"
                :class="{ 'input-error': handleError('last_name') }"
                :border="true"
                :bgColor="
                  settings?.register_login?.membership_registration_page?.button_text_and_color?.background
                "
                :textColor="
                  settings?.register_login?.membership_registration_page?.button_text_and_color?.color
                "
              />
              <InputText
                :model="form['first_name']"
                :label="$t('firstName')"
                required
                :is-nick-name="true"
                @update:model="updateModel('first_name', $event)"
                @validate="validateInput('first_name', $event)"
                :validate-on-submit="validateOnSubmit"
                :error="handleError('first_name')"
                :class="{ 'input-error': handleError('first_name') }"
                :border="true"
                :bgColor="
                  settings?.register_login?.membership_registration_page?.button_text_and_color?.background
                "
                :textColor="
                  settings?.register_login?.membership_registration_page?.button_text_and_color?.color
                "
              />
            </div>
          -->

            <GenderSelection
              v-if="item.type === 'gender'"
              v-model="form[item.name]"
              :label="item.label_translation_key_id"
              :required="item.required"
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
              :label="item.label_translation_key_id"
              :placeholder="item.placeholder_translation_key_id"
              :required="item.required"
              v-model:model="form[item.name]"
              :error="handleError(item.name, item.required)"
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

            <RadioButton
              v-if="item.type === 'radio'"
              :label="t('questionnaire1')"
              v-model:model="form[item.name]"
              :options="questionnaire1Options"
              :name="item.name"
              :error="handleError(item.name, item.required)"
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
                class="flex flex-col gap-1 text-justify text-exd-gray-scorpion"
                v-html="terms"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-16" />
      <div class="fixed bottom-0 z-50 w-full max-w-md mx-auto mb-2">
        <SolidButton
          :label="
            settings?.register_login?.change_membership_information_page_1
              ?.button_text
          "
          :has-loading="isLoading"
          :disabled="!isButtonEnabled || !form.checked"
          :on-click="handleSubmit"
          :bgColor="
            settings?.register_login?.change_membership_information_page_1
              ?.button_text_and_color?.background
          "
          :textColor="
            settings?.register_login?.change_membership_information_page_1
              ?.button_text_and_color?.color
          "
          has-bottom
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isErrorMessage"
    modal
    class="!w-11/12 !max-w-sm border border-exd-gray-44"
    :style="{
      background: settings?.global?.modal?.background_color,
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
        <IconsWarning
          class="w-10 h-10"
          :style="{ color: settings?.global?.icon_color?.background }"
        />
        <div class="w-10/12 text-center">
          <p
            v-for="(item, index) in errorScroll"
            :key="index"
            class="font-bold text-exd-1424 text-exd-gray-scorpion"
            :style="{
              color: settings?.global?.modal?.text_color,
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
import close from '~/assets/images/close.svg'
import Dropdown from '~/components/Dropdown.vue'
import InputText from '~/components/InputText.vue'
import InputTextArea from '~/components/InputTextArea.vue'
import JapanPostalCode from 'japan-postal-code'
import { useI18n } from 'vue-i18n'
import { countries } from '~/data/countries'

const { t } = useI18n()

const validateOnSubmit = ref(false)

const userId = ref(null)
const isLoading = ref(false)
const isErrorMessage = ref(false)
const isButtonEnabled = ref(false)
const errorKeyPostCode = ref('')
const errorPostCodeMessage = computed(() => t(errorKeyPostCode.value))

const form = ref({
  checked: false,
})

const errorMessages = ref([])
const errorScroll = ref([])
const errorEmailMessage = ref('')
const errorNicknameMessage = ref('')
const errorPasswordMessage = ref('')
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

const getAgeOptions = () => [
  { value: 1, label: t('10') },
  { value: 2, label: t('20') },
  { value: 3, label: t('30') },
  { value: 4, label: t('40') },
  { value: 5, label: t('50') },
  { value: 6, label: t('60') },
  { value: 7, label: t('70') },
]

const updateModel = (field, value) => {
  form[field] = value

  const password = form.password
  const confPassword = form.confPassword

  if (field === 'password') {
    passwordValidate()
  }

  if (field in form) {
    form[field] = value
  } else {
    console.error(`Field ${field} tidak ditemukan dalam form`)
  }
}

const handleError = (field, required) => {
  const value = form.value[field] || ''

  if (!value && validateOnSubmit.value && required) {
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

const passwordValidate = () => {
  const password = form.password
  const alphanumericRegex = /^[a-zA-Z0-9]{8,}$/

  if (password.length > 0 && password.length < 8) {
    errorPasswordMessage.value = 'passwordMin'
  } else if (!alphanumericRegex.test(password)) {
    errorPasswordMessage.value = 'validPassword'
  } else {
    errorPasswordMessage.value = ''
  }
}

const validateInput = (field, value) => {
  //console.log(`Validated ${field}:`, value)
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

const emailRegex = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

let initialForm = {}

const isFormChanged = () => {
  return JSON.stringify(form) !== JSON.stringify(initialForm)
}

const validateForm = () => {
  let isValid = true
  const requiredFields = ['email', 'password', 'postal_code']
  const firstErrorElement = document.querySelector('.input-error')

  if (!emailRegex(form.email)) {
    isValid = false
  } else {
    errorEmailMessage.value = ''
  }

  // Pastikan email valid
  if (!isValid) {
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
    if (!form[field]) {
      console.log('Field must be filled:', field)
      return false
    }
  }

  return true
}

const populateForm = (data) => {
  const forms = settings.value?.register_login?.register_fields;

  if (!forms) return;

  const shownKeys = Object.keys(forms).filter(key => forms[key].show);

  shownKeys.forEach(key => {
    if (data[key] !== undefined) {
      form.value[key] = data[key];
    }
  });

  console.log('Form setelah autofill:', form.value);
};

const fetchGetUserData = async () => {
  errorMessages.value = []
  isLoading.value = true

  try {
    const { data } = await useFetchApi('GET', 'user')

    userId.value = data.user_id

    populateForm(data)

    initialForm = JSON.parse(JSON.stringify(form))
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const fetchPostUserData = async (payload) => {
  errorMessages.value = []
  isLoading.value = true

  try {
    const { data } = await useFetchApi('POST', 'user', {
      body: payload,
    })

    if (validateForm()) {
      localStorage.setItem('USER_ID', data.user.id)
      localStorage.setItem('PROFILE_SUBMITTED', 'true')
      localStorage.setItem('PROFILE_SUBMIT_TIME', Date.now().toString())

      navigateTo('/profile/complete')
    }
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
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

  if (
    response.email?.[0] === 'emailはすでに使用されています。' ||
    response.email?.[0] === 'The email has already been taken.'
  ) {
    emailErrorKey.value = 'emailIsAlreadyRegistered'
  }
}

const buildPayload = () => {
  const { checked, ...payload } = form.value

  return payload
}

const handleSubmit = async () => {
  if (!validateForm()) return
  if (
    !form.postCode ||
    form.postCode.length < 7 ||
    errorPostCodeMessage.value
  ) {
    return
  }

  errorScroll.value = []

  isLoading.value = true

  validateOnSubmit.value = true

  const payload = buildPayload()

  await fetchPostUserData(payload)

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
  isLoading.value = false
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

watch(
  () => form,
  (newValue, oldValue) => {
    isButtonEnabled.value = isFormChanged()
  },
  { deep: true }
)

onMounted(() => {
  getTerms()
})

onMounted(async () => {
  await fetchGetUserData()
  checkPostalCode(form.postCode)
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
