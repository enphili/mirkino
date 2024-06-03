import {api} from 'boot/axios'
import {useGetPosterUrl} from 'src/use/getPosterUrl'

const cyrillicPattern = /[\u0400-\u04FF]/
const basePosterURL = useGetPosterUrl('https://image.tmdb.org/t/p/w500')

const ActorResponseInfo = (response, obj) => {
  const {biography, birthday, homepage, place_of_birth, name, profile_path, also_known_as} = response.data

  obj.biography = biography || 'данных в базе нет'
  obj.birthday = new Date(birthday).toLocaleString('ru', { year: 'numeric', month: 'long', day: 'numeric' }) || 'дата рождения не указана'
  obj.homepage = homepage
  obj.placeOfBirth = place_of_birth || 'место рождения не указано'
  obj.actorName = name
  obj.profilePath = basePosterURL(profile_path)
  obj.actorNameRU = also_known_as.find(el => cyrillicPattern.test(el))
}

const ActorResponseCast = (response, obj) => {
  obj.cast = response.data.cast
}

export const useServiceActor = async (personId, obj) => {
  try {
    const [actorData, actorCast] = await Promise.all([
      api.get(`/api/actorsinfo?personId=${personId}`),
      api.get(`/api/actorscast?personId=${personId}`)
    ])

    ActorResponseInfo(actorData, obj)
    ActorResponseCast(actorCast, obj)
  }
  catch (error) {
    throw error
  }
}
