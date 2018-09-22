'use strict'
let Sequelize = require('sequelize')

module.exports = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	createdAt: {
		type: Sequelize.DATE,
		field: 'created_at',
		defaultValue: Sequelize.NOW,
		allowNull: false
	},
	updatedAt: {
		type: Sequelize.DATE,
		field: 'updated_at',
		defaultValue: Sequelize.NOW,
		allowNull: false
	},
	isDeleted: {
		type: Sequelize.BOOLEAN,
		field: 'is_deleted',
		defaultValue: 0,
		allowNull: false
	}
}
