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
    class="relative flex flex-col w-full bg-center scroll-container"
  >
    <div class="flex flex-col mt-[35%] items-center mb-4"></div>

    <div class="relative flex flex-col gap-3 px-10 -top-10">
      <template v-if="isFetching">
        <PagesPrizeCard
          v-for="(prize, key) in dummyPrizes"
          :key="key"
          :keyBody="key"
          :body="prize.data"
          :totalData="prize.totalVoucher"
          :currentPoint="store.point"
          :is-fetching="true"
        />
      </template>
      <template v-else>
        <PagesPrizeCard
          v-for="(prize, key) in dummyPrizes"
          :key="key"
          :keyBody="key"
          :body="prize.data"
          :totalData="prize.totalVoucher"
          :currentPoint="store.point"
          :is-fetching="false"
        />
      </template>
    </div>

    <div ref="prizeHistory" class="relative flex flex-col px-10 -bottom-5">
      <div class="px-2 py-1 text-white bg-exd-gray-44">
        <p
          v-if="!isFetching"
          class="font-semibold md:text-[15px] sm:text-[14px] text-[13px]"
        >
          {{ $t('exchangeHistory') }}
        </p>
        <Skeleton
          v-else
          class="font-semibold h-5 md:text-[15px] sm:text-[14px] text-[13px]"
        >
        </Skeleton>
      </div>
      <template v-if="isFetching">
        <PagesPrizeHistory
          v-for="(redeem, key) in dummyReedems"
          :key="key"
          :keyBody="key"
          :body="redeem"
          :currentPoint="store.point"
          :is-fetching="true"
        />
      </template>
      <template v-else>
        <PagesPrizeHistory
          v-for="(redeem, key) in dummyReedems"
          :key="key"
          :keyBody="key"
          :body="redeem"
          :currentPoint="store.point"
          :is-fetching="false"
        />
      </template>
    </div>

    <div v-if="!isFetching" class="vertical-menu bottom-[15%]">
      <div class="menu-item" @click="handleScrollUp">
        <div class="flex items-center gap-2 btn-click">
          <img
            src="~/assets/images/arrow-skip.svg"
            width="13"
            height="13"
            alt=""
            class="-rotate-90"
          />
          <p :class="{ 'reverse-mode': $i18n.locale === 'en' }">
            {{ $t('listOfPrizes') }}
          </p>
        </div>
      </div>
      <div class="menu-item" @click="handleScrollDown">
        <div class="flex items-center gap-2 btn-click">
          <p :class="{ 'reverse-mode': $i18n.locale === 'en' }">
            {{ $t('exchangeHistory') }}
          </p>
          <img
            src="~/assets/images/arrow-skip.svg"
            width="13"
            height="13"
            alt=""
            class="rotate-90"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '~/stores/dashboard.js'
import noImage from '~/assets/images/no-image.svg'

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

const dummyPrizes = {
  '2000pt': {
    totalVoucher: 2,
    data: [
      {
        user_point_id: 1,
        point_id: 1,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
      {
        user_point_id: 2,
        point_id: 2,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
    ],
  },
  '1000pt': {
    totalVoucher: 1,
    data: [
      {
        user_point_id: 1,
        point_id: 1,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
    ],
  },
  '500pt': {
    totalVoucher: 1,
    data: [
      {
        user_point_id: 1,
        point_id: 1,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
    ],
  },
  '200pt': {
    totalVoucher: 1,
    data: [
      {
        user_point_id: 1,
        point_id: 1,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
    ],
  },
  '50pt': {
    totalVoucher: 1,
    data: [
      {
        user_point_id: 1,
        point_id: 1,
        image: '/images/character.png',
        name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
        started_at: '2022/01/01',
        expired_at: '2022/01/01',
      },
    ],
  },
}

const dummyReedems = [
  {
    user_point_id: 1,
    point_id: 1,
    rank: 's',
    image: '/images/character.png',
    name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
    redeem_at: '2022-01-01',
  },
  {
    user_point_id: 2,
    point_id: 2,
    rank: 'a',
    image: '/images/character.png',
    name: '景品名景品名景品名景品名景品名景品名景品名景品名景品名景品名',
    redeem_at: '2022-01-01',
  },
]

const fetchingPrizesData = async () => {
  try {
    isFetching.value = true
    const { data } = await useFetchApi('GET', 'prize-list')
    console.log(data)
    prizes.value = data
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
  if (Array.isArray(data)) {
    return data.reduce((acc, obj) => {
      const key = Object.keys(obj)[0]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key] = acc[key].concat(obj[key])
      return acc
    }, {})
  } else if (typeof data === 'object') {
    return data
  } else {
    console.error('Data tidak valid:', data)
    return []
  }
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

onMounted(async () => {
  await fetchingPrizesData()
  fetchingRedeemsData()
})
</script>

<style scoped>
.scroll-container {
  max-height: 95vh;
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

.reverse-mode {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}
</style>
