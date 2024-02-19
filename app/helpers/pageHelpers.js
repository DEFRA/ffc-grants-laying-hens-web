const { getHtml } = require('../helpers/conditionalHTML')
const { setOptionsLabel } = require('../helpers/answer-options')
const { session } = require('ffc-grants-common-functionality')

const getConfirmationId = guid => {
  const prefix = 'CH'
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? session.getYarValue(request, yarKey)?.sbi : session.getYarValue(request, yarKey)
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
  session.setYarValue(request, 'reachedCheckDetails', true)

  const applying = session.getYarValue(request, 'applying')
  const businessDetails = session.getYarValue(request, 'businessDetails')
  const agentDetails = session.getYarValue(request, 'agentsDetails')
  const farmerDetails = session.getYarValue(request, 'farmerDetails')

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
  session.setYarValue(request, 'reachedEvidenceSummary', true)

  const planningPermission = session.getYarValue(request, 'planningPermission')
  const gridReference = session.getYarValue(request, 'gridReference')
  const hasEvidence = !planningPermission.startsWith('Not yet')
  if (hasEvidence && !session.getYarValue(request, 'PlanningPermissionEvidence')) {
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
            planningAuthority: session.getYarValue(request, 'PlanningPermissionEvidence').planningAuthority,
            planningReferenceNumber: session.getYarValue(request, 'PlanningPermissionEvidence').planningReferenceNumber
          }
        }
      : {}
    )
  })
}

const getDataFromYarValue = (request, yarKey, type) => {
  let data = session.getYarValue(request, yarKey) || null
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
