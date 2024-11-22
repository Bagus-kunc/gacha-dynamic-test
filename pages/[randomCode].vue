<template>
  <div
    class="grow bg-[url('assets/images/bg-red.webp')] bg-cover bg-center justify-between items-center flex flex-col overflow-hidden"
  >
    <div
      class="flex-1 items-center flex flex-col pt-[2rem] pb-20 px-8 overflow-y-auto overflow-x-hidden"
    >
      <div class="relative w-full text-right -right-4">
        <button type="button" aria-haspopup="true" @click="langPanelToggle">
          <img
            src="/images/intl-icon.svg"
            alt="intl"
            width="40"
            height="40"
            preload
            class="cursor-pointer bg-white rounded-full"
          />
        </button>
        <LanguangePanel v-model:visible="langPanel" />
      </div>
      <img
        src="/images/logo.png"
        alt="logo"
        width="190"
        height="71"
        preload
        class="mb-8"
      />
      <div class="flex flex-col mx-8 justify-start items-center w-full">
        <h1
          class="text-center font-bold text-exd-1824.52 p-3 text-white"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          {{ $t('password') }}
        </h1>
        <div
          class="bg-white h-exd-150 rounded-xl text-center grid place-items-center text-exd-6081.72 text-exd-red w-full font-bold"
        >
          <Skeleton
            class="bg-gray-100"
            width="10rem"
            height="4rem"
            borderRadius="16px"
            v-if="isLoading && responseData.password !== ''"
          ></Skeleton>
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)" v-else>
            {{ responseData.password }}
          </p>
        </div>
        <div class="text-white font-medium text-xs text-start p-3">
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            ※ {{ $t('passwordIsOnlyForToday') }}
          </p>
        </div>
      </div>
      <div
        class="bg-white text-center py-1 text-sm px-4 w-full text-exd-red font-bold mt-8"
        v-if="responseData.description && responseData.image"
      >
        {{ $t('qrCodeSpot') }}
      </div>
      <div
        class="inline-flex justify-between bg w-full gap-3 mt-3"
        v-if="responseData.description"
      >
        <p
          class="text-white text-justify text-xs basis-1/2 vhtml-desc"
          style="overflow-wrap: break-word; inline-size: 180px"
          v-html="responseData.description"
        ></p>
        <div class="basis-1/2 overflow-hidden flex-0">
          <img
            :src="displayImage"
            alt="response-image"
            preload
            class="size-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import emptyImage from '~/assets/images/no-image.svg'

const langPanel = ref(false)
const langPanelToggle = (event) => {
  langPanel.value = !langPanel.value
}
const route = useRoute()
const responseData = ref({
  password: '',
  image: '',
  description: '',
})
const isLoading = ref(false)

const getPassword = async (id) => {
  try {
    isLoading.value = true

    const { status, data } = await useFetchApi(
      'GET',
      '/location/password/' + id
    )
    if (data) {
      responseData.value = {
        password:
          data.password ?? Math.floor(1000 + Math.random() * 9000).toString(),
        description: data.description,
        image: data.image,
      }
    }

    isLoading.value = false
  } catch (error) {
    navigateTo('/')
  }
}

const displayImage = computed(() => {
  return responseData.value.image || emptyImage
})

onMounted(async () => {
  const location = route.params.randomCode

  await getPassword(location)
})
</script>
