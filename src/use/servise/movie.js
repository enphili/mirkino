import {api} from 'boot/axios'
import {useDividedReleaseDate} from 'src/use/dividedReleaseDate'
import {useDividedRuntime} from 'src/use/dividedRuntime'
import {useMediaCertification} from 'src/use/getMediaCertification'
import {useGetPosterUrl} from 'src/use/getPosterUrl'
import countries from 'src/utils/countries'

const baseBgURL = useGetPosterUrl('https://image.tmdb.org/t/p/original', true)
const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

const movieResponse = (response, obj) => {
  const {id, genres, production_countries, backdrop_path, poster_path, title, original_title, tagline, overview, runtime, release_dates, homepage, release_date, credits } = response.data
  obj.id = +id
  obj.type = 'movie'
  obj.tags = genres
  obj.productionCountries = production_countries.map(el => countries(el.iso_3166_1))
  obj.bgUrl = baseBgURL(backdrop_path)
  obj.posterPath = basePosterURL(poster_path)
  obj.mediaTitle = title
  obj.originalMediaTitle = original_title
  obj.tagline = tagline.replace(/\.$/, "")
  obj.description = overview
  obj.runtime = useDividedRuntime('movie', runtime)
  obj.certification = useMediaCertification('movie', release_dates.results)
  obj.homepageUrl = homepage
  obj.year = useDividedReleaseDate(release_date)
  obj.castActors = credits.cast
}

const collectionResponse = (response, obj) => {
  const {name, overview, parts} = response.data
  obj.hasCollection = !!response.data
  obj.collectionName = name
  obj.collectionDescription = overview
  obj.collectionParts = parts
}

const trailersResponse = (response, obj) => {
  obj.trailersData = response.data
}

const recommendResponse = (response, obj) => {
  obj.recomendMedia = response.data.results
}

const similarResponse = (response, obj) => {
  obj.similarMedia = response.data.results
}

const reviewsResponse = (response, obj) => {
  obj.reviews = response.data
}

export const useServiceMovie = async (mediaID, obj) => {
  try {
    const [movieData, movieTrailers, recommendMovie, similarMovie, reviews] = await Promise.all([
      api.get(`/api/filminfo?id=${mediaID}&type=movie`),
      api.get(`/api/trailers?id=${mediaID}&type=movie`),
      api.get(`/api/recomendmedia?id=${mediaID}&type=movie`),
      api.get(`/api/similarmedia?id=${mediaID}&type=movie`),
      api.get(`/api/reviews?id=${mediaID}&type=movie`)
    ])

    movieResponse(movieData, obj)
    const collectionExist = movieData.data.belongs_to_collection
    if (!!collectionExist) {
      const collection = await api.get(`/api/belongs?id=${collectionExist.id}`)
      collectionResponse(collection, obj)
    }
    trailersResponse(movieTrailers, obj)
    recommendResponse(recommendMovie, obj)
    similarResponse(similarMovie, obj)
    reviewsResponse(reviews, obj)
  }
  catch (error) {
    throw error
  }
}
