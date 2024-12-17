export default defineNuxtRouteMiddleware(async (to, from) => {
  const validPassword = useCookie('VALID_PASSWORD')
  const { decryptData } = useEncryption()

  const randomCode = to.params?.randomCode || from.params?.randomCode
  const { data }: any = await useFetchApi(
    'GET',
    '/location/password/' + randomCode
  )

  const validSlug = decryptData(validPassword.value || '{}')

  if (data) {
    const spinType = useState('spin_type', () => 0)
    spinType.value = data.spin_type

    if (data.spin_type === 4) {
      const spinInterval = useState('spin_interval', () => 0)
      spinInterval.value = data.spin_interval
    }
  }

  if (data && data.not_required_pin === 0 && validSlug?.slug !== randomCode) {
    return navigateTo({
      path: `/scan/${randomCode}`,
    })
  }

  if (data && data.not_required_pin === 1 && validSlug?.slug !== randomCode) {
    return navigateTo({
      path: `/spin/${randomCode}`,
    })
  }
})
