export const randomItemFromArray = arr => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null
  }
  const rand = Math.floor(Math.random() * arr.length)
  return arr[rand]
}
