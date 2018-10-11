'use strict'

const responder = require('helpers/response.helper')
const messages = require('catalogs/messages')
const models = require('models')
const moment = require('moment')

exports.getFavorites = async (req, res, next) => {
	// let userId = req.user.id
	let userId = 1
	let user = await models.user.scope(['favorites']).findById(userId)

	let favorites = user.favorites
	
	return responder.respondData(res, { favorites: user })
}

exports.addFavorite = async (req, res, next) => {
	let productId = req.params.productId
	// let userId = req.user.id
	let userId = 1
	let user = await models.user.scope(['favorites']).findById(userId)

	await user.addFavorite(productId)
	await user.save()
	await user.reload()

	let favorites = user.favorites
	
	return responder.respondData(res, { favorites: favorites })
}

exports.removeFavorite = async (req, res, next) => {
	let productId = req.params.productId
	// let userId = req.user.id
	let userId = 1
	let user = await models.user.scope(['favorites']).findById(userId)

	await user.removeFavorite(productId)
	await user.save()
	await user.reload()

	let favorites = user.favorites

	return responder.respondData(res, { favorites: favorites })
}
