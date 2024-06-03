import {api} from 'boot/axios'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useGetPosterUrl} from 'src/use/getPosterUrl'
import countries from 'src/utils/countries'

const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')
const baseBgURL = useGetPosterUrl('https://image.tmdb.org/t/p/original', true)

const episodeResponse = (response, obj) => {
  const {still_path, episode_number, name, original_name, overview, runtime, air_date} = response.data
  obj.bgUrl = baseBgURL(still_path)
  obj.posterPath = basePosterURL(still_path)
  obj.episodeNumber = episode_number
  obj.title = name || original_name
  obj.description = overview
  obj.runtime =  useDividedRuntime('movie', runtime)
  obj.type = 'tv'
  obj.year = useDividedReleaseDate(air_date)
}

const seriesResponse = (response, obj) => {
  const {id, name, content_ratings, production_countries, genres, homepage, seasons} = response.data
  obj.id = +id
  obj.mediaName = name
  obj.certification = useMediaCertification('tv', content_ratings.results)
  obj.productionCountries = production_countries.map(el => countries(el.iso_3166_1))
  obj.tags = genres
  obj.homepageUrl = homepage
  obj.hasSeasons = !!seasons
  if (!!seasons) {
    obj.seasons = seasons
  }
}

const episodeTrailersResponse = (response, obj) => {
  const hasTrailers = response.data && response.data.length > 0
  obj.hasTrailers = hasTrailers
  obj.trailersData = hasTrailers ? response.data : []
}

const seasonResponse = (response, obj) => {
  const {episodes, name} = response.data
  obj.episodes = episodes
  obj.seasonName = name
}

export const useServiceEpisode = async (mediaID, seasonNumber, episodeNumber, obj) => {
  try {
    const [episodeData, seriesData, episodeTrailers, seasonData] = await Promise.all([
      api.get(`/api/episode?id=${mediaID}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`),
      api.get(`/api/filminfo?id=${mediaID}&type=tv`),
      api.get(`/api/episodetrailers?id=${mediaID}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`),
      api.get(`/api/season?id=${mediaID}&seasonNumber=${seasonNumber}`)
    ])

    episodeResponse(episodeData, obj)
    seriesResponse(seriesData, obj)
    episodeTrailersResponse(episodeTrailers, obj)
    seasonResponse(seasonData, obj)
  }
  catch (error) {
    throw error
  }
}
