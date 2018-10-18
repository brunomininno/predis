'use strict'

const responder = require('helpers/response.helper')
const userServices = require('services/user.services')
const messages = require('catalogs/messages')
const models = require('models')
const moment = require('moment')
const authHelper = require('helpers/auth.helper')
const Facebook = require('fb').Facebook
const fb = new Facebook({
	appId: __config.fb.appId,
	appSecret: __config.fb.appSecret,
	version: 'v3.1'
})

exports.login = async(req, res, next) => {
	let fbToken = req.body.fbToken
	let googleToken = req.body.googleToken

	if (fbToken) {
		exports.fbLogin(req, res, next)
	} else if (googleToken) {
		// exports.googleLogin(req, res, next)
	}
}

exports.fbLogin = async(req, res, next) => {
	let fbToken = req.body.fbToken

	if (!fbToken) {
		return responder.respondBadRequest(res, 'Invalid Facebook token')
	}

	fb.setAccessToken(fbToken)

	fb.api('/me?fields=id,first_name,last_name,email', async(response) => {
		if (!response || response.error) {
			if (response.error) {
				return responder.respondBadRequest(res, response.error.message)
			} else {
				return responder.respondBadRequest(res, 'Invalid Facebook token')
			}
		}

		// Revisar si existe en la DB, sino lo creo
		let userSocialData = await models.userSocialData.scope(['user']).findOne({ where: { fbId: response.id }})

		let user = null
		if (!userSocialData) {
			user = await userServices.createUser(response, 'fb')
		} else {
			user = userSocialData.user
		}

		user = await models.user.scope(['metadata']).findById(user.id)

		let token = authHelper.generateToken(user.toJSON())

		responder.respondData(res, {
			'token': token,
			'user': user
		})
	})
}

exports.getMe = async (req, res, next) => {
	let userId = req.user.id
	let user = await models.user.scope(['metadata']).findById(userId)

	if (!user) {
		return responder.respondBadRequest(res, 'Algo anduvo mal')
	}

	responder.respondData(res, user)
}

exports.updateMe = async(req, res, next) => {
	let userId = req.user.id
	let user = await models.user.scope(['metadata']).findById(userId)

	if (!user) {
		return responder.respondBadRequest(res, 'Algo anduvo mal')
	}

	let body = req.body

	if (body.email) {
		await user.set('email', body.email)
		await user.save()
	}

	if (body.firstName) {
		let firstName = await models.userMetadata.findOne({ where: { user_id: userId, key: 'first_name' }})
		if (firstName) {
			await firstName.set('value', body.firstName)
			await firstName.save()
		}
	}

	if (body.lastName) {
		let lastName = await models.userMetadata.findOne({ where: { user_id: userId, key: 'last_name' } })
		if (lastName) {
			await lastName.set('value', body.lastName)
			await lastName.save()
		}
	}

	user = await models.user.scope(['metadata']).findById(userId)

	responder.respondData(res, user)
}

exports.getFavorites = async (req, res, next) => {
	let userId = req.user.id
	let user = await models.user.scope(['favorites']).findById(userId)

	let favorites = user.favorites
	
	return responder.respondData(res, { favorites: favorites })
}

exports.addFavorite = async (req, res, next) => {
	let productId = req.params.productId
	let userId = req.user.id
	let user = await models.user.scope(['favorites']).findById(userId)

	await user.addFavorite(productId)
	await user.save()
	await user.reload()

	let favorites = user.favorites
	
	return responder.respondData(res, { favorites: favorites })
}

exports.removeFavorite = async (req, res, next) => {
	let productId = req.params.productId
	let userId = req.user.id
	let user = await models.user.scope(['favorites']).findById(userId)

	await user.removeFavorite(productId)
	await user.save()
	await user.reload()

	let favorites = user.favorites

	return responder.respondData(res, { favorites: favorites })
}
