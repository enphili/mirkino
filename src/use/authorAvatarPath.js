export const useAuthorAvatarPath = path => {
  if (!path || typeof path !== 'string') return 'https://www.gravatar.com/avatar'
  if (path.startsWith('https://')) return path
  if (path.startsWith('/')) return `https://image.tmdb.org/t/p/w45${path}`
  return 'https://www.gravatar.com/avatar'
}
