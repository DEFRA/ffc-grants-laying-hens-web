const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('ffc-grants-common-functionality').session 
const { GRANT_PERCENTAGE_SOLAR, GRANT_PERCENTAGE } = require('../helpers/grant-details')
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { formatUKCurrency } = require('../helpers/data-formats')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { guardPage } = require('ffc-grants-common-functionality').pageGuard
const { startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')
const { setYarValue } = require('ffc-grants-common-functionality/lib/session')
const viewTemplate = 'potential-amount-solar-calculation'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/remaining-costs`

function createModel (data, request) {
    const previousPath = `${urlPrefix}/solar-power-capacity`

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
    handler: async (request, h) => {
        const preValidationKeys = ['projectCost', 'solarBirdNumber', 'solarPVCost', 'solarPowerCapacity']
        const isRedirect = guardPage(request, preValidationKeys, startPageUrl, serviceEndDate, serviceEndTime, ALL_QUESTIONS)
        if (isRedirect) {
            return h.redirect(startPageUrl)
        }

        setYarValue(request, 'solarPowerCapacity', Number(getYarValue(request, 'solarPowerCapacity').toString().replace(/,/g, '')))
        setYarValue(request, 'solarBirdNumber', Number(getYarValue(request, 'solarBirdNumber').toString().replace(/,/g, '')))

        const numberOfBirds = getYarValue(request, 'solarBirdNumber')
        const numberOfBirdsFormat = formatUKCurrency(getYarValue(request, 'solarBirdNumber'))
        const projectCost = Number(getYarValue(request, 'projectCost'))
        const projectCostFormat = formatUKCurrency(getYarValue(request, 'projectCost'))
        const calculatedGrant = getYarValue(request, 'calculatedGrant')
        const energyRating = getYarValue(request, 'solarPowerCapacity')
        const energyRatingFormat = formatUKCurrency(getYarValue(request, 'solarPowerCapacity')).replace(/£/g, '')
        const solarCost = Number(getYarValue(request, 'solarProjectCost'))
        const solarCostFormat = formatUKCurrency(getYarValue(request, 'solarProjectCost'))
        const totalProjectCost = projectCost + solarCost
        const totalProjectCostFormat = formatUKCurrency(projectCost + solarCost)

        const powerLimit = 0.005

        const solarCap = Number.isInteger(solarCost / energyRating) ? (solarCost / energyRating) : (solarCost / energyRating).toFixed(2)
        const solarCapFormat = formatUKCurrency(solarCap)
        const powerCap = numberOfBirds * powerLimit
        const cost = solarCap * powerCap
        const costFormat = formatUKCurrency(solarCap * powerCap)
        const solarGrantFundingFormat = formatUKCurrency(Number(GRANT_PERCENTAGE_SOLAR * (cost / 100).toFixed(2)))
        const housingGrantFundingFormat = formatUKCurrency(Number(GRANT_PERCENTAGE * (projectCost / 100).toFixed(2)))
        const solarGrantFunding = Number(GRANT_PERCENTAGE_SOLAR * (cost / 100).toFixed(2))
        const housingGrantFunding = Number(GRANT_PERCENTAGE * (projectCost / 100).toFixed(2))
        const totalCalculatedGrant = housingGrantFunding + solarGrantFunding
        
        setYarValue(request, 'totalRemainingCost', totalProjectCost - totalCalculatedGrant)
        setYarValue(request, 'totalProjectCost', totalProjectCost)
        setYarValue(request, 'totalCalculatedGrant', totalCalculatedGrant)

        const totalCalculatedGrantFormat = formatUKCurrency(housingGrantFunding + solarGrantFunding)
        const projectTypeTableText = getYarValue(request, 'projectType') === getQuestionAnswer('project-type', 'project-type-A2', ALL_QUESTIONS) ? 
        'Number of birds the refurbished part of the building will house': 'Number of birds the new building will house'

        return h.view(viewTemplate, createModel({
            totalCalculatedGrant,
            totalCalculatedGrantFormat,
            totalProjectCost,
            calculatedGrant,
            grantPercentage: GRANT_PERCENTAGE,
            projectCost,
            solarGrantFunding,
            numberOfBirds,
            grantSolarPercentage: GRANT_PERCENTAGE_SOLAR,
            powerCap,
            solarCost,
            energyRating,
            energyRatingFormat,
            solarCap,
            solarCapFormat,
            cost,
            projectTypeTableText,
            housingGrantFunding,
            solarGrantFundingFormat,
            housingGrantFundingFormat,
            projectCostFormat,
            totalProjectCostFormat,
            numberOfBirdsFormat,
            solarCostFormat,
            costFormat
        }, request))
    }
    
    },
    {
    method: 'POST',
    path: currentPath,
    handler: (request, h) => {
        return h.redirect(nextPath)
    }
}]