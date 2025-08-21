<template>
  <div class="flex flex-col grow">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion font-bold text-exd-1824.52"
      >
        {{ $t('newMemberRegistration') }}
      </p>
    </HeaderBar>

    <div
      class="flex flex-col justify-between w-full gap-6 px-3 pb-3 mt-32 grow"
    >
      <div class="flex flex-col grow">
        <p
          class="mt-8 font-bold text-center text-exd-gray-scorpion text-exd-1416"
        >
          {{ $t('registrationComplete') }}
        </p>
        <div
          class="flex flex-col max-w-xs mx-auto mt-8 font-normal leading-loose text-exd-gray-scorpion text-exd-1416 text-start"
        >
          <p>{{ $t('registrationCompleteInformation1') }}</p>

          <p>{{ $t('registrationCompleteInformation2') }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 z-50 w-full max-w-md mx-auto mb-2">
    <SolidButton
      :label="settings.register_login?.change_membership_information_page_2?.button_text"
      :bgColor="settings.register_login?.change_membership_information_page_2?.button_text_and_color?.background"
      :textColor="settings.register_login?.change_membership_information_page_2?.button_text_and_color?.color"
<<<<<<< HEAD
      :on-click="handleRedirect"
=======
      :on-click="goTo"
>>>>>>> 642e66d9c81dca6e67a3a08553537f6678f23805
      :has-loading="isLoading"
      has-bottom
    />
  </div>
</template>

<script setup>
import useRegister from '~/composables/useRegister'

const router = useRouter()
const register = useRegister()
const { isSpin } = storeToRefs(register)
const { decryptData } = useEncryption()
const settings = useState('settings')

const saveSpin = async () => {
  if (!isSpin.value) return
  const storedData = useCookie('VALID_PASSWORD')

  const parseData = decryptData(storedData.value)
  const slug = parseData?.slug?.toUpperCase()
  const slugStorageName = `${slug}_GACHA`
  const slugStorage = decryptData(localStorage.getItem(slugStorageName))
  try {
    const response = await useFetchApi('POST', 'gacha/save/temp', {
      body: {
        point_id: slugStorage?.point_id,
        location_id: slugStorage?.location_id,
        temporary_user_id: localStorage.getItem('USER_ID'),
        character_id: slugStorage?.character_id,
        log_id: slugStorage?.log_id,
      },
    })
  } catch (error) {
    console.log("Error: Can't save spin result")
  }
}

const goTo = () => {
  const needConfirm = localStorage.getItem('NEED_CONFIRMATION')

  if (needConfirm === 'false') {
    navigateTo('/#registration-complete')
  } else {
    navigateTo('/')
  }

  localStorage.removeItem('REGISTER_SUBMITTED')
}

onMounted(() => {
  saveSpin()
})
</script>
