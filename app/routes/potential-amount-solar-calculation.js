const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('ffc-grants-common-functionality').session 
const { grantSolarPercentage, GRANT_PERCENTAGE } = require('../helpers/grant-details')
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { ALL_QUESTIONS } = require('../config/question-bank')

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
        // calculate all values
        // store all as variables
        // call load page with all values

        const numberOfBirds = getYarValue(request, 'solarBirdNumber')
        const projectCost = getYarValue(request, 'projectCost')
        const calculatedGrant = getYarValue(request, 'calculatedGrant')
        const energyRating = getYarValue(request, 'solarPowerCapacity')
        const solarCost = getYarValue(request, 'solarProjectCost')
        const totalProjectCost = getYarValue(request, 'totalProjectCost')

        const powerLimit = 0.005

        const solarCap = (solarCost / energyRating).toFixed(2)
        const powerCap = numberOfBirds * powerLimit
        const cost = solarCap * powerCap
        const grantFunding = Number(grantSolarPercentage * (cost / 100)).toFixed(2)

        const totalCalculatedGrant = calculatedGrant + grantFunding
        const projectTypeTableText = getYarValue(request, 'projectType') === getQuestionAnswer('project-type', 'project-type-A2', ALL_QUESTIONS) ? 
        'Number of birds the refurbished part of the building will house': 'Number of birds the new building will house'
        return h.view(viewTemplate, createModel({
            totalCalculatedGrant,
            totalProjectCost,
            calculatedGrant,
            grantPercentage: GRANT_PERCENTAGE,
            projectCost,
            grantFunding,
            numberOfBirds,
            grantSolarPercentage: grantSolarPercentage,
            powerCap,
            solarCost,
            energyRating,
            solarCap,
            cost,
            projectTypeTableText
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