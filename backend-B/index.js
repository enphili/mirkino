require('dotenv').config()
const express = require('express')
const cors = require('cors')
const tmdbMediaData = require('./routes/tmdbMediaData.js')
const { handleError } = require('./helpers/errorHandler.js')

const app = express()
const HOSTNAME = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'
const PORT = process.env.PORT ?? 3050

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://mir-kino.webfldev.ru' : 'http://localhost:3001'
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(tmdbMediaData)


app.use((err, req, res, next) => handleError(err, res))

app.listen(PORT, HOSTNAME, err => {
  err ? console.log(`Unexpected occurred error:  ${err}`) : console.log(`Server has been started at http://${HOSTNAME}:${PORT}...`)
})
