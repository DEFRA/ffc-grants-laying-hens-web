const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')
const { GRANT_PERCENTAGE, GRANT_PERCENTAGE_SOLAR } = require('../../../../app/helpers/grant-details')

describe('Page: /potential-amount-solar', () => {
  const varList = {
    totalCalculatedGrant: 66000,
    totalProjectCost: 240000,
    calculatedGrant: 16000,
    projectCost: 40000,
    solarCalculatedGrant: 50000,
    solarProjectCost: 200000
  }

  commonFunctionsMock(varList, undefined)
  
  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('You may be able to apply for a grant of up to £66,000, based on the total estimated cost of £240,000.')
    expect(response.payload).toContain('This grant amount combines:')
    expect(response.payload).toContain(`£16,000 for building costs (${GRANT_PERCENTAGE}% of £40,000)`)
    expect(response.payload).toContain(`£50,000 for solar PV system costs (${GRANT_PERCENTAGE_SOLAR}% of £200,000)`)
    expect(response.payload).toContain('There’s no guarantee the project will receive a grant.')
  })

  it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount-solar`,
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
      url: `${global.__URLPREFIX__}/potential-amount-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-power-capacity\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
