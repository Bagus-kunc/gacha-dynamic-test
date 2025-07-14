<template>
  <main
    class="relative flex flex-col w-full h-full max-w-md mx-auto overflow-hidden bg-center bg-cover"
    :style="{ background: settings?.user_dashboard?.my_account_settings?.background?.type === 'image' ? `url(${settings?.user_dashboard?.my_account_settings?.background?.value})` : settings?.user_dashboard?.my_account_settings?.background?.value }"
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

    <section class="min-h-dvh max-h-[calc(100dvh-30px)] overflow-y-auto pb-28">
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
  title: settings.value?.global?.ogp?.title,
  meta: [
    { name: 'description', content: settings.value?.global?.ogp?.title },
    // Facebook
    { name: 'og:title', content: settings.value?.global?.ogp?.title },
    { name: 'og:description', content: settings.value?.global?.ogp?.description },
    { name: 'og:image', content: settings.value?.global?.ogp?.image },
    { name: 'og:url', content: config.public.META_URL },
    { name: 'og:type', content: 'Website' },
    { name: 'og:image:width', content: '1200' },
    { name: 'og:image:height', content: '630' },
    // twitter
    { name: 'twitter:title', content: settings.value?.global?.ogp?.title },
    { name: 'twitter:description', content: settings.value?.global?.ogp?.description },
    { name: 'twitter:image', content: settings.value?.global?.ogp?.image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image:width', content: '1200' },
    { name: 'twitter:image:height', content: '630' },
  ],
})
</script>
