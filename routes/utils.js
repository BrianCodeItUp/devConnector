const _ = require('lodash')

function splitByComma (value) {
  return typeof value === 'string'
    ? _(value).split(',').map(_.trim).value()
    : ''
}

module.exports = {
  splitByComma
}
