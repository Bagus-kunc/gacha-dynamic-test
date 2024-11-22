const useRegister = defineStore('useRegister', () => {
  const source_from_cookie = useCookie('SOURCE_FROM')
  const sourceFrom = ref<string>(source_from_cookie.value || '')

  const setSourceFrom = (value: string) => {
    console.log(value)
    sourceFrom.value = value
    source_from_cookie.value = value
  }

  const isSpin = computed(() => {
    console.log(sourceFrom.value)
    return sourceFrom.value === 'spin'
  })

  return {
    isSpin,
    setSourceFrom,
  }
})

export default useRegister
