'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')
let Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('user',
		{
			...baseModel,

			email: {
				type: DataTypes.STRING,
				field: 'user_email'
			},

			createdAt: {
				type: DataTypes.DATE,
				field: 'user_registered',
				defaultValue: Sequelize.NOW
			},
		},
		{
			tableName: 'wp_users'
		}
	)

	entity.associate = (models) => {
		entity.hasMany(models.userMetadata, { foreignKey: { field: 'user_id' }, as: 'metadata' })
		entity.belongsToMany(models.product, { through: 'user_product', foreignKey: { field: 'id_user', name: 'idUser', type: Sequelize.BIGINT(20).UNSIGNED }, otherKey: { field: 'id_product', name: 'idProduct', type: Sequelize.BIGINT(20).UNSIGNED }, as: 'favorites' })
		entity.hasOne(models.userSocialData, { foreignKey: { field: 'id_user', name: 'idUser', type: Sequelize.BIGINT(20).UNSIGNED }, as: 'userSocialData' })
	}

	entity.loadScopes = (models) => {
		entity.addScope('favorites', {
			include: [
				{
					model: models.product.scope(['metadata', 'image', 'provider']),
					required: false,
					as: 'favorites'
				}
			]
		})

		entity.addScope('userSocialData', {
			include: [
				{
					model: models.userSocialData,
					as: 'userSocialData'
				}
			]
		})

		entity.addScope('metadata', {
			include: [
				{
					model: models.userMetadata,
					required: false,
					as: 'metadata'
				}
			]
		})
	}

	entity.loadHooks = (models) => {
	}

	return entity
}
