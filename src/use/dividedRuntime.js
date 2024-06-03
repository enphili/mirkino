const formatRuntime = minutes => {
  minutes = Number(minutes)
  if (isNaN(minutes) || minutes <= 0) return ''

  const hours = Math.trunc(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours > 0 ? hours + ' ч' : ''} ${remainingMinutes > 0 ? remainingMinutes + ' мин' : ''}`.trim()
}

export const useDividedRuntime = (mediaType, time) => {
  time = Number(time)
  if (isNaN(time) || time <= 0) return ''
  switch (mediaType) {
    case 'movie':
      return  formatRuntime(time)
    case 'tv':
      return `серии по ${formatRuntime(time)}`
    default:
      return ''
  }
}
