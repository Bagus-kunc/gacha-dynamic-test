<template>
  <HeaderBar withLogo />
  <div
    class="flex flex-col justify-between px-8 mt-20 !h-full grow !bg-no-repeat !bg-cover !bg-center"
    :style="{
      background:
        settings?.prize?.step_2?.data?.background_page_2.type === 'image'
          ? `url(${settings?.prize?.step_2?.data?.background_page_2.value})`
          : settings?.prize?.step_2?.data?.background_page_2.value,
    }"
  >
    <p
      class="mx-auto my-8 font-bold text-center text-exd-gray-scorpion text-exd-1424 max-w-44"
    >
      {{ settings?.prize?.step_2?.data?.page_sub_title_2 }}
    </p>
    <div class="relative flex-1 w-full">
      <div
        class="border-4 flex-1 w-5/6 text-center absolute top-8 left-1/2 transform -translate-x-1/2 px-6 py-2 !font-extrabold rounded-lg text-[38px]"
        :style="{
          color: settings?.prize?.step_2?.data?.text_1_color,
          borderColor: settings?.prize?.step_2?.data?.text_1_color,
        }"
      >
        {{ settings?.prize?.step_2?.data?.text_3 || '' }}
      </div>
    </div>
  </div>
  <div class="fixed bottom-0 w-full max-w-md px-8 mx-auto">
    <SolidButton
      :on-click="() => goTo('top')"
      :label="settings?.prize?.step_2?.data?.button_text_2"
      has-bottom
      :bg-color="
        settings?.prize?.step_2?.data?.button_and_text_color?.background
      "
      :text-color="settings?.prize?.step_2?.data?.button_and_text_color?.color"
    />
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ['auth', 'navigation-guard'],
  layout: 'default',
})

const router = useRouter()
const settings = useState('settings')

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
</script>
