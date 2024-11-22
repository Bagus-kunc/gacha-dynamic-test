<template>
  <div class="grow flex flex-col">
    <HeaderBar hasBack>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion font-bold text-exd-1824.52"
      >
        {{ $t('newMemberRegistration') }}
      </p>
    </HeaderBar>

    <div
      class="flex flex-col grow px-3 mt-32 pb-3 justify-between gap-6 w-full"
    >
      <div class="flex flex-col grow">
        <p
          class="text-exd-gray-scorpion font-bold text-exd-1416 text-center mt-8"
        >
          {{ $t('registrationComplete') }}
        </p>
        <div
          class="text-exd-gray-scorpion font-normal text-exd-1416 text-start mt-8 max-w-xs mx-auto flex flex-col leading-loose"
        >
          <p>{{ $t('registrationCompleteInformation1') }}</p>

          <p>{{ $t('registrationCompleteInformation2') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useRegister from '~/composables/useRegister'

const register = useRegister()
const { isSpin } = storeToRefs(register)
const { decryptData } = useEncryption()

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

onMounted(() => {
  saveSpin()
})
</script>
