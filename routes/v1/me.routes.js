const express = require('express')
const router = express.Router()

const authenticator = require('middleware/authentication.middleware')
const asyncMiddleware = require('middleware/async.middleware')
const controller = require('controllers/me.controller')


router.post('/fb-login', asyncMiddleware(controller.fbLogin))


router.get('/', authenticator.validateAccess(), asyncMiddleware(controller.getMe))
router.put('/', authenticator.validateAccess(), asyncMiddleware(controller.updateMe))
router.get('/favorites', authenticator.validateAccess(), asyncMiddleware(controller.getFavorites))
router.put('/favorites/:productId', authenticator.validateAccess(), asyncMiddleware(controller.addFavorite))
router.delete('/favorites/:productId', authenticator.validateAccess(), asyncMiddleware(controller.removeFavorite))

module.exports = router