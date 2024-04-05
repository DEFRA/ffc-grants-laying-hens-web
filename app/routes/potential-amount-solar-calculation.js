const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('ffc-grants-common-functionality').session 
const { grantSolarPercentage, GRANT_PERCENTAGE } = require('../helpers/grant-details')

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

        const numberOfBirds = getYarValue(request, 'numberOfBirds')
        const projectCost = getYarValue(request, 'projectCost')
        const calculatedGrant = getYarValue(request, 'calculatedGrant')
        const energyRating = getYarValue(request, 'solarPowerCapacity')
        const solarCost = getYarValue(request, 'solarProjectCost')
        const totalProjectCost = getYarValue(request, 'totalProjectCost')

        const powerLimit = 0.005

        const solarCap = solarCost / energyRating
        const powerCap = numberOfBirds * powerLimit
        const cost = solarCap * powerCap
        const grantFunding = Number(grantSolarPercentage * (cost / 100)).toFixed(2)

        const totalCalculatedGrant = calculatedGrant + grantFunding

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
            cost
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