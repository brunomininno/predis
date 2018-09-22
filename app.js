require('app-module-path').addPath(__dirname)

const bodyParser		= require('body-parser')
const cookieParser 	= require('cookie-parser')
const express      	= require('express')
const multer       	= require('multer')
const path         	= require('path')
const accessControl 	= require('middleware/access_control.middleware');

const app = express()

global.__config = require('konphyg')('config')('main')
global.__logger = require('middleware/logger.middleware.js')

console.log('NODE_ENV: ' + process.env.NODE_ENV)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': false}))
app.use(cookieParser())
app.use('/api-docs', express.static(path.join(__dirname, 'api-docs')))
app.use(accessControl)

require('routes/routes')(app)

module.exports = app