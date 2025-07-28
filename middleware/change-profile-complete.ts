export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const hasSubmittedProfile = localStorage.getItem('PROFILE_SUBMITTED')
        const userId = localStorage.getItem('USER_ID')
        
        if (to.path === '/profile/complete' && (!hasSubmittedProfile || !userId)) {
            return navigateTo('/profile')
        }
    }
  })