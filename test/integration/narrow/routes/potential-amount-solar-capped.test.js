const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')
const { GRANT_PERCENTAGE } = require('../../../../app/helpers/grant-details')

describe('Page: /potential-amount-solar-capped', () => {
  const varList = {
    totalProjectCost: 1450000,
    calculatedGrant: 400000,
    projectCost: 1000000,
    cappedSolarProjectCost: 100000,
    solarPVCost: 450000
  }

  commonFunctionsMock(varList, undefined)
  
  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar-capped`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('You may be able to apply for a grant of up to £500,000, based on the total estimated cost of £1,450,000.')
    expect(response.payload).toContain('This grant amount combines:')
    expect(response.payload).toContain(`£400,000 for building costs (${GRANT_PERCENTAGE}% of £1,000,000)`)
    expect(response.payload).toContain('£100,000 for solar PV system costs')
    expect(response.payload).toContain('As building project costs take grant funding priority, you may be able to apply for a grant of up to £100,000 for a solar PV system. The maximum grant is £500,000.')
    expect(response.payload).toContain('There’s no guarantee the project will receive a grant.')
  })

  it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount-solar-capped`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar-capped`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-power-capacity\" class=\"govuk-back-link\"')
  })
})