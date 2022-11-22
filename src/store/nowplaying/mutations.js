import {useSortMedia} from 'src/use/sortMedia'

export const setNowPlaying = (state, array) => state.NowPlaying.push(...array)

export const setNowPlayingSort = (state, sort) => state.NowPlaying.sort(useSortMedia(sort))
