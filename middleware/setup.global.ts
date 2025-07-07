import { fetchAndCacheImage } from "~/utils/fetchAndCacheImage"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const allowPaths = ['spin']

  const res = await useFetchApi('GET', 'settings')
  const settings = useState('settings', () => res.data)

  console.log(settings.value)

  if (settings.value?.backgrounds?.length) {
    const imageUrls = await Promise.all(
      settings.value.backgrounds.map(async (bg: any) => {
        try {
          if (bg.type === 'image') {
            await fetchAndCacheImage(bg.value)
          }
        } catch (e) {
          console.error('Fetch gagal:', bg.value, e)
          return null
        }
      })
    )

    console.log('Image URLs:', imageUrls)
  }

  // if (allowPaths.some((path) => !to.path.includes(path))) {
  //   return abortNavigation()
  // }
})
