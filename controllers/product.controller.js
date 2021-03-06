'use strict'

const productServices = require('services/product.services')
const userServices = require('services/user.services')
const responder = require('helpers/response.helper')
const authHelper = require('helpers/auth.helper')
const messages = require('catalogs/messages')
const models = require('models')
const moment = require('moment')
const striptags = require('striptags')

exports.getAll = async (req, res, next) => {
	let options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 20,
		filters: req.query.filters || null
	}

	let profileImages = await userServices.getProfileImage()

	productServices.findAll(options, async(err, data) => {
		if (err) {
			__logger.error('getAll: Error getting products', err)
			return next(messages.GET_DATA_FAILED)
		}

		let i = 0
		for (let r of data.rows) {
			let r = data.rows[i].toJSON()
			for (let pi of profileImages) {
				if (r.provider && (r.provider.id == pi.user_id)) {
					r.provider.profileImage = pi.meta_value
				}
			}
			r.isInStock = await stockOrNot(r)
			data.rows[i] = r
			i++
		}

		return responder.respondData(res, {
			'products': data.rows,
			'metadata': {
				'totalResults': data.count,
				'currentPage': options.page,
				'pageSize': options.limit
			}
		})
	})
}

exports.getOneById = async (req, res, next) => {
	let id = req.params.id

	if (!id) {
		return responder.respondBadRequest(res, 'ID Requerido')
	}

	let scopes = ['metadata', 'image', 'provider']

	let product = await models.product.scope(scopes).findById(id)
	if (!product) {
		__logger.error('productController->getOneById: Error getting product')
		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
	}

	product = product.toJSON()

	let profileImage = null
	if (product.provider) {
		profileImage = await userServices.getProfileImage(product.provider.id)
		if (profileImage[0]) {
			product.provider.profileImage = profileImage[0].meta_value
		}
	}

	product.isInStock = await stockOrNot(product)

	product.description = striptags(product.description)

	__logger.info('productController->getOneById: Found product ' + id)

	return responder.respondData(res, product)

}

let stockOrNot = async (product) => {
	if (!product.metadata) {
		return false
	}
	for (let md of product.metadata) {
		if (md.key == 'disponibilidad') {
			return md.value.includes('disponible')
		}
	}

	return false
}