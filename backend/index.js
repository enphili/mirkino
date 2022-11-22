require('dotenv').config()
const express = require('express')
const firebase = require('firebase')
const firebaseConfig  = require('./config/firebaseConfig.js')
const middlewares  = require('./middlewares.js')
const fbRegistry = require('./routes/fbRegistry.js')
const fbLogin = require('./routes/fbLogin.js')
const fbLogout = require('./routes/fbLogout.js')
const fbForget = require('./routes/fbForget.js')
const fbAddToUserList = require('./routes/fbAddToUserList.js')
const fbRemoveFromUserList = require('./routes/fbRemoveFromUserList.js')
const tmdbMediaData = require('./routes/tmdbMediaData.js')
const { handleError } = require('./helpers/errorHandler.js')

firebase.initializeApp(firebaseConfig)

const app = express()
const HOSTNAME = 'localhost'
const PORT = process.env.PORT ?? 3000

app.use(middlewares.responseHeaders)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fbRegistry)
app.use(fbLogin)
app.use(fbLogout)
app.use(fbForget)
app.use(fbRemoveFromUserList)
app.use(fbAddToUserList)
app.use(tmdbMediaData)


app.use((err, req, res, next) => handleError(err, res))

app.listen(PORT, HOSTNAME, err => {
  err ? console.log(`Unexpected occurred error:  ${err}`) : console.log(`Server has been started at http://${HOSTNAME}:${PORT}...`)
})
