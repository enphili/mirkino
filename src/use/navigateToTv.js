export const useNavigateToTv = async (router, media) => {
  const { id, title, episodeNumber, seasonNumber, episodTitle } = media

  if (!id) {
    await router.push('/404')
  }

  const cleanedEpisodeNumber = episodeNumber?.replace(/[^\d]/g, '')
  const cleanedSeasonNumber = seasonNumber?.replace(/[^\d]/g, '')

  if (!cleanedSeasonNumber && !cleanedEpisodeNumber) {
    await router.push({
      name: 'serials',
      params: {
        mediaID: id,
        mediaTitle: title
      }
    })
  }
  else if (cleanedSeasonNumber && !cleanedEpisodeNumber) {
    await router.push({
      name: 'season',
      params: {
        mediaID: id,
        mediaTitle: title,
        seasonNumber: cleanedSeasonNumber
      }
    })
  }
  else if (cleanedSeasonNumber && cleanedEpisodeNumber) {
    await router.push({
      name: 'episode',
      params: {
        mediaID: id,
        mediaTitle: title,
        seasonNumber: cleanedSeasonNumber,
        episodeNumber: cleanedEpisodeNumber,
        episodTitle: episodTitle || ''
      }
    })
  }
}
