const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('ffc-grants-common-functionality').session
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn, _currentUrl) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath

  if (!urlObject) {
    return secBtn ? secBtnPath : url
  }

  const { dependentQuestionYarKey, dependentAnswerKeysArray, urlOptions, dependentElseUrlYarKey,dependentElseUrlQuestionKey, dependentElseUrlAnswerKey, nonDependentAnswerKeysArray = [] } = urlObject
  let { thenUrl, elseUrl, nonDependentUrl, dependantElseUrl } = urlOptions
  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)

  if (dependentQuestionYarKey === 'SolarPVCost') {
    // if key is not null, show then page, otherwise show else
    return  dependentAnswer != null ? thenUrl : elseUrl
  }

  if (dependantElseUrl &&
      getYarValue(request, dependentElseUrlYarKey) === getQuestionAnswer(dependentElseUrlQuestionKey, dependentElseUrlAnswerKey, ALL_QUESTIONS)) {
      elseUrl = dependantElseUrl
  }

  const selectThenUrl = checkAnswerExist([dependentQuestionYarKey].flat(), request, dependentAnswerKeysArray)
  const isNonDependantAnswer = checkAnswerExist([dependentQuestionYarKey].flat(), request, nonDependentAnswerKeysArray)
  const selectedElseUrl = checkSelectElseUrl(request, [dependentQuestionYarKey].flat(), isNonDependantAnswer) ? elseUrl : nonDependentUrl

  const nextUrl = selectThenUrl ? thenUrl : selectedElseUrl

  return secBtn ? secBtnPath : nextUrl
}
const checkAnswerExist = (dependentQuestionYarKey, request, yarKeysToCheck) => {
  return dependentQuestionYarKey.some(questionYarKey => {
    const dependentAnswer = getYarValue(request, questionYarKey)
    return !!ALL_QUESTIONS.find(thisQuestion => (
      thisQuestion.yarKey === questionYarKey &&
      thisQuestion?.answers.some(answer => (
        !!dependentAnswer &&
        yarKeysToCheck.includes(answer.key) &&
        dependentAnswer.includes(answer.value)
      ))
    ))
  })
}

const checkSelectElseUrl = (request, dependentQuestionYarKey, isNonDependantAnswer) => {
  return dependentQuestionYarKey.some(questionYarKey => getYarValue(request, questionYarKey) && !isNonDependantAnswer
  )
}

module.exports = {
  getUrl
}
