export const getReleaseDate = item => {
  if (!item || !item.media_type) return 'Дата неизвестна'

  switch (item.media_type) {
    case 'movie':
      return item.release_date || 'Дата неизвестна'
    case 'tv':
      return item.first_air_date || 'Дата неизвестна'
    default:
      return 'Дата неизвестна'
  }
}
