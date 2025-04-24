import { reactive } from 'vue'

export const store = reactive({
  async fetchingDashboardData() {
    try {
      const { data } = await useFetchApi('GET', 'dashboard')

      const sumTotal = Object.values(data).reduce(
        (acc, cur) => acc + cur.totalVoucher,
        0
      )

      this.point = String(data.point).padStart(6, '0')
    } catch (error) {
      console.log("Error: Can't save spin result")
    }
  },
})
