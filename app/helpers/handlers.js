const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('ffc-grants-common-functionality').regex
const { getYarValue, setYarValue } = require('ffc-grants-common-functionality').session
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { guardPage } = require('ffc-grants-common-functionality').pageGuard
const { getUrl } = require('../helpers/urls')
const senders = require('../messaging/senders')

const { startPageUrl, urlPrefix, serviceEndDate, serviceEndTime } = require('./../config/server')

// const emailFormatting = require('./../messaging/email/process-submission')
const gapiService = require('../services/gapi-service')

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData
} = require('./pageHelpers')

const { getUserScore } = require('../messaging/application')
const { tableOrder } = require('../helpers/score-table-helper')
const createMsg = require('../messaging/create-msg')
const { desirability } = require('./../messaging/scoring/create-desirability-msg')


const { ALL_QUESTIONS } = require('../config/question-bank')

const createModel = (data, backUrl, url) => {
  return {
    backLink: backUrl,
    formActionPage: url,
    ...data
  }
}

const checkYarKeyReset = (thisAnswer, request) => {
  if (thisAnswer?.yarKeysReset) {
    thisAnswer.yarKeysReset.forEach(yarKey => setYarValue(request, yarKey, ''))
  }
}

const insertYarValue = (field, url, request) => {
  field = field.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => {

    switch (url) {
      case '1000-birds':
        if (getYarValue(request, additionalYarKeyName) === getQuestionAnswer('poultry-type','poultry-type-A1', ALL_QUESTIONS)) {
          return 'laying hens'
        } else {
          return 'pullets'
        }
      case 'current-multi-tier-system':
        if (getYarValue(request, additionalYarKeyName) === getQuestionAnswer('poultry-type','poultry-type-A1', ALL_QUESTIONS)){
          return 'multi-tier aviary systems'
        } else {
          return 'multi-tier systems'
        }
        case 'lighting-features':
          if (getYarValue(request, additionalYarKeyName) === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS)) {
            return ' (unless this is already provided as part of an aviary lighting system)'
          } else {
            return ''
          }
          case 'bird-number':
          if (getYarValue(request, additionalYarKeyName) === getQuestionAnswer('project-type', 'project-type-A2', ALL_QUESTIONS)) {
            return 'the refurbished part of this building'
          } else {
            return 'this new building'
          } 
      default:
        if (field.includes('£')) {
          return formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        } else {
          return getYarValue(request, additionalYarKeyName)
        }
    }

  })

  return field
}

const titleCheck = (question, title, url, request) => {
  if (title?.includes('{{_')) {
    question = {
      ...question,
      title: insertYarValue(title, url, request)
    }
  }

  return question
}

const labelTextCheck = (question, label, url, request) => {
  if (label?.text?.includes('{{_')) {
    question = {
      ...question,
      label: {
        ...label,
        text: insertYarValue(label.text, url, request)
      }
    }
  }

  return question
}

const hintTextCheck = (question, hint, url, request) => {
  if (hint?.html?.includes('{{_')) {
    question = {
      ...question,
      hint: {
            ...hint,
            html: insertYarValue(hint.html,url, request)
      }
    }
  }
  
  return question
}

const sidebarCheck = (question, url, request ) => {
  if (question.sidebar?.values[0]?.content[0]?.para.includes('{{_')) {
    question = {
      ...question,
      sidebar: {
        values: [
          {
            ...question.sidebar.values[0],
            content: [{
              para: insertYarValue(question.sidebar.values[0].content[0].para, url, request)
            }
            ]
          }
        ]
      }
    }
  }

  if (question.sidebar?.values[0]?.content[0]?.items?.some(item => item.includes('{{_'))) {
    question = {
      ...question,
      sidebar: {
        values: [
          {
            ...question.sidebar.values[0],
            content: [
              {
                ...question.sidebar.values[0].content[0],
                items: question.sidebar.values[0].content[0].items.map(item => 
                  item.includes('{{_') ? insertYarValue(item, url, request) : item
                
                )
              }
            ]
          }
        ]
      }
    }
}

  return question
}

const validateErrorCheck = (question, validate, url, request) => {

 // this sonar issue fix actually breaks all tests
  if (question?.validate && question.validate[0].error.includes('{{_')) {
    question = {
      ...question,
      validate: [
        {
          ...validate[0],
          error: insertYarValue(question.validate[0].error, url, request)
        },
        ...validate
      ]
    }
  }

  return question
}

const ineligibleContentCheck = (question, ineligibleContent, url,  request) => {
  if (question?.ineligibleContent?.messageContent.includes('{{_')) {
    question = {
      ...question,
      ineligibleContent: {
            ...question.ineligibleContent,
            messageContent: insertYarValue(ineligibleContent.messageContent,url, request)
      }
    }
  }
  
  return question
}

const scorePageData = async (request, backUrl, url, h) => {
  const desirabilityAnswers = createMsg.getDesirabilityAnswers(request)
  const formatAnswersForScoring = desirability(desirabilityAnswers)

  try {
    const msgData = await getUserScore(formatAnswersForScoring, request.yar.id)

    setYarValue(request, 'current-score', msgData.desirability.overallRating.band) // do we need this alongside overAllScore? Having both seems redundant

    // Mocked score res
    let scoreChance
    switch (msgData.desirability.overallRating.band.toLowerCase()) {
      case 'strong':
        scoreChance = 'is likely to'
        break
      case 'average':
        scoreChance = 'might'
        break
      default:
        scoreChance = 'is unlikely to'
        break
    }

    setYarValue(request, 'overAllScore', msgData)

    const questions = msgData.desirability.questions.map(desirabilityQuestion => {
      if (desirabilityQuestion.key === 'environmental-impact' && getYarValue(request, 'SolarPVCost') === null) {
        desirabilityQuestion.key = 'rainwater'
        if (desirabilityQuestion.answers[0].input[0].value === 'None of the above') {
          desirabilityQuestion.answers[0].input[0].value = 'No'
        } else {
          desirabilityQuestion.answers[0].input[0].value = 'Yes'
        }
      }

      const tableQuestion = tableOrder.filter(tableQuestionD => tableQuestionD.key === desirabilityQuestion.key)[0]
      desirabilityQuestion.title = tableQuestion.title
      desirabilityQuestion.desc = tableQuestion.desc ?? ''
      desirabilityQuestion.url = `${urlPrefix}/${tableQuestion.url}`
      desirabilityQuestion.order = tableQuestion.order
      desirabilityQuestion.unit = tableQuestion?.unit
      desirabilityQuestion.pageTitle = tableQuestion.pageTitle
      desirabilityQuestion.fundingPriorities = tableQuestion.fundingPriorities
      return desirabilityQuestion
    })

    await gapiService.sendGAEvent(request, { name: 'score', params: { score_presented: msgData.desirability.overallRating.band } })
    setYarValue(request, 'onScorePage', true)

    return h.view('score', createModel({
      titleText: msgData.desirability.overallRating.band,
      scoreData: msgData,
      questions: questions.sort((a, b) => a.order - b.order),
      scoreChance: scoreChance
    }, backUrl, url))
  } catch (error) {
    console.log(error)
    await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.EXCEPTION, params: { error: error.message } })
    return h.view('500')
  }
}

const maybeEligibleGet = async (request, confirmationId, question, url, nextUrl, backUrl, h) => {
  let { maybeEligibleContent } = question
  maybeEligibleContent.title = question.title
  let consentOptionalData

  if (url === 'veranda-potential-amount' && getYarValue(request, 'projectCost') > 250000) {
    question.maybeEligibleContent.potentialAmountConditional = true
  } else {
    question.maybeEligibleContent.potentialAmountConditional = false
  }

  if (maybeEligibleContent.reference) {
    if (!getYarValue(request, 'consentMain')) {
      return h.redirect(startPageUrl)
    }
    confirmationId = getConfirmationId(request.yar.id)
    // try {
    //   const emailData = await emailFormatting({ body: createMsg.getAllDetails(request, confirmationId), scoring: getYarValue(request, 'overAllScore') }, request.yar.id)
    //   await senders.sendDesirabilitySubmitted(emailData, request.yar.id)
    //   console.log('[CONFIRMATION EVENT SENT]')
    // } catch (err) {
    //   console.log('ERROR: ', err)
    // }
    maybeEligibleContent = {
      ...maybeEligibleContent,
      reference: {
        ...maybeEligibleContent.reference,
        html: maybeEligibleContent.reference.html.replace(
          SELECT_VARIABLE_TO_REPLACE, (_ignore, _confirmatnId) => (
            confirmationId
          )
        )
      }
    }
    request.yar.reset()
  }

  maybeEligibleContent = {
    ...maybeEligibleContent,
    messageContent: maybeEligibleContent.messageContent.replace(
      SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      )
    )
  }

  if (url === 'confirm' || url === 'veranda-confirm') {
    const consentOptional = getYarValue(request, 'consentOptional')
    consentOptionalData = getConsentOptionalData(consentOptional)
  }

  const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
  return h.view('maybe-eligible', MAYBE_ELIGIBLE)
}

const getUrlSwitchFunction = async (data, question, request, conditionalHtml, backUrl, nextUrl, h) => {
  switch (question.url) {
    case 'check-details': {
      return h.view('check-details', getCheckDetailsModel(request, question, backUrl, nextUrl))
    }

    case 'planning-permission-summary': {
      const evidenceSummaryModel = getEvidenceSummaryModel(request, question, backUrl, nextUrl)
      if (evidenceSummaryModel.redirect) {
        return h.redirect(startPageUrl)
      }
      return h.view('evidence-summary', evidenceSummaryModel)
    }

    case 'project': {
      if (getYarValue(request, 'tenancy') === 'Yes') {
        setYarValue(request, 'tenancyLength', null)
      }
      return h.view('page', getModel(data, question, request, conditionalHtml))
    }

    case 'business-details':
    case 'agent-details':
    case 'applicant-details':
    default:
      return h.view('page', getModel(data, question, request, conditionalHtml))
  }
}

const getPage = async (question, request, h) => {
  const { url, backUrl, nextUrlObject, type, title, hint, yarKey, ineligibleContent, label } = question
  const preValidationObject = question.preValidationObject ?? question.preValidationKeys //
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationObject, startPageUrl, serviceEndDate, serviceEndTime, ALL_QUESTIONS)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }

  // formatting variables block
  question = titleCheck(question, title, url, request)
  question = sidebarCheck(question, url, request)
  question = ineligibleContentCheck(question, ineligibleContent, url, request)
  question = hintTextCheck(question, hint, url, request)
  question = labelTextCheck(question, label, url, request)

  // score contains maybe eligible, so can't be included in getUrlSwitchFunction
  if (url === 'score') {
    return scorePageData(request, backUrl, url, h)
  }

  const confirmationId = ''
  await processGA(question, request)

  if (question.maybeEligible) {
    return maybeEligibleGet(request, confirmationId, question, url, nextUrl, backUrl, h)
  }

  const data = getDataFromYarValue(request, yarKey, type)

  let conditionalHtml
  if (question?.conditionalKey && question?.conditionalLabelData) {
    const conditional = yarKey === 'businessDetails' ? yarKey : question.conditionalKey
    conditionalHtml = handleConditinalHtmlData(
      type,
      question.conditionalLabelData,
      conditional,
      request
    )
  }
  return (getUrlSwitchFunction(data, question, request, conditionalHtml, backUrl, nextUrl, h))
}

const multiInputPostHandler = (currentQuestion, request, dataObject, payload, yarKey) => {
  const allFields = currentQuestion.allFields
  allFields.forEach(field => {
    const payloadYarVal = payload[field.yarKey]
      ? payload[field.yarKey].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
      : ''
    dataObject = {
      ...dataObject,
      [field.yarKey]: (
        (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode')
          ? payloadYarVal
          : payload[field.yarKey] || ''
      ),
      ...field.conditionalKey ? { [field.conditionalKey]: payload[field.conditionalKey] } : {}
    }
  })
  setYarValue(request, yarKey, dataObject)
}

const multiInputForLoop = (payload, answers, type, yarKey, request) => {
  let thisAnswer
  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }

  for (const [key, value] of Object.entries(payload)) {
    // if statement added for multi-input eligibility for non-eligible
    if (typeof (value) === 'object') {
      thisAnswer = answers?.find(answer => (answer.value === value[0]))
    } else {
      thisAnswer = answers?.find(answer => (answer.value === value))
    }

    if (key === 'henVeranda' && value === 'My project is exempt') {
      setYarValue(request, 'henPopHoles', null)
    }

    if (type !== 'multi-input' && key !== 'secBtn') {
      setYarValue(request, key, key === 'projectPostcode' ? value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : value)
    }
  }

  return thisAnswer
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, nextUrlObject, title, hint, type, validate } = currentQuestion
  const payload = request.payload

  if (baseUrl !== 'score') {
    setYarValue(request, 'onScorePage', false)
  }

  // formatting variables block - needed for error validations
  currentQuestion = titleCheck(currentQuestion, title, baseUrl, request)
  currentQuestion = validateErrorCheck(currentQuestion, validate, baseUrl, request)
  currentQuestion = sidebarCheck(currentQuestion, baseUrl, request)
  currentQuestion = ineligibleContentCheck(currentQuestion, ineligibleContent, baseUrl, request)
  currentQuestion = hintTextCheck(currentQuestion, hint, baseUrl, request)
  currentQuestion = labelTextCheck(currentQuestion, currentQuestion.label, baseUrl, request)

  const thisAnswer = multiInputForLoop(payload, answers, type, yarKey, request)
  const NOT_ELIGIBLE = { ...currentQuestion?.ineligibleContent, backUrl: baseUrl }
  let dataObject
  if (type === 'multi-input') {
    multiInputPostHandler(currentQuestion, request, dataObject, payload, yarKey)
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)) {
    gapiService.sendGAEvent(request,
      { name: gapiService.eventTypes.ELIMINATION, params: {} })

    return h.view('not-eligible', NOT_ELIGIBLE)
  }

  if (baseUrl === 'project-cost' && payload[Object.keys(payload)[0]] > 1250000) {
    return h.redirect('/laying-hens/potential-amount-capped')
  }
  
  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost, projectCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
    setYarValue(request, 'projectCost', projectCost)
  }

  if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  checkYarKeyReset(thisAnswer, request)

  return h.redirect(getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url))
}

const getHandler = question => (request, h) => getPage(question, request, h)

const getPostHandler = currentQuestion => (request, h) => showPostPage(currentQuestion, request, h)

const processGA = async (question, request) => {
  if (question.ga) {
    if (question.ga.journeyStart) {
      setYarValue(request, 'journey-start-time', Date.now())
      console.log('[JOURNEY STARTED] ')
    } else {
      await gapiService.sendGAEvent(request, question.ga)
    }
  }
}

module.exports = {
  getHandler,
  getPostHandler,
  insertYarValue,
  createModel
}
