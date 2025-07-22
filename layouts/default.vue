<template>
  <main
    class="relative flex flex-col w-full h-full max-w-md mx-auto overflow-auto bg-white"
  >
    <slot />
  </main>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const { t } = useI18n()
const settings = useState('settings')

useHead({
  title: settings.value?.global?.ogp?.title || 'Default Title',
  meta: [
    { name: 'description', content: settings.value?.global?.ogp?.description || 'Default Description' },

    { property: 'og:title', content: settings.value?.global?.ogp?.title },
    { property: 'og:description', content: settings.value?.global?.ogp?.description },
    { property: 'og:image', content: settings.value?.global?.ogp?.image },
    { property: 'og:url', content: config.public.META_URL },
    { property: 'og:type', content: 'website' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: settings.value?.global?.ogp?.title },
    { name: 'twitter:description', content: settings.value?.global?.ogp?.description },
    { name: 'twitter:image', content: settings.value?.global?.ogp?.image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image:width', content: '1200' },
    { name: 'twitter:image:height', content: '630' },
  ]
})
</script>
