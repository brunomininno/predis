'use strict'
let Sequelize = require('sequelize')

module.exports = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}
}
