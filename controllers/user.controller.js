// 'use strict'

// const userServices = require('services/user.services')
// const responder = require('helpers/response.helper')
// const authHelper = require('helpers/auth.helper')
// const messages = require('catalogs/messages')
// const models = require('models')
// const moment = require('moment')
// const emailServices = require('services/email.services')

// /**
//  * @api {POST} /users/login Login
//  * @apiName LoginUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {String} email E-mail del usuario
//  * @apiParam {String} password Password del usuario
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data.user Usuario
//  * @apiSuccess {String} data.token Token de autenticación
//  */
// exports.login = async (req, res, next) => {
// 	let email = req.body.email
// 	let password = req.body.password

// 	if (!email || !password) {
// 		return responder.respondBadRequest(res, messages.EMAIL_PASSWORD_REQUIRED)
// 	}

// 	let user = await models.user.findOne({ where: { email: email } })
// 	if (!user) {
// 		__logger.error('login: Error getting user')
// 		return responder.respondBadRequest(res, messages.LOGIN_INVALID_CREDENTIALS)
// 	}

// 	if (!authHelper.comparePassword(password, user.password)) {
// 		return responder.respondBadRequest(res, messages.LOGIN_INVALID_CREDENTIALS)
// 	}

// 	user = user.get({ 'plain': true })

// 	// Unset password
// 	delete user.password

// 	user.type = 'user'

// 	let token = authHelper.generateToken(user)

// 	responder.respondData(res, {
// 		'token': token,
// 		'user': user
// 	})

// }

// /**
//  * @api {GET} /users Get users
//  * @apiName GetUsers
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[[user]](#api-Modelos-ObjectUser)} data.users[] Array of users
//  * @apiUse MetaDataResponse
//  */
// exports.getAll = async (req, res, next) => {
// 	let options = {
// 		page: parseInt(req.query.page) || 1,
// 		limit: parseInt(req.query.limit) || 20,
// 		filters: req.query.filters || null
// 	}

// 	userServices.findAll(options, (err, data) => {
// 		if (err) {
// 			__logger.error('getAll: Error getting users', err)
// 			return next(messages.GET_DATA_FAILED)
// 		}
// 		return responder.respondData(res, {
// 			'users': data.rows,
// 			'metadata': {
// 				'totalResults': data.count,
// 				'currentPage': options.page,
// 				'pageSize': options.limit
// 			}
// 		})
// 	})
// }

// /**
//  * @api {GET} /users/:id Get single user
//  * @apiName GetUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {Integer} id ID del usuario
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data User
//  */
// exports.getOneById = async (req, res, next) => {
// 	let id = req.params.id

// 	if (!id) {
// 		return responder.respondBadRequest(res, messages.ID_USER_REQUIRED)
// 	}

// 	let scopes = ['area', 'department', 'direction']

// 	let user = await models.user.scope(scopes).findById(id)
// 	if (!user) {
// 		__logger.error('userController->getOneById: Error getting user', err)
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	__logger.info('userController->getOneById: Found user ' + id)

// 	user = user.get({ 'plain': true })

// 	// Unset password
// 	delete user.password

// 	return responder.respondData(res, user)

// }

// /**
//  * @api {PUT} /users/:id Update user
//  * @apiName UpdateUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {Integer} id ID del usuario
//  * @apiParam {[user](#api-Modelos-ObjectUser)} user Usuario
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data Usuario
//  */
// exports.update = async (req, res, next) => {
// 	let id = req.params.id
// 	let body = req.body

// 	if (!id) {
// 		return responder.respondBadRequest(res, messages.ID_USER_REQUIRED)
// 	}

// 	let user = await models.user.findById(id)

// 	if (!user) {
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	__logger.info('userController->update: Found user ' + id)

// 	user.set('firstName', body.firstName)
// 	user.set('lastName', body.lastName)
// 	user.set('email', body.email)
// 	user.set('roles', body.roles)
// 	user.set('id_direction', body.idDirection)
// 	user.set('id_area', body.idArea)
// 	user.set('id_department', body.idDepartment)

// 	if (body.password) {
// 		user.set('password', authHelper.hashPassword(body.password))
// 	}

// 	await user.save()

// 	return responder.respondData(res, user)
// }

// /**
//  * @api {DELETE} /users/:id Delete user
//  * @apiName DeleteUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {Integer} id ID del usuario
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data Usuario
//  */
// exports.delete = async (req, res, next) => {
// 	let id = req.params.id
// 	let body = req.body

// 	if (!id) {
// 		return responder.respondBadRequest(res, messages.ID_USER_REQUIRED)
// 	}

// 	let user = await models.user.findById(id)

// 	if (!user) {
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	__logger.info('userController->update: Found user ' + id)

// 	user.set('isDeleted', 1)

// 	await user.save()

// 	return responder.respondData(res, user)
// }

// /**
//  * @api {POST} /users Create user
//  * @apiName CreateUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {[user](#api-Modelos-ObjectUser)} user Usuario
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data Usuario
//  */
// exports.create = async (req, res, next) => {
// 	let body = req.body

// 	if (!body.password) {
// 		return responder.respondBadRequest(res, messages.PASSWORD_REQUIRED)
// 	}

// 	let user = new models.user
// 	user.set('firstName', body.firstName)
// 	user.set('lastName', body.lastName)
// 	user.set('email', body.email)
// 	user.set('roles', body.roles)
// 	user.set('password', authHelper.hashPassword(body.password))
// 	user.set('id_direction', body.idDirection)
// 	user.set('id_area', body.idArea)
// 	user.set('id_department', body.idDepartment)

// 	await user.save()

// 	return responder.respondData(res, user)
// }

// /**
//  * @api {GET} /users/me Get current user
//  * @apiName GetUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[user](#api-Modelos-ObjectUser)} data User
//  */
// exports.getMe = async (req, res, next) => {
// 	let user = req.user

// 	if (!user) {
// 		__logger.error('userController->getOneById: Error getting user', err)
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	// Unset password
// 	delete user.password

// 	return responder.respondData(res, user)
// }

// /**
//  * @api {PUT} /users/me Update current applicant
//  * @apiName UpdateCurrentUser
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[applicant](#api-Modelos-ObjectUser)} data User
//  */
// exports.putMe = async (req, res, next) => {
// 	let body = req.body

// 	let user = await models.user.findById(req.user.id)

// 	if (!user) {
// 		__logger.error('putMe: Error getting user')
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	if (body.pushToken) {
// 		user.set('pushToken', body.pushToken)
// 	}

// 	await user.save()

// 	return responder.respondData(res, user)
// }

// /**
//  * @api {POST} /users/forgot-password Forgot password
//  * @apiName ForgotPassword
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {String} email E-mail
//  *
//  * @apiUse SuccessResponse
//  */
// exports.forgotPassword = async (req, res, next) => {
// 	let email = req.body.email

// 	if (!email) {
// 		return responder.respondBadRequest(res, messages.EMAIL_REQUIRED)
// 	}

// 	let user = await models.user.findOne({ where: { email: email } })
// 	__logger.info('user ' + user)
// 	if (!user) {
// 		__logger.error('confirmEmail: Error getting user')
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	__logger.info('userController->getOneById: Found user ' + email)

// 	let payloadData = {
// 		'email': (user.email).toLowerCase(),
// 	};

// 	let expiration = moment().add(__config.expirations.forgotPassword, 'hours').unix()
// 	let token = authHelper.encodeToken(payloadData, expiration)

// 	__logger.info('Token for forgot-password user email', email, token)

// 	let resetLink = __config.backUrl + '/reset-password/' + token

// 	user = {
// 		name: user.firstName,
// 		email: user.email
// 	}

// 	emailServices.sendForgotPassword(user, resetLink, (err, response) => {
// 		if (err) {
// 			__logger.error('forgotPassword: Error sending email', err)
// 			return next(messages.CANNOT_SEND_EMAIL)
// 		}

// 		return responder.respondMessage(res, messages.FORGOT_PASSWORD_EMAIL_SENT)
// 	})
// }

// /**
//  * @api {PUT} /users/reset-password Reset password
//  * @apiName ResetPassword
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiParam {String} token Password reset token
//  * @apiParam {String} newPassword New password
//  *
//  * @apiUse SuccessResponse
//  */
// exports.resetPassword = async (req, res, next) => {
// 	let token = req.body.token
// 	let newPassword = req.body.newPassword

// 	if (!token) {
// 		return responder.respondBadRequest(res, messages.TOKEN_REQUIRED)
// 	}

// 	if (!newPassword) {
// 		return responder.respondBadRequest(res, messages.NEW_PASSWORD_REQUIRED)
// 	}

// 	let payload = authHelper.decodeToken(token)

// 	let user = await models.user.findOne({ where: { email: payload.data.email } })
// 	if (!user) {
// 		__logger.error('confirmEmail: Error getting user')
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	__logger.info('userController->getOneById: Found user ' + user.email)

// 	user.set('password', authHelper.hashPassword(newPassword))

// 	await user.save()

// 	return responder.respondMessage(res, messages.PASSWORD_SUCCESFULLY_CHANGED)
// }

// /**
//  * @api {PUT} /users/terms Update terminos y condiciones
//  * @apiName SignTerms
//  * @apiGroup Users
//  * @apiVersion 1.0.0
//  *
//  * @apiUse SuccessResponse
//  * @apiSuccess {[applicant](#api-Modelos-ObjectUser)} data User
//  */
// exports.signTerms = async (req, res, next) => {
// 	let body = req.body

// 	let user = await models.user.findById(req.user.id)

// 	if (!user) {
// 		__logger.error('putMe: Error getting user')
// 		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
// 	}

// 	user.set('termsSigned', true)

// 	await user.save()

// 	return responder.respondData(res, user)
// }