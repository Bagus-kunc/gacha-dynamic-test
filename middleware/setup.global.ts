
export default defineNuxtRouteMiddleware(async (to, from) => {
  const allowPaths = ['spin']


  const res = await useFetchApi('GET', 'settings')

  const settings = useState('settings', () => res.data)

  console.log(settings.value)
 
})
