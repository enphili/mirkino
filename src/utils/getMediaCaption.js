export const getMediaCaption = item => {
  if (!item || !item.media_type) return 'Название неизвестно'

  switch (item.media_type) {
    case 'movie':
      return item.title || 'Название неизвестно'
    case 'person':
    case 'tv':
      return item.name || 'Имя неизвестно'
    case 'episode':
      return `Серия-${item.episode_number}. ${item.name || 'Название неизвестно'}`
    default:
      return 'Название неизвестно'
  }
}
