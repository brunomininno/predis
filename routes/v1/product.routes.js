const express = require('express')
const router = express.Router()

const authenticator = require('middleware/authentication.middleware')
const asyncMiddleware = require('middleware/async.middleware')
const controller = require('controllers/product.controller')
const controllerName = 'users'


router.get('/', asyncMiddleware(controller.getAll))
router.get('/:id', asyncMiddleware(controller.getOneById))

module.exports = router