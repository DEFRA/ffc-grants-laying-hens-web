const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission-condition', () => {
  const varList = {
    legalStatus: 'fake data',
    inEngland: 'randomData',
    planningPermission: 'fake'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('You may be able to apply for a grant from this scheme')
  })
  it('page loads with correct back link', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('<a href=\"planning-permission\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
