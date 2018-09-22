const express = require('express')
const router = express.Router()

const authenticator = require('middleware/authentication.middleware')
const asyncMiddleware = require('middleware/async.middleware')
const userController = require('controllers/user.controller')
const controllerName = 'users'


router.post('/login', asyncMiddleware(userController.login))
router.put('/reset-password', asyncMiddleware(userController.resetPassword))
router.put('/forgot-password', asyncMiddleware(userController.forgotPassword))

router.get('/', authenticator.validateAccess(controllerName, 'getAll'), asyncMiddleware(userController.getAll))
router.get('/me', authenticator.validateAccess(controllerName, 'getMe'), asyncMiddleware(userController.getMe))
router.put('/terms', authenticator.validateAccess(controllerName, 'signTerms'), asyncMiddleware(userController.signTerms))
router.put('/me', authenticator.validateAccess(controllerName, 'putMe'), asyncMiddleware(userController.putMe))
router.get('/:id', authenticator.validateAccess(controllerName, 'getOneById'), asyncMiddleware(userController.getOneById))
router.put('/:id', authenticator.validateAccess(controllerName, 'update'), asyncMiddleware(userController.update))
router.delete('/:id', authenticator.validateAccess(controllerName, 'delete'), asyncMiddleware(userController.delete))
router.post('/', authenticator.validateAccess(controllerName, 'create'), asyncMiddleware(userController.create))

module.exports = router