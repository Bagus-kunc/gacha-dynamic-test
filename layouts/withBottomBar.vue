<template>
  <main
    class="w-full max-w-md mx-auto h-full overflow-hidden bg-white flex flex-col relative bg-[url('/images/bg-red2.webp')] bg-cover bg-center"
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

    <section class="min-h-dvh max-h-[calc(100dvh-30px)] overflow-y-auto pb-32">
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

useHead({
  title: t('headTitle'),
  meta: [
    { name: 'description', content: config.public.META_TITLE },
    // Facebook
    { name: 'og:title', content: config.public.META_TITLE },
    { name: 'og:description', content: config.public.META_DESCRIPTION },
    { name: 'og:image', content: config.public.META_IMAGE },
    { name: 'og:url', content: config.public.META_URL },
    { name: 'og:type', content: 'Website' },
    { name: 'og:image:width', content: '1200' },
    { name: 'og:image:height', content: '630' },
    // twitter
    { name: 'twitter:title', content: config.public.META_TITLE },
    { name: 'twitter:description', content: config.public.META_DESCRIPTION },
    { name: 'twitter:image', content: config.public.META_IMAGE },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image:width', content: '1200' },
    { name: 'twitter:image:height', content: '630' },
  ],
})
</script>
