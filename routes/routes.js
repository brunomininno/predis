'use strict'

const responder = require('helpers/response.helper')

// Require api-docs routes
const index = require('routes/index')

// Require routes
const userRoutes = require('routes/v1/user.routes')
const productRoutes = require('routes/v1/product.routes')

module.exports = function (app) {

	// Api-Docs
	app.use('/api-docs', index)

	// User routes
	app.use('/v1/users', userRoutes)
	app.use('/v1/products', productRoutes)

	app.use(responder.notFound)
	app.use(responder.error)
}
