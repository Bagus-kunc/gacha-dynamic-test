import { reactive } from 'vue'

export const store = reactive({
  async fetchingSettingsData() {
    try {
      const { data } = await useFetchApi('GET', 'settings')

      const settings = useState('settings', () => data)

      this.data = data

      // * Buttons
      this.bgColorOne = data.buttons[0].background
      this.textColorOne = data.buttons[0].color

      this.bgColorTwo = data.buttons[1].background
      this.textColorTwo = data.buttons[1].color

      // * Forgot Password
      this.fpBtnBgColor = data.forgot_password.button_and_text_color.background
      this.fpBtnTextColor = data.forgot_password.button_and_text_color.color

      this.fpPageTitle = data.forgot_password.page_title

      // * Languages
      this.languages = data.languages
    } catch (error) {
      console.log("Error: Can't save spin result")
    }
  },
})