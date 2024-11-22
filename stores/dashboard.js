import { reactive } from 'vue'

export const store = reactive({
  point: 0,
  async fetchingDashboardData() {
    try {
      const { data } = await useFetchApi('GET', 'dashboard')
      this.point = data.point
    } catch (error) {
      console.log("Error: Can't save spin result")
    }
  },
})
