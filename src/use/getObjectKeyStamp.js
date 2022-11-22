export const useGetObjectKeyStamp = (obj, id) => {
  const allItems = Object.values(obj)
  if (allItems.length > 0) {
    return allItems.find(el => el.id === id).keyStamp
  }
}
