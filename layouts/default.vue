<template>
  <main
    class="relative flex flex-col w-full h-full max-w-md mx-auto overflow-auto bg-white"
  >
    <slot />
  </main>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const settings = useState('settings')

const requestURL = useRequestURL()
const url = requestURL.origin

useSeoMeta({
  title: settings.value?.global?.ogp?.title,
  meta: [
    {
      name: 'description',
      content: stripHtml(settings.value?.global?.ogp?.description),
    },

    { property: 'og:title', content: settings.value?.global?.ogp?.title },
    { property: 'og:description', content: stripHtml(settings.value?.global?.ogp?.description) },
    { property: 'og:image', content: settings.value?.global?.ogp?.image },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: settings.value?.global?.ogp?.title },
    { name: 'twitter:description', content: stripHtml(settings.value?.global?.ogp?.description) },
    { name: 'twitter:image', content: settings.value?.global?.ogp?.image },
  ],
})

function stripHtml(html = '') {
  return html.replace(/<\/?[^>]+(>|$)/g, '').trim()
}

onMounted(() => {
  if (!route.path.includes('quiz')) {
    localStorage.removeItem('answer-quiz')
  }
  if (!route.path.includes('scan')) {
    localStorage.removeItem('answer-password')
  }
})

</script>
