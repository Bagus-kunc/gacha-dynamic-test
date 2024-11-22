export default defineNuxtPlugin(({ vueApp }) => {
  function preventScroll(e) {
    e.preventDefault()
  }

  window.addEventListener('focusin', () => {
    // Keyboard is opened
    // document.addEventListener('touchmove', preventScroll, { passive: false })
  })

  window.addEventListener('focusout', () => {
    // Keyboard is closed
    // document.removeEventListener('touchmove', preventScroll, { passive: false })
  })
})
