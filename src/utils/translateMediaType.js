export const translateMediaType = item => {
  if (!item || !item.media_type) return 'Неизвестный тип медиа'

  switch (item.media_type) {
    case 'movie':
      return 'фильм'
    case 'tv':
      return 'сериал'
    default:
      return 'Неизвестный тип медиа'
  }
}
