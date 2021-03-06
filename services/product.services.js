'use strict'

const models = require('models')
let Sequelize = require('sequelize')

exports.findAll = async(options, callback) => {
	let query = {
		limit: options.limit,
		offset: options.limit * (options.page - 1),
		distinct: true,
		col: 'product.id',
		order: []
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
			let searchWithAsteriscos = search.replace(/[^\w\s]/gi, '').split(' ').join('* ') + '*'

			let sqlQueryTitle = 'SELECT DISTINCT(p.id) AS id, ' +
				' CASE WHEN md2.meta_key = "disponibilidad" AND md2.meta_value LIKE "%disponible%" THEN 1 ELSE 2 END AS e, ' +
				'MATCH(p.post_title) AGAINST("' + searchWithAsteriscos + '" IN BOOLEAN MODE) AS matchi ' +
				'FROM wp_posts AS p ' +
				'INNER JOIN wp_postmeta AS md ON md.post_id = p.ID ' +
				'INNER JOIN wp_postmeta AS md2 ON md2.post_id = p.ID ' +
				'WHERE p.post_type = "product" ' +
				'AND( ' +
				'	(MATCH(p.post_title) AGAINST("' + searchWithAsteriscos + '" IN BOOLEAN MODE)) OR ' +
				'	(md.meta_key = "_sku" AND md.meta_value LIKE "%' + search + '%") ' +
				') ' +
				'ORDER BY ' +
				'	e, ' +
				'	matchi DESC'

			let sqlQueryDesc = 'SELECT DISTINCT(p.id) AS id, ' +
				' CASE WHEN md2.meta_key = "disponibilidad" AND md2.meta_value LIKE "%disponible%" THEN 1 ELSE 2 END AS e, ' +
				'MATCH(p.post_content) AGAINST("' + searchWithAsteriscos + '" IN BOOLEAN MODE) AS matchi ' +
				'FROM wp_posts AS p ' +
				'INNER JOIN wp_postmeta AS md2 ON md2.post_id = p.ID ' +
				'WHERE p.post_type = "product" ' +
				'AND( ' +
				'	(MATCH(p.post_content) AGAINST("' + searchWithAsteriscos + '" IN BOOLEAN MODE)) ' +
				') ' +
				'ORDER BY ' +
				'	e, ' +
				'	matchi DESC'

			let sqlQuery = 'SELECT id FROM (' + sqlQueryTitle + ' ) AS a1 UNION ALL SELECT id FROM( ' + sqlQueryDesc + ' ) AS a2'

			let result = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT })

			let ids = result.map(v => {
				return v.id
			})

			if (!ids.length) {
				return callback(null, {
					rows: [],
					count: 0
				})
			}
			
			query.where = {
				id: ids
			}

			query.order.push([Sequelize.literal('FIELD(product.id, ' + ids.join() + ')')])
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

exports.getStartScrapes = async () => {
	let sqlQuery = "SELECT " +
		"	p.ID, " +
		"	pm.meta_value " +
		"FROM " +
		"	wp_posts p " +
		"INNER JOIN wp_postmeta pm ON pm.post_id = p.ID " +
		"	AND p.post_type = 'scrape' " +
		"	AND pm.meta_key = 'scrape_start_time' " +
		"ORDER BY " +
		"	p.ID ASC"
	let result = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT })

	return Promise.resolve(result)
}