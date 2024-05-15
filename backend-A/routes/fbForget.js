const express = require('express')
const router = express.Router()
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')
const { ErrorHandler } = require('../helpers/errorHandler.js')

router.post(`/apifb/forget`, async (req, res, next) => {
  try {
    const {email} = req.body
    if (!email) throw new ErrorHandler(404, 'Email не может быть пустым.')
    const actionCodeSettings = {
      url: process.env.REDIRECT_URL_AFTER_RESET_PASSWORD
    }
     await firebase
       .auth()
       .sendPasswordResetEmail(email, actionCodeSettings)
       .catch(error => {
         throw new ErrorHandler(error.code, error.message)
        }
       )

    res.status(200).send('ссылка отправлена на email')
    next()
  }
  catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
