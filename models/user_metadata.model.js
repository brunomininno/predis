'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('userMetadata',
		{
			id: {
				type: DataTypes.STRING,
				field: 'umeta_id',
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
			tableName: 'wp_usermeta'
		}
	)

	entity.associate = (models) => {
		entity.hasOne(models.metadata, { foreignKey: 'post_id', as: 'metadata' })
		var item = entity.associations[models.metadata.name]
		item.sourceIdentifier = item.sourceKey = item.sourceKeyAttribute = 'value'
		item.sourceKeyIsPrimary = false
	}

	return entity
}
