// middleware/check-submenu-access.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const settings = useState('settings')
  const screens = settings.value?.flow?.screens

  // Mapping route ke permission dari API
  const pageAccessMap = {
    '/dashboard': screens?.user_dashboard_screen?.show_user_dashboard_screen,
    '/': screens?.show_user_tap_screen,
    '/redeem': screens?.user_dashboard_screen?.redeem_prize,
  }

  const allowed = pageAccessMap[to.path]

  if (allowed === false) {
    return navigateTo('/not-found')
  }
})
