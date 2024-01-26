const { getQuestionAnswer } = require('../helpers/utils')

const minMaxCheck = (value, min, max) =>
  value >= min && value <= max


const regexCheck = (regex, value) =>
  !value || regex.test(value)


const validateAnswerField = (value, validationType, details, payload) => {
  switch (validationType) {
    case 'NOT_EMPTY': {
      const { extraFieldsToCheck } = details

      if (extraFieldsToCheck && !value) {
        return extraFieldsToCheck.some(extraField => (
          !!payload[extraField]
        ))
      }

      return !!value
    }

    case 'STANDALONE_ANSWER': {
      const selectedAnswer = [value].flat()
      const {
        standaloneObject: {
          questionKey: standaloneQuestionKey,
          answerKey: standaloneAnswerKey
        }
      } = details
      const standAloneAnswer = getQuestionAnswer(standaloneQuestionKey, standaloneAnswerKey)

      if (selectedAnswer.includes(standAloneAnswer)) {
        return selectedAnswer.length === 1
      }
      return true
    }

    case 'CONFIRMATION_ANSWER': {
      const { fieldsToCampare } = details
      return payload[fieldsToCampare[0]] === payload[fieldsToCampare[1]]
    }

    case 'REGEX': {
      const { regex } = details
      return regexCheck(regex, value)
    }

    case 'MIN_MAX_CHARS': {
      const { min, max } = details
      return minMaxCheck(value.length, min, max)
    }

    case 'MIN_MAX': {
      const { min, max } = details
      return minMaxCheck(value, min, max)
    }

    default:
      return false
  }
}

const checkInputError = (validate, isconditionalAnswer, payload, yarKey) => {
  return validate.find(
    ({ type, dependentKey, ...details }) => (isconditionalAnswer && dependentKey)
      ? (validateAnswerField(payload[dependentKey], type, details, payload) === false)
      : !dependentKey && (validateAnswerField(payload[yarKey], type, details, payload) === false)
  )
}

module.exports = {
  validateAnswerField,
  checkInputError
}
