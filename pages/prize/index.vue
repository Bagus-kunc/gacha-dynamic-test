<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('listOfPrizesAndExchanges') }}
    </p>
  </HeaderBar>
  <div ref="prizeCards" class="scroll-container relative flex flex-col bg-center w-full">
    <div class="flex flex-col mt-[24%] items-center mb-4">
      <p class="text-white text-exd-1530 font-bold">
        {{ $t('currentPoints') }}
      </p>
      <p class="text-white text-exd-56112 font-bold relative -top-10">
        {{ store.point }}<span class="text-exd-1530 ml-1">pt</span>
      </p>
    </div>

    <div class="flex flex-col gap-8 px-8 relative -top-14">
      <template v-if="isFetching">
        <PagesPrizeCard
          v-for="n in 1"
          :key="n"
          :keyBody="n"
          :body="[]"
          :currentPoint="0"
          :rankColor="n"
          :is-fetching="true"
        />
      </template>
      <template v-else>
        <PagesPrizeCard
          v-for="(prize, key) in prizes"
          :key="key"
          :keyBody="key"
          :body="prize"
          :currentPoint="store.point"
          :rankColor="rankColor"
          :is-fetching="false"
        />
      </template>
    </div>

    <div class="flex flex-col px-8 relative -bottom-14">
      <template v-if="isFetching">
        <PagesPrizeHistory
          v-for="n in 1"
          :key="n"
          :keyBody="n"
          :body="[]"
          :currentPoint="0"
          :rankColor="n"
          :is-fetching="true"
        />
      </template>
      <template v-else>
        <PagesPrizeHistory
          v-for="(prize, key) in prizes"
          :key="key"
          :keyBody="key"
          :body="prize"
          :currentPoint="store.point"
          :rankColor="rankColor"
          :is-fetching="false"
        />
      </template>
    </div>

    <div class="vertical-menu bottom-10">
        <div class="menu-item">
          <p class="btn-click" @click="handleScrollUp">景 品 一 覧</p>
        </div>
        <div class="menu-item">
          <p class="btn-click" @click="handleScrollDown">交 換 履 歴</p>
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
const prizeCards = ref(null);
const isFetching = ref(false)
const rankColor = ref('gold')

const fetchingPrizesData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'prizes')

    prizes.value = dataArrays(data)
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
    console.log('data array', acc)
    return acc
  }, {})
}

const handleScrollUp = () => {
  if (prizeCards.value) {
    prizeCards.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  console.log('scroll up clicked')
};

const handleScrollDown = () => {
  if (prizeCards.value) {
    prizeCards.value.scrollTo({
      top: prizeCards.value.scrollHeight,
      behavior: 'smooth'
    });
  }
  console.log('scroll down clicked')
}

onMounted(() => {
  fetchingPrizesData()
  console.log('prize', prizes.value)
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
}

.btn-click {
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
</style>
