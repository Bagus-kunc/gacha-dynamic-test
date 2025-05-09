<template>
  <div class="flex flex-col grow">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion text-exd-1824.52"
      >
        {{ $t('membershipInformation') }}
      </p>
    </HeaderBar>

    <div
      class="flex flex-col justify-between w-full gap-6 pb-3 mt-32 font-bold grow"
    >
      <h1
        class="text-center flex flex-col text-1416 text-exd-gray-scorpion pt-6 pb-10 w-full max-w-[360px] mx-auto"
      >
        {{ $t('memberInformation1') }}
        <span> {{ $t('memberInformation2') }}</span>
      </h1>
      <div
        class="inline-flex items-center justify-between gap-4 pb-5 border-b border-b-exd-light-grey px-7 text-exd-gray-scorpion text-1416"
      >
        <h1>{{ $t('member') }} <span class="font-bold">ID</span></h1>
        <p class="w-48 overflow-hidden font-bold text-right whitespace-nowrap">
          {{ userId }}
        </p>
      </div>
      <div class="flex flex-col px-3 grow">
        <div
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
            :error="
              !form.email && validateOnSubmit
                ? t('fieldRequired')
                : form.email && !emailRegex(form.email)
                ? t('emailFormat')
                : errorEmailMessage
            "
            :class="{
              'input-error':
                !form.email && validateOnSubmit
                  ? t('fieldRequired')
                  : form.email && !emailRegex(form.email)
                  ? t('emailFormat')
                  : errorEmailMessage,
            }"
            :border="true"
          />
        </div>

        <div
          class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
        >
          <InputText
            type="password"
            :model="form.password"
            :isPassword="true"
            required
            :minLength="8"
            :label="$t('loginPassword')"
            inform="passwordMin"
            @update:model="updateModel('password', $event)"
            @validate="validateInput('password', $event)"
            :validate-on-submit="validateOnSubmit"
            :error="
              !form.password && validateOnSubmit
                ? t('fieldRequired')
                : '' || errorPasswordMessage === ''
                ? ''
                : t(errorPasswordMessage)
            "
            :border="true"
          />
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
                v-for="i in 20"
                :key="i"
                class="flex flex-col gap-1 text-justify"
              >
                <span>{{ t(`dummyDummy.subTitle.term${i}`) }}</span>
                {{ t(`dummyDummy.detail.term${i}`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-16" />
      <div class="fixed bottom-0 z-50 w-full max-w-md mx-auto mb-2">
        <SolidButton
          :label="$t('change')"
          :has-loading="isLoading"
          :disabled="!isButtonEnabled || !form.checked"
          :on-click="handleSubmit"
          variant="red-coral"
          has-bottom
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isErrorMessage"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
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
            class="font-bold text-exd-1424 text-exd-gray-scorpion"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import warning from '~/assets/images/warning.svg'
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

const form = reactive({
  email: '',
  password: '',
  checked: false,
})

const errorMessages = ref([])
const errorScroll = ref([])
const errorEmailMessage = ref('')
const errorNicknameMessage = ref('')
const errorPasswordMessage = ref('')

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

const emailRegex = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

let initialForm = {}

const isFormChanged = () => {
  return JSON.stringify(form) !== JSON.stringify(initialForm)
}

const validateForm = () => {
  let isValid = true

  if (!emailRegex(form.email)) {
    isValid = false
  } else {
    errorEmailMessage.value = ''
  }

  // Pastikan email valid
  if (!isValid) {
    const firstErrorElement = document.querySelector('.input-error')
    firstErrorElement.style.paddingTop = '80px'
    firstErrorElement.style.marginTop = '-80px'

    firstErrorElement.scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      firstErrorElement.style.paddingTop = ''
      firstErrorElement.style.marginTop = ''
    }, 3000)
    return false
  }

  return true
}

const populateForm = (data) => {
  form.email = data.email || ''
  form.password = ''
}

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
  const payload = {
    email: form.email,
    password: form.password,
  }

  return payload
}

const handleSubmit = async () => {
  errorScroll.value = []

  validateOnSubmit.value = true

  if (!validateForm()) return

  isLoading.value = true

  const payload = buildPayload()

  await fetchPostUserData(payload)

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
  isLoading.value = false
}

let postCodeBounds

const checkPostalCode = async (code) => {
  if (!code || code.length < 7) {
    form.prefecture = ''
    form.city = ''

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

    // Success case
    form.prefecture = address.prefecture
    form.city = address.city
    form.area = address.area
    errorKeyPostCode.value = ''
  } catch (error) {
    console.error('Postal code error:', error)
    form.prefecture = ''
    form.city = ''

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

onMounted(async () => {
  await fetchGetUserData()
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
  background: #d7a237 !important;
  border-radius: 10px !important;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  display: block !important;
  background: #555 !important;
}
</style>
