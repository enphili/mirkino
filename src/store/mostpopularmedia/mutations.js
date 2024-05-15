export const setMostPopularMedia = (state, array) => {
  array.forEach(item => {
    // Проверяем, существует ли уже объект с таким же id в массиве mostPopularMedia
    const existItem = state.mostPopularMedia.find(mediaItem => mediaItem.id === item.id)
    // Если объект не найден, добавляем его в массив
    if(!existItem) {
      state.mostPopularMedia.push(item)
    }
  })
}
