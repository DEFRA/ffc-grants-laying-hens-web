const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pullet-multi-tier', () => {
  let varList = {}
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullets in your grant-funded building live in a multi-tier system as hens?')
    expect(response.payload).toContain('When they are over 15 weeks old')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('I don’t know')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the pullets in your grant-funded building will live in a multi-tier system as hens',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullets in your grant-funded building will live in a multi-tier system as hens')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletMultiTier: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletMultiTier: 'No',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletMultiTier: 'I don\'t know',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('page loads with correct back link - /three-tiers', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-multi-tier`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"three-tiers\" class=\"govuk-back-link\">Back</a>')
  })
})
