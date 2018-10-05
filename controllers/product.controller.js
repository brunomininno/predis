'use strict'

const productServices = require('services/product.services')
const responder = require('helpers/response.helper')
const authHelper = require('helpers/auth.helper')
const messages = require('catalogs/messages')
const models = require('models')
const moment = require('moment')

exports.getAll = async (req, res, next) => {
	let options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 20,
		filters: req.query.filters || null
	}

	productServices.findAll(options, (err, data) => {
		if (err) {
			__logger.error('getAll: Error getting products', err)
			return next(messages.GET_DATA_FAILED)
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
		return responder.respondBadRequest(res, messages.ID_product_REQUIRED)
	}

	let scopes = ['defaultScope']

	let product = await models.product.scope(scopes).findById(id)
	if (!product) {
		__logger.error('productController->getOneById: Error getting product')
		return responder.respondBadRequest(res, messages.ENTITY_NOT_FOUND)
	}

	__logger.info('productController->getOneById: Found product ' + id)

	return responder.respondData(res, product)

}

