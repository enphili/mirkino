/**
 * Получает данные из localStorage по ключу и возвращает значение указанного ключа.
 * Если данные отсутствуют или не могут быть разобраны, возвращает значение по умолчанию.
 *
 * @param {string} key - Ключ для доступа к значению в localStorage.
 * @param {any} dataType - Значение по умолчанию, если данных нет или они невалидны.
 * @returns {any} - Значение из localStorage или значение по умолчанию.
 */

export const useGetLSData = (key, dataType) => {
  try {
    const data = JSON.parse(localStorage.getItem('mirKinoUser'))
    return data?.[key] ?? dataType
  }
  catch (error) {
    console.error('Error parsing JSON from localStorage:', error)
    return dataType
  }
}
