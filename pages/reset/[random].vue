<template>
  <div class="flex flex-col grow">
    <HeaderBar>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion font-bold text-exd-1824.52"
      >
        {{ $t('resetPassword') }}
      </p>
    </HeaderBar>

    <div class="flex flex-col justify-between px-8 pb-3 mt-32 grow">
      <template v-if="!isSuccessSendResetPassword">
        <div>
          <h1
            class="font-bold text-center text-exd-gray-scorpion text-exd-1424"
          >
            {{ $t('enterYourNewPassword') }}
          </h1>
          <div class="flex flex-col gap-7 mt-14">
            <InputText
              :model="form.email"
              :label="$t('loginID')"
              @validate="validateInput('email', $event)"
              disabled
            />
            <InputText
              type="password"
              :model="form.password"
              :label="$t('password')"
              @validate="validateInput('password', $event)"
              @update:model="updateModel('password', $event)"
            />
            <!-- <InputText
              type="password"
              :model="form.confirmPassword"
              :label="$t('rePassword')"
              @validate="validateInput('confPassword', $event)"
              @update:model="updateModel('confirmPassword', $event)"
            /> -->
          </div>
        </div>
      </template>
      <template v-else>
        <h1 class="font-bold text-center text-exd-gray-scorpion text-exd-1424">
          {{ $t('passwordResetCompleted') }}
        </h1>
      </template>

      <SolidButton
        :label="!isSuccessSendResetPassword ? $t('send') : $t('myPage')"
        :has-loading="isLoading"
        :disabled="isLoading"
        :bgColor="settings?.forgot_password?.button_and_text_color?.background"
        :textColor="settings?.forgot_password?.button_and_text_color?.color"
        :on-click="handleSubmit"
        has-bottom
      />
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
        <div class="w-10/12 text-center text-exd-gray-scorpion">
          <p>
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import arrow from '~/assets/images/arrow.svg'
import close from '~/assets/images/close.svg'
import warning from '~/assets/images/warning.svg'
import InputText from '~/components/InputText.vue'
import HeaderBar from '~/components/HeaderBar.vue'
import { store } from '~~/stores/global-settings.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref(null)
const isErrorMessage = ref(false)
const token = route.params.random
const settings = useState('settings')

const isSuccessSendResetPassword = ref(false)
const handleCloseDialog = () => (isErrorMessage.value = false)

const form = ref({
  email: null,
  password: null,
  confirmPassword: null,
})

const updateModel = (field, value) => {
  form.value[field] = value
}

const handleSubmit = async () => {
  isLoading.value = true

  if (isSuccessSendResetPassword.value) {
    navigateTo('/')
  } else {
    let payload = {
      token: token,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword,
    }

    try {
      const { status, message } = await useFetchApi('POST', 'email/reset', {
        body: payload,
      })

      if (status) {
        isLoading.value = false
        isSuccessSendResetPassword.value = true
      }

      // console.log(response)
    } catch (error) {
      isLoading.value = false
      const message = error._data.message
      const password = form.value.password
      const confirmPassword = form.value.confirmPassword
      if (password === null) {
        errorMessage.value = t('passwordRequired')
      } else {
        if (password.length < 8) {
          errorMessage.value = t('minLength', { number: 8 })
        } else if (confirmPassword !== password) {
          errorMessage.value = t('passwordNotMatch')
        } else {
          errorMessage.value = message
        }
      }
      isErrorMessage.value = true
    }
  }
}

const fetchingEmailData = async () => {
  try {
    const { data } = await useFetchApi('GET', 'email/decrypt?token=' + token)
    form.value.email = data.email
  } catch (error) {
    console.log("Error: Can't save spin result")
  }
}

const validateInput = (field, value) => {
  // console.log(`Validated ${field}:`, value)
}

onMounted(() => {
  fetchingEmailData()
  store.fetchingSettingsData()
})
</script>
