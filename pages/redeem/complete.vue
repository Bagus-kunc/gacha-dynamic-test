<template>
  <div class="grow flex flex-col">
    <HeaderBar>
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

    <div
      class="flex flex-col grow px-3 mt-32 pb-3 justify-between gap-6 w-full"
    >
      <div v-if="type" class="flex flex-col grow">
        <p
          class="text-exd-gray-scorpion font-semibold text-exd-1416 text-center mt-8"
        >
          {{ $t('done') }}
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full relative gap-1">
    <SolidButton
      :on-click="handleClick"
      :has-loading="isLoading"
      :label="$t('gachaTop')"
      has-bottom
    />
  </div>
</template>

<script setup>
import useRegister from '~/composables/useRegister'
import { useRouter, useRoute } from 'vue-router'

const { isSpin } = useRegister()
const { decryptData } = useEncryption()
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const type = ref('')

const saveSpin = async () => {
  if (!isSpin) return
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

const goTo = (type) => {
  switch (type) {
    case 'top':
      router.push('/dashboard')
      break
    case 'external':
      window.open('https://nospot.new-ordinary.co.jp/maps/nagoya')
      break

    default:
      break
  }
}

const handleClick = async () => {
  sessionStorage.clear()
  nextTick()
  goTo('top')
}

onMounted(() => {
  saveSpin()
  type.value = sessionStorage.getItem('type')
})
</script>
