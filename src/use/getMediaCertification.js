export const useMediaCertification = (mediaType, data) => {
  const russianCertification = data.find(el => el.iso_3166_1 === 'RU')

  if (!russianCertification) return 'н/д'

  if (mediaType === 'movie') {
    const { release_dates: releaseDates } = russianCertification
    const certification = releaseDates.find(c => c.certification && c.certification.length > 0)
    return certification ? certification.certification : 'н/д'
  }

  if (mediaType === 'tv') return russianCertification.rating || 'н/д'

  return 'н/д'
}
