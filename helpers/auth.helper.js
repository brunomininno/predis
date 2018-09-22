'use strict'

const jwt 		= require('jwt-simple')
const bcrypt 	= require('bcrypt')
const moment 	= require('moment')

exports.generateToken = (data) => {
	let expiration = moment().add(__config.expirations.token, 'seconds').unix()
	return exports.encodeToken(data, expiration)
}

exports.encodeToken = (data, expiration) => {
	let payload = {
		'data': data,
		'expiration': expiration
	}

	return jwt.encode(payload, __config.jwtSalt)
}

exports.decodeToken = (token) => {
	return jwt.decode(token, __config.jwtSalt)
}

exports.hashPassword = (password) => {
	return bcrypt.hashSync(password, 10)
}

exports.comparePassword = (password, hash) => {
	return bcrypt.compareSync(password, hash)
}