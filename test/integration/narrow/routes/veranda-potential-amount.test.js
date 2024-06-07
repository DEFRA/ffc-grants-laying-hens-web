const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-potential-amount', () => {
  const varList = {
    projectCost: 12500,
    calculatedGrant: 5000,
  }

  commonFunctionsMock(varList, undefined)

  it('page loads successfully - project cots is between £12500 and £250000', async () => {
    varList.projectCost = 12500
    varList.calculatedGrant = 5000
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('You may be able to apply for a grant of up to £5,000, based on the estimated cost of £12,500.')
  })

  it('page loads successfully - project cost is > 250,000', async () => {
    varList.calculatedGrant = 100000
    varList.projectCost = 500000
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain('You may be able to apply for a grant of up to £100,000, based on the estimated cost of £500,000.')
  })

  it('should redirect to /veranda-remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-potential-amount`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaRemainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-potential-amount`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"veranda-project-cost\" class=\"govuk-back-link\"')
  })
})
