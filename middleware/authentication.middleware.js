'use strict'

const authHelper = require('helpers/auth.helper')
const moment = require('moment')
const models = require('models')
const responder = require('helpers/response.helper')
const messages = require('catalogs/messages')

exports.validateAccess = () => {
	return async (req, res, next) => {
		let headers = req.headers

		if (!isTokenValid(headers)) {
			return responder.respondUnauthorized(res, messages.INVALID_TOKEN)
		}

		let payload = authHelper.decodeToken(headers['x-api-key'])

		let user = await models.user.findById(payload.data.id)

		if (!user) {
			__logger.error('validateAccess: Error getting user for ID ' + payload.data.id)
			return responder.respondBadRequest(res, 'Se produjo un error al validar el usuario')
		}

		user = user.get({ plain: true })
		req.user = user
		return next()
	}
}

let isTokenValid = (headers) => {
	let api_key = headers['x-api-key']

	if (api_key && (api_key !== undefined)) {
		try {
			let payload = authHelper.decodeToken(api_key)
			if ((payload !== undefined) && (payload.expiration > moment().unix())) {
				return true
			}

		} catch (e) {
			return false
		}
	}
	return false
}