'use strict'

const models = require('models')
let Sequelize = require('sequelize')

exports.findAll = async(options, callback) => {
	let query = {
		limit: options.limit,
		offset: options.limit * (options.page - 1),
		distinct: true,
		col: 'product.id',
		logging: true
	}

	if (options.limit && options.limit == -1) {
		query.limit = undefined
		query.offset = undefined
	}

	let scopes = ['image', 'metadata', 'provider']

	if (options.filters) {
		let filters = JSON.parse(options.filters)

		if (filters.search && filters.typeahead) {
			let search = filters.search
			query.where = {
				name: { $like: '%' + search + '%' }
			}
			scopes = ['image']
		} else if (filters.search) {
			let search = filters.search
			let sqlQuery = 'SELECT DISTINCT(p.id) AS id FROM wp_posts AS p ' +
				'INNER JOIN wp_postmeta AS md ON md.post_id = p.ID ' +
				'WHERE p.post_type = "product" ' +
				'AND( ' +
				'	(p.post_title LIKE "%' + search + '%") OR ' +
				'	(p.post_content LIKE "%' + search + '%") OR ' +
				'	(md.meta_key = "_sku" AND md.meta_value LIKE "%' + search + '%") ' +
				')'

			let result = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT })
			
			query.where = {
				id: result.map(v => {
					return v.id
				})
			}
		}
	}

	models.product.scope(scopes).findAndCountAll(query)
		.then((data) => {
			__logger.info('productServices->findAll: Retrieve products')
			if (options.limit && options.limit == -1) {
				options.limit = data.count
			}
			return callback(null, data)
		})
		.catch((err) => {
			__logger.error('productServices->findAll: Error Retrieving products', err)
			return callback(err, null)
		})
}