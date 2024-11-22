<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const props = defineProps(['visible'])
const emit = defineEmits(['update:visible'])
const LOCALE = useCookie('LOCALE')

const langItems = [
  {
    label: 'JA',
    value: 'ja',
    command: () => changeLanguage('ja'),
  },
  {
    label: 'EN',
    value: 'en',
    command: () => changeLanguage('en'),
  },
]

function changeLanguage(lang) {
  locale.value = lang
  LOCALE.value = lang
  emit('update:visible', false)
}

const clickOutside = async (event) => {
  const panel = document.getElementById('languange-panel')
  if (!(panel === event.target || panel.contains(event.target))) {
    if (props.visible) {
      emit('update:visible', false)
    }
  }
}

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      setTimeout(() => {
        document.body.addEventListener('click', clickOutside)
      }, 200)
    } else {
      document.body.removeEventListener('click', clickOutside)
    }
  }
)

onMounted(() => {})

onUnmounted(() => {
  document.body.removeEventListener('click', clickOutside)
})
</script>

<template>
  <transition name="fade">
    <div v-if="props.visible" class="languange-panel" id="languange-panel">
      <ul>
        <li v-for="lang in langItems" role="none">
          <a
            href="javascript:void(0)"
            :class="
              locale === lang.value
                ? 'bg-exd-red text-white active-text'
                : '!text-exd-gray-scorpion'
            "
            @click="changeLanguage(lang.value)"
          >
            <span>{{ lang.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </transition>
</template>
<style scoped>
.languange-panel {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
  padding: 0.25rem;
  position: absolute;
  right: 0;
  top: calc(100% + 2px);
  transform-origin: top;
  width: 105px;
}

.languange-panel ul {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.languange-panel li {
  margin: 2px;
  position: relative;
}

.languange-panel a {
  border-radius: 6px;
  color: var(--text-color);
  display: inline-flex;
  overflow: hidden;
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.active-text {
  -webkit-text-fill-color: rgba(255, 255, 255, 1);
  -webkit-opacity: 1;
}
</style>
