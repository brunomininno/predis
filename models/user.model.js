'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')
let Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('user',
		{
			...baseModel
		},
		{
			tableName: 'wp_users'
		}
	)

	entity.associate = (models) => {
		entity.belongsToMany(models.product, { through: 'user_product', foreignKey: { field: 'id_user', name: 'idUser', type: Sequelize.BIGINT(20).UNSIGNED }, otherKey: { field: 'id_product', name: 'idProduct', type: Sequelize.BIGINT(20).UNSIGNED }, as: 'favorites' })
	}

	entity.loadScopes = (models) => {
		entity.addScope('favorites', {
			include: [
				{
					model: models.product.scope(['metadata', 'image']),
					required: false,
					as: 'favorites'
				}
			]
		})
	}

	entity.loadHooks = (models) => {
	}

	return entity
}
