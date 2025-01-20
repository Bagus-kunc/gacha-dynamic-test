export default defineNuxtRouteMiddleware((to, from) => {
  const allowPaths = ['spin']

  if (allowPaths.some((path) => !to.path.includes(path))) {
    return abortNavigation()
  }
})
