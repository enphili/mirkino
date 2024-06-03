export const useNavigateTo = async (router, name, params) => {
  await router.push({ name, params })
}
