const createUrl = require('./createUrl.js')
// const {handleError} = require('./errorHandler.js')
const api = require('axios').create({baseURL: 'https://api.themoviedb.org/3'})

// Общая функция для выполнения нескольких запросов
const fetchAllData = async (req, res, next, path) => {
  try {
    const url = createUrl(path)
    const [responseRU, responseEN] = await Promise.all([
      api({url: url + '&language=ru', method: 'get'}),
      api({url, method: 'get'})
    ])
    const result =[ ...responseRU.data.results, ...responseEN.data.results]
    res.status(200).json(result)
    next()
  } catch (err) {
    // handleError(err, res)
    next(err)
  }
}

module.exports = fetchAllData
