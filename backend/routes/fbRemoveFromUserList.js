const express = require('express')
const router = express.Router()
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')


router.post(`/api/removefromuserlist`, async (req, res, next) => {
  const {keyStamp, key} = req.body
  try {
    const user = await firebase.auth().currentUser
    if (user) {
      await firebase.database().ref().child('users').child(user.uid).child(key).child(keyStamp).remove()
      res.send('good')
    }
    else {
      res.send('needReLogin')
    }
  }
  catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
