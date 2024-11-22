export default defineNuxtRouteMiddleware(() => {
  //to do replace with proper condition

  const TOKEN = useCookie('TOKEN')
  if (!TOKEN.value) {
    return navigateTo({ name: 'index' })
  }
})
