const express = require('express')
const router = express.Router()
const api = require('axios').create({baseURL: 'https://api.themoviedb.org/3'})


router.get('/api/trendingfilms',  async (req, res, next) => {
  try {
    const url = `/trending/all/week?language=ru&api_key=${process.env.TMDB_API_KEY}&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/filminfo',  async (req, res, next) => {
  let release = ''
  if (req.query.type === 'tv') release = 'content_ratings'
  if (req.query.type === 'movie') release = 'release_dates'
  try {
    const url = `/${req.query.type}/${req.query.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,${release}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/trailers',  async (req, res, next) => {
  try {
    const url = `/${req.query.type}/${req.query.id}/videos?api_key=${process.env.TMDB_API_KEY}`
    const [responseRU, responseEN] = await Promise.all([
      api({url: url + '&language=ru', method: 'get'}),
      api({url, method: 'get'}),
    ])
    const allTrailers =[ ...responseRU.data.results, ...responseEN.data.results]
    res.status(200).json(allTrailers)
    next()
  }
  catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/seasontrailers',  async (req, res, next) => {
  try {
    const url = `/tv/${req.query.id}/season/${req.query.seasonNumber}/videos?api_key=${process.env.TMDB_API_KEY}`
    const [responseRU, responseEN ] = await Promise.all([
      api({url: url + '&language=ru', method: 'get'}),
      api({url, method: 'get'}),
    ])
    const allTrailers =[ ...responseRU.data.results, ...responseEN.data.results]
    res.status(200).json(allTrailers)
    next()
  }
  catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/episodetrailers',  async (req, res, next) => {
  try {
    const url = `/tv/${req.query.id}/season/${req.query.seasonNumber}/episode/${req.query.episodeNumber}/videos?api_key=${process.env.TMDB_API_KEY}`
    const [responseRU, responseEN ] = await Promise.all([
      api({url: url + '&language=ru', method: 'get'}),
      api({url, method: 'get'}),
    ])
    const allTrailers =[ ...responseRU.data.results, ...responseEN.data.results]
    res.status(200).json(allTrailers)
    next()
  }
  catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/belongs',  async (req, res, next) => {
  try {
    const url = `/collection/${req.query.id}?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/season',  async (req, res, next) => {
  try {
    const url = `/tv/${req.query.id}/season/${req.query.seasonNumber}?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/episode',  async (req, res, next) => {
  try {
    const url = `/tv/${req.query.id}/season/${req.query.seasonNumber}/episode/${req.query.episodeNumber}?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/search',  async (req, res, next) => {
  try {
    const url = `/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(req.query.query)}&page=${req.query.page}&include_adult=true&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/searchbygenres',  async (req, res, next) => {
  try {
    const url = `/discover/${req.query.mediaType}?api_key=${process.env.TMDB_API_KEY}&language=ru&include_adult=false&with_genres=${req.query.genresId}&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/actorsinfo',  async (req, res, next) => {
  try {
    const url = `/person/${req.query.personId}?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/actorscast',  async (req, res, next) => {
  try {
    const url = `/person/${req.query.personId}/combined_credits?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/recomendmedia',  async (req, res, next) => {
  try {
    const url = `/${req.query.type}/${req.query.id}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/similarmedia',  async (req, res, next) => {
  try {
    const url = `/${req.query.type}/${req.query.id}/similar?api_key=${process.env.TMDB_API_KEY}&language=ru`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/reviews',  async (req, res, next) => {
  try {
    const url = `/${req.query.type}/${req.query.id}/reviews?api_key=${process.env.TMDB_API_KEY}`
    const [reviewsRU, reviewsEN] = await Promise.all([
      api({url: url + '&language=ru', method: 'get'}),
      api({url, method: 'get'}),
    ])
    const allReviews =[ ...reviewsRU.data.results, ...reviewsEN.data.results]
    res.status(200).json(allReviews)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/nowplaying',  async (req, res, next) => {
  try {
    const url = `/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ru&region=RU&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/popularity',  async (req, res, next) => {
  try {
    const url = `/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=ru&region=RU&sort_by=popularity.desc&include_adult=false&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/primaryreleaseyear',  async (req, res, next) => {
  try {
    const url = `/discover/movie?api_key=${process.env.TMDB_API_KEY}&primary_release_year=${req.query.year}&language=ru&region=RU&sort_by=vote_average.desc&include_adult=false&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})

router.get('/api/upcoming',  async (req, res, next) => {
  try {
    const url = `/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=ru&region=RU&page=${req.query.page}`
    const response = await api({url, method: 'get'})
    res.status(200).json(response.data)
    next()
  } catch (err) {
    console.log(err.code)
    next(err)
  }
})


module.exports = router
