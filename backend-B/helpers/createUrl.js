// Функция для создания URL
const createUrl = (path, params='') => `${path}?api_key=${process.env.TMDB_API_KEY}&${new URLSearchParams(params).toString()}`

module.exports = createUrl
