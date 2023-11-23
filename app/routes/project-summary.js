const { formatSummaryTable } = require('./../helpers/project-summary')
const { formatUKCurrency } = require('../helpers/data-formats')
const urlPrefix = require('../config/server').urlPrefix
const { getUrl } = require('../helpers/urls')
const { startPageUrl } = require('../config/server')
const { guardPage } = require('../helpers/page-guard')
const gapiService = require('../services/gapi-service')

const viewTemplate = 'project-summary'
const currentPath = `${urlPrefix}/${viewTemplate}`
const backUrlObject = {
  dependentQuestionYarKey: 'otherItems',
  dependentAnswerKeysArray: ['other-items-A15'],
  urlOptions: {
    thenUrl: 'other-items',
    elseUrl: 'item-sizes-quantities'
  }
}

function createModel (data, request) {
  const backUrl = getUrl(backUrlObject, '', request)
  const previousPath = `${urlPrefix}/${backUrl}`
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: async (request, h, _err) => {
    const preValidationKeys = ['otherItems']
    const isRedirect = guardPage(request, preValidationKeys, null)

    if (isRedirect) {
      return h.redirect(startPageUrl)
    }

    const result = formatSummaryTable(request)
    const totalValue = formatUKCurrency(request.yar.get('itemsTotalValue'))
    // await gapiService.sendDimensionOrMetrics(request, [{
    //   dimensionOrMetric: gapiService.dimensions.SCORE,
    //   value: 'Eligible'
    // },
    // {
    //   dimensionOrMetric: gapiService.metrics.SCORE,
    //   value: 'TIME'
    // }])

    return h.view(viewTemplate, createModel({ catagory: result, totalValue: totalValue }, request))
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    const { secBtn } = request.payload
    const nextPath = secBtn ? `${urlPrefix}/storage-type` : `${urlPrefix}/potential-amount`

    request.yar.set('standardisedCostCalculated', true)
    return h.redirect(nextPath)
  }
}]
