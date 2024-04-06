const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')
const { GRANT_PERCENTAGE, GRANT_PERCENTAGE_SOLAR } = require('../../../../app/helpers/grant-details')
const { formatUKCurrency } = require('../../../../app/helpers/data-formats')
const utilsList = {
  'project-type-A2': 'Refurbishing the existing building',
  'poultry-type-A3': 'Replacing the entire building with a new building'
}

describe('Page: /potential-amount-solar-calculation', () => {
  const varList = {
    projectType: 'Refurbishing the existing building',
    solarPVSystem: 'Yes',
    projectCost: 90000,
    projectCostFormat: formatUKCurrency(90000),
    solarBirdNumber: 30000,
    solarProjectCost: 50000,
    solarPowerCapacity: 500,
    totalCalculatedGrant: 39750,
    totalCalculatedGrantFormat: formatUKCurrency(39750),
    totalProjectCost: 140000,
    totalProjectCostFormat: formatUKCurrency(140000),
    housingGrantFunding: 36000,
    housingGrantFundingFormat: formatUKCurrency(36000),
    solarGrantFunding: 3750,
    solarGrantFundingFormat: formatUKCurrency(3750),
    grantPercentage: GRANT_PERCENTAGE,
    grantSolarPercentage: GRANT_PERCENTAGE_SOLAR,
    projectTypeTableText: 'Number of birds the refurbished part of the building will house' ,
    numberOfBirds: 30000,
    numberOfBirdsFormat : formatUKCurrency(30000),
    powerCap: 150,
    solarCost: 50000,
    solarCostFormat: formatUKCurrency(50000),
    energyRating: 500,
    solarcap: 100,
    cost: 15000,
    costFormat: formatUKCurrency(15000)

  }
  let valList = {}

  commonFunctionsMock(varList, undefined, utilsList, valList)
  
  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar-calculation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain(`You may be able to apply for a grant of up to £${varList.totalCalculatedGrantFormat}, based on the estimated cost of £${varList.totalProjectCostFormat}`)
    expect(response.payload).toContain(`£${varList.housingGrantFundingFormat} for building project costs (${varList.grantPercentage}% of £${varList.projectCostFormat})`)
    expect(response.payload).toContain(`£${varList.solarGrantFundingFormat} for solar PV system costs`)
    expect(response.payload).toContain('How is the solar PV system grant funding calculated?')
    expect(response.payload).toContain(`Based on the building's bird capacity (${varList.numberOfBirdsFormat} birds), you can apply ${varList.grantSolarPercentage}% of the costs of a solar PV system with a power capacity of up to ${varList.powerCap}kW.`)
    expect(response.payload).toContain(`This is based on the solar PV system costs (£${varList.solarCostFormat}) divided by the solar PV system’s power capacity (${varList.energyRating}kW). With these figures, the cost of the solar PV system is equal to £${varList.solarcap} per kW.`)
    expect(response.payload).toContain(`You can apply for grant funding of £${varList.solarGrantFundingFormat} for solar PV system costs. This is ${varList.grantSolarPercentage}% of £${varList.costFormat} , the amount based on your solar PV system costing £${varList.solarcap} per kW, multiplied by the power rating of ${varList.powerCap}kW.`)
    expect(response.payload).toContain(`You must pay the remaining solar PV system costs over £${varList.solarGrantFundingFormat}.`)
    expect(response.payload).toContain(varList.numberOfBirdsFormat)
    expect(response.payload).toContain(varList.projectTypeTableText)
    expect(response.payload).toContain('There’s no guarantee the project will receive a grant.')
  })

  it('page loads successfully, with all the Eligible options', async () => {
    varList.projectType = 'Replacing the entire building with a new building'
    varList.projectTypeTableText = 'Number of birds the new building will house'
    varList.solarcap = 112
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar-calculation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(varList.projectTypeTableText)
  })


  it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount-solar-calculation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/laying-hens/remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar-calculation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/laying-hens/solar-power-capacity\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
