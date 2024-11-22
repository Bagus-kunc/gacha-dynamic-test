<template>
  <HeaderBar hasBack>
    <p
      style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
      class="text-exd-gray-scorpion font-bold text-exd-1824.52"
    >
      {{ $t('collection') }}
    </p>
  </HeaderBar>
  <div class="flex flex-col bg-center text-black mt-32 px-8 gap-3">
    <div class="text-white w-full inline-flex justify-between items-end">
      <p class="text-exd-1424 font-bold">{{ $t('characterCatalog') }}</p>
      <p class="font-bold text-exd-1424 leading-tight">
        <span class="text-exd-2238">{{ character_count }}</span
        >/{{ master_count }}
      </p>
    </div>
    <template v-if="isFetching">
      <PagesHistoryCard v-for="n in 3" :key="n" :data="n" :is-fetching="true" />
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
