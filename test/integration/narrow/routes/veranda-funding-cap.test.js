
const { commonFunctionsMock } = require('../../../session-mock')

describe('Page: /veranda-funding-cap', () => {
  const varList = { 
    projectType: 'Adding a veranda only to the existing building' 
  }

  commonFunctionsMock(varList, undefined)

  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-funding-cap`
    }
    const response = await global.__SERVER__.inject(getOptions)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('We have reached the limit of applications for veranda grant funding')
    expect(response.payload).toContain('The veranda grant funding is awarded on a first come, first served basis. We are not currently accepting applications for veranda-only grant funding.')
    expect(response.payload).toContain(' You can check your eligibility and provide your business details to <a class=\"govuk-link\" href=\"./applicant-type\" rel=\"noopener noreferrer\">register your interest for veranda-only grant funding.</a>The RPA will contact you if funding becomes available.')
    expect(response.payload).toContain('Alternatively, you can check if you are eligible comprehensive grant funding to refurbish or replace laying hen or pullet housing.')
  })

  it('page loads with correct back link', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-funding-cap`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('<a href=\"project-type\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})

