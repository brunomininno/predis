'use strict'

let fs = require('fs')
let path = require('path')
let Sequelize = require('sequelize')
let moment = require('moment')
let basename = path.basename(module.filename)

let db = {}

let sequelize = new Sequelize(__config.db, {
	define: {
		freezeTableName: true,
		timestamps: false
	},
	omitNull: false,
	logging: false
})

sequelize.sync()

fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
	})
	.forEach(file => {
		let model = sequelize['import'](path.join(__dirname, file))
		db[model.name] = model
	})


// Load models
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})


// Load scopes & hooks
Object.keys(db).forEach(modelName => {
	if (db[modelName].loadScopes) {
		db[modelName].loadScopes(db)
	}
	if (db[modelName].loadHooks) {
		db[modelName].loadHooks(db)
	}
})

sequelize.authenticate()
	.then(() => {
		__logger.info('Connected to DB.')
	})
	.catch(err => {
		__logger.error('Unable to connect to DB.');
	})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db