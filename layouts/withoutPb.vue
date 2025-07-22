<template>
  <main
    class="w-full max-w-md mx-auto h-full overflow-hidden bg-white flex flex-col relative bg-[url('/images/green_base.png')] bg-cover bg-center"
  >
    <HeaderBar :hasBack="hasBack">
      <p
        style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        class="text-exd-gray-scorpion font-bold text-exd-1824.52"
      >
        {{ title }}
      </p>
    </HeaderBar>

    <slot name="header"></slot>

    <section class="min-h-dvh max-h-[calc(100dvh-30%)] overflow-y-auto">
      <slot />
    </section>
    <BottomBar />
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const layoutCustomProps = useAttrs()

const hasBack = ref(layoutCustomProps.hasBack ?? false)
const title = ref(layoutCustomProps.title)

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
