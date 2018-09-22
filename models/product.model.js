'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('product',
		{
			...baseModel,

			postType: {
				type: DataTypes.STRING,
				field: 'post_type'
			}

		},
		{
			tableName: 'post'
		}
	)

	entity.associate = (models) => {
	}

	entity.loadScopes = (models) => {
	}

	entity.loadHooks = (models) => {
	}

	return entity
}
