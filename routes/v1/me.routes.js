const express = require('express')
const router = express.Router()

const authenticator = require('middleware/authentication.middleware')
const asyncMiddleware = require('middleware/async.middleware')
const controller = require('controllers/me.controller')


router.get('/favorites', asyncMiddleware(controller.getFavorites))
router.put('/favorites/:productId', asyncMiddleware(controller.addFavorite))
router.delete('/favorites/:productId', asyncMiddleware(controller.removeFavorite))

module.exports = router