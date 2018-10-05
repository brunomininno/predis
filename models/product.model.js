'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('product',
		{
			type: {
				type: DataTypes.STRING,
				field: 'post_type'
			},

			name: {
				type: DataTypes.STRING,
				field: 'post_title'
			}

		},
		{
			tableName: 'wp_posts'
		}
	)

	entity.associate = (models) => {
		entity.hasMany(models.metadata, { foreignKey: { field: 'post_id' }, as: 'metadata' })
	}

	entity.loadScopes = (models) => {
		entity.addScope('defaultScope', {
			where: {
				type: 'product'
			},
			include: [
				{
					model: models.metadata,
					required: false,
					as: 'metadata'
				}
			]
		}, { override: true })
	}

	entity.loadHooks = (models) => {
	}

	return entity
}
