const { getUrl } = require('../helpers/urls')
const { getYarValue } = require('ffc-grants-common-functionality').session
const { getOptions } = require('ffc-grants-common-functionality').answerOptions
const { getQuestionByKey, allAnswersSelected } = require('../helpers/utils')

const getDependentSideBar = (sidebar, request) => {
  const { values, dependentQuestionKeys } = sidebar
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    const yarKey = getQuestionByKey(dependentQuestionKey).yarKey
    const selectedAnswers = getYarValue(request, yarKey)

    if (selectedAnswers) {
      values[index].content[0].items = [selectedAnswers].flat()
    } else {
      values[index].content[0].items = ['Not needed']
    }

  })
  return {
    ...sidebar
  }
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'remaining-costs') ? null : url
}

const showBackToDetailsButton = (key, request) => {
  switch (key) {
    case 'farmer-details':
    case 'business-details':
    case 'applicant-details':
    case 'agent-details':
    case 'score': {
      return !! getYarValue(request, 'reachedCheckDetails')
    }
    default:
      return false
  }
}

const showBackToEvidenceSummaryButton = (key, request) => {
  switch (key) {
    case 'planning-permission':
    case 'planning-permission-evidence':
    case 'grid-reference': {
      return !! getYarValue(request, 'reachedEvidenceSummary')
    }
    default:
      return false
  }
}

const getModel = (data, question, request, conditionalHtml = '') => {
  let { type, backUrl, key, backUrlObject, sidebar, title, hint, score, label, warning, warningCondition, nextUrl, nextUrlObject } = question
  const hasScore = !! getYarValue(request, 'current-score')

  title = title ?? label?.text

  const sideBarText = sidebar

  let warningDetails
  if (warningCondition) {
    const { dependentWarningQuestionKey, dependentWarningAnswerKeysArray } = warningCondition
    if (allAnswersSelected(request, dependentWarningQuestionKey, dependentWarningAnswerKeysArray)) {
      warningDetails = warningCondition.warning
    }
  } else if (warning) {
    warningDetails = warning
  }
  return {
    type,
    key,
    title,
    hint,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    nextUrl: getUrl(nextUrlObject, nextUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    ...(warningDetails ? ({ warning: warningDetails }) : {}),
    reachedCheckDetails: showBackToDetailsButton(key, request),
    reachedEvidenceSummary: showBackToEvidenceSummaryButton(key, request),
    diaplaySecondryBtn: hasScore && score?.isScore
  }
}

module.exports = {
  getModel
}
