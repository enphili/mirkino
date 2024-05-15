import {useSortMedia} from 'src/use/sortMedia'

export const setNowPlaying = (state, array) => {
  array.forEach(item => {
    // Проверяем, существует ли уже объект с таким же id в массиве NowPlaying
    const existItem = state.NowPlaying.find(mediaItem => mediaItem.id === item.id)
    // Если объект не найден, добавляем его в массив
    if(!existItem) {
      state.NowPlaying.push(item)
    }
  })
}

export const setNowPlayingSort = (state, sort) => state.NowPlaying.sort(useSortMedia(sort))
