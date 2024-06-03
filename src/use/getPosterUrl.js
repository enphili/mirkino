/**
 * Возвращает функцию для формирования полного URL для постера.
 *
 * @param {string} baseUrl - Базовый URL для формирования полного URL постера.
 * @param {boolean} [isBg=false] - Флаг для указания, является ли URL для фона.
 * @returns {function(string): string} - Функция, которая принимает часть URL и возвращает полный URL.
 */
export const useGetPosterUrl = (baseUrl, isBg = false) => {
  return urlPart => {
    if (urlPart) {
      return `${baseUrl}${urlPart}`
    }
    return isBg ? '' : require('../assets/img/unnamed.jpg')
  }
}
