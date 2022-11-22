const express = require('express')
const router = express.Router()
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')


router.post(`/api/addtouserlist`, async (req, res, next) => {
  const {mediaData, key, keyStamp} = req.body
  mediaData['keyStamp'] = keyStamp
  try {
    const user = await firebase.auth().currentUser
      if (user) {
        await firebase.database().ref('/users/' + user.uid + '/' + key + '/' + keyStamp).update(mediaData)
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
