const { session } = require('ffc-grants-common-functionality')
const { startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')
const { getQuestionAnswer } = require('./utils')

function isServiceDecommissioned(request) {
  const currentUrl = request.url.pathname.split('/').pop();
  const today = new Date(new Date().toDateString());
  const decomissionServiceDate = new Date(serviceEndDate);
  const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
  const dateExpired = +today > +decomissionServiceDate;
  const expiringToday = (+today === +decomissionServiceDate) && (time > serviceEndTime);
  const serviceDecommissioned = expiringToday || dateExpired;
  return (request.url.pathname !== startPageUrl && currentUrl !== 'login' && serviceDecommissioned);
}

const guardDataCheck = (guardData, preValidationList, result, inverseResult, request) => {
  switch (guardData?.preValidationRule) {
    case 'AND':
      // check for all keys (that every key and value pair exists)

      preValidationList.forEach(preValidation => {
        if (preValidation?.values?.filter(answer => getQuestionAnswer(preValidation.url, answer) === session.getYarValue(request, preValidation.key)).length === 0) {
          result = true
        }
      })
      break

    case 'OR':

      preValidationList.forEach(preValidation => {
        if (preValidation.values.filter(answer => getQuestionAnswer(preValidation.url, answer) === session.getYarValue(request, preValidation.key)).length > 0) {
          inverseResult = false
        }
      })

      result = inverseResult
      break

    case 'NOT':
      // check if answer exists in list (if key and value pair contains needed answer)
      preValidationList.forEach(preValidation => {

        if (
          (!session.getYarValue(request, preValidation.key)) ||
          (preValidation.values.filter(answer => getQuestionAnswer(preValidation.url, answer) === session.getYarValue(request, preValidation.key)).length > 0)){
          result = true
        }
      })
      break

    default:
      break

  }

  return result
}

function guardPage (request, guardData) {
  let result = false
  const inverseResult = true

  if (isServiceDecommissioned(request)) {
    return true;
  }

  if (guardData) {

    if (Array.isArray(guardData)) {
      return guardData.filter(dependcyKey => session.getYarValue(request, dependcyKey) === null).length > 0
    }
    // filter list of answers with keys?

    const preValidationList = []

    for (let i = 0; i < guardData.preValidationKeys.length; i++) {
      preValidationList.push({
        key: guardData.preValidationKeys[i],
        values: (guardData?.preValidationAnswer.filter(answer => answer.startsWith(guardData.preValidationUrls[i]))),
        url: guardData.preValidationUrls[i]
      })
    }
    // should format preValidations as below
    //   preValidationObject: {
    //     preValidationKeys: [' '],
    //     preValidationAnswer: ['key1', 'key2'], // make it optional in case of OR
    //     preValidationRule: 'AND',
    //     preValidationUrls: ['project-subject']
    // },

    result = guardDataCheck(guardData, preValidationList, result, inverseResult, request)
  }

  return result
}

module.exports = { guardPage }

