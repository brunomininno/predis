'use strict'

const baseModel = require('../models/base_model/base.model')
const _ = require('underscore')
let Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	let entity = sequelize.define('userSocialData',
		{
			...baseModel,

			fbId: {
				type: DataTypes.STRING,
				field: 'fb_id'
			},

			googleId: {
				type: DataTypes.STRING,
				field: 'google_id'
			},
		},
		{
			tableName: 'user_social_data'
		}
	)

	entity.associate = (models) => {
		entity.belongsTo(models.user, { foreignKey: { field: 'id_user', name: 'idUser', type: Sequelize.BIGINT(20).UNSIGNED }, as: 'user' })
	}

	entity.loadScopes = (models) => {
		entity.addScope('user', {
			include: [
				{
					model: models.user,
					required: false,
					as: 'user'
				}
			]
		})
	}

	entity.loadHooks = (models) => {
	}

	return entity
}
