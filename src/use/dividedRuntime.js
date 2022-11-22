export const useDividedRuntime = (mediaType, time) => {
  if (!time || time.length === 0) return 'нет данных о длительности'
  if (mediaType === 'movie') return `${Math.trunc(time / 60) === 0 ? '' : Math.trunc(time / 60) + ' ч'} ${time % 60 === 0 ? '' : time % 60 + ' мин'}`
  if (mediaType === 'tv') return `серии по ${Math.trunc(time[0] / 60) === 0 ? '' : Math.trunc(time[0] / 60) + ' ч'} ${time[0] % 60 === 0 ? '' : time[0] % 60 + ' мин'}`
}
