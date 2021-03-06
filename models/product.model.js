'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('product',
	{
		...baseModel,
		
		type: {
			type: DataTypes.STRING,
			field: 'post_type'
		},

		description: {
			type: DataTypes.STRING,
			field: 'post_content'
		},
		
		name: {
			type: DataTypes.STRING,
			field: 'post_title'
		},

		updatedAt: {
			type: DataTypes.DATE,
			field: 'post_modified'
		}
		
	},
	{
		tableName: 'wp_posts'
	}
	)
	
	entity.associate = (models) => {
		entity.hasMany(models.metadata, { foreignKey: { field: 'post_id' }, as: 'metadata' })
		entity.hasOne(models.product, { targetKey: 'post_parent', foreignKey: 'post_parent', as: 'image' })
		entity.belongsTo(models.user, { foreignKey: 'post_author', as: 'provider' })
	}
	
	entity.loadScopes = (models) => {
		entity.addScope('metadata', {
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
		})

		entity.addScope('provider', {
			include: [
				{
					model: models.user,
					required: false,
					as: 'provider',
					include: [
						{
							model: models.userMetadata,
							required: false,
							as: 'metadata',
							where: {
								key: 'nickname'
							}
						}
					]
				}
			]
		})
		
		entity.addScope('image', {
			include: [
				{
					model: models.product,
					required: false,
					as: 'image',
					where: {
						type: 'attachment'
					},
					include: [
						{
							model: models.metadata,
							required: false,
							as: 'metadata',
							where: {
								'meta_key': '_wp_attached_file'
							}
						}
					]
				}
			]
		})
	}
	
	entity.loadHooks = (models) => {
	}
	
	return entity
}
