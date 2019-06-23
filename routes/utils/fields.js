const _ = require('lodash')
const fieldHelper = require('./fieldHelper')
const fieldsConfig = require('../fieldsConfig')

function addFields (fieldCongfig, profileData) {
  let fieldObj = {}
  _.forEach(fieldCongfig, (typeSpec, field) => {
    if (typeSpec !== null) {
      const { funcName } = typeSpec
      const func = fieldHelper[funcName]
      func ? fieldObj[field] = func() : console.log(`fieldHelper Not Found: ${funcName}`)
    }
    if (profileData[field]) fieldObj[field] = profileData[field]
  })
  return { ...fieldObj }
}

const addGeneralFields = _.partial(addFields, fieldsConfig.GERNERL_FIELDS)
const addSocialFields = _.partial(addFields, fieldsConfig.SOCIAL_FIELDS)
const addExperienceFields = _.partial(addFields, fieldsConfig.EXPERENCE_FIELDS)

module.exports = {
  addGeneralFields,
  addSocialFields,
  addExperienceFields
}
