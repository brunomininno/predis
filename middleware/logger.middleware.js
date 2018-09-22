'use strict';

const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  'transports': [
    // colorize the output to the console
    new (winston.transports.Console)({
      'timestamp': tsFormat,
      'colorize': true,
      'level': process.env.NODE_ENV === 'development' ? 'silly' : 'info'
    })
  ]
});
module.exports = logger;