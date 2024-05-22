const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission-condition', () => {
  const varList = {
    legalStatus: 'fake data',
    inEngland: 'randomData',
    planningPermission: 'fake'
  }

  commonFunctionsMock(varList, undefined)

  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('You may be able to apply for a grant from this scheme')
    expect(getResponse.payload).toContain('You must have secured planning permission before you submit a full application. The application deadline is 30th January 2026.')
  })
  it('page loads with correct back link', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('<a href=\"planning-permission\" class=\"govuk-back-link\"')
  })
})
