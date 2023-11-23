const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn, currentUrl) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath

  if (!urlObject) {
    return secBtn ? secBtnPath : url
  }

  const { dependentQuestionYarKey, dependentAnswerKeysArray, urlOptions, nonDependentAnswerKeysArray = [] } = urlObject
  const { thenUrl, elseUrl, nonDependentUrl } = urlOptions

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)

  if (dependentQuestionYarKey === 'SolarPVCost') {
    // if key is not null, show then page, otherwise show else
    return  dependentAnswer != null ? thenUrl : elseUrl
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
      thisQuestion.answers &&
      thisQuestion.answers.some(answer => (
        !!dependentAnswer &&
        yarKeysToCheck.includes(answer.key) &&
        dependentAnswer.includes(answer.value)
      ))
    ))
  })
}

const checkSelectElseUrl = (request, dependentQuestionYarKey, isNonDependantAnswer) => {
  return dependentQuestionYarKey.some(dependentQuestionYarKey => {
    return getYarValue(request, dependentQuestionYarKey) && !isNonDependantAnswer
  })
}

module.exports = {
  getUrl
}
