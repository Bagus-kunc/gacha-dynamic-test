export default defineNuxtRouteMiddleware((to, from) => {
  const validPassword = useCookie('VALID_PASSWORD')

  if (!validPassword.value) {
    const randomCode = to.params?.randomCode || from.params?.randomCode

    return navigateTo({
      path: `/scan/${randomCode}`,
    })
  }
})
