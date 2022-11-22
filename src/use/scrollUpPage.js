export const useScrollUpPage = () => {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
}
