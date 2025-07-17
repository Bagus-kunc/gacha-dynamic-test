<template>
    <div class="flex flex-col overflow-hidden grow">
        <HeaderBar>
            <p
                style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
                class="header text-black font-bold text-exd-1824.52"
            >
                {{ $t('quiz') }}
            </p>
        </HeaderBar>

        <div class="flex flex-col items-center h-screen mt-24 grow">  
            <div class="flex flex-col items-center justify-between w-full p-5 bg-yellow-300 min-h-[55%]">
              <div class="flex flex-col items-center justify-center gap-1">
                <p class="bg-[#341f15] text-white text-[2.5vw] xs:text-[12px] sm:text-[16px] px-3 py-1 rounded-full font-semibold">{{ $t('quiz') }}</p>
                <p class="text-[3.4vw] xs:text-[18px] sm:text-[22px] text-[#341f15] text-center px-3 py-2 rounded-full font-bold">QUESTIONQUESTION QUESTIONQUESTION?</p>
              </div>

              <div class="flex flex-col items-center justify-center w-full gap-1">
                <p class="text-[2.5vw] xs:text-[12px] sm:text-[16px] text-[#341f15] text-center px-3 py-2 rounded-full font-bold ">{{ $t('answer') }}</p>
                <InputTextArea name="answer" placeholder="Answer" class="w-[70%] h-[25vw] sm:h-28 border border-[#341f15] rounded-md" />
              </div>
              
              <div class="flex flex-col items-center w-full gap-0 px-3 py-2 text-white bg-exd-red-vermilion">
                <p class="text-[2.5vw] xs:text-[12px] sm:text-[16px] flex text-center items-center rounded-full font-bold ">クイズは<a href="https://google.com" class="flex underline cursor-pointer">でらっくじ公式X</a><IconsExport :style="{ color: '#ffffff' }" class="w-6 h-6 ml-[2px] cursor-pointer" /></p>
                <p class="text-[2.5vw] xs:text-[12px] sm:text-[16px] text-center rounded-full font-bold ">をフォローしてチェック！</p>
              </div>
            </div>
            <div class="bg-[#e8e7b5] w-full pb-24 flex-auto">
                <div class="max-h-[28vh] sm:max-h-[31vh] md:max-h-[31vh] lg:max-h-[31vh] p-5 overflow-y-auto scrollable-content text-exd-gray-scorpion">
                  <h3>
                    注意事項
                  </h3>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                  <p>
                    ダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミーダミー</p>
                    <p>END</p>
                </div>
            </div>

            <div class="fixed bottom-0 z-50 w-full max-w-md px-8 mx-auto mb-1">
              <SolidButton
                label="GO!"
                bgColor="#341f15"
                textColor="#ffffff"
                :disabled="false"
                :has-loading="false"
                :on-click="() => {}"
                has-bottom
              />
          </div>
        </div>
    </div>
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

const getQuiz = async () => {
    const location = route.params.randomCode
    console.log(location)
}
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