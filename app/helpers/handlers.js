const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues, getGrantValuesSolar } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')

const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const createDesirabilityMsg = require('./../messaging/scoring/create-desirability-msg')
const { getUserScore } = require('../messaging/application')

const emailFormatting = require('./../messaging/email/process-submission')
const gapiService = require('../services/gapi-service')
const { startPageUrl, urlPrefix } = require('../config/server')

const { tableOrder } = require('../helpers/score-table-helper')

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData
} = require('./pageHelpers')
const desirability = require('./../messaging/scoring/create-desirability-msg')

const scoreViewTemplate = 'score'

const createModel = (data, backUrl, url) => {
  return {
    backLink: backUrl,
    formActionPage: url,
    ...data
  }
}

const getPage = async (question, request, h) => {
  const { url, backUrl, nextUrlObject, type, title, yarKey, preValidationKeys, preValidationKeysRule } = question
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationKeys, preValidationKeysRule)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  if (getYarValue(request, 'current-score') && question.order < 250) {
    return h.redirect(`${urlPrefix}/housing`)
  }

  switch (url) {
    case 'project-cost':
      setYarValue(request, 'projectCostSolar', null)
      setYarValue(request, 'calculatedGrantSolar', null)
      setYarValue(request, 'SolarPVCost', null)
      setYarValue(request, 'calculatedGrantSolarPreCap', null)
      setYarValue(request, 'calculatedGrantCalf', null)
      break
    case 'remaining-costs':
      const SolarPVCost = getYarValue(request, 'SolarPVCost')
      const calfGrant = getYarValue(request, 'calculatedGrantCalf')
      const projectCost = getYarValue(request, 'projectCost')

      if (calfGrant && calfGrant >= 500000) {
        question.backUrl = `${urlPrefix}/potential-amount-conditional`
      } else if (SolarPVCost && SolarPVCost > (500000 - calfGrant) / 0.25) {
        question.backUrl = `${urlPrefix}/potential-amount-solar-capped`
      } else if (SolarPVCost) {
        question.backUrl = `${urlPrefix}/potential-amount-solar`
      } else if (projectCost > 1250000) {
        question.backUrl = `${urlPrefix}/potential-amount-capped`
      } else {
        question.backUrl = `${urlPrefix}/potential-amount`
      }

      break

    case 'score':
      const desirabilityAnswers = createMsg.getDesirabilityAnswers(request)
      const formatAnswersForScoring = createDesirabilityMsg(desirabilityAnswers)
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
          desirabilityQuestion.answers = desirabilityQuestion.answers
          return desirabilityQuestion
        })

        await gapiService.sendGAEvent(request, { name: 'score', params: { score_presented: msgData.desirability.overallRating.band } })
        setYarValue(request, 'onScorePage', true)

        return h.view(scoreViewTemplate, createModel({
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

  let confirmationId = ''
  await processGA(question, request)

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question
    maybeEligibleContent.title = question.title
    let consentOptionalData

    if (maybeEligibleContent.reference) {
      if (!getYarValue(request, 'consentMain')) {
        return h.redirect(startPageUrl)
      }
      confirmationId = getConfirmationId(request.yar.id)
      try {
        const emailData = await emailFormatting({ body: createMsg.getAllDetails(request, confirmationId), scoring: getYarValue(request, 'overAllScore') }, request.yar.id)
        await senders.sendDesirabilitySubmitted(emailData, request.yar.id) // replace with sendDesirabilitySubmitted, and replace first param with call to function in process-submission
        console.log('[CONFIRMATION EVENT SENT]')
      } catch (err) {
        console.log('ERROR: ', err)
      }
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

    if (url === 'confirm') {
      const consentOptional = getYarValue(request, 'consentOptional')
      consentOptionalData = getConsentOptionalData(consentOptional)
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (title) {
    question = {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
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

  switch (url) {
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
    }
    // case 'score':

    case 'business-details':
    case 'agent-details':
    case 'applicant-details': {
      return h.view('page', getModel(data, question, request, conditionalHtml))
    }
    default:
      break
  }

  return h.view('page', getModel(data, question, request, conditionalHtml))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, nextUrlObject, title, type } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload

  if (baseUrl !== 'score') {
    setYarValue(request, 'onScorePage', false)
  }

  let thisAnswer
  let dataObject

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
    if (key === 'roofSolarPV' && value === 'Yes') {
      setYarValue(request, 'heritageSite', null)
      setYarValue(request, 'upgradingExistingBuilding', null)
      setYarValue(request, 'projectCostSolar', null)
      setYarValue(request, 'calculatedGrantSolar', null)
      setYarValue(request, 'SolarPVCost', null)
      setYarValue(request, 'calculatedGrantSolarPreCap', null)
    }
    if (key === 'upgradingExistingBuilding' && value === 'Yes') {
      setYarValue(request, 'heritageSite', null)
    }

    if (type !== 'multi-input' && key !== 'secBtn') {
      setYarValue(request, key, key === 'projectPostcode' ? value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : value)
    }
  }
  if (type === 'multi-input') {
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

  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }
  if (currentQuestion?.grantInfoSolar) { // double check
    const projectCostSolar = getYarValue(request, 'projectCostSolar')
    const calfHousingCost = projectCostSolar.calfHousingCost
    const solarCost = projectCostSolar.SolarPVCost
    setYarValue(request, 'calfHousingCost', calfHousingCost)
    setYarValue(request, 'SolarPVCost', solarCost)
    setYarValue(request, 'projectCost', Number(calfHousingCost) + Number(solarCost))
    // calf housing
    const { calculatedGrant, remainingCost } = getGrantValues(calfHousingCost, currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrantCalf', calculatedGrant)
    setYarValue(request, 'remainingCostCalf', remainingCost)
    // Solar
    const { calculatedGrantSolar, remainingCostSolar } = getGrantValuesSolar(solarCost, currentQuestion.grantInfoSolar)
    setYarValue(request, 'calculatedGrantSolar', calculatedGrantSolar)
    setYarValue(request, 'remainingCostSolar', remainingCostSolar)
    // overall
    setYarValue(request, 'calculatedGrant', Number(calculatedGrant) + Number(calculatedGrantSolar))
    setYarValue(request, 'remainingCost', Number(remainingCost) + Number(remainingCostSolar))
  } else if (currentQuestion.grantInfo) {
    const { calculatedGrant, remainingCost } = getGrantValues(getYarValue(request, 'projectCost'), currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)) {
    // if (thisAnswer?.alsoMaybeEligible) {
    //   const {
    //     dependentQuestionKey,
    //     dependentQuestionYarKey,
    //     uniqueAnswer,
    //     notUniqueAnswer,
    //     maybeEligibleContent
    //   } = thisAnswer.alsoMaybeEligible

    //   const prevAnswer = getYarValue(request, dependentQuestionYarKey)

    //   const dependentQuestion = ALL_QUESTIONS.find(thisQuestion => (
    //     thisQuestion.key === dependentQuestionKey &&
    //     thisQuestion.yarKey === dependentQuestionYarKey
    //   ))

    //   let dependentAnswer
    //   let openMaybeEligible

    //   if (notUniqueAnswer) {
    //     dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === notUniqueAnswer)).value
    //     openMaybeEligible = notUniqueSelection(prevAnswer, dependentAnswer)
    //   } else if (uniqueAnswer) {
    //     dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === uniqueAnswer)).value
    //     openMaybeEligible = uniqueSelection(prevAnswer, dependentAnswer)
    //   }

    //   if (openMaybeEligible) {
    //     maybeEligibleContent.title = currentQuestion.title
    //     const { url } = currentQuestion
    //     const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, backUrl: baseUrl }
    //     return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    //   }
    // }
    gapiService.sendGAEvent(request, { name: gapiService.eventTypes.ELIMINATION, params: {} })
    return h.view('not-eligible', NOT_ELIGIBLE)
  }

  switch (baseUrl) {
    case 'project-cost':
      if (payload[Object.keys(payload)[0]] > 1250000) {
        return h.redirect('/upgrading-calf-housing/potential-amount-capped')
      }
      break
    case 'project-cost-solar':
      // ineligible as calf housing too low
      if (getYarValue(request, 'calculatedGrantCalf') < 15000) {
        return h.view('not-eligible', NOT_ELIGIBLE)
        // calf housing only
      } else if (getYarValue(request, 'calculatedGrantCalf') >= 500000) {
        setYarValue(request, 'calculatedGrant', 500000)
        // reset SolarPVCost value
        setYarValue(request, 'calculatedGrantSolar', null)
        setYarValue(request, 'remainingCost', getYarValue(request, 'projectCost') - 500000)

        return h.redirect('/upgrading-calf-housing/potential-amount-conditional')
        // solar capping
      } else if (getYarValue(request, 'calculatedGrant') > 500000) {
        const solarCap = 500000 - getYarValue(request, 'calculatedGrantCalf')
        // store capped solar value for potential amount solar capped page
        setYarValue(request, 'calculatedGrantSolarPreCap', getYarValue(request, 'SolarPVCost') * 0.25)
        // set cap for solar and grant
        setYarValue(request, 'calculatedGrantSolar', solarCap)
        setYarValue(request, 'calculatedGrant', 500000)
        const remaingCostSolar = (getYarValue(request, 'SolarPVCost') - solarCap)
        setYarValue(request, 'remainingCost', Number(getYarValue(request, 'remainingCostCalf')) + remaingCostSolar)

        return h.redirect('/upgrading-calf-housing/potential-amount-solar-capped')
      }
  }

  if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  return h.redirect(getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url))
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

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
  createModel
}
