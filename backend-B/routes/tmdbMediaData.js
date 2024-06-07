const express = require('express')
const router = express.Router()
const fetchData = require('../helpers/fetchData.js')
const fetchAllData = require('../helpers/fetchAllData.js')

// Маршруты
router.get('/api/trendingfilms', async (req, res, next) => {
  const params = {language: 'ru', page: req.query.page}
  console.log('params:', params)
  await fetchData(req, res, next, '/trending/all/week', params)
})

router.get('/api/filminfo', async (req, res, next) => {
  let release = ''
  if (req.query.type === 'tv') release = 'content_ratings'
  if (req.query.type === 'movie') release = 'release_dates'
  const params = {language: 'ru', append_to_response: `credits,${release}`}
  await fetchData(req, res, next, `${req.query.type}/${req.query.id}`, params)
})

router.get('/api/belongs',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/collection/${req.query.id}`, params)
})

router.get('/api/season',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/tv/${req.query.id}/season/${req.query.seasonNumber}`, params)
})

router.get('/api/episode', async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/tv/${req.query.id}/season/${req.query.seasonNumber}/episode/${req.query.episodeNumber}`, params)
})

router.get('/api/search',  async (req, res, next) => {
  const params = {query: encodeURIComponent(req.query.query), include_adult: true, page: req.query.page, language: 'ru'}
  await fetchData(req, res, next, `/search/multi`, params)
})

router.get('/api/searchbygenres',  async (req, res, next) => {
  const params = {language: 'ru', include_adult: false, with_genres: req.query.genresId, page: req.query.page}
  await fetchData(req, res, next, `/discover/${req.query.mediaType}`, params)
})

router.get('/api/actorsinfo',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/person/${req.query.personId}`, params)
})

router.get('/api/actorscast',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/person/${req.query.personId}/combined_credits`, params)
})

router.get('/api/recomendmedia',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/${req.query.type}/${req.query.id}/recommendations`, params)
})

router.get('/api/similarmedia',  async (req, res, next) => {
  const params = {language: 'ru'}
  await fetchData(req, res, next, `/${req.query.type}/${req.query.id}/similar`, params)
})

router.get('/api/nowplaying',  async (req, res, next) => {
  const params = {language: 'ru', region: 'RU', page: req.query.page}
  await fetchData(req, res, next, `/movie/now_playing`, params)
})

router.get('/api/popularity',  async (req, res, next) => {
  const params = {language: 'ru', region: 'RU', sort_by: 'popularity.desc', include_adult: false, page: req.query.page}
  await fetchData(req, res, next, `/discover/movie`, params)
})

router.get('/api/primaryreleaseyear',  async (req, res, next) => {
  const params = {primary_release_year: req.query.year, language: 'ru', region: 'RU', include_adult: false, page: req.query.page}
  await fetchData(req, res, next, `/discover/movie`, params)
})

router.get('/api/upcoming',  async (req, res, next) => {
  const params = {language: 'ru', region: 'RU', page: req.query.page}
  await fetchData(req, res, next, `/movie/upcoming`, params)
})

router.get('/api/trailers',  async (req, res, next) => {
  await fetchAllData(req, res, next, `/${req.query.type}/${req.query.id}/videos`)
})

router.get('/api/seasontrailers',  async (req, res, next) => {
  await fetchAllData(req, res, next, `/tv/${req.query.id}/season/${req.query.seasonNumber}/videos`)
})

router.get('/api/episodetrailers',  async (req, res, next) => {
  await fetchAllData(req, res, next, `/tv/${req.query.id}/season/${req.query.seasonNumber}/episode/${req.query.episodeNumber}/videos`)
})

router.get('/api/reviews',  async (req, res, next) => {
  await fetchAllData(req, res, next, `/${req.query.type}/${req.query.id}/reviews`)
})


module.exports = router
