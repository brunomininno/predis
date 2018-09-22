'use strict'

const responder = require('helpers/response.helper')

// Require api-docs routes
const index = require('routes/index')

// Require routes
const userRoutes = require('routes/v1/user.routes')

module.exports = function (app) {

	// Api-Docs
	app.use('/api-docs', index)

	// User routes
	app.use('/v1/users', userRoutes)

	app.use(responder.notFound)
	app.use(responder.error)
}
