'use strict'
let Sequelize = require('sequelize')

module.exports = {
	id: {
		type: Sequelize.BIGINT(20).UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		field: 'ID'
	}
}
