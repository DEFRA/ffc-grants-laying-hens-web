const { YAR_KEYS } = require('../config/question-bank')
const Joi = require('joi')
const { getDataFromYarValue } = require('./../helpers/pageHelpers')
const { getYarValue } = require('ffc-grants-common-functionality').session

const multiAnswer = 'multi-answer'

function getAllDetails (request, confirmationId) {
  return YAR_KEYS.reduce(
    (allDetails, key) => {
      allDetails[key] = getYarValue(request, key)
      return allDetails
    },
    { confirmationId }
  )
}

const desirabilityAnswersSchema = Joi.object({
  poultryType: Joi.string(),
  currentSystem: Joi.string(),
  currentMultiTierSystem: Joi.string().allow(null),
  rampConnection: Joi.string(),
  maximumTierHeight: Joi.string(),
  threeTiers: Joi.string(),
  henMultiTier: Joi.string().allow(null),
  // pulletMultiTier: Joi.string().allow(null),
  naturalLight: Joi.string(),
  // darkBrooders: Joi.string().allow(null),
  easyGripPerches: Joi.string(),
  buildingBiosecurity: Joi.array().items(Joi.string()),
  pollutionMitigation: Joi.array().items(Joi.string()),
  // pulletVerandaFeatures: Joi.string().allow(null)
  renewableEnergy: Joi.array().items(Joi.string()),
  birdDataType: Joi.array().items(Joi.string()),
  environmentalDataType: Joi.array().items(Joi.string())
})

function getDesirabilityAnswers (request) {
  try {
    const val = {
      poultryType: getYarValue(request, 'poultryType'),
      currentSystem: getYarValue(request, 'currentSystem'),
      currentMultiTierSystem: getYarValue(request, 'currentMultiTierSystem'),
      rampConnection: getYarValue(request, 'rampConnection'),
      maximumTierHeight: getYarValue(request, 'maximumTierHeight'),
      threeTiers: getYarValue(request, 'threeTiers'),
      henMultiTier: getYarValue(request, 'henMultiTier'),
      // pulletMultiTier: getYarValue(request, 'pulletMultiTier'),
      naturalLight: getYarValue(request, 'naturalLight'),
      // darkBrooders: getYarValue(request, 'darkBrooders'),
      easyGripPerches: getYarValue(request, 'easyGripPerches'),
      buildingBiosecurity: getDataFromYarValue(request, 'buildingBiosecurity', multiAnswer),
      pollutionMitigation: getDataFromYarValue(request, 'pollutionMitigation', multiAnswer),
      // pulletVerandaFeatures: getYarValue(request, 'pulletVerandaFeatures'),
      renewableEnergy: getDataFromYarValue(request, 'renewableEnergy', multiAnswer),
      birdDataType: getDataFromYarValue(request, 'birdDataType', multiAnswer),
      environmentalDataType: getDataFromYarValue(request, 'environmentalDataType', multiAnswer)
    }

    const result = desirabilityAnswersSchema.validate(val, {
      abortEarly: false
    })
    if (result.error) {
      throw new Error(`The scoring data is invalid. ${result.error.message}`)
    }
    return result.value
  } catch (ex) {
    console.log(ex, 'error')
    return null
  }
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
