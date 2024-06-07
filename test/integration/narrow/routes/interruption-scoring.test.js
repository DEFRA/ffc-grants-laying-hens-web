const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /interruption scoring', () => {
  it('loads page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/interruption-scoring`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('We will now score your project against our funding priorities')    
    expect(response.payload).toContain('You have passed our eligibility criteria.')
    expect(response.payload).toContain('Your answers to the next questions will help us decide which projects we will invite to make a full application.')
    expect(response.payload).toContain('Your project will get a score of weak, average or strong. You can then make changes to improve your score.')
  })

  it('should redirect to /current-system when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/interruption-scoring`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/laying-hens/current-system')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/interruption-scoring`,
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/laying-hens/remaining-costs\" class=\"govuk-back-link\"')
  })
})