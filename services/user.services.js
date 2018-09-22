'use strict'

const models = require('models')

exports.findAll = (options, callback) => {
	let query = {
		limit: options.limit,
		offset: options.limit * (options.page - 1)
	}

	if (options.limit && options.limit == -1) {
		query.limit = undefined
		query.offset = undefined
	}

	if (options.filters) {
		let filters = JSON.parse(options.filters)
		let and = {};
		if (filters.search) {
			let search = filters.search
			and.$or = {
				email: { $like: '%' + search + '%' },
				firstName: { $like: '%' + search + '%' },
				lastName: { $like: '%' + search + '%' },
			}
		}
		if (filters.roles) {
			let role = filters.roles;
			and.roles = role;
		}
		if (filters.idDirection) {
			let idDirection = filters.idDirection;
			and.id_direction = idDirection;
		}
		if (filters.idArea) {
			let idArea = filters.idArea;
			and.id_area = idArea;
		}
		if (filters.idDepartment) {
			let idDepartment = filters.idDepartment;
			and.id_department = idDepartment;
		}

		query.where = {
			$and: and
		}
	}

	let scopes = ['area', 'department', 'direction', 'defaultScope']

	models.user.scope(scopes).findAndCountAll(query)
		.then((data) => {
			__logger.info('userServices->findAll: Retrieve users')
			if (options.limit && options.limit == -1) {
				options.limit = data.count
			}
			return callback(null, data)
		})
		.catch((err) => {
			__logger.error('userServices->findAll: Error Retrieving users', err)
			return callback(err, null)
		})
}