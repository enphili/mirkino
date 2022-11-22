export const useAuthorAvatarPath = path => {
  if (!path) return 'https://www.gravatar.com/avatar'
  if (path.includes('https://')) return path.substring(1)
  return `https://image.tmdb.org/t/p/w45${path}`
}
