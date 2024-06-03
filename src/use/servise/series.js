import {api} from 'boot/axios'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useGetPosterUrl} from 'src/use/getPosterUrl'
import countries from 'src/utils/countries'

const baseBgURL = useGetPosterUrl('https://image.tmdb.org/t/p/original', true)
const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

const seriesResponse = (response, obj) => {
  const allObj = response.data
  const {id, poster_path, first_air_date, genres, production_countries, backdrop_path, name, original_name, overview, episode_run_time, content_ratings, homepage, tagline, seasons, credits } = allObj
  obj.allObj = allObj
  obj.id = +id
  obj.type = 'tv'
  obj.posterPath = basePosterURL(poster_path)
  obj.year = useDividedReleaseDate(first_air_date)
  obj.tags = genres
  obj.productionCountries = production_countries.map(el => countries(el.iso_3166_1))
  obj.bgUrl = baseBgURL(backdrop_path)
  obj.mediaTitle = name
  obj.originalMediaTitle = original_name
  obj.description = overview
  obj.runtime = useDividedRuntime('tv', episode_run_time)
  obj.certification = useMediaCertification('tv', content_ratings.results)
  obj.homepageUrl = homepage
  obj.tagline = tagline.replace(/\.$/, "")
  obj.hasSeasons = !!seasons
  if (!!seasons) {
    obj.seasons = seasons
  }
  obj.castActors = credits.cast
}

const trailersResponse = (response, obj) => {
  obj.trailersData = response.data
}

const reviewsResponse = (response, obj) => {
  obj.reviews = response.data
}

const similarResponse = (response, obj) => {
  obj.similarMedia = response.data.results
}

const recomendedResponse = (response, obj) => {
  obj.recomendMedia = response.data.results
}

export const useServiceSeries = async (mediaID, obj) => {
  try {
    const [seriesData, trailersData, reviewsData, similarData, recomendedData ] = await Promise.all([
      api.get(`/api/filminfo?id=${mediaID}&type=tv`),
      api.get(`/api/trailers?id=${mediaID}&type=tv`),
      api.get(`/api/reviews?id=${mediaID}&type=tv`),
      api.get(`/api/similarmedia?id=${mediaID}&type=tv`),
      api.get(`/api/recomendmedia?id=${mediaID}&type=tv`)
    ])

    seriesResponse(seriesData, obj)
    trailersResponse(trailersData, obj)
    reviewsResponse(reviewsData, obj)
    similarResponse(similarData, obj)
    recomendedResponse(recomendedData, obj)
  }
  catch (error) {
    throw error
  }
}
