const express = require('express')
const router = express.Router()

// Get angular app index
router.get('/', function(req,res,next){
	res.sendFile('/doc/index.html', {'root': __dirname + '/../'})
})

module.exports = router