import CryptoJS from 'crypto-js'

export const useEncryption = () => {
  const config = useRuntimeConfig()

  const secretKey = computed(() => {
    return config.public.SECRET_KEY
  })

  const encryptData = (data: any) => {
    let serialization
    if (typeof data === 'object') {
      serialization = JSON.stringify(data)
    } else {
      serialization = data
    }

    const encryptedData = CryptoJS.AES.encrypt(
      serialization,
      secretKey.value
    ).toString()
    return encryptedData
  }

  function decryptData(encryptedData: any) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey.value)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    if (isJSON(decryptedData)) {
      return JSON.parse(decryptedData)
    }

    return decryptedData
  }

  function isJSON(str: any) {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  return {
    encryptData,
    decryptData,
  }
}
