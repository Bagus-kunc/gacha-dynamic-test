import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ja from '@/locales/ja.json'
import id from '@/locales/id.json'
import ko from '@/locales/ko.json'
import zhCn from '~/locales/zh-CN.json'
import zhTw from '~/locales/zh-TW.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const locale = useCookie('LOCALE').value || 'ja'

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    fallbackLocale: 'ja',
    messages: {
      en,
      ja,
      id,
      ko,
      'zh-CN': zhCn,
      'zh-TW': zhTw,
    },
  })

  vueApp.use(i18n)
})
