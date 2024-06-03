const createUrl = require('./createUrl.js')
const api = require('axios').create({baseURL: 'https://api.themoviedb.org/3'})

// Общая функция для выполнения запросов
const fetchData = async (req, res, next, path, params) => {
  try {
    const url = createUrl(path, params)
    const response = await api({ url, method: 'get' })
    res.status(200).json(response.data)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fetchData
