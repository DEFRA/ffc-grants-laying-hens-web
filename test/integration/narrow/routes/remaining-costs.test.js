const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /remaining-costs', () => {
  const varList = {
    totalRemainingCost: 247500,
    projectCost: 400000,
    calculatedGrant: 100000,
    solarCalculatedGrant: 10000,
    solarBirdNumber: 1000,
    solarPowerCapacity: 5,
    solarPVSystem : 'Yes'
  }

  let valList = {}

  commonFunctionsMock(varList, null, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Can you pay the remaining costs of £247,500?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.remainingCosts = {
      error: 'Select yes if you can pay the remaining costs',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    valList.remainingCosts = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /interruption-scoring', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('interruption-scoring')
  })

  it('page loads with correct back link - /potential-amount-solar', async () => {
    varList.calculatedGrant = 100000
    varList.solarCalculatedGrant = 10000
    varList.solarBirdNumber = 1000
    varList.solarPowerCapacity = 5
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount-solar\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /potential-amount-solar-calculation', async () => {
    varList.calculatedGrant = 5000
    varList.solarCalculatedGrant = 50000
    varList.solarBirdNumber = 700
    varList.solarPowerCapacity = 5
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount-solar-calculation\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /potential-amount-solar-capped', async () => {
    varList.calculatedGrant = 1250000
    varList.solarCalculatedGrant = 500000
    varList.solarBirdNumber = 1000
    varList.solarPowerCapacity = 1
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount-solar-capped" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when solarPVSystem is No - /potential-amount', async () => {
    varList.solarPVSystem = 'No'
    varList.solarCalculatedGrant = null
    varList.solarBirdNumber = null
    varList.solarPowerCapacity = null
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when solarPVSystem is Yes - /potential-amount', async () => {
    varList.solarPVSystem = 'Yes'
    varList.projectCost = 2000000
    varList.calculatedGrant = 50
    varList.solarCalculatedGrant = 50
    varList.solarBirdNumber = 1000
    varList.solarPowerCapacity = 5

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount-solar\" class=\"govuk-back-link\">Back</a>')
  })

})
