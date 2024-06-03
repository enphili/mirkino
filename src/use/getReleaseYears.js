/**
 * Получает уникальные года из дат релизов и дат первого выхода из массива результатов поиска.
 *
 * @param {Array} searchResult - Массив объектов с датами релиза или датами первого выхода.
 * @returns {Array} - Отсортированный массив уникальных годов.
 */
export const getReleaseYears = searchResult => {
  const years = searchResult.reduce((acc, item) => {
    const releaseYear = item.release_date?.substring(0, 4)
    const firstAirYear = item.first_air_date?.substring(0, 4)

    if (releaseYear) acc.add(releaseYear)
    if (firstAirYear) acc.add(firstAirYear)

    return acc
  }, new Set())

  return Array.from(years).sort((a, b) => Number(b) - Number(a))
}
