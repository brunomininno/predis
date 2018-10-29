'use strict'

const messages = require('catalogs/messages')

/**
 * @api {OBJECT} baseResponse baseResponse
 * @apiGroup Respuestas
 * @apiVersion 1.0.0
 * @apiHeader {Token} X-Api-Key Token de autorización
 * @apiParam {Boolean} status boolean
 * @apiParam {Object} data Data
 * @apiParam {String} message Message
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *        "users": [
 *         User1,
 *         User2
 *       ]
 *      }
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 OK
 *     {
 *       "success": false,
 *       "message": "Unauthorized"
 *     }
 */

/**
 * @apiDefine SuccessResponse
 * @apiSuccess {Boolean} status true
 * @apiSuccess {Object} data Data
 */

/**
* @apiDefine MetaDataResponse
* @apiSuccess {Object} data.metadata Metadata
* @apiSuccess {Object} data.metadata.totalResults Total results
* @apiSuccess {Object} data.metadata.currentPage Current page
* @apiSuccess {Object} data.metadata.pageSize Page size
*/

const respond = (res, response) => {
	// __logger.info(JSON.stringify(response))
	res.send(response)
}

exports.respondData = (res, data) => {
	let response = {}
	response.status = true
	response.data = data
	res.status(200)

	respond(res, response)
}

exports.respondMessage = (res, message) => {
	let response = {}
	response.status = true
	response.message = message
	res.status(200)

	respond(res, response)
}

exports.respondBadRequest = (res, message) => {
	let response = {}
	response.status = false
	response.message = message ? message : messages.BAD_REQUEST
	res.status(400)

	respond(res, response)
}

exports.respondUnauthorized = (res, message) => {
	let response = {}
	response.status = false
	response.message = message ? message : messages.UNAUTHORIZED
	res.status(401)

	respond(res, response)
}

exports.respondForbidden = (res) => {
	let response = {}
	response.status = false
	response.message = messages.FORBIDDEN
	res.status(403)

	respond(res, response)
}

exports.respondNotFound = (res) => {
	let response = {}
	response.status = false
	response.message = messages.NOT_FOUND
	res.status(404)

	respond(res, response)
}


exports.notFound = (req, res, next) => {
	let response = {}
	response.status = false
	response.message = messages.URL_NOT_FOUND
	res.status(404)

	respond(res, response)
}

exports.error = (err, req, res, next) => {
	let response = {}
	response.status = false
	response.message = err.message
	res.status(err.status || 500)

	respond(res, response)
}
