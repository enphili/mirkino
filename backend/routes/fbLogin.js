const express = require('express')
const router = express.Router()
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')
const { ErrorHandler } = require('../helpers/errorHandler.js')


router.post(`/api/login`, async (req, res, next) => {
  try {
    const {email, password} = req.body
    if (!email) throw new ErrorHandler(404, 'Email не может быть пустым.')
    if (!password) throw new ErrorHandler(404, 'Пароль не может быть пустым.')
    const UserCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {throw new ErrorHandler(error.code, error.message)})
    const user = await UserCredential.user
    if (!user) throw new ErrorHandler(500, 'Внутренняя ошибка сервера. Попробуйте позже.')
    await firebase
      .database()
      .ref('/users/' + user.uid)
      .get()
      .then(snapshot => {
      if (snapshot.exists()) res.status(200).json(snapshot.val())
      else throw new ErrorHandler(410, 'Данные недоступны.')
    })
    next()
  }
  catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
