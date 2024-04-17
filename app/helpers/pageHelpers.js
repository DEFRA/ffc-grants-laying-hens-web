const { getQuestionAnswer } = require('ffc-grants-common-functionality/lib/utils');
const { getHtml } = require('../helpers/conditionalHTML');
const { ALL_QUESTIONS } = require('../config/question-bank');

const { getYarValue, setYarValue } = require('ffc-grants-common-functionality').session
const { setOptionsLabel } = require('ffc-grants-common-functionality').answerOptions

const getConfirmationId = (guid, request) => {
  const projectType = getYarValue(request, 'projectType');
  const projectTypeAnswer = getQuestionAnswer('project-type','project-type-A1', ALL_QUESTIONS)

  let prefix =''
  if(projectType === projectTypeAnswer){
    if(getYarValue(request, 'verandaFundingCap')){
      prefix = 'VI'
    }else{
      console.log('VOOOOO I am here!!!!!!')
      prefix = 'VO'
    }
  }else{
      prefix = 'LH'
  }
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase();
}

const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? getYarValue(request, yarKey)?.sbi : getYarValue(request, yarKey)
  return getHtml(label, labelData, fieldValue)
}

const saveValuesToArray = (yarKey, fields) => {
  const result = []

  if (yarKey) {
    fields.forEach(field => {
      if (yarKey[field]) {
        result.push(yarKey[field])
      }
    })
  }

  return result
}

const getCheckDetailsModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedCheckDetails', true)

  const applying = getYarValue(request, 'applying')
  const businessDetails = getYarValue(request, 'businessDetails')
  const agentDetails = getYarValue(request, 'agentsDetails')
  const farmerDetails = getYarValue(request, 'farmerDetails')

  const agentContact = saveValuesToArray(agentDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
  const agentAddress = saveValuesToArray(agentDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

  const farmerContact = saveValuesToArray(farmerDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
  const farmerAddress = saveValuesToArray(farmerDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    applying,
    businessDetails,
    farmerDetails: {
      ...farmerDetails,
      ...(farmerDetails
        ? {
            name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
            contact: farmerContact.join('<br/>'),
            address: farmerAddress.join('<br/>')
          }
        : {}
      )
    },
    agentDetails: {
      ...agentDetails,
      ...(agentDetails
        ? {
            name: `${agentDetails.firstName} ${agentDetails.lastName}`,
            contact: agentContact.join('<br/>'),
            address: agentAddress.join('<br/>')
          }
        : {}
      )
    }

  })
}

const getEvidenceSummaryModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedEvidenceSummary', true)

  const planningPermission = getYarValue(request, 'planningPermission')
  const gridReference = getYarValue(request, 'gridReference')
  const hasEvidence = !planningPermission.startsWith('Not yet')
  if (hasEvidence && !getYarValue(request, 'PlanningPermissionEvidence')) {
    return { redirect: true }
  }

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    planningPermission,
    gridReference,
    ...(hasEvidence
      ? {
          evidence: {
            planningAuthority: getYarValue(request, 'PlanningPermissionEvidence').planningAuthority,
            planningReferenceNumber: getYarValue(request, 'PlanningPermissionEvidence').planningReferenceNumber
          }
        }
      : {}
    )
  })
}

const getDataFromYarValue = (request, yarKey, type) => {
  let data = getYarValue(request, yarKey) || null
  if (type === 'multi-answer' && !!data) {
    data = [data].flat()
  }

  return data
}

const getConsentOptionalData = consentOptional => {
  return {
    hiddenInput: {
      id: 'consentMain',
      name: 'consentMain',
      value: 'true',
      type: 'hidden'
    },
    idPrefix: 'consentOptional',
    name: 'consentOptional',
    items: setOptionsLabel(consentOptional,
      [{
        value: 'CONSENT_OPTIONAL',
        text: '(Optional) I consent to being contacted by Defra or a third party about service improvements'
      }]
    )
  }
}

module.exports = {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData
}
