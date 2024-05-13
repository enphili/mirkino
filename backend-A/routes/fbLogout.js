const express = require('express')
const router = express.Router()
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')
const { ErrorHandler } = require('../helpers/errorHandler.js')

router.get(`/apifb/logout`, async (req, res, next) => {
  try {
    await firebase
      .auth()
      .signOut()
      .then(() => res.send('signed Out'))
      .catch(error => {
      throw new ErrorHandler(error.code, error.message)
    })
    next()
  }
  catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
