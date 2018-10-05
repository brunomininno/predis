'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('metadata',
		{
			id: {
				type: DataTypes.STRING,
				field: 'meta_id',
				primaryKey: true
			},

			key: {
				type: DataTypes.STRING,
				field: 'meta_key'
			},

			value: {
				type: DataTypes.STRING,
				field: 'meta_value'
			}

		},
		{
			tableName: 'wp_postmeta'
		}
	)

	return entity
}
