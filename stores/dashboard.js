import { reactive } from 'vue'

export const store = reactive({
  point: 0,
  async fetchingDashboardData() {
    try {
      const { data } = await useFetchApi('GET', 'prize-by-poin')

      const sumTotal = Object.values(data).reduce(
        (acc, cur) => acc + cur.totalData,
        0
      )

      this.point = sumTotal
    } catch (error) {
      console.log("Error: Can't save spin result")
    }
  },
})
