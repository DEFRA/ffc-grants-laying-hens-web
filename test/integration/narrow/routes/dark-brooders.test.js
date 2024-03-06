const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /dark-brooders', () => {
  let varList = {}

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/dark-brooders`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing include dark boorders?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the housing will include dark brooders',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/dark-brooders`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the housing will include dark brooders')
  })

  it('user selects eligible option -> store user response and redirect to /renewable-energy', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/dark-brooders`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { darkBrooders: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('renewable-energy')
  })

  it('page loads with correct back link - /pullet-veranda-features', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/dark-brooders`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-veranda-features\" class=\"govuk-back-link\">Back</a>')
  })
})
