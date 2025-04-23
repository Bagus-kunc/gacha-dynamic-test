import { reactive } from 'vue'

export const store = reactive({
  point: 0,
  async fetchingDashboardData() {
    try {
      const { data } = await useFetchApi('GET', 'dashboard')

      const sumTotal = Object.values(data).reduce(
        (acc, cur) => acc + cur.totalVoucher,
        0
      )

      this.point = sumTotal
    } catch (error) {
      console.log("Error: Can't save spin result")
    }
  },
})
