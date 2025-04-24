<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('collection') }}
    </p>
  </HeaderBar>
  <div class="flex flex-col gap-3 px-8 mt-32 text-black bg-center">
    <div class="inline-flex items-end justify-between w-full text-white">
      <p class="font-bold text-exd-1424">{{ $t('characterCatalog') }}</p>
      <p class="font-bold leading-tight text-exd-1424">
        <span class="text-exd-2238">{{
          String(character_count).padStart(3, '0')
        }}</span
        >/{{ String(master_count).padStart(3, '0') }}
      </p>
    </div>
    <template v-if="isFetching">
      <PagesHistoryCard v-for="n in 3" :key="n" :is-fetching="true" />
    </template>
    <template v-else>
      <PagesHistoryCard
        v-for="(history, index) in histories"
        :key="index"
        :data="history"
        :is-fetching="false"
      />
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'with-bottom-bar',
})

const histories = ref([])
const character_count = ref(0)
const master_count = ref(0)
const isFetching = ref(false)

const fetchingHistoryData = async () => {
  try {
    isFetching.value = true
    const data = await useFetchApi('GET', 'history')

    histories.value = data.data

    character_count.value = data.character_count
    master_count.value = data.master_count
  } catch (error) {
    console.log(error)
  } finally {
    isFetching.value = false
  }
}

onMounted(() => {
  fetchingHistoryData()
})
</script>
