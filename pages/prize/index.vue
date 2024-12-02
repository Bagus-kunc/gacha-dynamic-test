<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('listOfPrizesAndExchanges') }}
    </p>
  </HeaderBar>
  <div
    ref="prizeCards"
    class="scroll-container relative flex flex-col bg-center w-full"
  >
    <div class="flex flex-col mt-[42%] items-center mb-4"></div>

    <div class="flex flex-col gap-3 px-8 relative -top-14">
      <template v-if="isFetching">
        <Skeleton v-if="isFetching" class="!w-full !h-full"></Skeleton>
      </template>
      <template v-else>
        <PagesPrizeCard
          v-for="(prize, key) in prizes"
          :key="key"
          :keyBody="key"
          :body="prize.data"
          :totalData="prize.totalData"
          :currentPoint="store.point"
          :is-fetching="false"
        />
      </template>
    </div>

    <div ref="prizeHistory" class="flex flex-col px-8 relative -bottom-5">
      <div class="bg-exd-gray-44 px-2 py-1 text-exd-1424">
        <p>{{ $t('exchangeHistory') }}</p>
      </div>
      <template v-if="isFetching">
        <PagesPrizeHistory
          v-for="n in 1"
          :key="n"
          :keyBody="n"
          :body="[]"
          :currentPoint="0"
          :is-fetching="true"
        />
      </template>
      <template v-else>
        <PagesPrizeHistory
          v-for="(redeem, key) in redeems"
          :key="key"
          :keyBody="key"
          :body="redeem"
          :currentPoint="store.point"
          :is-fetching="false"
        />
      </template>
    </div>

    <div class="vertical-menu bottom-10">
      <div class="menu-item">
        <p
          class="btn-click"
          :class="{ 'reverse-mode': $i18n.locale === 'en' }"
          @click="handleScrollUp"
        >
          {{ $t('listOfPrizes') }}
        </p>
      </div>
      <div class="menu-item">
        <p
          class="btn-click"
          :class="{ 'reverse-mode': $i18n.locale === 'en' }"
          @click="handleScrollDown"
        >
          {{ $t('exchangeHistory') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '~/stores/dashboard.js'

definePageMeta({
  middleware: 'auth',
  layout: 'without-pb',
})

const prizes = ref([])
const redeems = ref([])
const prizeCards = ref(null)
const isFetching = ref(false)
const rankColor = ref('rainbow')

const prizeHistory = ref(null)

const fetchingPrizesData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'prize-by-poin')
    prizes.value = data

    // prizes.value = dataArrays(data)
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const fetchingRedeemsData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'prize-redeemed')
    redeems.value = data.data

  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

const dataArrays = (data) => {
  return data.reduce((acc, obj) => {
    const key = Object.keys(obj)[0]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key] = acc[key].concat(obj[key])
    return acc
  }, {})
}

const handleScrollUp = () => {
  if (prizeCards.value) {
    prizeCards.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const handleScrollDown = () => {
  if (prizeHistory.value) {
    prizeHistory.value.style.paddingTop = '120px'
    prizeHistory.value.style.marginTop = '-120px'

    prizeHistory.value.scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      prizeHistory.value.style.paddingTop = ''
      prizeHistory.value.style.marginTop = ''
    }, 3000)
  }
}

onMounted(() => {
  fetchingPrizesData(),
  fetchingRedeemsData()
})
</script>

<style scoped>
.scroll-container {
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.vertical-menu {
  position: sticky;
  display: flex;
  flex-direction: column;
  align-items: end;
  border-radius: 8px 0 0 8px;
  pointer-events: none;
}

.menu-item {
  margin: 5px 0;
  pointer-events: auto;
  writing-mode: vertical-rl;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 20px 10px;
  background: rgba(0, 0, 0, 0.638);
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  transition: color 0.3s, background-color 0.3s;
  color: white;
}

.btn-click {
}

.reverse-mode {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}
</style>
