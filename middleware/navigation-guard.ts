export default defineNuxtRouteMiddleware((to) => {
  const settings = useState('settings')
  const screens = settings.value?.flow?.screens

  if (!screens) return

  const accessRules: Record<string, boolean | undefined> = {
    '/': screens.show_user_tap_screen,
    '/dashboard': screens.user_dashboard_screen?.show_user_dashboard_screen,
  }

  if (to.path.startsWith('/redeem')) {
    accessRules[to.path] = screens.user_dashboard_screen?.redeem_prize
  }

  const allowed = accessRules[to.path]

  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Route:', to.path, '| Allowed:', allowed)
  }

  if (allowed === false) {
    return navigateTo('/not-found')
  }

})

