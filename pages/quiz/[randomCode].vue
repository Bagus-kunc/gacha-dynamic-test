<template>
  <div class="flex flex-col overflow-hidden grow">
    <HeaderBar>
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="header text-black font-bold text-exd-1824.52"
      >
        {{ settings?.pre_gacha?.quiz?.page_title }}
      </p>
    </HeaderBar>

    <div class="flex flex-col items-center h-screen mt-24 grow">
      <div
        class="flex flex-col items-center justify-between w-full p-5 bg-yellow-300 min-h-[55%]"
        :style="{
          background:
            settings?.pre_gacha?.quiz?.background_page.type === 'image'
              ? `url(${settings?.pre_gacha?.quiz?.background_page.value})`
              : settings?.pre_gacha?.quiz?.background_page.value,
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
        }"
      >
        <div class="flex flex-col items-center justify-center gap-1">
          <p
            class="bg-[#341f15] text-white text-[2.5vw] xs:text-[12px] sm:text-[16px] px-3 py-1 rounded-full font-semibold"
          >
            {{ settings?.pre_gacha?.quiz?.page_sub_title }}
          </p>
          <p
            class="text-[3.4vw] xs:text-[18px] sm:text-[22px] text-[#341f15] text-center px-3 py-2 rounded-full font-bold"
          >
            QUESTIONQUESTION QUESTIONQUESTION?
          </p>
        </div>

        <div class="flex flex-col items-center justify-center w-[68%] gap-1">
          <p
            class="text-[2.5vw] xs:text-[12px] sm:text-[16px] text-[#341f15] text-center px-3 py-2 rounded-full font-bold"
          >
            {{ settings?.pre_gacha?.quiz?.answer_box_text }}
          </p>
          <InputTextArea
            name="answer"
            placeholder="Answer"
            class="w-full h-[25vw] sm:h-28 border border-[#341f15] rounded-md"
          />
        </div>

        <div
          class="flex items-center justify-center w-full gap-0 px-3 py-2 text-white"
          :style="{ background: settings?.pre_gacha?.quiz?.label_color }"
        >
          <a
            :href="settings?.pre_gacha?.quiz?.url_link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[2.5vw] xs:text-[12px] sm:text-[16px] flex text-center items-center rounded-full font-bold underline cursor-pointer"
          >
            {{ settings?.pre_gacha?.quiz?.url_link_text }}
            <IconsExport
              :style="{ color: '#ffffff' }"
              class="w-6 h-6 ml-[2px] cursor-pointer"
            />
          </a>
        </div>
      </div>
      <div class="bg-[#e8e7b5] w-full pb-24 flex-auto">
        <div
          class="max-h-[28vh] sm:max-h-[31vh] md:max-h-[31vh] lg:max-h-[31vh] p-5 overflow-y-auto scrollable-content text-exd-gray-scorpion"
        >
          <h3 class="text-[2.5vw] xs:text-[12px] sm:text-[16px] font-bold text-[#341f15] mb-2">
            {{ settings?.pre_gacha?.quiz?.add_notes_title }}
          </h3>
          <p class="flex flex-col gap-1 text-justify text-[2vw] xs:text-[11px] sm:text-[15px]" v-html="terms" />
        </div>
      </div>

      <div class="fixed bottom-0 z-50 w-full max-w-md px-8 mx-auto mb-1">
        <SolidButton
          :label="settings?.pre_gacha?.quiz?.button_text"
          :bgColor="
            settings?.pre_gacha?.quiz?.button_and_text_color?.background
          "
          :textColor="settings?.pre_gacha?.quiz?.button_and_text_color?.color"
          :disabled="false"
          :has-loading="false"
          :on-click="handleQuiz"
          has-bottom
        />
      </div>
    </div>
  </div>

  <Modal 
    :is-open="showModal"
    :on-close="() => toggleModal()"
  >
    <template #body>
      <div class="flex flex-col items-center justify-center p-5 text-center">
        <IconsWarning class="w-8 h-8 xs:w-9 sm:h-9 md:w-10 md:h-10 " :style="{ color: settings?.global?.icon_color?.background }" />
        <p class="font-bold text-[2.5vw] xs:text-[12px] sm:text-[14px] md:text-exd-1424">
          {{ settings?.pre_gacha?.quiz?.warning_message }}
        </p>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import InputTextArea from '~/components/InputTextArea.vue'

definePageMeta({
  middleware: async (to, from) => {
    const location = to.params.randomCode
    const { data } = await useFetchApi('GET', '/location/password/' + location)

    if (data && data.before_spin_type === 1) {
      return navigateTo(`/spin/${location}`)
    }
    if (data && data.before_spin_type === 2) {
      return navigateTo(`/scan/${location}`)
    }
  },
})

const settings = useState('settings')
const LOCALE = useCookie('LOCALE')

const route = useRoute()

const showModal = ref(false)
const toggleModal = () => {
  showModal.value = !showModal.value
}

const handleQuiz = async () => {
  showModal.value = true

  const location = route.params.randomCode
  console.log(location)
}

const terms = ref('')

const getTerms = async () => {
  try {
    terms.value = settings.value?.pre_gacha?.quiz?.text1?.[LOCALE.value] || ''
  } catch (error) {
    console.error("Error: Can't get terms", error)
    terms.value = ''
  }
}

onMounted(() => {
  getTerms()
})
</script>

<style scoped>
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
