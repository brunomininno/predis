'use strict'

const responder = require('helpers/response.helper')

// Require routes
const userRoutes = require('routes/v1/user.routes')
const productRoutes = require('routes/v1/product.routes')
const meRoutes = require('routes/v1/me.routes')

module.exports = function (app) {
	// User routes
	app.use('/v1/users', userRoutes)
	app.use('/v1/products', productRoutes)
	app.use('/v1/me', meRoutes)

	app.use(responder.notFound)
	app.use(responder.error)
}
