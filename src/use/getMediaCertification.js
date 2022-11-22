export const useMediaCertification = (mediaType, data) => {
  const isRUexist = data.find(el => el.iso_3166_1 === 'RU')
  if (!isRUexist) return 'н/д'
  if (mediaType === 'movie') {
    if (isRUexist.release_dates.find(c => c.certification.length > 0)) return isRUexist.release_dates.find(c => c.certification.length > 0).certification
    else return 'н/д'
  }
  if (mediaType === 'tv') return isRUexist.rating
}
