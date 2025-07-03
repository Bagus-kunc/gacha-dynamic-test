<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
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
        @click="$emit('update:modelValue', false)"
      />
      <div
        class="relative flex flex-col items-center justify-center w-full gap-4 px-4 py-6"
      >
        <div class="font-bold text-center text-exd-1424 text-exd-gray-scorpion">
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('loginOrRegister') }}
          </p>
        </div>

        <InputText
          type="email"
          :model="form.email"
          :placeholder="$t('loginID')"
          @update:model="updateModel('email', $event)"
          @validate="validateInput('email', $event)"
        />
        <InputText
          type="password"
          :model="form.password"
          :placeholder="$t('password')"
          @update:model="updateModel('password', $event)"
          @validate="validateInput('password', $event)"
        />

        <a
          class="font-medium underline cursor-pointer text-exd-1220 text-exd-gray-scorpion"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
          @click="navigateTo('/forgot-password')"
        >
          {{ $t('forgotYourPassword') }}
        </a>
        
        <SolidButton
          :label="settings.register_login?.login?.button_text"
          :onClick="handleSubmit"
          :bgColor="settings?.register_login?.login?.button_text_color?.background"
          :textColor="settings?.register_login?.login?.button_text_color?.color"
          :disabled="!isValidInput || isLoading"
          :has-loading="isLoading"
        />
        <SolidButton
          :label="settings?.register_login?.new_member_registration?.button_text"
          :bgColor="settings?.register_login?.new_member_registration?.button_text_color.background"
          :textColor="settings?.register_login?.new_member_registration?.button_text_color.color"
          :onClick="handleToRegister"
        />
      </div>
    </template>
  </Dialog>

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
        @click="isErrorMessage = false"
      />
      <div class="flex flex-col items-center justify-center w-full gap-4 py-6">
        <img :src="warning" alt="warning" width="40" height="40" preload />
        <div class="w-10/12 text-center">
          <p
            v-for="(item, index) in errorMessages"
            class="font-bold text-exd-1424 text-exd-gray-scorpion"
            :key="index"
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
import arrow from '~/assets/images/arrow.svg'
import warning from '~/assets/images/warning.svg'
import InputText from '~/components/InputText.vue'
import useRegister from '~/composables/useRegister'

const register = useRegister()
const { isSpin } = storeToRefs(register)
const settings = useState('settings')

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  email: {
    type: String,
    default: null, // Default to null if no email is provided
  },
})

const emits = defineEmits(['update:modelValue', 'callback'])

const isLoading = ref(false)

const form = ref({
  email: '',
  password: '',
})

const isErrorMessage = ref(false)
const errorMessages = ref([])
const route = useRoute()
const { encryptData, decryptData } = useEncryption()

const isValidInput = computed(
  () => form.value.email !== '' && form.value.password !== ''
)

const updateModel = (field, value) => {
  form.value[field] = value
}

const validateInput = (field, value) => {
  // console.log(`Validated ${field}:`, value)
}

const handleToRegister = () => {
  navigateTo('/register')
}

const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const updateSpinStatus = async () => {
  const storedData = useCookie('VALID_PASSWORD')
  const payload = decryptData(storedData.value || '{}')
  const { data } = await useFetchApi('POST', 'gacha/spin', { body: payload })

  const newStatus = data.is_already_spin

  return new Promise((resolve) => {
    const currentStatus = sessionStorage.getItem('IS_ALREADY_SPIN')
    if (currentStatus !== newStatus.toString()) {
      sessionStorage.setItem('IS_ALREADY_SPIN', newStatus.toString())
      isAlreadySpin.value = newStatus
    }
    setTimeout(() => {
      resolve()
    }, 0)
  })
}

const handleSubmit = async () => {
  const location = route.params.randomCode

  if (isLoading.value) return
  isLoading.value = true

  if (!validateEmailFormat(form.value.email)) {
    errorMessages.value = [t('emailValidation')]
    isErrorMessage.value = true
    isLoading.value = false
    return
  }

  try {
    const response = await useFetchApi('POST', 'login', {
      body: { ...form.value },
    })

    const TOKEN = useCookie('TOKEN', {
      maxAge: 60 * 60 * 24 * 7,
    })
    const USER = useCookie('USER', {
      maxAge: 60 * 60 * 24 * 7,
    })
    TOKEN.value = response.data.token
    USER.value = response.data.user

    sessionStorage.setItem('EMAIL', form.value?.email)
    if (form.value?.password) {
      try {
        const encrypted = encryptData(form.value.password)
        sessionStorage.setItem('PASSWORD', encrypted)
      } catch (encryptError) {
        
      }
    }

    await nextTick()

    await saveSpin()

    if (route.path === '/spin/character/' + location) {
      await navigateTo('/dashboard', { replace: true })
    } else {
      await navigateTo('/dashboard', { replace: true })
    }
    
    isLoading.value = false

  } catch (error) {

    console.log("Error: Can't login", error)

    const { errors, message } = error._data || {}

    if (errors) {
      const message = Object.keys(errors).map((item) => errors[item][0])
      errorMessages.value = message
      isErrorMessage.value = true
    }
    if (message && !errors) {
      errorMessages.value = [message]
      isErrorMessage.value = true
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
    const { data } = await useFetchApi('POST', 'gacha/save', {
      body: {
        point_id: slugStorage?.point_id,
        location_id: slugStorage?.location_id,
        character_id: slugStorage?.character_id,
        log_id: slugStorage?.log_id,
        gift_image: slugStorage?.gift_image,
        gift_name: slugStorage?.voucher_name,
        gift_type: slugStorage?.gift_type,
      },
    })

    storedData.value = null
    localStorage.removeItem(slugStorageName)

    sessionStorage.setItem('IS_ALREADY_SPIN', data.is_already_spin)
    sessionStorage.setItem(
      'READY_SPIN_AFTER_DATE',
      data?.ready_spin_after_date || ''
    )
    sessionStorage.setItem('IS_QUOTA_AVAILABLE', data?.is_quota_available)
    sessionStorage.setItem('LOCATION_SLUG', data?.location_slug)
  } catch (error) {
    console.log("Error: Can't save spin result")

    throw error
  }
}

onMounted(() => {

  const emailSession    = sessionStorage.getItem('EMAIL')    || ''
  const passwordCipher  = sessionStorage.getItem('PASSWORD') || ''

  form.value.email = emailSession
  form.value.password = decryptData(passwordCipher)
})

watch(
  () => props.email,
  (newEmail) => {
    if (newEmail) {
      form.value.email = newEmail // Update form email only if newEmail is provided
    }
  },
  { immediate: true } // This will immediately set email if provided when the component mounts
)
</script>
