const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /hen-multi-tier', () => {
  let varList = {}

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-multi-tier`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the hens in this building be reared in a multi-tier system as pullets?')
    expect(response.payload).toContain('When they are under 15 weeks old')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('I don’t know')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the hens in this building will be reared in a multi-tier system as pullets',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the hens in this building will be reared in a multi-tier system as pullets')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henMultiTier: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henMultiTier: 'No',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('user selects eligible option -> store user response and redirect to /natural-light', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-multi-tier`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henMultiTier: 'I don\'t know',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('natural-light')
  })

  it('page loads with correct back link - /tier-number', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-multi-tier`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tier-number\" class=\"govuk-back-link\">Back</a>')
  })
})
