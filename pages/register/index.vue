<template>
  <div class="flex flex-col grow">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion text-exd-1824.52"
      >
        {{ $t('newMemberRegistration') }}
      </p>
    </HeaderBar>

    <div class="flex flex-col justify-between w-full gap-6 pb-3 mt-24 grow">
      <div class="flex flex-col px-3 grow">

        <!-- * First Name & Last Name * -->
        <div
            v-if="settings?.register_login?.register_fields?.first_name.show && settings?.register_login?.register_fields?.last_name.show"
            class="inline-flex gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
          <InputText
            :model="form.lastName"
            :label="$t('lastName')"
            :required="settings?.register_login?.register_fields?.last_name.required"
            @update:model="updateModel('lastName', $event)"
            @validate="validateInput('lastName', $event)"
            :validate-on-submit="validateOnSubmit"
            :placeholder="settings?.register_login?.register_fields?.last_name?.placeholder_translation_key_id"
            :error="
              !form.lastName && validateOnSubmit ? $t('fieldRequired') : ''
            "
            :class="{
              'input-error': !form.lastName && validateOnSubmit,
            }"
            :border="true"
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />
          <InputText
            :model="form.firstName"
            :label="$t('givenName')"
            :required="settings?.register_login?.register_fields?.first_name.required"
            :placeholder="settings?.register_login?.register_fields?.first_name.placeholder_translation_key_id"
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
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />
        </div>

        <!-- * Gender * -->
        <div
          class="inline-flex flex-col px-4 py-5 border-b border-b-exd-light-grey"
        >
          <label
            :for="$t('sex')"
            class="flex items-center gap-2 text-exd-gray-scorpion text-exd-1424"
            >{{ $t('sex') }}
            <span
              class="text-exd-0910 px-1 py-[2px] rounded-sm"
              :style="{ backgroundColor: settings?.register_login?.new_member_registration?.button_text_color?.background, color: settings?.register_login?.new_member_registration?.button_text_color?.color }"
              >{{ $t('required') }}</span
            >
          </label>
          <ButtonGroup
            class="w-full h-10 rounded-none text-exd-gray-scorpion"
            style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
          >
            <Button
              @click="updateModel('gender', 'Male')"
              :label="$t('male')"
              :class="[
                'bg-white w-4/12 h-full border border-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
                form.gender === 'Male' && '!bg-exd-banana',
              ]"
            />
            <Button
              @click="updateModel('gender', 'Female')"
              :label="$t('female')"
              :class="[
                'bg-white w-4/12 h-full border-t border-b border-t-exd-stone-300 border-b-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
                form.gender === 'Female' && '!bg-exd-banana',
              ]"
            />
            <Button
              @click="updateModel('gender', 'No-Answer')"
              :label="$t('noAnswer')"
              :class="[
                'bg-white w-4/12 h-full border border-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
                form.gender === 'No-Answer' && '!bg-exd-banana',
              ]"
            />
          </ButtonGroup>
        </div>

        <!-- * Postal Code * -->
        <div
          v-if="settings?.register_login?.register_fields?.postal_code.show"
          class="inline-flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
        >
          <div class="">
            <InputText
              onlyNumeric
              :model="form.postCode"
              :disabled="isLoading"
              :required="settings?.register_login?.register_fields?.postal_code.required"
              :placeholder="settings?.register_login?.register_fields?.postal_code.placeholder_translation_key_id"
              :label="settings?.register_login?.register_fields?.postal_code.label_translation_key_id"
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
                  : '' || (form.postCode.length > 0 && form.postCode.length < 7)
                  ? $t('minLengthPostalCode')
                  : '' || errorPostCodeMessage
              "
              :class="{
                'input-error':
                  (!form.postCode && validateOnSubmit) ||
                  (form.postCode.length > 0 && form.postCode.length < 7) ||
                  errorPostCodeMessage,
                'opacity-50': isLoading,
              }"
              :w230Px="true"
              :border="true"
              :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
              :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
            />
          </div>
        </div>

        <!-- * Address * -->
        <div
            v-if="settings?.register_login?.register_fields?.postal_code.show || settings?.register_login?.register_fields?.address.show"
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
          <InputText
            v-if="settings?.register_login?.register_fields?.postal_code.show"
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
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />

          <InputText
            v-if="settings?.register_login?.register_fields?.postal_code.show"
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
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />

          <InputText
            v-if="settings?.register_login?.register_fields?.address.show"
            :model="form.streetAddressEtc"
            :required="settings?.register_login?.register_fields?.address.required"
            :placeholder="settings?.register_login?.register_fields?.address.placeholder_translation_key_id"
            :label="settings?.register_login?.register_fields?.address.label_translation_key_id"
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
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />
          <p class="font-normal text-exd-1320 text-exd-gray-scorpion">
            {{ t('streetAddressInformation') }}
          </p>
        </div>

        <!-- * Date of Birth * -->
        <div
            v-if="settings?.register_login?.register_fields?.date_of_birth.show"
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
          <div class="">
            <InputDate 
              :required="settings?.register_login?.register_fields?.date_of_birth.required"
              :placeholder="settings?.register_login?.register_fields?.date_of_birth.placeholder_translation_key_id"
              :label="settings?.register_login?.register_fields?.date_of_birth.label_translation_key_id"
              v-model:model="form.birthday" 
              border 
              :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
              :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
            />
          </div>
        </div>

        <!-- * Phone Number * -->
        <div
            v-if="settings?.register_login?.register_fields?.phone_number.show"
            class="inline-flex flex-col gap-4 px-5 py-5 border-b border-b-exd-light-grey"
          >
          <div class="">
            <InputText
              type="number"
              :model="form.phoneNumber"
              :required="settings?.register_login?.register_fields?.phone_number.required"
              :placeholder="settings?.register_login?.register_fields?.phone_number.placeholder_translation_key_id"
              :label="settings?.register_login?.register_fields?.phone_number.label_translation_key_id"
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
              :w230Px="true"
              :border="true"
              :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
              :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
            />
          </div>
        </div>

        <!-- * Email * -->
        <div
          v-if="settings?.register_login?.register_fields?.email.show"
          class="inline-flex gap-4 px-4 py-5 border-b border-b-exd-light-grey"
        >
          <InputText
            type="email"
            :model="form.email"
            :required="settings?.register_login?.register_fields?.email.required"
            :placeholder="settings?.register_login?.register_fields?.email.placeholder_translation_key_id"
            :label="settings?.register_login?.register_fields?.email.label_translation_key_id"
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
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />
        </div>

        <!-- * Password * -->
        <div
          class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
        >
          <InputText
            v-if="settings?.register_login?.register_fields?.password.show"
            type="password"
            :model="form.password"
            :isPassword="true"
            :required="settings?.register_login?.register_fields?.password.required"
            :placeholder="settings?.register_login?.register_fields?.password.placeholder_translation_key_id"
            :label="settings?.register_login?.register_fields?.password.label_translation_key_id"
            :minLength="8"
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
            :class="{
              'input-error': errorPasswordMessage,
            }"
            :border="true"
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />

          <InputText
            v-if="settings?.register_login?.register_fields?.password_confirmation.show"
            type="password"
            :model="form.confPassword"
            :isPassword="true"
            :required="settings?.register_login?.register_fields?.password_confirmation.required"
            :placeholder="settings?.register_login?.register_fields?.password_confirmation.placeholder_translation_key_id"
            :label="settings?.register_login?.register_fields?.password_confirmation.label_translation_key_id"
            :isConfPassword="true"
            :minLength="8"
            @update:model="updateModel('confPassword', $event)"
            @validate="validateInput('confPassword', $event)"
            :validate-on-submit="validateOnSubmit"
            :error="
              !form.confPassword && validateOnSubmit
                ? t('fieldRequired')
                : '' || errorConfPasswordMessage === ''
                ? ''
                : t(errorConfPasswordMessage)
            "
            :class="{
              'input-error': errorConfPasswordMessage,
            }"
            :border="true"
            :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
            :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
          />
        </div>

        <!-- * Questionnaire1 * -->
        <div
            class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
          >
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
              :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
              :textColor="settings?.register_login?.new_member_registration?.button_text_color?.color"
              required
            />
        </div>

        <!-- * Questionnaire2 * -->
        <div
          class="flex flex-col gap-4 px-4 py-5 border-b border-b-exd-light-grey"
        >
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
              :bgColor="settings?.register_login?.new_member_registration?.button_text_color?.background"
              :textColor="settings.buttons[0].color"
              required
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
          :label="$t('register')"
          :has-loading="isLoading"
          :bgColor="settings?.register_login?.new_member_registration?.button_text_color.background"
          :textColor="settings?.register_login?.new_member_registration?.button_text_color.color"
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
  firstName: '',
  lastName: '',
  gender: 'No-Answer',
  birthday: '',
  postCode: '',
  prefecture: '',
  address: '',
  phoneNumber: '',
  email: '',
  password: '',
  confPassword: '',
  questionnaire1: '',
  questionnaire2: '',
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

const validateInput = (field, value) => {
  //console.log(`Validated ${field}:`, value)
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

  const payload = buildPayload()

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
