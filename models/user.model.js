// 'use strict'

// const baseModel = require('models/base_model/base.model')
// const _ = require('underscore')
// const messages = require('catalogs/messages')

// /**
//  * @api {OBJECT} user user
//  * @apiGroup Modelos
//  * @apiVersion 1.0.0
//  * @apiParam {Integer} id ID.
//  * @apiParam {String} firstName Primer nombre
//  * @apiParam {String} lastName Apellido
//  * @apiParam {String} email E-Mail
//  * @apiParam {String} roles Roles separados por coma
//  */

// module.exports = (sequelize, DataTypes) => {
// 	let entity = sequelize.define('user', _.extend({

// 		firstName: {
// 			type: DataTypes.STRING,
// 			field: 'first_name'
// 		},

// 		lastName: {
// 			type: DataTypes.STRING,
// 			field: 'last_name'
// 		},

// 		email: {
// 			type: DataTypes.STRING,
// 			unique: {
// 				args: true,
// 				msg: messages.UNIQUE_EMAIL
// 			}
// 		},

// 		password: {
// 			type: DataTypes.STRING
// 		},

// 		roles: {
// 			type: DataTypes.TEXT
// 		}

// 	}, baseModel), {
// 			tableName: 'user'
// 		})

// 	entity.associate = (models) => {
// 	}

// 	entity.loadScopes = (models) => {
// 	}

// 	entity.loadHooks = (models) => {
// 	}

// 	return entity
// }
