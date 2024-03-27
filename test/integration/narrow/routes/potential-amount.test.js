const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

const utilsList = {
  'poultry-type-A1': 'hen',
  'poultry-type-A2': 'pullet'
}

describe('Page: /potential-amount', () => {
  const varList = {
    projectCost: 37500,
    calculatedGrant: 15000,
    calculatedGrantSolarPreCap: 34567,
    solarPVSystem: 'No',
    poultryType: 'hen'
  }
  let eligiblePageText = 'You may be able to apply for a grant of up to £15,000, based on the estimated cost of £37,500.'

  commonFunctionsMock(varList, undefined, utilsList, {})
  
  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain(eligiblePageText)
  })

  it('page loads successfully, with all the Eligible options', async () => {
    varList.projectCost= 1260000
    varList.calculatedGrant= 500000
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('The maximum grant you can apply for is £500,000.')
    expect(response.payload).toContain('You may be able to apply for a grant of up to £500,000, based on the estimated cost of £1,260,000.')
  })

  it('page loads successfully, with all the Eligible options', async () => {
    varList.projectCost= 1260000
    varList.calculatedGrant= 500000
    varList.solarPVSystem = 'Yes'
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('The maximum grant you can apply for is £500,000.')
    expect(response.payload).toContain('You cannot apply for funding for a solar PV system if you have requested the maximum funding amount for building project costs.')
    expect(response.payload).toContain('You can continue to check your eligibility for grant funding to replace or refurbish a laying hens house.')
  })

  it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-cost\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
