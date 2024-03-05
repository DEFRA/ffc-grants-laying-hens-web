const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { getYarValue } = require('ffc-grants-common-functionality').session

const { validateAnswerField, checkInputError } = require('ffc-grants-common-functionality').errorHelpers

// Fix sonarcloud complaint by making this type a constant
const multi = 'multi-input'

const customiseErrorText = (value, currentQuestion, errorList, h, request) => {
  const { yarKey, type, conditionalKey, conditionalLabelData } = currentQuestion
  let conditionalHtml

  if (conditionalKey) {
    const conditionalFieldError = errorList.find(thisErrorHref => thisErrorHref.href.includes(conditionalKey))?.text
    const conditionalFieldValue = (type === multi) ? getYarValue(request, yarKey)[conditionalKey] : getYarValue(request, conditionalKey)
    conditionalHtml = getHtml(conditionalKey, conditionalLabelData, conditionalFieldValue, conditionalFieldError)
  }
  const baseModel = getModel(value, currentQuestion, request, conditionalHtml)

  if (type === multi) {
    const baseModelItems = baseModel.items.map(thisItem => {
      const matchingErrorHref = errorList.find(thisErrorHref => thisErrorHref.href.includes(thisItem.id))

      if (matchingErrorHref) {
        return {
          ...thisItem,
          errorMessage: { text: matchingErrorHref.text }
        }
      }
      return thisItem
    })
    baseModel.items = [
      ...baseModelItems
    ]
  } else {
    baseModel.items = {
      ...baseModel.items,
      ...(errorList[0].href.includes(yarKey) ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

const validateFunction = (validate, isconditionalAnswer, payload, yarKey, errorHrefList, placeholderInputError) => {

  if (validate) {
    placeholderInputError = checkInputError(validate, isconditionalAnswer, payload, yarKey, ALL_QUESTIONS)

    if (placeholderInputError) {
      errorHrefList.push({
        text: placeholderInputError.error,
        href: `#${placeholderInputError.dependentKey ?? yarKey}`
      })
    }
  }

  return errorHrefList
}

const checkErrors = (payload, currentQuestion, h, request) => {
  const { yarKey, answers, validate } = currentQuestion
  const conditionalAnswer = answers?.find(answer => answer.conditional)
  let errorHrefList = []
  let isconditionalAnswer
  let placeholderInputError
  if (currentQuestion.type === multi) {
    const allFields =  currentQuestion.allFields

    allFields.forEach(
      ({ yarKey: inputYarKey, validate: inputValidate, answers: inputAnswers }) => {
        isconditionalAnswer = inputAnswers?.find(answer => answer.conditional)?.value === payload[inputYarKey]

        errorHrefList = validateFunction(inputValidate, isconditionalAnswer, payload, inputYarKey, errorHrefList, placeholderInputError)
      }
    )

    if (errorHrefList.length > 0) {
      return customiseErrorText(payload, currentQuestion, errorHrefList, h, request)
    }
  }
  if (Object.keys(payload).length === 0 && currentQuestion.type) {
    placeholderInputError = validate.find(
      ({ type, _dependentKey, ...details }) => (validateAnswerField(payload[yarKey], type, details, payload, ALL_QUESTIONS) === false))

    errorHrefList.push({
      text: placeholderInputError.error,
      href: `#${placeholderInputError.dependentKey ?? yarKey}`
    })
    return customiseErrorText('', currentQuestion, errorHrefList, h, request)
  }

  const payloadValue = typeof payload[yarKey] === 'string' ? payload[yarKey].trim() : payload[yarKey]
  isconditionalAnswer = payload[yarKey]?.includes(conditionalAnswer?.value)

  errorHrefList = validateFunction(validate, isconditionalAnswer, payload, yarKey, errorHrefList, placeholderInputError)

  if (errorHrefList.length > 0) {
    return customiseErrorText(payloadValue, currentQuestion, errorHrefList, h, request)
  }

  return false
}

module.exports = {
  customiseErrorText,
  checkErrors
}
