export const setPopularMedia = (state, array) => {
  array.forEach(item => {
    // Проверяем, существует ли уже объект с таким же id в массиве popularMedia
    const existItem = state.popularMedia.find(mediaItem => mediaItem.id === item.id)
    // Если объект не найден, добавляем его в массив
    if(!existItem) {
      state.popularMedia.push(item)
    }
  })
}

