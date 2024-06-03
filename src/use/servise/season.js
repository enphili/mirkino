import {api} from 'boot/axios'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useGetPosterUrl} from 'src/use/getPosterUrl'
import countries from 'src/utils/countries'

const baseBgURL = useGetPosterUrl('https://image.tmdb.org/t/p/original', true)
const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

const mediaResponse = (response, obj) => {
  const {id, backdrop_path, tagline, name, original_name, content_ratings, episode_run_time, production_countries, genres, homepage, seasons, } = response.data
  obj.id = +id
  obj.type = 'tv'
  obj.bgUrl = baseBgURL(backdrop_path)
  obj.tagline = tagline
  obj.title = name
  obj.originaltvTitle = original_name
  obj.certification = useMediaCertification('tv', content_ratings.results)
  obj.runtime = useDividedRuntime('tv', episode_run_time)
  obj.productionCountries = production_countries.map(el => countries(el.iso_3166_1))
  obj.tags = genres
  obj.homepageUrl = homepage
  obj.hasSeasons = !!seasons
  if (!!seasons) {
    obj.seasons = seasons
  }
}

const seasonTrailersResponse = (response, obj) => {
  obj.hasTrailers = response.data.length > 0
  obj.trailersData = response.data
}

const seasonResponse = (response, obj) => {
  const {overview, episodes, name, poster_path, air_date} = response.data
  obj.description = overview
  obj.episodes = episodes
  obj.seasonName = name
  obj.posterPath = basePosterURL(poster_path)
  obj.year = useDividedReleaseDate(air_date)
}

export const useServiceSeason = async (mediaID, seasonNumber, obj) => {
  try {
    const [mediaData, seasonTrailers, seasonData] = await Promise.all([
      api.get(`/api/filminfo?id=${mediaID}&type=tv`),
      api.get(`/api/seasontrailers?id=${mediaID}&seasonNumber=${seasonNumber}`),
      api.get(`/api/season?id=${mediaID}&seasonNumber=${seasonNumber}`)
    ])

    mediaResponse(mediaData, obj)
    seasonTrailersResponse(seasonTrailers, obj)
    seasonResponse(seasonData, obj)
  }
  catch (error) {
    throw error
  }
}
