require('dotenv').config()
const express = require('express')
const firebase = require('firebase')
const cors = require('cors')
const firebaseConfig  = require('./config/firebaseConfig.js')
const fbRegistry = require('./routes/fbRegistry.js')
const fbLogin = require('./routes/fbLogin.js')
const fbLogout = require('./routes/fbLogout.js')
const fbForget = require('./routes/fbForget.js')
const fbAddToUserList = require('./routes/fbAddToUserList.js')
const fbRemoveFromUserList = require('./routes/fbRemoveFromUserList.js')
const { handleError } = require('./helpers/errorHandler.js')

firebase.initializeApp(firebaseConfig)

const app = express()
const HOSTNAME = 'localhost'
const PORT = process.env.PORT ?? 3001
// const serverB = 'http://194.35.119.124:3000'
const serverB = 'http://127.0.0.1:3050'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fbRegistry)
app.use(fbLogin)
app.use(fbLogout)
app.use(fbForget)
app.use(fbRemoveFromUserList)
app.use(fbAddToUserList)

app.get('/api/*', async (request, response) => {
  const { method, originalUrl } = request
  try {
    const res = await fetch(`${serverB}${originalUrl}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    response.json(data)
  }
  catch (error) {
    console.log(error)
  }
})

app.use((err, req, res, next) => handleError(err, res))

app.listen(PORT, HOSTNAME, err => {
  err ? console.log(`Unexpected occurred error:  ${err}`) : console.log(`Server has been started at http://${HOSTNAME}:${PORT}...`)
})
