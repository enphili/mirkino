export const upperCaseFirstChar = str => {
  if (!str || typeof str !== 'string') return str
  return str[0].toUpperCase() + str.slice(1)
}
